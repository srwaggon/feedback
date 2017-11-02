import firebase from 'firebase';

const config = {
  apiKey: "AIzaSyAFjzz8GYRncSz4-J14ss9UQb2XHikS018",
  authDomain: "feedback-2128f.firebaseapp.com",
  databaseURL: "https://feedback-2128f.firebaseio.com",
  projectId: "feedback-2128f",
  storageBucket: "feedback-2128f.appspot.com",
  messagingSenderId: "404483784037"
};

export const fire = firebase.initializeApp(config);

export const database = fire.database();
