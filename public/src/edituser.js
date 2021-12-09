import { initializeApp } from 'firebase/app'
import {
    getFirestore, collection, onSnapshot,
    addDoc, deleteDoc, doc,
    query, where,
    orderBy, updateDoc
} from 'firebase/firestore'
import {
    getAuth, signOut,
    onAuthStateChanged
} from 'firebase/auth'
import { 
    getStorage, ref, 
    getDownloadURL
} from "firebase/storage"

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

//global variables
const editUserID = sessionStorage.getItem('userID')
if(editUserID == null) {window.location = 'usersummary.html'}

const userRef = doc(db, 'user', editUserID)
const attendRef = collection(db, 'attendance')
const eventRef = collection(db, 'event')

const attendQ = query(attendRef, where('uid', '==', editUserID))

var presentEvents = []
var allEvents = []

var userID
onAuthStateChanged(auth, (user) => {
    if (user) {
        userID = user.uid
        getProfileImageUrl('edituser_pp', userID)
        const dataRef = doc(db, 'user', userID)
        onSnapshot(dataRef, (doc) => {
            document.getElementById('profname').innerHTML = doc.data().fname + " " + doc.data().lname + "<br>" + doc.data().email
        })
    }
    else {
        window.location = 'index.html'
    }
})

const logoutButton = document.querySelector('.lobtn')
logoutButton.addEventListener('click', () => {
    signOut(auth)
        .then(() => {
            window.location = 'index.html'
        })
        .catch(err => {
            console.log(err)
        })
})

function getProfileImageUrl(destination, ID) {
    var location = "images/" + ID
    getDownloadURL(ref(storage, location))
        .then((url) => {
            document.getElementById(destination).src = url
        })
}


onSnapshot(userRef, (doc) => {
    let user = doc.data()

    displayUserData(user)
})

function displayUserData(eu) {
    var name = eu.fname + " " + eu.lname
    var status = 'false'
    if (eu.clearance_status) {
        status = 'true'
    }

    document.getElementById('bcname').innerHTML = 'Edit ' + name
    document.getElementById('selectedUser').innerHTML = name
    document.getElementById('type').value = eu.type
    document.getElementById('incentives').value = eu.incentives
    document.getElementById('status').value = status
}

onSnapshot(attendQ, (snapshot) => {
    presentEvents = []

    snapshot.docs.forEach((doc) => {
        presentEvents.push({ eid: doc.data().event_id, id: doc.id})
    })

    getAllEvents()
})

function getAllEvents() {
    const eventQ = query(eventRef, orderBy('name', 'asc'))
    onSnapshot(eventQ, (snapshot) => {
        allEvents = []
        snapshot.docs.forEach((doc) => {
            allEvents.push({ ...doc.data()})
        })
        checkAttendance(allEvents)
    })
}

function checkAttendance(events) {
    clearTable()
    for (var i = 0; i < events.length; i++) {
        displayAttendance(events[i])
    }
}

function clearTable() {
    document.getElementById('attendancedata').innerHTML = ""
}

function displayAttendance(event) {
    let present = "<select class='attendance' id='attendance' name='status'>" +
                  "<option selected value='false'>ABSENT</option>" +
                  "<option  value='true'>PRESENT</option>"
    for(var i = 0; i < presentEvents.length; i++) {
        if(event.qrcode == presentEvents[i].eid) {
            present = "<select class='attendance' id='attendance' name='status'>" +
                      "<option value='false'>ABSENT</option>" +
                      "<option selected value='true'>PRESENT</option>"
        }
    }

    var codeBlock = "<tr><td name='name'>" + event.name + "</td>" +
                    "<td name='attendance'>" + present + "</td>" +
                    "<td name='fines'>" + event.fine + "</td></tr>"
    document.getElementById('attendancedata').innerHTML += codeBlock
}

const saveChanges = document.getElementById('saveChanges')
saveChanges.addEventListener('click', (e) => {
    e.preventDefault

    handleManualAttendanceMarking()
    handleUserDetailChanges()
})

function handleManualAttendanceMarking() {
    var selections = document.getElementsByClassName('attendance')
    for(let i = 0; i < selections.length; i++) {
        if(selections[i].value == 'true') {
            let notAttended = true
            for(let j = 0; j < presentEvents.length; j++) {
                if(allEvents[i].qrcode == presentEvents[j].eid) {
                    notAttended = false
                    break
                }
            }
            if(notAttended) {
                addDoc(attendRef, {
                    event_id: allEvents[i].qrcode,
                    timestamp: null,
                    uid: editUserID
                })
            }
        }
        else {
            let attended = false
            let attendanceID
            for(let j = 0; j < presentEvents.length; j++) {
                if(allEvents[i].qrcode == presentEvents[j].eid) {
                    attended = true
                    attendanceID = presentEvents[j].id
                    break
                }
            }
            if(attended) {
                const attendDocRef = doc(db, 'attendance', attendanceID)
                deleteDoc(attendDocRef)
            }
        }
    }
}

function handleUserDetailChanges() {
    let status
    let incentives = parseFloat(document.getElementById('incentives').value)
    let input = document.getElementById('status').value

    if(input == 'true') {
        status = true 
    } else {
        status = false
    }

    updateDoc(userRef, {
        type: document.getElementById('type').value,
        incentives: incentives,
        clearance_status: status
    })
    .then(() => {
        window.location = ('viewuser.html')
    })
}