const C="budget-v1",SHELL=["./","index.html","config.js","manifest.webmanifest","icon-192.png","icon-512.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",e=>{
  const r=e.request;if(r.method!=="GET")return;
  const u=new URL(r.url);
  if(u.pathname.startsWith("/__/"))return;
  if(u.hostname.endsWith("googleapis.com")&&u.hostname!=="fonts.googleapis.com")return;
  e.respondWith(fetch(r).then(res=>{
    if(res.ok&&(u.origin===location.origin||/gstatic|cdnjs|fonts/.test(u.hostname))){const cp=res.clone();caches.open(C).then(c=>c.put(r,cp))}
    return res;
  }).catch(()=>caches.match(r).then(m=>m||(r.mode==="navigate"?caches.match("index.html"):Response.error()))));
});
