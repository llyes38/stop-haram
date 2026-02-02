/* Service worker pour les notifications push StopHaram */
self.addEventListener("push", (event) => {
  let data = {};
  if (event.data) {
    try {
      data = event.data.json ? event.data.json() : JSON.parse(event.data.text());
    } catch (_) {
      data = { body: event.data.text() };
    }
  }
  const title = data.title || "StopHaram";
  const options = {
    body: data.body || "Rappel : pense à tes actions du jour.",
    icon: data.icon || "/file.svg",
    badge: data.badge || "/file.svg",
    tag: data.tag || "stopharam-push",
    requireInteraction: !!data.requireInteraction,
    data: { url: data.url || "/" },
    vibrate: data.vibrate || [200, 100, 200],
    silent: !!data.silent,
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = event.notification?.data?.url || "/";
  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((list) => {
      if (list.length) list[0].focus();
      else if (clients.openWindow) clients.openWindow(url);
    })
  );
});
