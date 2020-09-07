self.addEventListener('push', function (event) {
    console.log('[Service Worker] Push Received.');
    const data = event.data.json();
    const title = data.title;
    const options = {
        body: data.body,
    };

    event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', function (event) {
    console.log('[Service Worker] Notification click Received.');
    event.notification.close();
    event.waitUntil(
        clients.openWindow('https://developers.google.com/web/')
    );
});