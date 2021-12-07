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

//global vars
const eventRef = collection(db, 'event')
const q = query(eventRef, orderBy('name', 'asc'))
var IDs = []
var userID

//firebase functions
onAuthStateChanged(auth, (user) => {
    if (user) {
        userID = user.uid
        getProfileImageUrl('evsum_pp')
        console.log('user status changed:', userID)
        const dataRef = doc(db, 'user', userID)
        onSnapshot(dataRef, (doc) => {
            document.getElementById('profname').innerHTML = doc.data().fname + " " + doc.data().lname + "<br>" + doc.data().email
        })
    }
    else {
        window.location = 'index.html'
        console.log('user not signed in')
    }
})

onSnapshot(q, (snapshot) => {
    let event = []
    snapshot.docs.forEach((doc) => {
        event.push({ ...doc.data()})
        IDs.push({ id: doc.id})
    })
    resetTable()
    for (var i in event) {
        displayToTable(event[i])
    }
    console.log(event)
    console.log(IDs)
})

const logoutButton = document.querySelector('.lobtn')
logoutButton.addEventListener('click', () => {
    signOut(auth)
        .then(() => {
            console.log('user signed out');
            window.location = 'index.html'
        })
        .catch(err => {
            console.log(err)
        })
})

/*const deleteEvents = document.getElementById('btn2')
deleteEvents.addEventListener('submit', (e) => {
    e.preventDefault()
})*/

//custom functions
function getProfileImageUrl(destination) {
    var location = "images/" + userID
    console.log(location)
    getDownloadURL(ref(storage, location))
        .then((url) => {
            document.getElementById(destination).src = url
        })
}

function displayToTable(event) {
    let avail
    if (event.availability === true) {
        avail = 'Available'
    } else {
        avail = 'Not Available'
    }

    var codeBlock = "<tr><td><input type='checkbox' name='ticks'></td>" +
                    "<td name='name'>" + event.name + "</td>" +
                    "<td name='date'>" + event.date + "</td>" +
                    "<td name='timestart'>" + event.time_start + "</td>" +
                    "<td name='timeend'>" + event.time_end + "</td>" +
                    "<td name='location'>" + event.location + "</td>" +
                    "<td name='fine'>" + event.fine + "</td>" +
                    "<td name='avail'>" + avail + "</td></tr>"
    document.getElementById('eventsdata').innerHTML += codeBlock
    addRowHandlers()
}

function resetTable() {
    document.getElementById('eventsdata').innerHTML = ""
}

document.getElementById('selectall').onclick = function checkAllBoxes() {
    let checkboxes = document.getElementsByName('ticks')

    for(var i = 0, n = checkboxes.length; i < n; i++) {
        checkboxes[i].checked = selectall.checked
    }
}

document.getElementById('clear').onclick = function clearAllBoxes() {
    let checkboxes = document.getElementsByName('ticks')
    
    document.getElementById('selectall').checked = false
    for(var i = 0, n = checkboxes.length; i < n; i++) {
        checkboxes[i].checked = false
    }
}

/*function addRowHandlers() {
    var theTbl = document.getElementById('events')
    for(var i = 0; i < theTbl.length; i++)
    {
        var currentRow = theTbl.rows[i]
        for(var j = 0; j<theTbl.rows[i].cells.length; j++)
        {
            if (j != 0) {
                currentRow.onclick = console.log('hello')
            }
        }
    }
}*/

function addRowHandlers() {
    var table = document.getElementById('events')
    var rows = table.getElementsByTagName('tr')
    for (var i = 0; i < rows.length; i++) {
        var currentRow = table.rows[i]
        var createClickHandler = function(row) {
            return function() {
            sessionStorage.setItem('eventID', IDs[row.rowIndex - 1].id)
            window.location = 'editevent.html'
            }
        }
        currentRow.onclick = createClickHandler(currentRow);
    }
}

var flag = true

window.onload(changeState())
function changeState() {
    if (flag) {
        var checks = document.getElementsByTagName('input')
        for (var i = 0; i < checks.length; i++) {
            if(checks[i].hasAttribute()) {
                checks[i].disabled = true
            }
        }

        
    } else {
        var checks = document.getElementsByTagName('input')

        for (var i = 0; i < checks.length; i++) {
            if(checks[i].hasAttribute()) {
                checks[i].disabled = false
            }
        }
    }
}