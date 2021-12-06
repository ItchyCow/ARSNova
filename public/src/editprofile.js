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

  //init firebase app
initializeApp(firebaseConfig)

//init services
const db = getFirestore()
const auth = getAuth()

//collection ref
const colRef = collection(db, 'user')

//real time collection data
onSnapshot(colRef, (snapshot) => {
    let user = []
    snapshot.docs.forEach((doc) => {
        user.push({ ...doc.data(), id: doc.id})
    })
    console.log(user)
})

/*updating a document
const updateForm = document.querySelector('.update')
updateForm.addEventListener('submit', (e) => {
    e.preventDefault()

    const docRef = doc(db, 'user', updateForm.id.value)
})*/

function writeNewPost(bio, course, position, year_level) {
      
    // A post entry.
    const postData = {
      bio: bio,
      course: course,
      position: position,
      year_level: year_level
    };
  
    // Get a key for a new Post.
    const docRef = doc(db, 'user', updateForm.id.value)
  
    return update(ref(db), updates);
}