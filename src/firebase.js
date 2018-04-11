import firebase from "firebase";

const config = {
  apiKey: "AIzaSyCvYIE3RZHg26MtRgstd2Ea8BVM4lqLl_M",
  authDomain: "memopad-dev.firebaseapp.com",
  databaseURL: "https://memopad-dev.firebaseio.com",
  projectId: "memopad-dev",
  storageBucket: "memopad-dev.appspot.com",
  messagingSenderId: "967234494324"
};

firebase.initializeApp(config);

export default firebase;
