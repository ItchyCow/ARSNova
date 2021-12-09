import { initializeApp } from 'firebase/app'
import {
    getFirestore, collection, onSnapshot,
    deleteDoc, doc, query, where,
    orderBy, updateDoc
} from 'firebase/firestore'
import {
    getAuth, signOut,
    onAuthStateChanged
} from 'firebase/auth'
import { 
    getStorage, ref, 
    getDownloadURL, deleteObject
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

//global vars
const viewuserID = sessionStorage.getItem('userID')

if(viewuserID == null) {window.location='usersummary.html'}

const userRef = doc(db, 'user', viewuserID)
const attendRef = collection(db, 'attendance')
const eventRef = collection(db, 'event')
const attendQ = query(attendRef, where('uid', '==', viewuserID))
var userID
var presentEvents = []
var fines = []

//firebase functions
onAuthStateChanged(auth, (user) => {
    if (user) {
        userID = user.uid
        getProfileImageUrl('profile_pp', userID)
        const dataRef = doc(db, 'user', userID)
        onSnapshot(dataRef, (doc) => {
            document.getElementById('profname').innerHTML = doc.data().fname + " " + doc.data().lname + "<br>" + doc.data().email
        })
    }
    else {
        window.location = 'index.html'
    }
})

onSnapshot(userRef, (doc) => {
    let user = doc.data()

    displayUserData(user)
    getProfileImageUrl('view_pp', viewuserID)
})

onSnapshot(attendQ, (snapshot) => {
    presentEvents = []

    snapshot.docs.forEach((doc) => {
        presentEvents.push({ id: doc.data().event_id})
    })

    getAllEvents()
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

//customfunctions
function getProfileImageUrl(destination, ID) {
    var location = "images/" + ID
    getDownloadURL(ref(storage, location))
        .then((url) => {
            document.getElementById(destination).src = url
        })
}

function displayUserData(vu) {
    let balance = parseFloat(vu.fines) - parseFloat(vu.incentives)
    let status
    if (vu.clearance_status === true) {
        status = 'CLEARED'
    } else {
        status = 'NOT CLEARED'
    }

    document.getElementById('clickedUser').innerHTML = vu.fname + " " + vu.lname
    document.getElementById('nameuser').innerHTML = vu.fname + " " + vu.mi + ". " + vu.lname
    document.getElementById('yrlvl').innerHTML = vu.course + " - " + vu.year_level
    document.getElementById('useremail').innerHTML = vu.email
    document.getElementById('type').innerHTML = vu.type
    document.getElementById('bio').innerHTML = vu.bio
    document.getElementById('incentives').innerHTML = vu.incentives
    document.getElementById('balance').innerHTML = balance
    document.getElementById('status').innerHTML = status
}

function getAllEvents() {
    const eventQ = query(eventRef, orderBy('name', 'asc'))
    onSnapshot(eventQ, (snapshot) => {
        fines = []
        let events = []
        snapshot.docs.forEach((doc) => {
            events.push({ ...doc.data()})
            fines.push({ id: doc.id, fine: doc.data().fine})
        })
        checkAttendance(events)
    })
    
    
}

function checkAttendance(events) {
    clearTable()
    for (var i = 0; i < events.length; i++) {
        displayAttendance(events[i])
    }
    updateBalance()
}

function displayAttendance(event) {
    let present = 'ABSENT'
    for(var i = 0; i < presentEvents.length; i++) {
        if(event.qrcode == presentEvents[i].id) {
            present = 'PRESENT'
        }
    }

    var codeBlock = "<tr><td name='name'>" + event.name + "</td>" +
                    "<td name='attendance'>" + present + "</td>" +
                    "<td name='fines'>" + event.fine + "</td>"
    document.getElementById('attendancedata').innerHTML += codeBlock
}

function clearTable() {
    document.getElementById('attendancedata').innerHTML = ""
}

function updateBalance() {
    let missed = []
    for(let i = 0; i < fines.length; i++) {
        let flag = true
        for(let j = 0; j < presentEvents.length; j++) {
            if(fines[i].id == presentEvents[j].id) {
                flag = false
            }
        }
        if(flag) {
            missed[i] = fines[i].fine
        }
    }
    var total = 0
    for(let i in missed) {
        total += missed[i]
    }
    
    updateDoc(userRef, {
        fines: total
    })
}

var modal = document.getElementById("myModal")
var deleteEvent = document.getElementById('deleteUser')
deleteEvent.onclick = function() {
    modal.style.display = "block"
}

var cancel = document.getElementById('cancelDelete')
cancel.onclick = function() {
    closeModal()
}

window.onclick = function(event) {
    if (event.target == modal) {
        closeModal()
    }
}

function closeModal() {
    modal.style.display = 'none'
}

var confirmDelete = document.getElementById('confirmDelete')
confirmDelete.addEventListener('click', (e) => {
    e.preventDefault()

    closeModal()

    var loc = 'images/' + viewuserID
    console.log(loc)
    const ppRef = ref(storage, loc)
    deleteObject(ppRef)
    cascadeDeleteAttendance()
    deleteDoc(userRef)

    window.location = 'usersummary.html'
})

function cascadeDeleteAttendance() {
    var find =  query(attendRef, where('uid', '==', viewuserID))
    let attendances = []
    onSnapshot(find, (snapshot) => {
        snapshot.docs.forEach((doc) => {
            attendances.push({ id: doc.id})
        })
        for (var i = 0; i < attendances.length; i++) {
            const attendDocRef = doc(db, 'attendance', attendances[i].id)
            deleteDoc(attendDocRef)
        }
    })
}

document.getElementById('editUser').addEventListener('click', (e) => {
    e.preventDefault()

    sessionStorage.setItem('userID', viewuserID)
    window.location = 'edituser.html'
})
