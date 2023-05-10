
import { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Alert } from 'react-native';
import { useSelector, useDispatch } from "react-redux";
import { Icon } from '@rneui/themed';
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, createUserWithEmailAndPassword } from 'firebase/auth'; 
import { getApps, initializeApp } from 'firebase/app';
import { firebaseConfig } from '../Secrets';
import { saveAndDispatch, getFBAuth } from '../data/DB';
import { LOAD_PLAYERS, ADD_USER, SET_NAME, SET_EMAIL, LOAD_USERS, LOAD_CURR, SET_ID } from '../data/Reducer';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { getFirestore, collection, getDocs,
  doc, setDoc, getDoc, addDoc, updateDoc,  onSnapshot, deleteDoc, query, where } 
  from 'firebase/firestore';

import firebase from 'firebase/compat/app'

export default function LoginScreen(props) {

const { navigation } = props;
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [teamName, setTeamName] = useState('');
const [loginMode, setLoginMode] = useState(true);
const dispatch = useDispatch();

let app, db = undefined;

if (firebase.apps.length === 0) {
  app = firebase.initializeApp(firebaseConfig)
} else {
  app = firebase.app();
}

db = app.firestore();

const getUser = () => {
  let propertiesQ = collection(db, 'users');
  let q = query(propertiesQ, where("email", "==", email));
  
  getDocs(q).then((qSnap) => {
    const data = qSnap.docs.map(d => d.id)
    console.log('updateID inside getuser')
    updateID(data[0])
    
  });
}


const addUser = (team, email) => {
    const action = {
      type: ADD_USER,
      payload: {
        teamName: team,
        email: email,
        roster: [],
      }
    };
    saveAndDispatch(action, dispatch);
  }

  const updateCurrEmail = (text) => {
    dispatch({
      type: SET_EMAIL,
      payload: {
        currEmail: text
      }
    });
  }

  const updateID = (text) => {
    dispatch({
      type: SET_ID,
      payload: {
        currID: text
      }
    });
  }

// const  loadCurrentUser= (email) => { 
//   const action = {
//     type: LOAD_CURR,
//     payload: {
//       email: email,
//     }
//   };
//   saveAndDispatch(action, dispatch);
// }

  const updateCurrTeam = (text) => {
    dispatch({
      type: SET_NAME,
      payload: {
        currTeam: text
      }
    });
  }



useEffect(() => {
    onAuthStateChanged(getFBAuth(), user => {
      if (user) {
        navigation.navigate('main');
      } else {
        navigation.navigate('Log');
      }
    })
    const loadAction = { type: LOAD_PLAYERS };
    saveAndDispatch(loadAction, dispatch);
    const loadAction2 = { type: LOAD_USERS };
    saveAndDispatch(loadAction2, dispatch);
    console.log('getUserRun in Use Effeect')
    getUser()
  }, []);
  

  return (
    <View style={styles.container}>
      <View style={styles.bodyContainer}>
      <Text style={styles.headerText1}>FANTASTY     </Text>
      <Text style={styles.headerText2}>     FOOTBALL</Text>
        {loginMode? 
        <View style={styles.loginContainer}>
            <Text style={styles.loginHeaderText}>Sign In</Text>
            <View style={styles.loginRow}>              
                <Text style={styles.loginLabelText}>EMAIL </Text>             
                <TextInput 
                    style={styles.loginInputBox}
                    placeholder='email address' 
                    autoCapitalize='none'
                    spellCheck={false}
                    onChangeText={text=>setEmail(text)}
                    value={email}
                />
            </View>
            <View style={styles.loginRow}>                
                <Text style={styles.loginLabelText}>PASSWORD </Text>
                <TextInput 
                    style={styles.loginInputBox}
                    placeholder='password' 
                    autoCapitalize='none'
                    spellCheck={false}
                    secureTextEntry={true}
                    onChangeText={text=>setPassword(text)}
                    value={password}
                />
            </View>
            <View style={styles.loginRowSign}>
                <TouchableOpacity
                style={styles.signinup}
                onPress={async () => {  
                    try {
                        await signInWithEmailAndPassword(getFBAuth(), email, password);
                        updateCurrTeam(teamName)
                        updateCurrEmail(email)
                        getUser()
                        
                    } catch(error) {
                        Alert.alert("Sign Up Error", error.message,[{ text: "OK" }])
                    }
                }}
                >
                <Text style={styles.signinupText}>Sign In</Text>
                <Icon name="arrow-forward-ios" type="MaterialIcons" color={'white'} size={20}/>
                </TouchableOpacity>  
            </View>
        </View> 

        : 
            
        <View style={styles.loginContainer}>
            <Text style={styles.loginHeaderText}>Sign Up</Text>
            <View style={styles.loginRow}>
                
                <Text style={styles.loginLabelText}>TEAM NAME </Text>      
                <TextInput 
                    style={styles.loginInputBox}
                    placeholder='team name' 
                    autoCapitalize='none'
                    spellCheck={false}
                    onChangeText={text=>setTeamName(text)}
                    value={teamName}
                />
               
            </View>
            <View style={styles.loginRow}>
                
                <Text style={styles.loginLabelText}>EMAIL </Text> 
                <TextInput 
                    style={styles.loginInputBox}
                    placeholder='email address' 
                    autoCapitalize='none'
                    spellCheck={false}
                    secureTextEntry={false}
                    onChangeText={text=>setEmail(text)}
                    value={email}
                />
             
            </View>
            <View style={styles.loginRow}>
               
                <Text style={styles.loginLabelText}>PASSWORD </Text>
               
               
                <TextInput 
                    style={styles.loginInputBox}
                    placeholder='password' 
                    autoCapitalize='none'
                    spellCheck={false}
                    secureTextEntry={true}
                    onChangeText={text=>setPassword(text)}
                    value={password}
                />
               
            </View>
            <View style={styles.loginRowSign}>
                <TouchableOpacity
                  style={styles.signinup}
                    onPress={async () => {
                    try {
                        await createUserWithEmailAndPassword(getFBAuth(), email, password); 
                        addUser(teamName, email)
                        updateCurrTeam(teamName)
                        updateCurrEmail(email)
                        console.log('getUserRun in sign up')
                        getUser()

                       
                    } catch(error) {
                    Alert.alert("Sign Up Error", error.message,[{ text: "OK" }])
                    }
                }}
                >
                <Text style={styles.signinupText}>Sign Up</Text>
                <Icon name="arrow-forward-ios" type="MaterialIcons" color={'white'} size={20}/>
                </TouchableOpacity>  
            </View>
        </View>
        }
      </View>
        { loginMode ? 
          <Text style={{fontSize: 22, fontWeight: 'bold', fontStyle: 'italic'}}>New user? 
            <Text 
              onPress={()=>{setLoginMode(!loginMode)}} 
              style={{color: 'blue', fontSize: 22, fontWeight: 'light', fontStyle: 'italic'}}> Sign up </Text> 
            instead!
          </Text>
        :
          <Text style={{ marginTop: '20%', fontSize: 22, fontWeight: 'bold', fontStyle: 'italic'}}>Returning user? 
            <Text 
              onPress={()=>{setLoginMode(!loginMode)}} 
              style={{color: 'blue', fontSize: 22, fontWeight: 'light', fontStyle: 'italic'}}> Sign in </Text> 
            instead!
          </Text>
        }
    </View>
  );
}
  

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    bodyContainer: {
      paddingTop: '10%',
      flex: 0.9,
      justifyContent: 'center',
      alignItems: 'center',
      //borderWidth: 1,
    },
    loginHeader: {
      width: '100%',
      padding: '3%',
      justifyContent: 'center',
      alignItems: 'center',
    },
    loginHeaderText: {
      fontSize: 42,
      fontWeight: 'light',
      color: 'black',
      paddingBottom: '5%',
      alignSelf: 'flex-start',
      paddingLeft: 12
    },
    headerText1: {
        fontSize: 44,
        fontWeight: 'bold',
        color: 'black',
        fontStyle: 'italic'
    },
    headerText2: {
        fontSize: 44,
        fontWeight: 'bold',
        color: 'black',
        fontStyle: 'italic'
    },
    loginContainer: {
      flex: 1,
      justifyContent: 'flex-start',
      alignItems: 'center',
      width: '100%',
      paddingTop: '20%',
      paddingBottom: '10%',
    },
    loginRow: {
      flexDirection: 'column',
      justifyContent: 'flex-start',
      alignItems: 'center',
      width: 350,
      height: 70,
      padding: '3%',
      marginBottom: 15
    },
    loginRowSign: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      alignItems: 'center',
      width: 350,
      height: 70,
      padding: '3%',
      marginTop: 40,
      alignSelf: 'flex-start',
    },
    loginLabelText: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 5,
    },
    loginInputBox: {
      width: '100%',
      borderColor: 'lightgray',
      backgroundColor: 'white',
      borderWidth: 1,
      borderRadius: 6,
      fontSize: 18,
      padding: '4%',
      shadowColor: '#171717',
      shadowOffset: {width: -2, height: 4},
      shadowOpacity: 0.2,
      shadowRadius: 3,
    },
    modeSwitchContainer:{
      flex: 0.2,
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      backgroundColor: 'pink'
    },
    loginButtonRow: {
      width: '100%',
      justifyContent: 'center', 
      alignItems: 'center'
    },
    listContainer: {
      flex: 0.7, 
      backgroundColor: '#ccc',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%', 
    },
    button: {
      BackgroundColor: '#2375c8',
    },
    signinup: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#2755F9',
      padding: 10,
      borderRadius: 3
    },
    signinupText: {
      //alignSelf: 'center',
      fontSize: 16,
      color: 'white',
      paddingRight: 6,
      paddingLeft: 4,
    },
  });