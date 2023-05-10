import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, collection, getDocs,
         doc, setDoc, getDoc, addDoc, updateDoc,  onSnapshot, deleteDoc } 
         from 'firebase/firestore';
import { firebaseConfig } from '../Secrets';
import { LOAD_PLAYERS, LOAD_USERS, ADD_USER, UPDATE_TEAM, UPDATE_TRADES, LOAD_CURR } from './Reducer'
import firebase from 'firebase/compat/app'
import { getAuth, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { useSelector, useDispatch } from "react-redux";




let app, db = undefined;
const COLLNAME = 'players';
const USERLIST = 'users';

// guard against creating duplicate apps
if (firebase.apps.length === 0) {
  app = firebase.initializeApp(firebaseConfig)
} else {
  app = firebase.app();
}

db = app.firestore();

const getFBAuth = () => {
  return getAuth(app);
}


  const loadPlayersAndDispatch = async (action, dispatch) => {

    const querySnap = await getDocs(collection(db, COLLNAME));
    let newPlayers = [];
    querySnap.forEach(docSnap => {
      let newPlayer = docSnap.data();
      newPlayer.key = docSnap.id;
      newPlayers.push(newPlayer);
    });
    let newAction = {
      ...action,
      payload: { newPlayers }
    };
    dispatch(newAction);
  }

  
  const loadCurrentUser = async (action, dispatch) => {
    const { payload } = action;
    const { currentID, email } = payload;
    const docToUpdate = doc(collection(db, 'current'), 'c');
    await updateDoc(docToUpdate, {currentID: currentID, email: email});

    // const querySnap = await getDocs(collection(db, USERLIST));
    // let currUser = [];
    // querySnap.forEach(docSnap => {
    //   console.log('docSnap')
    //   console.log(docSnap)

    //   let newUser = docSnap.data();
    //   console.log('newUser')
    //   console.log(newUser)
 
    //   newUser.key = docSnap.id;
    //   console.log('newUser.key')
    //   console.log(newUser.key)

    //   if (newUser.email == currEmail) {
    //     currUser.push(newUser.key)
    //   }
    //   console.log('currUser')
    //   console.log(currUser)
    // });

    let newAction = {
      ...action,
      payload: { currUser }
    };
    dispatch(newAction);
  }

  const loadUsersAndDispatch = async (action, dispatch) => {
    const querySnap = await getDocs(collection(db, USERLIST));
    let newUsers = [];
    querySnap.forEach(docSnap => {
      let newUser = docSnap.data();
      newUser.key = docSnap.id;
      newUsers.push(newUser);
    });
    let newAction = {
      ...action,
      payload: { newUsers }
    };
    dispatch(newAction);
  }

  const addUserAndDispatch = async (action, dispatch) => {
    const { payload } = action;
    const { teamName, email, roster } = payload;  
    const coll = collection(db, USERLIST);
    const newDocRef = await addDoc(coll, {
        teamName: teamName,
        email: email,
        roster: [],
        trades: [],
    });
    const newPayload = {
      ...payload,
      key: newDocRef.id
    }
    const newAction = {
      ...action,
      payload: newPayload
    } 
    dispatch(newAction);
  } 

  const updateTeamAndDispatch = async (action, dispatch) => {
    const { payload } = action;
    const { key, teamName, email, roster } = payload;
    const docToUpdate = doc(collection(db, USERLIST), key);
    await updateDoc(docToUpdate, {teamName: teamName, email: email, roster: roster});
    dispatch(action);
  }

  const updateTradesAndDispatch = async (action, dispatch) => {
    const { payload } = action;
    const { key, trades } = payload;
    const docToUpdate = doc(collection(db, USERLIST), key);
    await updateDoc(docToUpdate, { trades: trades})
    dispatch(action);
  }

  // const updateEmailAndDispatch = async (action, dispatch) => {
  //   const { payload } = action;
  //   const { key, teamName, email, roster } = payload;
  //   const docToUpdate = doc(collection(db, USERLIST), key);
  //   await updateDoc(docToUpdate, {teamName: teamName, email: email, roster: roster});
  //   dispatch(action);
  // }

  const saveAndDispatch = async(action, dispatch) => {
    const {type, payload} = action;
    switch (type) {
      case LOAD_PLAYERS:
        loadPlayersAndDispatch(action, dispatch);
        return;
      case LOAD_USERS:
          loadUsersAndDispatch(action, dispatch);
          return;
      case LOAD_CURR:
          loadCurrentUser(action, dispatch);
          return;
      case ADD_USER:
          addUserAndDispatch(action, dispatch);
          return;
      case UPDATE_TEAM:
        updateTeamAndDispatch(action, dispatch);
          return;
      case UPDATE_TRADES:
        updateTradesAndDispatch(action, dispatch);
          return;
      default:
        return;
    }
  }
  
    export { saveAndDispatch, getFBAuth }; 

