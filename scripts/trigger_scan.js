// scripts/trigger_scan.js
import fetch from "node-fetch";
const url = process.env.SITE_BASE_URL || "https://your-vercel-app.vercel.app";
const secret = process.env.SCAN_SECRET || "";
(async ()=>{
  const r = await fetch(url + "/api/scan", { method:"POST", headers: { "x-scan-secret": secret } });
  console.log(await r.text());
})();
