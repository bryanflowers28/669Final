import React, { useEffect, useState, Component } from 'react';
import { Icon } from '@rneui/themed';
import { Button, FlatList, StyleSheet, Text, TextInput, View, Image, TouchableOpacity } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { Overlay } from 'react-native-elements';
import { LOAD_USERS, LOAD_PLAYERS, UPDATE_TEAM } from '../data/Reducer';
import { saveAndDispatch, getFBAuth } from '../data/DB';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { firebaseConfig } from '../Secrets';
import { getFirestore, collection, getDocs,
  doc, setDoc, getDoc, addDoc, updateDoc,  onSnapshot, deleteDoc, query, where } 
  from 'firebase/firestore';
import firebase from 'firebase/compat/app'


export default function TeamScreen(props) {
  
    const { navigation, route } = props;
    

    let playerList = useSelector((state) => state.playerItems);
    let currTeam = useSelector((state) => state.currTeam);
    let currEmail = useSelector((state) => state.currEmail);
    let currID = useSelector((state) => state.currID);
    const [teamList, setTeamList] = useState([]);
    const [overlayVisible, setOverlayVisible] = useState(false);
    const dispatch = useDispatch();

    let app, db = undefined;

    if (firebase.apps.length === 0) {
      app = firebase.initializeApp(firebaseConfig)
    } else {
      app = firebase.app();
    }
    
    db = app.firestore();
    
    const getList = () => {
      let propertiesQ = collection(db, 'users');
      let q = query(propertiesQ, where("email", "==", currEmail));
      
      getDocs(q).then((qSnap) => {
        const data = qSnap.docs.map(d => ({...d.data()}))
        console.log(data[0])
        setTeamList(data[0].roster)
      });
    }

    const addList = (name) => {
      playerList.forEach((playerData) => {
          if (playerData.name == name) {
              let newPlayer = teamList.concat( {
                      name: playerData.name,
                      pts: playerData.pts,
                      avg: playerData.avg,
                      last: playerData.last,
                      rk: playerData.rk,
                      proj: playerData.proj,
                      szn: playerData.szn,
                      boom: playerData.boom,
                      bust: playerData.bust,
                      gp: playerData.gp,
                      pos: playerData.pos,
                  } 
              )
              setTeamList(newPlayer);
          }
      })
    }

    const deletePlayer = (name) => {
      let newList = teamList.filter(elem=>elem.name !== name);
      setTeamList(newList);

    }

    const updateUserTeam = (id, team, email, newRoster) => {
      // console.log('update saved trades current user')
      // console.log(currUser)
      const action = {
        type: UPDATE_TEAM,
        payload: {
          key: id,
          teamName: team,
          email: email,
          roster: newRoster,
        }
      };
      saveAndDispatch(action, dispatch);
      
    }


    useEffect(()=>{ 
      const loadAction = { type: LOAD_USERS };
      saveAndDispatch(loadAction, dispatch);
      const loadAction2 = { type: LOAD_PLAYERS };
      saveAndDispatch(loadAction2, dispatch);

      getList()
    }, []);


    return(
      <View style={styles.container}>
        <View style={styles.nav}>
            <TouchableOpacity  onPress={()=>{navigation.goBack();}}>
                <Text style={styles.navText}>Back</Text>
            </TouchableOpacity>
            <TouchableOpacity  onPress={()=>{
              updateUserTeam(currID, currTeam, currEmail, teamList)
              navigation.goBack();
            }}>
                <Text style={styles.navTextSave}>Save</Text>
            </TouchableOpacity>
        </View>
        <View style={styles.header}>
            <Text style={styles.headerText}>{currTeam} </Text>
        </View>
        <Icon name="sports-football" type="MaterialIcons"  size={40}/>
        <View style={styles.playerDataHeaderBox}>
          <Text style={styles.playerDataHeader}>My Players</Text>
          <TouchableOpacity style={styles.add} onPress={()=>{setOverlayVisible(true)}}> 
            <Text style={styles.swapText}>ADD PLAYER</Text>
          </TouchableOpacity>
        </View>
        <FlatList
            listKey='dataBox1'
            style={styles.dataBox}
            data={[1]} 
            renderItem={()=>{
            return (
            <View> 
              <View style={styles.data}>
                  <Text style={styles.dataText}>POS</Text>
                  <Text style={styles.dataText}>  Player</Text>
                  <Text style={styles.dataText}>      </Text>
                  <Text style={styles.dataText}>PROJ</Text>
                  <Text style={styles.dataText}>PTS</Text>
                  <Text style={styles.dataText}>RK</Text>
                  <Text style={styles.dataText}>       </Text>
              </View>
                <View style={styles.starterBox}> 
                        <FlatList
                            style={styles.playerBox}
                            listKey='Quarterbacks'
                            data={teamList.filter(elem=>elem.pos == 'QB')} 
                            renderItem={(item)=>{
                                return (
                                <TouchableOpacity style={styles.playerRectangle}>
                                  <View style={styles.posSquare}>
                                    <Text style={styles.posText}>{item.item.pos}</Text>
                                  </View> 
                                    <View style={styles.playerSquare}>
                                        <Text style={styles.playerNameText}>{item.item.name}</Text>
                                    </View> 
                                    <View style={styles.playerSquare}>
                                        <Text style={styles.playerText}>{item.item.proj}</Text>
                                    </View> 
                                    <View style={styles.playerSquare}>
                                        <Text style={styles.playerText}>{item.item.pts}</Text>
                                    </View> 
                                    <View style={styles.playerSquare}>
                                        <Text style={styles.playerText}>{item.item.rk}</Text>
                                    </View>   
                                    <View style={styles.playerSquare}>
                                      <TouchableOpacity style={styles.delete}> 
                                        <Text style={styles.swapText} onPress={()=>{deletePlayer(item.item.name)}}>  -  </Text>
                                      </TouchableOpacity>
                                    </View>   
                                </TouchableOpacity>
                                )
                            }}
                        />
                        <FlatList
                            style={styles.playerBox}
                            listKey='Runningbacks'
                            data={teamList.filter(elem=>elem.pos == 'RB')} 
                            renderItem={(item)=>{
                                return (
                                <TouchableOpacity style={styles.playerRectangle}>
                                  <View style={styles.posSquare}>
                                    <Text style={styles.posText}>{item.item.pos}</Text>
                                  </View> 
                                    <View style={styles.playerSquare}>
                                        <Text style={styles.playerNameText}>{item.item.name}</Text>
                                    </View> 
                                    <View style={styles.playerSquare}>
                                        <Text style={styles.playerText}>{item.item.proj}</Text>
                                    </View> 
                                    <View style={styles.playerSquare}>
                                        <Text style={styles.playerText}>{item.item.pts}</Text>
                                    </View> 
                                    <View style={styles.playerSquare}>
                                        <Text style={styles.playerText}>{item.item.rk}</Text>
                                    </View>   
                                    <View style={styles.playerSquare}>
                                      <TouchableOpacity style={styles.delete}> 
                                        <Text style={styles.swapText} onPress={()=>{deletePlayer(item.item.name)}}>  -  </Text>
                                      </TouchableOpacity>
                                    </View>   
                                </TouchableOpacity>
                                )
                            }}
                        />
                        <FlatList
                            style={styles.playerBox}
                            listKey='Wideout'
                            data={teamList.filter(elem=>elem.pos == 'WR')} 
                            renderItem={(item)=>{
                                return (
                                <TouchableOpacity style={styles.playerRectangle}>
                                  <View style={styles.posSquare}>
                                    <Text style={styles.posText}>{item.item.pos}</Text>
                                  </View> 
                                    <View style={styles.playerSquare}>
                                        <Text style={styles.playerNameText}>{item.item.name}</Text>
                                    </View> 
                                    <View style={styles.playerSquare}>
                                        <Text style={styles.playerText}>{item.item.proj}</Text>
                                    </View> 
                                    <View style={styles.playerSquare}>
                                        <Text style={styles.playerText}>{item.item.pts}</Text>
                                    </View> 
                                    <View style={styles.playerSquare}>
                                        <Text style={styles.playerText}>{item.item.rk}</Text>
                                    </View>   
                                    <View style={styles.playerSquare}>
                                      <TouchableOpacity style={styles.delete}> 
                                        <Text style={styles.swapText} onPress={()=>{deletePlayer(item.item.name)}}>  -  </Text>
                                      </TouchableOpacity>
                                    </View>   
                                </TouchableOpacity>
                                )
                            }}
                        />
                        <FlatList
                            style={styles.playerBox}
                            listKey='TigthEnd'
                            data={teamList.filter(elem=>elem.pos == 'TE')} 
                            renderItem={(item)=>{
                                return (
                                <TouchableOpacity style={styles.playerRectangle}>
                                  <View style={styles.posSquare}>
                                    <Text style={styles.posText}>{item.item.pos}</Text>
                                  </View> 
                                    <View style={styles.playerSquare}>
                                        <Text style={styles.playerNameText}>{item.item.name}</Text>
                                    </View> 
                                    <View style={styles.playerSquare}>
                                        <Text style={styles.playerText}>{item.item.proj}</Text>
                                    </View> 
                                    <View style={styles.playerSquare}>
                                        <Text style={styles.playerText}>{item.item.pts}</Text>
                                    </View> 
                                    <View style={styles.playerSquare}>
                                        <Text style={styles.playerText}>{item.item.rk}</Text>
                                    </View>   
                                    <View style={styles.playerSquare}>
                                      <TouchableOpacity style={styles.delete}> 
                                        <Text style={styles.swapText} onPress={()=>{deletePlayer(item.item.name)}}>  -  </Text>
                                      </TouchableOpacity>
                                    </View>   
                                </TouchableOpacity>
                                )
                            }}
                        />
                        <FlatList
                            style={styles.playerBox}
                            listKey='Defense'
                            data={teamList.filter(elem=>elem.pos == 'D/ST')} 
                            renderItem={(item)=>{
                                return (
                                <TouchableOpacity style={styles.playerRectangle}>
                                  <View style={styles.posSquare}>
                                    <Text style={styles.posText}>{item.item.pos}</Text>
                                  </View> 
                                    <View style={styles.playerSquare}>
                                        <Text style={styles.playerNameText}>{item.item.name}</Text>
                                    </View> 
                                    <View style={styles.playerSquare}>
                                        <Text style={styles.playerText}>{item.item.proj}</Text>
                                    </View> 
                                    <View style={styles.playerSquare}>
                                        <Text style={styles.playerText}>{item.item.pts}</Text>
                                    </View> 
                                    <View style={styles.playerSquare}>
                                        <Text style={styles.playerText}>{item.item.rk}</Text>
                                    </View>   
                                    <View style={styles.playerSquare}>
                                      <TouchableOpacity style={styles.delete}> 
                                        <Text style={styles.swapText} onPress={()=>{deletePlayer(item.item.name)}}>  -  </Text>
                                      </TouchableOpacity>
                                    </View>   
                                </TouchableOpacity>
                                )
                            }}
                        />
                        <FlatList
                            style={styles.playerBox}
                            listKey='Kicker'
                            data={teamList.filter(elem=>elem.pos == 'K')} 
                            renderItem={(item)=>{                              
                                return (
                                <TouchableOpacity style={styles.playerRectangle}>
                                  <View style={styles.posSquare}>
                                    <Text style={styles.posText}>{item.item.pos}</Text>
                                  </View> 
                                    <View style={styles.playerSquare}>
                                        <Text style={styles.playerNameText}>{item.item.name}</Text>
                                    </View> 
                                    <View style={styles.playerSquare}>
                                        <Text style={styles.playerText}>{item.item.proj}</Text>
                                    </View> 
                                    <View style={styles.playerSquare}>
                                        <Text style={styles.playerText}>{item.item.pts}</Text>
                                    </View> 
                                    <View style={styles.playerSquare}>
                                        <Text style={styles.playerText}>{item.item.rk}</Text>
                                    </View>   
                                    <View style={styles.playerSquare}>
                                      <TouchableOpacity style={styles.delete}> 
                                        <Text style={styles.swapText} onPress={()=>{deletePlayer(item.item.name)}}>  -  </Text>
                                      </TouchableOpacity>
                                    </View>   
                                </TouchableOpacity>
                                )
                            }}
                        />
                </View> 
            </View> 
            );
            }}
        />


    {/* {OVERLAY 1} */}
    <Overlay 
        isVisible={overlayVisible} 
        onBackdropPress={()=>setOverlayVisible(false)}
        overlayStyle={styles.overlayView}
      >
        <View>
            <Text style={styles.overHeaderText} >Choose Player</Text>
        </View>
        <FlatList
        listKey='overlay1'
        data={[1]}
        renderItem={({item})=>{
            return (
                <View style={styles.indent}>
                    <Text style={styles.subHeaderText} >QB</Text>
                    <FlatList 
                        listKey='qb1'
                        style={styles.playerChoose}
                        data={playerList.filter(elem=>elem.pos == 'QB')}
                            renderItem={({item})=>{
                                return (                
                                    <TouchableOpacity 
                                        onPress={()=>{
                                          setOverlayVisible(false)
                                          addList(item.name)
                                        }}>
                                            <Text style={styles.playerChooseText}>{item.name}</Text>
                                    </TouchableOpacity>
                                )
                            }}
                            >
                    </FlatList> 
                    <Text style={styles.subHeaderText} >RB</Text>
                    <FlatList 
                        listKey='rb1'
                        style={styles.playerChoose}
                        data={playerList.filter(elem=>elem.pos == 'RB')}
                            renderItem={({item})=>{
                                return (                
                                    <TouchableOpacity 
                                        onPress={()=>{
                                          setOverlayVisible(false)
                                          addList(item.name)
                                        }}>
                                            <Text style={styles.playerChooseText}>{item.name}</Text>
                                    </TouchableOpacity>
                                )
                            }}
                            >
                    </FlatList> 
                    <Text style={styles.subHeaderText} >WR</Text>
                    <FlatList 
                        listKey='wr1'
                        style={styles.playerChoose}
                        data={playerList.filter(elem=>elem.pos == 'WR')}
                            renderItem={({item})=>{
                                return (                
                                    <TouchableOpacity 
                                        onPress={()=>{
                                          setOverlayVisible(false)
                                          addList(item.name)
                                        }}>
                                            <Text style={styles.playerChooseText}>{item.name}</Text>
                                    </TouchableOpacity>
                                )
                            }}
                            >
                    </FlatList> 
                    <Text style={styles.subHeaderText} >TE</Text>
                    <FlatList 
                        listKey='te1'
                        style={styles.playerChoose}
                        data={playerList.filter(elem=>elem.pos == 'TE')}
                            renderItem={({item})=>{
                                return (                
                                    <TouchableOpacity 
                                        onPress={()=>{
                                          setOverlayVisible(false)
                                          addList(item.name)
                                        }}>
                                            <Text style={styles.playerChooseText}>{item.name}</Text>
                                    </TouchableOpacity>
                                )
                            }}
                            >
                    </FlatList> 
                    <Text style={styles.subHeaderText} >D/ST</Text>
                    <FlatList 
                        listKey='D1'
                        style={styles.playerChoose}
                        data={playerList.filter(elem=>elem.pos == 'D/ST')}
                            renderItem={({item})=>{
                                return (                
                                    <TouchableOpacity 
                                        onPress={()=>{
                                          setOverlayVisible(false)
                                          addList(item.name)
                                        }}>
                                            <Text style={styles.playerChooseText}>{item.name}</Text>
                                    </TouchableOpacity>
                                )
                            }}
                            >
                    </FlatList> 
                    <Text style={styles.subHeaderText} >K</Text>
                    <FlatList 
                        listKey='k1'
                        style={styles.playerChoose}
                        data={playerList.filter(elem=>elem.pos == 'K')}
                            renderItem={({item})=>{
                                return (                
                                    <TouchableOpacity 
                                        onPress={()=>{
                                            setOverlayVisible(false)
                                            addList(item.name)
                                            
                                        }}>
                                            <Text style={styles.playerChooseText}>{item.name}</Text>
                                    </TouchableOpacity>
                                )
                            }}
                            >
                    </FlatList> 
                </View>
                )
            }}>
        </FlatList> 
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
      },
      nav: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '3%',
        width: '100%',
        marginTop: 55,
      },
      navText: {
        fontSize: 16,
        color: '#2375c8',
        paddingLeft: '5%',
      },
      navTextSave: {
        fontSize: 16,
        color: '#2375c8',
        paddingRight: '5%',
      },
      header: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignContent: 'center',
        marginBottom: 20,
      },
      headerText: {
          fontSize: 34,
          fontWeight: 'bold',
      },
      data: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        marginTop: 5,
        borderColor: 'grey',
        paddingBottom: 8,
      },
      dataText: {
        fontSize: 12,
        fontWeight: 'bold',
        fontStyle: 'italic',
      },
      dataBox: {
        width: '100%',
      },
      playerDataHeaderBox: {    
        width: '100%', 
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: 20,
        paddingRight: 15,
        paddingTop: 40,
        paddingBottom: 15,
      },
      playerDataHeader: {
        fontSize: 25,
        fontStyle: 'italic',
      },
      starterBox: {
        borderTopWidth: 2,
        flexDirection: 'colmn'
      },
      posSquare: {
        paddingVertical: 20,
        backgroundColor: '#E0E0D7',
        alignItems:'center',
        width: '18%',
      },
      posText: {
        color: '#30302F',
        fontSize: 14,
        fontWeight: 'bold',
      },
      playerBox: {
        flexDirection: 'column',
        width: '100%',
        paddingRight: 10,
      },
      playerRectangle: {
        flexDirection: 'row',
        justifyContent: 'space-between',  
        borderBottomWidth: 1,
        borderColor: '#DFDAD6',
      },
      playerSquare: {
        flexDirection: 'row',
        paddingHorizontal: 4,
        paddingVertical: 15,
        alignItems:'center',
      },
      delete: {
        backgroundColor: '#B92407',
        paddingHorizontal: 5,
        paddingVertical: 5,
        borderRadius: 20,
      },
      add: {
        flexDirection: 'column',
        backgroundColor: '#2755F9',
        justifyContent: 'center',
        borderRadius: 3,
        paddingHorizontal: 5,
      },
      swapText: {
        color: 'white',
        fontSize: 14,
      },
      playerText: {
        color: '#2755F9',
        fontSize: 14,
        fontWeight: 'bold',
      },
      playerNameText: {
        color: '#30302F',
        fontSize: 12,
        fontWeight: 'bold',
      },
      overlayView: {
        flex: 'auto',
        width: '80%',
      },
      indent: {
        marginLeft: 10
      },  
    overHeaderText: {
      fontSize: 30,
      fontWeight: 'bold',
      paddingBottom: 10
    },
    subHeaderText: {
      fontSize: 24,
      fontWeight: 'bold',
      fontStyle: 'italic'
    },
    playerChooseText: {
        fontSize: 20,
        paddingHorizontal: 10,
        paddingVertical: 5,
    },

    });