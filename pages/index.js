// pages/index.js
import useSWR from "swr";
import { useEffect, useState } from "react";

const fetcher = (url)=>fetch(url).then(r=>r.json());

function daysLeft(dateStr){
  if(!dateStr) return null;
  const d = new Date(dateStr);
  const diff = Math.ceil((d - new Date()) / (1000*60*60*24));
  return diff;
}

export default function Dashboard(){
  const { data } = useSWR("/api/jobs", fetcher, { refreshInterval: 60*1000 });
  const jobs = data?.jobs || [];
  const [now, setNow] = useState(new Date());
  useEffect(()=>{ const t=setInterval(()=>setNow(new Date()),1000); return ()=>clearInterval(t); }, []);

  return (
    <div className="grid">
      <div className="header">
        <h1 className="h1">Job Search Dashboard</h1>
        <div className="now">{now.toLocaleString()}</div>
      </div>

      <div className="card">
        <div style={{display:"flex",gap:12,alignItems:"center"}}>
          <div className="muted">Jobs tracked: {jobs.length}</div>
          <div style={{flex:1}} />
          <a className="btn btn-ghost" href="/manage-urls">Manage URLs</a>
          <button className="btn btn-primary" onClick={()=>fetch("/api/scan", { method:"POST", headers: { "x-scan-secret": process.env.NEXT_PUBLIC_SCAN_SECRET || "" } }).then(()=>window.location.reload())}>Trigger Scan</button>
        </div>
      </div>

      <div className="grid grid-2">
        {jobs.length === 0 && (<div className="card muted">No jobs yet. Add URLs and wait for scheduled scans or trigger one.</div>)}
        {jobs.map(j => {
          const left = daysLeft(j.closing_date);
          return (
            <div key={j.id} className="card">
              <h3 className="job-title">{j.title}</h3>
              <div className="muted" style={{marginBottom:8}}>{j.source} • {j.posted_date || ""}</div>
              <div style={{marginBottom:8}}>{j.summary}</div>
              <div style={{display:"flex",gap:12,alignItems:"center"}}>
                <a className="link" href={j.link} target="_blank" rel="noreferrer">Open listing ↗</a>
                <div style={{flex:1}} />
                <div>{ left == null ? <span className="badge">No deadline</span> : left < 0 ? <span className="badge badge-red">Closed</span> : left <= 3 ? <span className="badge badge-red">Closes in {left}d</span> : left <= 7 ? <span className="badge badge-amber">Closes in {left}d</span> : <span className="badge badge-green">Closes in {left}d</span> }</div>
              </div>

              {/* AI suggestions preview */}
              {j.match_score != null && (<div style={{marginTop:10}} className="muted">Match: {j.match_score}%</div>)}
              {j.course_suggestions && j.course_suggestions.length > 0 && (
                <details style={{marginTop:8}}>
                  <summary className="muted">Suggested courses</summary>
                  <ul>
                    {j.course_suggestions.slice(0,5).map((c, idx)=>(<li key={idx}><a className="link" href={c.url || "#"} target="_blank" rel="noreferrer">{c.title || c.provider || "Course"}</a></li>))}
                  </ul>
                </details>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
