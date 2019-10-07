import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

const config = {
  apiKey: "AIzaSyAk8qDfkkOPmZgGfcgGmk8QnP2FLn8VCsc",
  authDomain: "authentication-d4bf8.firebaseapp.com",
  databaseURL: "https://authentication-d4bf8.firebaseio.com",
  projectId: "authentication-d4bf8",
  storageBucket: "authentication-d4bf8.appspot.com",
  messagingSenderId: "59747142167",
  appId: "1:59747142167:web:d46bb407c156fdc3146a52"
};

firebase.initializeApp(config);

export const auth = firebase.auth();

export const db = firebase.firestore();
