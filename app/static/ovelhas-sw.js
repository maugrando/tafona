// Projeto Borrego Tafona — service worker: recebe o aviso diário e põe a bolinha no ícone.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));

self.addEventListener('push', e => {
  let d = {};
  try { d = e.data ? e.data.json() : {}; } catch (_) { d = {corpo: e.data && e.data.text()}; }
  const n = d.pendentes || 0;
  const tarefas = [
    self.registration.showNotification(d.titulo || 'Borrego Tafona', {
      body: d.corpo || '', icon: '/ovelhas/ovelha-512.png?v=5', badge: '/ovelhas/ovelha.png?v=5',
      tag: 'ovelhas-diario', renotify: true, data: {url: d.url || '/ovelhas'}
    })
  ];
  if ('setAppBadge' in self.navigator) tarefas.push(n ? self.navigator.setAppBadge(n) : self.navigator.clearAppBadge());
  e.waitUntil(Promise.all(tarefas).catch(() => {}));
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  const url = (e.notification.data && e.notification.data.url) || '/ovelhas';
  e.waitUntil(self.clients.matchAll({type: 'window', includeUncontrolled: true}).then(cs => {
    for (const c of cs) if (c.url.includes('/ovelhas') && 'focus' in c) return c.focus();
    return self.clients.openWindow(url);
  }));
});
