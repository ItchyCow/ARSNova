import { initializeApp } from 'firebase/app'
import {
    getFirestore, collection, onSnapshot,
    addDoc, deleteDoc, doc,
    query, where,
    orderBy, Unsubscribe,
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
const userRef = collection(db, 'user')
const q = query(userRef, orderBy('lname', 'asc'))
var IDs = []
var userID

//firebase functions
onAuthStateChanged(auth, (user) => {
    if (user) {
        userID = user.uid
        getProfileImageUrl('ussum_pp')
        const dataRef = doc(db, 'user', userID)
        onSnapshot(dataRef, (doc) => {
            document.getElementById('profname').innerHTML = doc.data().fname + " " + doc.data().lname + "<br>" + doc.data().email
        })
    }
    else {
        window.location = 'index.html'
    }
})

function getProfileImageUrl(destination) {
    var location = "images/" + userID
    getDownloadURL(ref(storage, location))
        .then((url) => {
            document.getElementById(destination).src = url
        })
}

onSnapshot(q, (snapshot) => {
    IDs = []
    let user = []
    snapshot.docs.forEach((doc) => {
        user.push({ ...doc.data()})
        IDs.push({ id: doc.id})
    })
    clearTable()
    for (var i in user) {
        displayToTable(user[i])
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
function clearTable() {
    document.getElementById('userdata').innerHTML = ""
}

function displayToTable(user) {
    let stat
    let balance = 0
    if (user.availability === true) {
        stat = 'CLEARED'
    } else {
        stat = 'NOT CLEARED'
    }
    balance = parseFloat(user.fines) - parseFloat(user.incentives)

    var codeBlock = "<tr><td name='lname'>" + user.lname + "</td>" +
                    "<td name='fname'>" + user.fname + "</td>" +
                    "<td name='mi'>" + user.mi + "</td>" +
                    "<td name='year'>" + user.year_level + "</td>" +
                    "<td name='course'>" + user.course + "</td>" +
                    "<td name='type'>" + user.type + "</td>" +
                    "<td name='balance'>" + balance + "</td>" +
                    "<td name='status'>" + stat + "</td></tr>"
    document.getElementById('userdata').innerHTML += codeBlock
    addRowHandlers()
}

function addRowHandlers() {
    var table = document.getElementById('users')
    var rows = table.getElementsByTagName('tr')
    for (var i = 0; i < rows.length; i++) {
        var currentRow = table.rows[i]
        var createClickHandler = function(row) {
            return function() {
            sessionStorage.setItem('userID', IDs[row.rowIndex - 1].id)
            window.location = 'edituser.html'
            }
        }
        currentRow.onclick = createClickHandler(currentRow);
    }
}

const search = document.getElementById('searchbox')
search.addEventListener('submit', (e) => {
    e.preventDefault()
    
    let text = document.getElementById('search').value
    var sq = query(userRef, where('lname', '==', text))
    onSnapshot(sq, (snapshot) => {
        IDs = []
        let user = []
        snapshot.docs.forEach((doc) => {
            user.push({ ...doc.data()})
            IDs.push({ id: doc.id})
        })
        clearTable()
        for (var i in user) {
            displayToTable(user[i])
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
    var reset = query(userRef, orderBy('lname', 'asc'))
        onSnapshot(reset, (snapshot) => {
            IDs = []
            let user = []
            snapshot.docs.forEach((doc) => {
                user.push({ ...doc.data()})
                IDs.push({ id: doc.id})
            })
            clearTable()
            for (var i in user) {
                displayToTable(user[i])
            }
        })
}