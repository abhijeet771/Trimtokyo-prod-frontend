/* eslint-disable no-undef */

// ================= FIREBASE IMPORTS =================

importScripts(
  "https://www.gstatic.com/firebasejs/10.7.0/firebase-app-compat.js"
);

importScripts(
  "https://www.gstatic.com/firebasejs/10.7.0/firebase-messaging-compat.js"
);

// ================= FIREBASE INIT =================

firebase.initializeApp({
  apiKey:
    "AIzaSyDn3umFj5-XrsxTlX1Bg6bsdC_R0wo6paQ",

  authDomain:
    "barber-notifications.firebaseapp.com",

  projectId:
    "barber-notifications",

  storageBucket:
    "barber-notifications.firebasestorage.app",

  messagingSenderId:
    "1010337566182",

  appId:
    "1:1010337566182:web:09c256375c287718071a27",

  measurementId:
    "G-206K9JM142",
});

// ================= MESSAGING =================

const messaging =
  firebase.messaging();

// ================= BACKGROUND HANDLER =================

messaging.onBackgroundMessage(
  (payload) => {
    console.log(
      "📩 Background message:",
      payload
    );

    const notificationTitle =
      payload.notification?.title ||
      "TrimTokyo";

    const notificationOptions = {
      body:
        payload.notification?.body ||
        "",

      icon: "/logo192.png",

      image:
        payload.notification
          ?.image || undefined,

      data: {
        redirectUrl:
          payload.data
            ?.redirectUrl || "/",
      },
    };

    self.registration.showNotification(
      notificationTitle,
      notificationOptions
    );
  }
);

// ================= NOTIFICATION CLICK =================

self.addEventListener(
  "notificationclick",
  function (event) {
    event.notification.close();

    const redirectUrl =
      event.notification.data
        ?.redirectUrl || "/";

    event.waitUntil(
      clients.openWindow(
        redirectUrl
      )
    );
  }
);