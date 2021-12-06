import { initializeApp } from 'firebase/app'
import { getStorage, ref, uploadBytes } from "firebase/storage";
import {
    getFirestore, collection, onSnapshot,
    addDoc, deleteDoc, doc,
    query, where,
    orderBy,
    getDoc, updateDoc
} from 'firebase/firestore'

const firebaseConfig = {
    apiKey: "AIzaSyBMjNRz6ccicva3bAuQ07MN-xniNSCk0_A",
    authDomain: "ccs6-b084d.firebaseapp.com",
    projectId: "ccs6-b084d",
    storageBucket: "ccs6-b084d.appspot.com",
    messagingSenderId: "741143261047",
    appId: "1:741143261047:web:42557543c4d2a0cf0c7b72",
    measurementId: "G-KQ9QHRVZLG"
};

//init firebase app
initializeApp(firebaseConfig)


//init services
const db = getFirestore()

// collection ref
const colRef = collection(db, 'event')

 // real time collection data  
 onSnapshot(colRef, (snapshot) => {
    let event = []
    snapshot.docs.forEach((doc) => {
        event.push({ ...doc.data(), id: doc.id})
    })
    console.log(event)
})

// adding documents
const addEventForm = document.querySelector('.add')
addEventForm.addEventListener('submit', (e) => {
    e.preventDefault()

    addDoc(colRef, {
        Name: addEventForm.Name.value,
        Location: addEventForm.Location.value,
        id: addEventForm.id.value,
        TimeS: addEventForm.TimeS.value,
        TimeE: addEventForm.TimeE.value,
        date: addEventForm.date.value,
        //code: addEventForm.code.value,
    })
    .then(() => {
        addEventForm.reset()
    })
})

// index.js -> bundle.js
var QRCode = require('qrcode')
var canvas = document.getElementById('qrcode')

QRCode.toCanvas(canvas, 'TestingTesting123', function (error) {
  if (error) console.error(error)
  console.log(QRCode);
})

const storage = getStorage()
const storageRef = ref(storage, 'images/test')

uploadBytes(storageRef, 'resources/images/anakin.jpg').then((snapshot) => {
  console.log('Success for Image!')
})

