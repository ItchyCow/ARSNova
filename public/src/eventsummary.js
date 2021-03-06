import { initializeApp } from 'firebase/app'
import {
    getFirestore, collection, onSnapshot,
    deleteDoc, doc, query, where, orderBy
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
const eventRef = collection(db, 'event')
const attendRef = collection(db, 'attendance')
const q = query(eventRef, orderBy('name', 'asc'))
var IDs = []
var userID

//firebase functions
onAuthStateChanged(auth, (user) => {
    if (user) {
        userID = user.uid
        getProfileImageUrl('evsum_pp')
        const dataRef = doc(db, 'user', userID)
        onSnapshot(dataRef, (doc) => {
            document.getElementById('profname').innerHTML = doc.data().fname + " " + doc.data().lname + "<br>" + doc.data().email
        })
    }
    else {
        window.location = 'index.html'
    }
})

onSnapshot(q, (snapshot) => {
    IDs = []
    let event = []
    snapshot.docs.forEach((doc) => {
        event.push({ ...doc.data()})
        IDs.push({ id: doc.id})
    })
    clearTable()
    for (var i in event) {
        displayToTable(event[i])
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

//custom functions
function getProfileImageUrl(destination) {
    var location = "images/" + userID
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

function clearTable() {
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

function addRowHandlers() {
    var table = document.getElementById('events')
    var rows = table.getElementsByTagName('tr')
    for (var i = 0; i < rows.length; i++) {
        for(var j = 0; j < table.rows[i].cells.length; j++) {
            if (j != 0) {
                var currentRow = table.rows[i]
                var currentCell = table.rows[i].cells[j]
                var createClickHandler = function(row) {
                    return function() {
                    sessionStorage.setItem('eventID', IDs[row.rowIndex - 1].id)
                    window.location = 'editevent.html'
                    }
                }
                currentCell.onclick = createClickHandler(currentRow);
            }
            
        }
    }
}

var modal = document.getElementById("myModal")
var deleteEvent = document.getElementById('deleteEvent')
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

var confirmDelete = document.getElementById('confirmDelete')
confirmDelete.addEventListener('click', (e) => {
    e.preventDefault()

    closeModal()

    let checks = document.getElementsByName('ticks')
    let IDlist = []

    var j = 0
    for (var i = 0; i < checks.length; i++) {
        if(checks[i].checked) {
            IDlist[j] = IDs[checks[i].parentNode.parentNode.rowIndex - 1].id
            j++
        }
    }

    for (i = 0; i < IDlist.length; i++) {
        var current = IDlist[i]
        const eventRef = doc(db, 'event', current)
        deleteDoc(eventRef)
        var loc = 'qrcodes/' + current
        const qrRef = ref(storage, loc)
        deleteObject(qrRef)
        cascadeDeleteAttendance(current)
    }
})

function closeModal() {
    modal.style.display = 'none'
}

function cascadeDeleteAttendance(currentID) {
    var find =  query(attendRef, where('event_id', '==', currentID))
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

const search = document.getElementById('searchbox')
search.addEventListener('submit', (e) => {
    e.preventDefault()
    
    let text = document.getElementById('search').value
    var sq = query(eventRef, where('name', '==', text))
    onSnapshot(sq, (snapshot) => {
        IDs = []
        let event = []
        snapshot.docs.forEach((doc) => {
            event.push({ ...doc.data()})
            IDs.push({ id: doc.id})
        })
        clearTable()
        for (var i in event) {
            displayToTable(event[i])
        }
    })
    
})

search.addEventListener('input', (e) => {
    e.preventDefault()
    
    let text = document.getElementById('search').value

    if (text == '') {
        resetTable()
    }
})

function resetTable() {
    var reset = query(eventRef, orderBy('name', 'asc'))
        onSnapshot(reset, (snapshot) => {
            IDs = []
            let event = []
            snapshot.docs.forEach((doc) => {
                event.push({ ...doc.data()})
                IDs.push({ id: doc.id})
            })
            clearTable()
            for (var i in event) {
                displayToTable(event[i])
            }
        })
}