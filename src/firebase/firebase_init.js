import firebase from 'firebase';
import firestore from 'firebase/firestore';

// Initialize Firebase
var config = {
    apiKey: "AIzaSyDpCnii-r7PxvhsQkIllZU3WMDLzdLUT8E",
    authDomain: "chux-stealth-geo.firebaseapp.com",
    databaseURL: "https://chux-stealth-geo.firebaseio.com",
    projectId: "chux-stealth-geo",
    storageBucket: "chux-stealth-geo.appspot.com",
    messagingSenderId: "873959956873"
};

const firebaseApp = firebase.initializeApp(config);

firebaseApp.firestore().settings({ timestampsInSnapshots: true });

export default firebaseApp.firestore();