import React, { useEffect, useState, Component } from 'react';
import { Icon } from '@rneui/themed';
import { Button, FlatList, StyleSheet, Text, TextInput, View, Image, TouchableOpacity } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { Overlay } from 'react-native-elements';
import { LOAD_USERS, LOAD_PLAYERS, UPDATE_TEAM } from '../data/Reducer';
import { saveAndDispatch, getFBAuth } from '../data/DB';
import { firebaseConfig } from '../Secrets';
import { getFirestore, collection, getDocs,
  doc, setDoc, getDoc, addDoc, updateDoc,  onSnapshot, deleteDoc, query, where } 
  from 'firebase/firestore';
import firebase from 'firebase/compat/app'

export default function SavedTrades(props) {

  const { navigation } = props;
  const dispatch = useDispatch();
  let users = useSelector((state) => state.users);
  let currEmail = useSelector((state) => state.currEmail);
  //let currID = useSelector((state) => state.currID);
  const [tradeList, setTradeList] = useState([]);
  // const [leftList, setLeftList] = useState([]);
  // const [rightList, setRightList] = useState([]);

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
        
        setTradeList(data[0].trades)
        setTradeList(data[0].trades)
        
      });
    }


  useEffect(()=>{ 
      const loadAction = { type: LOAD_USERS };
      saveAndDispatch(loadAction, dispatch);
      getList()
      getList()
  }, [])



    return(
      <View style={styles.container}>
        <View style={styles.nav}>
           <TouchableOpacity  onPress={()=>{navigation.goBack();}}>
                <Text style={styles.navText}>Back</Text>
            </TouchableOpacity>
        </View>
        <View style={styles.pageHeader}>
          <Text style={styles.pageHeaderText}>SAVED      </Text>
          <Text style={styles.pageHeaderText}>       TRADES</Text>
        </View>
        <View style={styles.seperator}>
        </View>
        <FlatList
          style={styles.tradeBox}
          listKey='SavedTeams'
          data={tradeList} 
          renderItem={({item})=>{
           return (
                  <View style={styles.playersBox}>
                    {item.left.map((p) => (
                      <View style={styles.rightSide}>
                        <Text style={styles.playersBoxText}>{p.name}</Text>
                      </View> 
                    ))}
                    {item.right.map((p) => (
                      <View style={styles.rightSide}>
                        <Text style={styles.playersBoxText}>{p.name}</Text>
                      </View>
                    ))}
                  </View>
            )
          }}
        />
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
      pageHeader: {
        flex: 0.1,
        flexDirection: 'column',
        justifyContent: 'space-evenly',
        alignContent: 'center',
        marginVertical: '2%'
      },
      pageHeaderText: {
          fontSize: 38,
          fontWeight: 'bold',
          fontStyle: 'italic'
    },
    seperator: {
      borderWidth: 1,
      borderBottomColor: 'grey',
      width: '80%',
      marginTop: 20,
    },
    tradeBox: {
      flex:.7,
      flexDirection: 'column',
      width: '100%',
      borderWidth: 1,
    },
    playersBox: {
      flex:'auto',
      justifyContent: 'space-evenly',
      alignItems: 'center',
      width: '100%',
      height: 200,
      height: 'auto',
      borderWidth: 1,
      flexDirection: 'column'  
    },
    leftSide: {
      
      flexDirection: 'column',
      justifyContent: 'center'
    },
    rightSide: {
      
      flexDirection: 'row',
      justifyContent: 'center'
    },
    playersBoxText: {
      fontSize: 26,
    },
    });

                        {/* <Text>{}</Text>
                    <FlatList                                         //tradeList[0].left[0].name
                      style={styles.leftSide}
                      listKey={'item.left'}
                      data={item[index].left} 
                      renderItem={(item)=>{
                        return (
                          <Text style={styles.playerBoxText}>{item.name}</Text>
                        )
                      }}
                    />
                    <Text>Hello</Text>
                    <FlatList
                      style={styles.rightSide}
                      listKey={'item.right'}
                      data={item.right} 
                      renderItem={(item)=>{
                        return (
                          <>
                          <Text style={styles.playerBoxText}>{item.item.name}</Text>
                          <Text style={styles.playerBoxText}>{item.name}</Text>
                          </>
                        )
                      }}
                    />              */}