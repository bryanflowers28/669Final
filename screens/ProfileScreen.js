import React, { useEffect, useState, Component } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { Icon } from '@rneui/themed';
import { Button, FlatList, StyleSheet, Text, TextInput, View, Image, TouchableOpacity } from 'react-native';
import { firebaseConfig } from '../Secrets';
import { saveAndDispatch, getFBAuth } from '../data/DB';
import { LOAD_USERS, LOAD_PLAYERS } from '../data/Reducer';
import { signOut } from 'firebase/auth'; 



const auth = getFBAuth();

export default function ProfileScreen(props) {
  
  users = useSelector((state) => state.users);
  currTeam = useSelector((state) => state.currTeam);
  currID = useSelector((state) => state.currID);
  const [teamName, setTeamName] = useState('');
  

  const { navigation } = props;
  const dispatch = useDispatch();

  useEffect(()=>{ 
    const loadAction2 = { type: LOAD_PLAYERS };
    saveAndDispatch(loadAction2, dispatch);
    console.log(currID)
  }, []);

  useEffect(()=>{ 
    const loadAction = { type: LOAD_USERS };
    saveAndDispatch(loadAction, dispatch);
    setTeamName(currTeam)
  }, [currTeam]);

  
    return(
      <View style={styles.container}>
        <View style={styles.userInfo}>
          <Icon name="sports-football" type="MaterialIcons"  size={100}/>
          <View style={styles.nameBox}>
            <Text style={styles.teamName}>PROFILE</Text>
            <Text style={styles.userName}>{teamName}</Text>
          </View>
        </View>
        <View style={styles.profileOptions}>
            <TouchableOpacity style={styles.optionBox} onPress={()=>{navigation.navigate('Team')}}>
                <Text style={styles.optionText}>My Team</Text>
                <Icon name="arrow-forward-ios" type="MaterialIcons" color={'grey'} size={30}/>
            </TouchableOpacity>
            <TouchableOpacity style={styles.optionBox}  onPress={()=>{navigation.navigate('Trades')}}>
                <Text style={styles.optionText}>Saved Trades</Text>
                <Icon name="arrow-forward-ios" type="MaterialIcons" color={'grey'} size={30}/>
            </TouchableOpacity>
            <TouchableOpacity style={styles.optionBox} onPress={async () => {
                await signOut(auth);         
                navigation.navigate('Log');
              }}
            >
                <Text style={styles.optionText}>Log Out</Text>
                <Icon name="arrow-forward-ios" type="MaterialIcons" color={'grey'} size={30}/>
            </TouchableOpacity>
        </View>
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
      userInfo: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignContent: 'center',
      },
      teamName: {
          fontSize: 34,
          fontWeight: 'bold',
          fontStyle: 'italic'
      },
      userName: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#2755F9',
      },
      nameBox: {
        flexDirection: 'column',
        alignContent: 'center',
        justifyContent: 'center',
        marginLeft: 10
      },
      profileOptions: {
        marginTop: 10,
      },
      optionBox: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: 300,
        height: 90,
        marginHorizontal: 10,
        marginVertical: 15,
        borderWidth: 3,
        borderRadius: 5,
        borderColor: 'grey',
        paddingHorizontal: 10,
        backgroundColor: 'white',
        shadowColor: '#171717',
        shadowOffset: {width: -2, height: 4},
        shadowOpacity: 0.2,
        shadowRadius: 3,
    },
    optionText: {
        fontSize: 30,
        fontWeight: 'bold',
    },
    optionBoxSaved: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: 300,
      height: 90,
      marginHorizontal: 10,
      marginVertical: 15,
      borderWidth: 3,
      borderRadius: 5,
      borderColor: '#CFCFD1',
      paddingHorizontal: 10,
      backgroundColor: 'white',
      shadowColor: '#171717',
      shadowOffset: {width: -2, height: 4},
      shadowOpacity: 0.2,
      shadowRadius: 3,
  },
  optionTextSaved: {
      fontSize: 30,
      fontWeight: 'bold',
      color: '#CFCFD1'
  }
    });
    