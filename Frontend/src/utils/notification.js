import { getToken } from "firebase/messaging";
import { getMessagingInstance } from "../firebase/firebase";

export const getFCMToken = async () => {
  try {
    const messaging = await getMessagingInstance();
    if (!messaging) {
      console.log("❌ Messaging not supported in this browser");
      return null;
    }

    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      console.log("❌ Notification permission denied");
      return null;
    }

    const token = await getToken(messaging, {
      vapidKey: "BF0enm-rN4XkBhgvaZ2CWbm_WR_FzfgWHfMfvCwf3hxhcPZYPngI729FpHzoQt7Rgu-2iOihKnsAZwf7TTwtVjM",
    });

    if (token) {
      console.log("🔥 FCM TOKEN:", token);
      return token;
    } else {
      console.log("❌ No token generated");
      return null;
    }
  } catch (err) {
    console.error("❌ FCM Error:", err);
    return null;
  }
};