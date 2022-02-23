importScripts('https://www.gstatic.com/firebasejs/7.19.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.19.0/firebase-messaging.js');

firebase.initializeApp({
  apiKey: "AIzaSyBftgLJoAR-WbMHTayeLRDnRN9Tefr19AI",
  authDomain: "sharevans-ff2e8.firebaseapp.com",
  databaseURL: "https://sharevans-ff2e8.firebaseio.com",
  projectId: "sharevans-ff2e8",
  storageBucket: "sharevans-ff2e8.appspot.com",
  messagingSenderId: "903923035545",
  appId: "1:903923035545:web:a09ee13a6f5378d5ed3708",
  measurementId: "G-CM6JMBL89B"
});

const messaging = firebase.messaging();
