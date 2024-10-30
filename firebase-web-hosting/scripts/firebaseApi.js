// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-analytics.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAZ3uSIfeNWjX6fzQGViILir-pDKr3bQgM", //don't you dare
  authDomain: "personalwebsite-john.firebaseapp.com",
  projectId: "personalwebsite-john",
  storageBucket: "personalwebsite-john.appspot.com",
  messagingSenderId: "641737664192",
  appId: "1:641737664192:web:fe5484527ea8bde2a52f25"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

const studentsCollectionRef = collection (db, "students");

let data;
getDocs(studentsCollectionRef)
    .then ((snapshot) => {
        snapshot.docs.forEach((doc)=>{
            data = doc.data();
            console.log(doc.id, " => ", data);
        });
    })
    .catch((error) => {
        console.error ("Error getting documents",
            error);
    });

