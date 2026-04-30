import AsyncStorage from "@react-native-async-storage/async-storage";
import { getApps, initializeApp, getApp } from "firebase/app";
import {
  browserLocalPersistence,
  getReactNativePersistence,
  initializeAuth,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { Platform } from "react-native";

const firebaseConfig = {
  apiKey: "AIzaSyASdG81ZzExByrwbZwWB-sPIfcZlz5j07g",
  authDomain: "fiap-tech-challenge-3-31728.firebaseapp.com",
  projectId: "fiap-tech-challenge-3-31728",
  storageBucket: "fiap-tech-challenge-3-31728.firebasestorage.app",
  messagingSenderId: "70615285266",
  appId: "1:70615285266:web:520d4759930324c69222cb",
  measurementId: "G-LX9PCCYMFE",
  databaseURL: "",
};

let app;

if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

let auth;

if (Platform.OS === "web") {
  auth = initializeAuth(app, {
    persistence: browserLocalPersistence,
  });
} else {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
}

const db = getFirestore(app);

export { app, auth, db };
