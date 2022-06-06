import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAejQAH2XMC8R7hTaTakluNNzhV9hd2t2s",
  authDomain: "app-b784d.firebaseapp.com",
  projectId: "app-b784d",
  storageBucket: "app-b784d.appspot.com",
  messagingSenderId: "461101599355",
  appId: "1:461101599355:web:2b32997942d2f4e0b2b0de",
  measurementId: "G-5J6WN5PTRG",
};

// Inititaloizing the APp
const app = initializeApp(firebaseConfig);


const db = getFirestore(app);
// const firebaseApp = initializeApp(firebaseConfig);
// const db = getFirestore(firebaseApp);
const auth = getAuth();


export { auth, db };
// export default { db };
