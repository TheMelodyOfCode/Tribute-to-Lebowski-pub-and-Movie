
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  } from 'firebase/auth';
  /**Sign-In by email and password is a firebase nativ provider and therefore
   * we don't need to supply a provider but just a method. 
   * These come by default from firebase/auth =  createUserWithEmailAndPassword   */ 
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  collection,
  writeBatch,
  query,
  getDocs } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBrjL7UzA9rATHiB6SWo8VeU0ge4tvkMzA",
  authDomain: "thebiglebowski-1adfc.firebaseapp.com",
  projectId: "thebiglebowski-1adfc",
  storageBucket: "thebiglebowski-1adfc.appspot.com",
  messagingSenderId: "611056954314",
  appId: "1:611056954314:web:48a8e6d6259abe38c7bd33"
};

// Initialize Firebase
// const firebaseApp =
 initializeApp(firebaseConfig);

 
 // Firebase authentication service
const provider = new GoogleAuthProvider();
provider.setCustomParameters(
    {prompt: "select_account",}
);

export const auth = getAuth();
export const signInWithGooglePopup = ()=> signInWithPopup(auth, provider);

// Firebase Database connection
export const db = getFirestore()


export const addCollectionAndDocuments = async (
  collectionKey, 
  objectsToAdd, 
  field = 'title'   ) => {
  const collectionRef = collection(db, collectionKey);
  const batch = writeBatch(db);

  objectsToAdd.forEach((object)=>{

    const docRef = doc(collectionRef, object[field].toLowerCase());
    batch.set(docRef, object );
  });
  await batch.commit();
  console.log('done batching baby!');
};

export const getCategoriesAndDocuments = async ()=>{
  const collectionRef = collection(db, 'categories');
  const q = query(collectionRef);

  const querySnapshot = await getDocs(q);
  const categoryMap = querySnapshot.docs.reduce((acc, docSnapshot) =>{
    const {title, items} = docSnapshot.data();
    acc[title.toLowerCase()] = items;
    return acc;
  }, {});
  return categoryMap;
}


export const createUserDocumentFromAuth = async (
  userAuth, 
  additionalInformation = {}
  ) => {
    if(!userAuth) return;

  const userDocRef = doc(db, 'users', userAuth.uid);

  const userSnapshot = await getDoc(userDocRef);
  // console.log(userSnapshot);
  // console.log(userSnapshot.exists()); // returns false if the object(snapshot) doesn't exists in the DB

  /**If user data exists return userDocRef.
   * If user data does NOT exis
   * create / set the document with the data from userAuth in my collection*/
   if(!userSnapshot.exists()) {
    const {displayName, email} = userAuth;
    const createdAt = new Date(); // this way we know when the users sign in 

    try {
      await setDoc(userDocRef, {
        displayName,
        email,
        createdAt,
        ...additionalInformation
      });
    } catch (error) {
      console.log('ERROR creating the USER , fuckoff', error);
      console.log(userDocRef);
    }
   }
   return userDocRef;
}

export const createAuthUserWithEmailAndPassword = async (email, password)=>{
  if(!email || !password) return;
  return await createUserWithEmailAndPassword(auth, email, password)
};

export const signInAuthUserWithEmailAndPassword = async (email, password)=>{
  if(!email || !password) return;

  return await signInWithEmailAndPassword(auth, email, password)
};

export const signOutUser = async ()=> await signOut(auth);


export const onAuthStateChangedListener = (callback) => 
  /**whenever auth changes give me a callback */
  onAuthStateChanged(auth, callback );