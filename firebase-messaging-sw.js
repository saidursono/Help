// firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyDwzJgWcc4XPt4czcXpVFkHTniJFISpO7I",
  authDomain: "somaj-kallyan.firebaseapp.com",
  projectId: "somaj-kallyan",
  messagingSenderId: "392871962816",
  appId: "1:392871962816:web:0f7ebbc36a3d8c784da525"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  console.log('[SW] Background message:', payload);

  const notification = payload.notification || {};
  const data = payload.data || {};

  const title = notification.title || data.title || 'নতুন বার্তা';
  const body  = notification.body  || data.body  || 'সমাজ কল্যাণ যুব সংগঠন';

  const options = {
    body: body,
    icon: 'https://i.ibb.co.com/XZF23TDY/received-895949380028820.jpg',
    badge: 'https://i.ibb.co.com/XZF23TDY/received-895949380028820.jpg',
    vibrate: [200, 100, 200],
    tag: data.chatId || data.channel || 'msg',
    renotify: true,
    silent: false,
    data: {
      url: data.url || '/messages.html',
      chatId: data.chatId || ''
    },
    actions: [
      { action: 'open',  title: '💬 খুলুন' },
      { action: 'close', title: '✕ বন্ধ' }
    ]
  };

  return self.registration.showNotification(title, options);
});

// Notification click
self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  if (event.action === 'close') return;

  const url = event.notification.data?.url || '/messages.html';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
      for (const c of list) {
        if (c.url.includes('messages.html') && 'focus' in c) return c.focus();
      }
      if (clients.openWindow) return clients.openWindow(url);
    })
  );
});

self.addEventListener('install',  () => self.skipWaiting());
self.addEventListener('activate', e  => e.waitUntil(clients.claim()));