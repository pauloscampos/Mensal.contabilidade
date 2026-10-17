/* Service worker do app Contabilidade: atualiza sozinho.
   - A página (index.html) é buscada SEMPRE na internet primeiro; só usa a cópia salva se estiver sem conexão.
   - Os demais arquivos (ícones, bibliotecas) vêm da cópia salva e são renovados em segundo plano.
   - Chamadas do banco, do login e dos avisos nunca passam por aqui. */
const V='2026-10-17.1',C='contab-'+V;
const SKIP=/firestore\.googleapis\.com|identitytoolkit|securetoken|firebaseinstallations|fcmregistrations|fcm\.googleapis|workers\.dev|\/__\/auth|accounts\.google|google\.com\/(recaptcha|gsi)|apis\.google\.com/;
self.addEventListener('install',e=>{
  self.skipWaiting();
  e.waitUntil(caches.open(C).then(c=>Promise.all(['./','index.html','manifest.webmanifest'].map(u=>c.add(new Request(u,{cache:'reload'})).catch(()=>{})))));
});
self.addEventListener('activate',e=>{
  e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
self.addEventListener('message',e=>{if(e.data==='skip')self.skipWaiting()});
self.addEventListener('fetch',e=>{
  const r=e.request;
  if(r.method!=='GET'||!/^https?:/.test(r.url)||SKIP.test(r.url))return;
  const u=new URL(r.url),same=u.origin===location.origin;
  const page=r.mode==='navigate'||(same&&/\/(index\.html)?$/.test(u.pathname));
  if(page){
    e.respondWith(fetch(r.url,{cache:'no-store'}).then(res=>{
      if(res&&res.ok&&!u.search){const cp=res.clone();caches.open(C).then(c=>c.put(r.mode==='navigate'?r:r.url,cp))}
      return res;
    }).catch(()=>caches.match(r).then(m=>m||caches.match('index.html')||caches.match('./'))));
    return;
  }
  e.respondWith(caches.match(r).then(m=>{
    const net=fetch(r).then(res=>{if(res&&(res.ok||res.type==='opaque'))caches.open(C).then(c=>c.put(r,res.clone()));return res}).catch(()=>m);
    return m||net;
  }));
});
