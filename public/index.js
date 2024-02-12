async function run() {
  // A service worker must be registered in order to send notifications on iOS
  const registration = await navigator.serviceWorker.register(
    "serviceworker.js",
    {
      scope: "./",
    }
  );

  const subscribe = document.getElementById("subscribe");
  const sendNoti = document.getElementById("send-noti");

  sendNoti.addEventListener("click", async () => {
    await fetch("/send-notification");
  });

  subscribe.addEventListener("click", async () => {
    // Triggers popup to request access to send notifications
    const result = await window.Notification.requestPermission();

    // If the user rejects the permission result will be "denied"
    if (result === "granted") {
      const vapidPubkey = await fetch("/get-vapid-pubkey").then((res) =>
        res.text()
      );
      const subscription = await registration.pushManager.subscribe({
        // TODO: Replace with your public vapid key
        applicationServerKey: vapidPubkey,
        userVisibleOnly: true,
      });

      await fetch("/save-subscription", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(subscription),
      });
    }
  });
}

run();
