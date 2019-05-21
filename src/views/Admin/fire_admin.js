import * as admin from 'firebase-admin';

import serviceAccount from './e-learning-5d902-firebase-adminsdk-7b560-855b9e72ae.json';

var fire_admin=admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://e-learning-5d902.firebaseio.com"
});
 export default fire_admin;