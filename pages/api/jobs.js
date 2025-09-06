// pages/api/jobs.js
import { supabaseAdmin } from "../../lib/supabaseClient";

export default async function handler(req, res){
  const { data, error } = await supabaseAdmin.from("jobs").select("*").order("created_at", { ascending: false }).limit(500);
  if(error) return res.status(500).json({ error: error.message });
  res.json({ jobs: data });
}
