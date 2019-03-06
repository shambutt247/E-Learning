import app from 'firebase/app';
import 'firebase/auth';

  // Initialize Firebase
  const config = {
    apiKey: "AIzaSyCsGc1cUG0bUe5_QSzQq9Tmn9pAqUnyEAQ",
    authDomain: "e-learning-5d902.firebaseapp.com",
    databaseURL: "https://e-learning-5d902.firebaseio.com",
    projectId: "e-learning-5d902",
    storageBucket: "e-learning-5d902.appspot.com",
    messagingSenderId: "629075544291"
  };

class Firebase {
 constructor() {
   app.initializeApp(config);

   this.auth = app.auth();

 }

 doCreateUserWithEmailAndPassword = (email, password) =>
    this.auth.createUserWithEmailAndPassword(email, password);

    doSignInWithEmailAndPassword = (email, password) =>
    this.auth.signInWithEmailAndPassword(email, password);

    doSignOut = () => this.auth.signOut();

    doPasswordReset = email => this.auth.sendPasswordResetEmail(email);

  doPasswordUpdate = password =>
    this.auth.currentUser.updatePassword(password);
}

export default Firebase;