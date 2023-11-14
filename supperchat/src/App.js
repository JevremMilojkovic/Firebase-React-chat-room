import React, { useRef, useState } from 'react';
import './App.css';

import { initializeApp} from 'firebase/app'
import { getAuth,GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth'
import { getFirestore, collection, query, orderBy, limit, addDoc, serverTimestamp} from 'firebase/firestore'
import { getAnalytics} from 'firebase/analytics'



import { useAuthState } from 'react-firebase-hooks/auth'
import { useCollectionData } from 'react-firebase-hooks/firestore' 

const firebaseApp = initializeApp({
  apiKey: "AIzaSyAj8GHoofj2PHMzB8tzFBmR9SuNjSM99Ho",
  authDomain: "chatroom-92582.firebaseapp.com",
  projectId: "chatroom-92582",
  storageBucket: "chatroom-92582.appspot.com",
  messagingSenderId: "656620442167",
  appId: "1:656620442167:web:c5b55d3328efe29fff65b2",
  measurementId: "G-NZNN41YSP4"
});

const auth = getAuth(firebaseApp);
const firestore = getFirestore(firebaseApp);
const analytics = getAnalytics(firebaseApp)


function App() {

  const [user] = useAuthState(auth)
  return (
    <div className="App">
      <header>
        <h1>ChatRoom v1.0⚛️🔥💬</h1>
        <SignOut />
      </header>
      
      <section>
        {user ? <ChatRoom /> : <SignIn />}
      </section>
    </div>
  );
}

function SignIn() {

  const singInWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
  }

  return (
    <>
    <button className='sigh-in' onClick={singInWithGoogle}>Sing in with Google</button>
    <p>Do not violate community guidelines or you are gonna be banned for life!</p>
    </>
  )  
}

function SignOut() {
  return auth.currentUser && (
    <button className='sigh-out' onClick={() => signOut()}>Sigh out</button>
  )
}

function ChatRoom() {
  const dummy = useRef()
  const messagesRef = collection(firestore, 'messages');
  const q = query(messagesRef, orderBy('createdAt', limit(25)));

  const [messages] = useCollectionData(q, {idField: 'id'});

  const [formValue, setFormValue] = useState('');

  const sendMessage = async(e) => {

    e.preventDefault();

    const {uid, photoURL} = auth.currentUser;

    await addDoc(messagesRef, {
      text: formValue,
      createdAT: serverTimestamp(),
      uid,
      photoURL
    })

    setFormValue('');
    dummy.current.scrollIntoView({ behavior: 'smooth'});
  }


  return (
    <>
      <main>

        {messages && messages.map(msg => < ChatMessage key={msg.id} message={msg} />)}

        <span ref={dummy}></span>

      </main>      

      <form onSubmit={sendMessage}>

        <input value={formValue} onChange={(e) => setFormValue(e.target.value)} placeholder='Be nice' />

        <button type='submit' disabled={!formValue} >🕊️</button>

      </form>
    </>)
  
}

function ChatMessage(props) {
  const {text, uid, photoURL} = props.message;

  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

  return (<>
    <div className={`message ${messageClass}`}>
      <img src={photoURL || 'https://api.adorable.io/avatars/23/abott@adorable.png'}/>
      <p>{text}</p>
    </div>
    </>)
}
export default App;
