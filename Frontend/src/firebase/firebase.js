import { initializeApp } from "firebase/app";
import { getMessaging, isSupported } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyDn3umFj5-XrsxTlX1Bg6bsdC_R0wo6paQ",
  authDomain: "barber-notifications.firebaseapp.com",
  projectId: "barber-notifications",
  storageBucket: "barber-notifications.firebasestorage.app",
  messagingSenderId: "1010337566182",
  appId: "1:1010337566182:web:09c256375c287718071a27",
  measurementId: "G-206K9JM142",
};

const app = initializeApp(firebaseConfig);

// 🔥 Guard for browsers that don’t support messaging (prevents runtime errors)
export const getMessagingInstance = async () => {
  const supported = await isSupported();
  return supported ? getMessaging(app) : null;
};