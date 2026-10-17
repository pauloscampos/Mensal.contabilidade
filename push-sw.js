/* Service worker só das notificações push (Firebase Cloud Messaging).
   Fica separado do sw.js do app: usa o escopo ./push-scope/ e não mexe no cache do app. */
importScripts('https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js','https://www.gstatic.com/firebasejs/10.14.1/firebase-messaging-compat.js');
firebase.initializeApp({apiKey:"AIzaSyCquhK6tRdX7pLBzNTNGKkcL6Aw3OtgTQ8",authDomain:"mensal-contabilidade.firebaseapp.com",projectId:"mensal-contabilidade",storageBucket:"mensal-contabilidade.firebasestorage.app",messagingSenderId:"1084552414987",appId:"1:1084552414987:web:74fe5046bb0f588e71c40e"});
const messaging=firebase.messaging();
// Chega com o app fechado ou em segundo plano (com o app aberto na tela, quem avisa é o próprio app)
messaging.onBackgroundMessage(p=>{
  const d=(p&&p.data)||{};
  // icon = imagem colorida do app; badge = ícone pequeno da barra de status (precisa ser branco com fundo transparente: badge.png)
  // vibrate + silent:false fazem o Android mostrar o aviso em cima da tela (pop-up), e não só na lista
  return self.registration.showNotification(d.title||'Contabilidade',{
    body:d.body||'',icon:'icon-192.png',badge:'badge.png',tag:d.tag||undefined,renotify:!!d.tag,
    vibrate:[200,100,200],silent:false,requireInteraction:false,timestamp:Date.now(),data:{gid:d.gid||''}
  });
});
self.addEventListener('notificationclick',e=>{
  e.notification.close();
  const gid=(e.notification.data&&e.notification.data.gid)||'';
  const base=self.registration.scope.replace(/push-scope\/$/,'');
  e.waitUntil(clients.matchAll({type:'window',includeUncontrolled:true}).then(cl=>{
    const w=cl.find(c=>c.url.startsWith(base));
    if(w){if(gid)w.postMessage({ntfGid:gid});return w.focus()}
    return clients.openWindow(base+(gid?'#g='+gid:''));
  }));
});
