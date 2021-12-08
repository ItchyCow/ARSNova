import { initializeApp } from 'firebase/app'
import {
    getFirestore, collection, onSnapshot,
    addDoc, deleteDoc, doc,
    query, where,
    orderBy,
    getDoc, updateDoc
} from 'firebase/firestore'
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword, signOut,
    onAuthStateChanged
} from 'firebase/auth'
import { getStorage, ref, uploadString, getDownloadURL } from "firebase/storage";

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
const auth = getAuth()
const storage = getStorage()

//global vars
var userID

//firebase functions
onAuthStateChanged(auth, (user) => {
    if (user) {
        userID = user.uid
        getProfileImageUrl('addevent_pp')
        const dataRef = doc(db, 'user', userID)
        onSnapshot(dataRef, (doc) => {
            document.getElementById('profname').innerHTML = doc.data().fname + " " + doc.data().lname + "<br>" + doc.data().email
        })
    }
    else {
        window.location = 'index.html'
    }
})

//custom functions
function getProfileImageUrl(destination) {
    var location = "images/" + userID
    getDownloadURL(ref(storage, location))
        .then((url) => {
            document.getElementById(destination).src = url
        })
}

//logout
const logoutButton = document.querySelector('.lobtn')
logoutButton.addEventListener('click', () => {
    signOut(auth)
        .then(() => {
            window.location = 'index.html'
        })
        .catch(err => {
        })
})

// collection ref
const colRef = collection(db, 'event')

 // real time collection data  
 onSnapshot(colRef, (snapshot) => {
    let event = []
    snapshot.docs.forEach((doc) => {
        event.push({ ...doc.data(), id: doc.id})
    })
})

// adding documents
const addEventForm = document.querySelector('.add')
addEventForm.addEventListener('submit', (e) => {
    e.preventDefault()

    // When the user clicks the button, open the modal 
    
        if (addEventForm.availability.value === 'true') {
            var status = true
          } else {
             var status = false
          }

        var fine = parseFloat(addEventForm.fine.value)

        addEventtoFirestore(
            status,
            addEventForm.date.value,
            fine,
            addEventForm.location.value,
            addEventForm.name.value,
            addEventForm.time_end.value,
            addEventForm.time_start.value,
            addEventForm.type.value,
        )
            .then(() => {
                modal.style.display = "block";
                addEventForm.reset()
            })
               
})

function uploadQR(event_id) {
    var QRCode = require('qrcode')
    var location = "qrcodes/"+ event_id
    var storageRef = ref(storage, location)

    QRCode.toDataURL(event_id, {version: 2}, function (err, url) {
        uploadString(storageRef, url, 'data_url').then((snapshot) => {
        })
    })
    
}

async function addEventtoFirestore(availability, date, fine, location, name, time_end, time_start, type) {
    var docRef = await addDoc(collection(db, "event"), {
        availability: availability,
        date: date,
        fine: fine,
        location: location,
        name: name,
        time_end: time_end,
        time_start: time_start,
        type: type
    })

    await updateDoc(doc(db, "event", docRef.id), {
        qrcode: docRef.id
    })

    uploadQR(docRef.id)
    
}

// Modal code
// Get the modal
var modal = document.getElementById("myModal");

// Get the button that opens the modal
var btn = document.getElementById("myBtn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

