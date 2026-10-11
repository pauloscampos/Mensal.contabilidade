const C='contab-v1',CDN='https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.min.js';
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(async c=>{await c.addAll(['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png']);try{await c.add(CDN)}catch(_){}}).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;const u=new URL(e.request.url);
 if(u.origin===location.origin){e.respondWith(fetch(e.request).then(r=>{const cp=r.clone();caches.open(C).then(x=>x.put(e.request,cp));return r}).catch(()=>caches.match(e.request).then(r=>r||caches.match('./index.html'))))}
 else if(u.hostname==='cdnjs.cloudflare.com'||u.hostname==='fonts.googleapis.com'){e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).then(x=>{const cp=x.clone();caches.open(C).then(y=>y.put(e.request,cp));return x})))}});
