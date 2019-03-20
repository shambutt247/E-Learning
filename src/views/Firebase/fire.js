import firebase from 'firebase'

  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyCsGc1cUG0bUe5_QSzQq9Tmn9pAqUnyEAQ",
    authDomain: "e-learning-5d902.firebaseapp.com",
    databaseURL: "https://e-learning-5d902.firebaseio.com",
    projectId: "e-learning-5d902",
    storageBucket: "e-learning-5d902.appspot.com",
    messagingSenderId: "629075544291"
  };

var fire = firebase.initializeApp(config);
export default fire;