// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  getFirestore
} from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDWTmhcfEVy0HDT9TnVE3iOJ6aX_WKjbXs",
  authDomain: "realtime-audio-video.firebaseapp.com",
  databaseURL:
    "https://realtime-audio-video-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "realtime-audio-video",
  storageBucket: "realtime-audio-video.appspot.com",
  messagingSenderId: "115436010538",
  appId: "1:115436010538:web:b1147850f2684949159753",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(fireApp);
