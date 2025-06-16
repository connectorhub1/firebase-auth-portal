import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBOUvPz5GUz-hf4G0f9cVPmAX2pphdwRtg",
  authDomain: "authportal-74915.firebaseapp.com",
  projectId: "authportal-74915",
  storageBucket: "authportal-74915.appspot.com",
  messagingSenderId: "42499454353",
  appId: "1:42499454353:web:1f59c0b6938681ff249630",
  measurementId: "G-4XBXDB6TTZ"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();