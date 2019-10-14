import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

const config = {
  apiKey: "AIzaSyD9nWDYPdxnDKr2VhKYopSDEiA7UNDDR2k",
  authDomain: "todo-aa992.firebaseapp.com",
  databaseURL: "https://todo-aa992.firebaseio.com",
  projectId: "todo-aa992",
  storageBucket: "todo-aa992.appspot.com",
  messagingSenderId: "232429625722",
  appId: "1:232429625722:web:92798181e1495c9638f6c3"
};

firebase.initializeApp(config);

export const auth = firebase.auth();

export const db = firebase.firestore();
