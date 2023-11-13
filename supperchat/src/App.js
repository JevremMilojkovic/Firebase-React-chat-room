import React, { useRef, useState } from 'react';
import './App.css';

import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

import { useAuthState } from 'react-firebase-hooks/auth'
import { useCollectionData } from 'react-firebase-hooks/firestore' 

firebase.initializeApp({
  apiKey: "AIzaSyAj8GHoofj2PHMzB8tzFBmR9SuNjSM99Ho",
  authDomain: "chatroom-92582.firebaseapp.com",
  projectId: "chatroom-92582",
  storageBucket: "chatroom-92582.appspot.com",
  messagingSenderId: "656620442167",
  appId: "1:656620442167:web:c5b55d3328efe29fff65b2",
  measurementId: "G-NZNN41YSP4"
});

const auth = firebase.auth();
const firestore = firebase.firestore();

const [user] = useAuthState(auth)

function App() {
  return (
    <div className="App">
      <header>
        
      </header>
      
      <section>
        {user ? <ChatRoom /> : <SighIn />}
      </section>
    </div>
  );
}

function SighIn() {
  const singInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.sighInWithPopup(provider)
  }

  return (
    <button onClick={singInWithGoogle}>Sing in with Google</button>
  )
}

function SighOut() {
  return auth.currentUser && (

    <button onClick={() => auth.SighOut()}>Sigh out</button>
  )
}

function ChatRoom() {

  const dummy = useRef()

  const messagesRef = firebase.collection('message');
  const query = messagesRef.orderBy('createdAt').limit(25);

  const [messages] = useCollectionData(query, {idField: 'id'});

  const [formValue, setFormValue] = useState('');

  const sendMessage = async(e) => {

    e.preventDefault();

    const {uid, photoURL} = auth.currentUser;

    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
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
      </main>
      <div ref={dummy}></div>

      <form onSubmit={sendMessage}>
        <input value={formValue} onChange={(e) => setFormValue(e.target.value)} />
        <button type='submit'>Post</button>
      </form>
    </>
  )
}

function ChatMessage(props) {
  const {text, uid, photoURL} = props.message;

  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

  return (
    <div className={`message ${messageClass}`}>
      <img src={photoURL}/>
      <p>{text}</p>
    </div>
  )
}

export default App;
