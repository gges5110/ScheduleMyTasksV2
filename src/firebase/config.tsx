import * as firebase from "firebase/app";
import "firebase/database";
import "firebase/auth";
import "firebase/analytics";

export const firebaseConfig = {
  apiKey: "AIzaSyBgtxCFprO-DVdh6Wq0xaXi_suC4F-tRwA",
  authDomain: "schedulemytasks.firebaseapp.com",
  databaseURL: "https://schedulemytasks.firebaseio.com",
  projectId: "schedulemytasks",
  storageBucket: "schedulemytasks.appspot.com",
  messagingSenderId: "704574517222",
  appId: "1:704574517222:web:493b305f29615a11f6b027",
  measurementId: "G-QXYEV3LXKC",
};

firebase.initializeApp(firebaseConfig);
firebase.analytics();

export const auth = firebase.auth();
export const database = firebase.database();
