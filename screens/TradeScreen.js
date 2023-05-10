import React, { useEffect, useState, Component } from 'react';
import { useSelector, useDispatch } from "react-redux";
//import { Icon } from '@rneui/themed';
import { Button, FlatList, StyleSheet, Text, TextInput, View, Image, TouchableOpacity, Icon } from 'react-native';
import { initializeApp} from 'firebase/app';
//import firebase from 'firebase/compat/app'
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { firebaseConfig } from '../Secrets';
import { Overlay } from 'react-native-elements';
import { LOAD_PLAYERS, UPDATE_TRADES, SET_USER } from "../data/Reducer";
import { saveAndDispatch } from "../data/DB"; 
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { getFirestore, collection, getDocs,
  doc, setDoc, getDoc, addDoc, updateDoc,  onSnapshot, deleteDoc, query, where } 
  from 'firebase/firestore';
import firebase from 'firebase/compat/app'


export default function TradeScreen() {

  playerList = useSelector((state) => state.playerItems);
  users = useSelector((state) => state.users);
  let currUser = useSelector((state) => state.currUser);
  let currEmail = useSelector((state) => state.currEmail);
  let currID = useSelector((state) => state.currID);
  const [overlay1Visible, setOverlay1Visible] = useState(false);
  const [overlay2Visible, setOverlay2Visible] = useState(false);
  const [team1List, setTeam1List] = useState([]);
  const [team2List, setTeam2List] = useState([]);
  const [team1Stats, setTeam1Stats] = useState({pts: 0, avg: 0, last: 0, proj: 0, szn: 0, boom: 0, bust: 0, gp: 0, value: 0});
  const [team2Stats, setTeam2Stats] = useState({pts: 0, avg: 0, last: 0, proj: 0, szn: 0, boom: 0, bust: 0, gp: 0, value: 0});
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
      let q = query(propertiesQ, where("email", "==", currEmail));
      
      getDocs(q).then((qSnap) => {
        const data = qSnap.docs.map(d => ({...d.data()}))
        console.log('trade screen get user and update user')
        console.log(data[0])
        updateUser(data[0])
        console.log('currUSer')
        console.log(currUser)
      });
    }


  useEffect(()=>{ 
    const loadAction = { type: LOAD_PLAYERS };
    saveAndDispatch(loadAction, dispatch);
    getUser()
    getUser()
    //setCurrUser(users.filter(elem=>elem.email == currEmail))
    // console.log('tradescreen users')
    // console.log(users)
  }, [team1List, team2List]);


  const updateUser = (usr) => {
    dispatch({
      type: SET_USER,
      payload: {
        currUser: usr
      }
    });
  }

  const updateSavedTrades = (k, newSave) => {
    const action = {
      type: UPDATE_TRADES,
      payload: {
        key: k,
        trades: newSave
      }
    };
    saveAndDispatch(action, dispatch);
  }

  const addList1 = (name) => {
    playerList.forEach((playerData) => {
        if (playerData.name == name) {
            let newPlayer = team1List.concat( {
                    name: playerData.name,
                    pts: playerData.pts,
                    avg: playerData.avg,
                    last: playerData.last,
                    proj: playerData.proj,
                    szn: playerData.szn,
                    boom: playerData.boom,
                    bust: playerData.bust,
                    gp: playerData.gp,
                    value: playerData.value
                } 
            )
            setTeam1List(newPlayer);
        }
    })
  }

  const addList2 = (name) => {
    playerList.forEach((playerData) => {
        if (playerData.name == name) {
            let newPlayer = team2List.concat( {
                    name: playerData.name,
                    pts: playerData.pts,
                    avg: playerData.avg,
                    last: playerData.last,
                    proj: playerData.proj,
                    szn: playerData.szn,
                    boom: playerData.boom,
                    bust: playerData.bust,
                    gp: playerData.gp,
                    value: playerData.value
                } 
            )
            setTeam2List(newPlayer);
        }
    })
  }

  const team1StatCalculator = (name, act) => {
    if (act == 'sub') {
        playerList.forEach((playerData) => {
            if (playerData.name == name) {
                let newStats =  {
                    pts: team1Stats.pts - playerData.pts,
                    avg: team1Stats.avg - playerData.avg,
                    last: team1Stats.last - playerData.last,
                    proj: team1Stats.proj - playerData.proj,
                    szn: team1Stats.szn - playerData.szn,
                    boom: team1Stats.boom - playerData.boom,
                    bust: team1Stats.bust - playerData.bust,
                    value: team1Stats.value - playerData.value,
                    //gp: ((playerData.gp + team2Stats.gp)/team2List.length),
                } 
                setTeam1Stats(newStats);
            }
        })
    }
    else {
        playerList.forEach((playerData) => {
            if (playerData.name == name) {
                let newStats =  {
                    pts: playerData.pts + team1Stats.pts,
                    avg: playerData.avg + team1Stats.avg,
                    last: playerData.last + team1Stats.last,
                    proj: playerData.proj + team1Stats.proj,
                    szn: playerData.szn + team1Stats.szn,
                    boom: playerData.boom + team1Stats.boom,
                    bust: playerData.bust + team1Stats.bust,
                    value: playerData.value + team1Stats.value
                    //gp: ((playerData.gp + team2Stats.gp)/team2List.length),
                } 
                setTeam1Stats(newStats);
            }
        })
    }
  }

  const team2StatCalculator = (name, act) => {
    if (act == 'sub') {
        playerList.forEach((playerData) => {
            if (playerData.name == name) {
                let newStats =  {
                    pts: team2Stats.pts - playerData.pts,
                    avg: team2Stats.avg - playerData.avg,
                    last: team2Stats.last - playerData.last,
                    proj: team2Stats.proj - playerData.proj,
                    szn: team2Stats.szn - playerData.szn,
                    boom: team2Stats.boom - playerData.boom,
                    bust: team2Stats.bust - playerData.bust,
                    value: team2Stats.value - playerData.value,
                    //gp: ((playerData.gp + team2Stats.gp)/team2List.length),
                } 
                setTeam2Stats(newStats);
            }
        })
    }
    else {
        playerList.forEach((playerData) => {
            if (playerData.name == name) {
                let newStats =  {
                    pts: playerData.pts + team2Stats.pts,
                    avg: playerData.avg + team2Stats.avg,
                    last: playerData.last + team2Stats.last,
                    proj: playerData.proj + team2Stats.proj,
                    szn: playerData.szn + team2Stats.szn,
                    boom: playerData.boom + team2Stats.boom,
                    bust: playerData.bust + team2Stats.bust,
                    value: playerData.value + team2Stats.value
                    //gp: ((playerData.gp + team2Stats.gp)/team2List.length),
                } 
                setTeam2Stats(newStats);
            }
        })
    }
    
  }

  const swipeIt = (name, team) => {
    return (
      <View
        style={{
          margin: 0,
          alignContent: 'center',
          justifyContent: 'center',
          width: 70,
        }}>
        <TouchableOpacity style={styles.removeBack} onPress={() => {
                if (team == 1) {
                    let newList = team1List.filter(elem=>elem.name !== name);
                    setTeam1List(newList);
                    team1StatCalculator(name, 'sub')
                } 
                else {
                    let newList = team2List.filter(elem=>elem.name !== name);
                    setTeam2List(newList);
                    team2StatCalculator(name, 'sub')
                }
        }}>
            <Text style={styles.removeText}>Delete</Text>
        </TouchableOpacity>
      </View>
    );
  };


  return(
    <View style={styles.container}>
        <View style={styles.nav}>
            <TouchableOpacity  onPress={()=>{
                let updatedTrade = currUser.trades.concat([{'left': team1List, 'right': team2List}])
                updateSavedTrades(currID, updatedTrade)
            }}>
                <Text style={styles.navTextSave}>Save Trade</Text>
            </TouchableOpacity>
        </View>
      <View style={styles.pageHeader}>
        <Text style={styles.pageHeaderText}>TRADE      </Text>
        <Text style={styles.pageHeaderText}>       CENTER</Text>
      </View>
      <View style={styles.tradeBoxes}> 
        <View style={styles.leftBox}> 
            <Text style={styles.teamNamesText}>Team 1</Text> 
            <FlatList 
                contentContainerStyle={styles.statBox}
                data={team1List}
                renderItem={({item})=>{
                    return (
                        <Swipeable
                        renderRightActions={() =>
                          swipeIt(item.name, 1)
                        }
                        rightOpenValue={-100}>
                            <View style={styles.playerBox}>           
                                <Text style={styles.playerBoxText}>{item.name}</Text>
                            </View>
                        </Swipeable>
                    )
                }}>
            </FlatList> 
            <Text style={styles.tradeValue}>Trade Value</Text> 
            <Text style={styles.tradeValueScore}>{team1Stats.value}</Text> 
            <TouchableOpacity title={'Swap Player'} style={styles.swap} onPress={()=>setOverlay1Visible(true)}>
                <Text style={styles.swapText}>Add Player</Text> 
            </TouchableOpacity>
        </View>
        <View style={styles.rightBox}> 
            <Text style={styles.teamNamesText}>Team 2</Text> 
            <FlatList 
            //contentContainerStyle={styles.statBox1}
            data={team2List}
            renderItem={({item})=>{
                return (
                    <Swipeable
                    renderRightActions={() =>
                      swipeIt(item.name, 2)
                    }
                    rightOpenValue={-100}>
                        <View style={styles.playerBox}>           
                            <Text style={styles.playerBoxText}>{item.name}</Text>
                        </View>
                    </Swipeable>
                    )
                }}>
            </FlatList> 
            <Text style={styles.tradeValue}>Trade Value</Text>
            <Text style={styles.tradeValueScore}>{team2Stats.value}</Text>
            <TouchableOpacity title={'Swap Player'} style={styles.swap} onPress={()=>setOverlay2Visible(true)}>
                <Text style={styles.swapText}>Add Player</Text> 
            </TouchableOpacity>
        </View>
      </View>
      <View style={styles.seperator}>
      </View>
      <View style={styles.statHeader}>
         <Text style={styles.pageHeaderText} >Combined Stats</Text>
      </View>
      <View style={styles.statBoxContainer}>
        <FlatList contentContainerStyle={styles.statBox1}
            data={[team1Stats]}
                renderItem={({item})=>{
                    return (
                        <View>         
                            <Text style={styles.statText}>{item.pts}</Text>
                            <Text style={styles.statText}>{item.last}</Text>
                            <Text style={styles.statText}>{item.avg}</Text>
                            <Text style={styles.statText}>{item.proj}</Text>
                            <Text style={styles.statText}>{item.szn}</Text>
                            <Text style={styles.statText}>{item.boom}</Text>
                            <Text style={styles.statText}>{item.bust}</Text>
                            {/* <Text style={styles.statText}>{item.gp}</Text> */}
                        </View>
                    )
                }}>
        </FlatList> 
            <View style={styles.statBoxHeader}>
             
                <Text style={styles.statHeaderText}>PTS</Text>
                <Text style={styles.statHeaderText}>LAST</Text>
                <Text style={styles.statHeaderText}>AVG</Text>
                <Text style={styles.statHeaderText}>PROJ</Text>
                <Text style={styles.statHeaderText}>SZN PROJ</Text>
                <Text style={styles.statHeaderText}>BOOM</Text>
                <Text style={styles.statHeaderText}>BUST</Text>
                {/* <Text style={styles.statHeaderText}>GP</Text> */}
            </View>         
        <FlatList contentContainerStyle={styles.statBox2}
            data={[team2Stats]}
                renderItem={({item})=>{
                    return (
                        <View>
                            <Text style={styles.statText}>{item.pts}</Text>
                            <Text style={styles.statText}>{item.last}</Text>
                            <Text style={styles.statText}>{item.avg}</Text>
                            <Text style={styles.statText}>{item.proj}</Text>
                            <Text style={styles.statText}>{item.szn}</Text>
                            <Text style={styles.statText}>{item.boom}</Text>
                            <Text style={styles.statText}>{item.bust}</Text>
                            {/* <Text style={styles.statText}>{item.gp}</Text> */}
                        </View>
                    )
                }}>
        </FlatList> 
        </View>

    {/* {OVERLAY 1} */}
    <Overlay 
        isVisible={overlay1Visible} 
        onBackdropPress={()=>setOverlay1Visible(false)}
        overlayStyle={styles.overlayView}
      >
        <View>
            <View>
                <Text style={styles.pageHeaderText} >Choose Player</Text>
            </View>
            <FlatList style={styles.playerChoose}
                data={playerList}
                    renderItem={({item})=>{
                        return (
                            <TouchableOpacity 
                                onPress={()=>{
                                    setOverlay1Visible(false)
                                    addList1(item.name)
                                    team1StatCalculator(item.name, 'add')
                                }}>
                                    <Text style={styles.playerChooseText}>{item.name}</Text>
                            </TouchableOpacity>
                        )
                    }}
                    >
            </FlatList> 
        </View>
      </Overlay>
      {/* {OVERLAY 2} */}
      <Overlay 
        isVisible={overlay2Visible} 
        onBackdropPress={()=>setOverlay2Visible(false)}
        overlayStyle={styles.overlayView}
      >
        <View>
            <View>
                <Text style={styles.pageHeaderText} >Choose Player</Text>
            </View>
            <FlatList style={styles.playerChoose}
                data={playerList}
                    renderItem={({item})=>{
                        return (
                            <TouchableOpacity 
                                onPress={()=>{
                                    setOverlay2Visible(false)
                                    addList2(item.name)
                                    team2StatCalculator(item.name, 'add')
                                }}>
                                    <Text style={styles.playerChooseText}>{item.name}</Text>
                            </TouchableOpacity>
                        )
                    }}
                    >
            </FlatList> 
        </View>
      </Overlay>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'flex-start',
      paddingTop: '15%'
    },
    nav: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        marginBottom: '3%',
        width: '100%',
      },
      navTextSave: {
        fontSize: 16,
        color: '#2375c8',
        paddingRight: '5%',
      },
    pageHeader: {
      flex: 0.15,
      flexDirection: 'column',
      justifyContent: 'space-evenly',
      alignContent: 'center',
      marginVertical: '3%'
    },
    pageHeaderText: {
        marginVertical: 1,
        fontSize: 30,
        fontWeight: 'bold',
        fontStyle: 'italic'
    },
    tradeBoxes: {
        flex: 1,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
    },
    teamNamesText: {
        fontSize: 15,
        fontWeight: 'bold',
        marginTop: 10,
        alignSelf: 'center'
    },
    playerBox: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        width: 150,
        height: 40,
        marginVertical: 5,
        borderWidth: 1,
        //borderRadius: 5,
        borderColor: 'grey',
    },
    playerImagesPicture: {
        height: 30, 
        width: 30,
        alignSelf: 'flex-end',
        marginRight: 5,
        marginLeft: 5,
        alignItems: 'center',
        alignSelf: 'center',
    },
    playerBoxText: {
        fontSize: 16,
        fontWeight: 'bold',
        fontStyle: 'italic',
    },
    removeBack: {
        flexDirection: 'row',
        backgroundColor: '#C92A24',
        justifyContent: 'center',
        alignItems: 'center',
        height: '79%',
        //transform: [{rotateY: '180deg'}]
    },
    removeText: {
        color: 'white',
        fontSize: 12,
    },
    tradeValue: {
        fontSize: 20,
        fontWeight: 'bold', 
    },
    tradeValueScore: {
        fontSize: 20,
        fontWeight: 'bold',    
        marginVertical: 5,
        color: '#2755F9'
    },
    swap: {
        flexDirection: 'row',
        backgroundColor: '#2755F9',
        justifyContent: 'center',
        width: 150,
        paddingVertical: 10,
        marginTop: 10,
        borderRadius: 5,
        shadowColor: '#171717',
        shadowOffset: {width: -2, height: 4},
        shadowOpacity: 0.2,
        shadowRadius: 3,
    },
    swapText: {
        color: 'white',
    },
    overlayView: {
        flex: 'auto',
        width: '90%',
    },
    playerChoose: {

    }, 
    playerChooseText: {
        fontSize: 20,
        paddingHorizontal: 10,
        paddingVertical: 5,
    },
    seperator: {
        borderWidth: 1,
        borderBottomColor: 'grey',
        width: 1000,
        marginTop: 20,
    },
    statHeader: {
      marginTop: 15,
      marginRight: 100,
      marginBottom: 10,
    },
    statBoxContainer: {
        flex: .9,
        flexDirection: 'row',
        justifyContent: 'center',
        width: '95%',
        paddingVertical: 4,
    },
    statText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2755F9',
        paddingVertical: 4,
        alignSelf: 'center'
    },
    statHeaderText: {
        fontSize: 18,
        fontWeight: 'bold',
        //marginHorizontal: 34,
        paddingVertical: 4,
        alignSelf: 'center',
    },
  });
  