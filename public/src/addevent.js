import { initializeApp } from 'firebase/app'
import { getStorage, ref, uploadString, getDownloadURL } from "firebase/storage";
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
const storage = getStorage()

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

function uploadQR(event_id) {
    var QRCode = require('qrcode')
    var location = "qrcodes/"+ event_id
    console.log(location)
    var storageRef = ref(storage, location)

    QRCode.toDataURL(event_id, {version: 2}, function (err, url) {
        console.log(url);
        uploadString(storageRef, url, 'data_url').then((snapshot) => {
            console.log("Success")
        })
    })
    
}

function getProfileImageUrl(user_id) {
    var location = "images/"+ user_id
    getDownloadURL(ref(storage, location)).then((url) => {
        return url

    })

}

uploadQR("Hello world hi there")
document.getElementById("addevent_pp").src = getProfileImageUrl("yCLNQPosR3RUvKYd7tqOs73Rdc52")

