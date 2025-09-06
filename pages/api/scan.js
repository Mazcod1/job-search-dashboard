// pages/api/scan.js
import { scrapeWithAdapters } from "../../lib/adapters";
import { supabaseAdmin } from "../../lib/supabaseClient";
import { summarizeJob, recommendCourses, computeMatchScore } from "../../lib/ai";
import fetch from "isomorphic-unfetch";
import nodemailer from "nodemailer";

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const ALERT_EMAIL_TO = process.env.ALERT_EMAIL_TO;

// send telegram message
async function sendTelegram(text){
  if(!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) return;
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
  await fetch(url, {
    method: "POST",
    headers: { "Content-Type":"application/json" },
    body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text, parse_mode:"HTML", disable_web_page_preview:true })
  });
}

// send email (via SendGrid)
async function sendEmail(subject, text){
  if(!SENDGRID_API_KEY || !ALERT_EMAIL_TO) return;
  const r = await fetch("https://api.sendgrid.com/v3/mail/send", {
    method: "POST",
    headers: { "Authorization": `Bearer ${SENDGRID_API_KEY}`, "Content-Type":"application/json" },
    body: JSON.stringify({
      personalizations:[{ to:[{ email: ALERT_EMAIL_TO }] }],
      from: { email:"alerts@jobhub.example", name:"JobHub Alerts" },
      subject, content:[{ type:"text/plain", value:text }]
    })
  });
  return r.status;
}

export default async function handler(req, res){
  // optional secret token check for safety
  const SECRET = process.env.SCAN_SECRET;
  if(SECRET && req.headers["x-scan-secret"] !== SECRET) {
    return res.status(401).json({ error: "unauthorized" });
  }

  // fetch watchlist from DB
  const { data: urls, error } = await supabaseAdmin.from("job_urls").select("*");
  if(error) return res.status(500).json({ error: error.message });

  const newJobsFound = [];
  for(const u of urls){
    try{
      const items = await scrapeWithAdapters(u.url);
      for(const it of items){
        // create unique id by link
        const id = Buffer.from((it.link||it.title||u.url)).toString("base64").slice(0,12);
        // check if already exists
        const { data: exists } = await supabaseAdmin.from("jobs").select("id").eq("id", id).limit(1);
        if(exists && exists.length > 0) continue;

        // fetch job page lightly to extract description if possible (adapter may have done that)
        let desc = it.summary || "";
        if(it.link){
          try{
            const r = await fetch(it.link, { headers: { "user-agent":"JobHubBot/1.0" }});
            const text = await r.text();
            // very naive summary of first paragraphs if none
            if(!desc){
              const m = text.match(/<p[^>]*>(.*?)<\/p>/i);
              if(m) desc = m[1].replace(/<[^>]+>/g,"").slice(0,800);
            }
          }catch(e){}
        }

        // AI summary and course suggestions
        let aiSummary = null, courseSuggestions = null, matchScore = null;
        try{
          aiSummary = await summarizeJob(it.title || "", desc || "");
          // match score: if user uploaded CV we can compute; else compute relative match based on job description only (we can pass empty CV)
          matchScore = await computeMatchScore("", (it.title || "") + "\n" + (desc || ""));
          // suggest courses based on required skills (ask AI to propose)
          courseSuggestions = await recommendCourses(`${it.title}. ${desc ? desc.slice(0,800) : ""}`);
        }catch(e){
          console.error("AI failed", e);
        }

        // insert into DB
        await supabaseAdmin.from("jobs").insert([{
          id,
          title: it.title,
          link: it.link,
          source: u.name || u.url,
          source_url: u.url,
          summary: aiSummary || desc,
          posted_date: null,
          closing_date: it.closingDate || null,
          match_score: matchScore,
          course_suggestions: courseSuggestions
        }]);

        newJobsFound.push({ title: it.title, link: it.link, source: u.name || u.url });
      }
    }catch(e){
      console.error("scrape loop error", e);
    }
  }

  // send notifications if new jobs found
  if(newJobsFound.length > 0){
    const text = "New jobs found:\n\n" + newJobsFound.slice(0,10).map(j => `${j.title} — ${j.source}\n${j.link}`).join("\n\n");
    try{ await sendTelegram(text); }catch(e){ console.error("tg fail", e); }
    try{ await sendEmail("JobHub — New jobs found", text); }catch(e){ console.error("email fail", e); }
  }

  return res.json({ ok: true, new: newJobsFound.length });
}
