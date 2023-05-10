import React, { useEffect, useState, Component } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { Button, FlatList, StyleSheet, Text, TextInput, View, Image, TouchableOpacity } from 'react-native';
import { Overlay } from 'react-native-elements';
import { LOAD_PLAYERS } from "../data/Reducer";
import { saveAndDispatch } from "../data/DB"; 


export default function CompareScreen() {

  playerList = useSelector((state) => state.playerItems);
  //const [playerList, setPlayerList] = useState([]);
  const [player1, setPlayer1] = useState('Add Player 1');
  const [player2, setPlayer2] = useState('Add Player 2');
  const [player1Info, setPlayer1Info] = useState([]);
  const [player2Info, setPlayer2Info] = useState([]);
  const [player1V, setPlayer1V] = useState(0);
  const [player2V, setPlayer2V] = useState(0);
  const [player1Pic, setPlayer1Pic] = useState('../images/default.png');
  const [player2Pic, setPlayer2Pic] = useState('../images/default.png');
  const [overlay1Visible, setOverlay1Visible] = useState(false);
  const [overlay2Visible, setOverlay2Visible] = useState(false);
  const dispatch = useDispatch();

  
  useEffect(()=>{ 
    const loadAction = { type: LOAD_PLAYERS };
    saveAndDispatch(loadAction, dispatch);

  }, []);


  const getPlayer1Stats = (name) => {
    setPlayer1Info([])
    playerList.forEach((playerData) => {
       
        if (playerData.name == name) {
            let newPlayer = [{
                pos: playerData.pos,
                pts: playerData.pts,
                avg: playerData.avg,
                last: playerData.last,
                rk: playerData.rk,
                proj: playerData.proj,
                szn: playerData.szn,
                boom: playerData.boom,
                bust: playerData.bust,
                gp: playerData.gp, 
            }]
            setPlayer1Info(newPlayer);
            setPlayer1V(playerData.value)
            
        }
    })
  }

  const getPlayer2Stats = (name) => {
    setPlayer2Info([])
    playerList.forEach((playerData) => {
  
        if (playerData.name == name) {
            let newPlayer = [{
                pos: playerData.pos,
                pts: playerData.pts,
                avg: playerData.avg,
                last: playerData.last,
                rk: playerData.rk,
                proj: playerData.proj,
                szn: playerData.szn,
                boom: playerData.boom,
                bust: playerData.bust,
                gp: playerData.gp,
            }]
            setPlayer2Info(newPlayer);
            setPlayer2V(playerData.value)
        }
    })
  }


  return(
    <View style={styles.container}>
      <View style={styles.pageHeader}>
        <Text style={styles.pageHeaderText}>COMPARE         </Text>
        <Text style={styles.pageHeaderText}>          PLAYERS</Text>
      </View>
      <View style={styles.playerBox}>
        <View style={styles.leftBox}>
            <Text style={styles.playerNamesText1}>Player 1</Text> 
            <View style={styles.playerImagesBox}>
                <Text style={styles.playerImagesPicture}>{player1}</Text> 
            </View>
            <Text style={styles.tradeValue}>Trade Value</Text> 
            <Text style={styles.tradeValueScore}>{player1V}</Text> 
            <TouchableOpacity title={'Swap Player'} style={styles.swap} onPress={()=>setOverlay1Visible(true)}>
                <Text style={styles.swapText}>Swap Player</Text> 
            </TouchableOpacity>
        </View>
        <View style={styles.rightBox}>
            <Text style={styles.playerNamesText2}>Player 2</Text> 
            <View style={styles.playerImagesBox}>
            <Text style={styles.playerImagesPicture}>{player2}</Text> 
            </View> 
            <Text style={styles.tradeValue}>Trade Value</Text>
            <Text style={styles.tradeValueScore}>{player2V}</Text>
            <TouchableOpacity title={'Swap Player'} style={styles.swap} onPress={()=>setOverlay2Visible(true)}>
                <Text style={styles.swapText}>Swap Player</Text> 
            </TouchableOpacity>
        </View>
      </View>

        <View style={styles.seperator}>
      </View>
        <View style={styles.statHeader}>
            <Text style={styles.pageHeaderText} >Player Stats</Text>
        </View>
      <View style={styles.statBoxContainer}>
        <FlatList contentContainerStyle={styles.statBox1}
            data={player1Info}
                renderItem={({item})=>{
                    return (
                        <View>
                            <Text style={styles.statText}>{item.pos}</Text>
                            <Text style={styles.statText}>{item.pts}</Text>
                            <Text style={styles.statText}>{item.last}</Text>
                            <Text style={styles.statText}>{item.avg}</Text>
                            <Text style={styles.statText}>{item.rk}</Text>
                            <Text style={styles.statText}>{item.proj}</Text>
                            <Text style={styles.statText}>{item.szn}</Text>
                            <Text style={styles.statText}>{item.boom}</Text>
                            <Text style={styles.statText}>{item.bust}</Text>
                            <Text style={styles.statText}>{item.gp}</Text>
                        </View>
                    )
                }}>
        </FlatList> 
            <View style={styles.statBoxHeader}>
                <Text style={styles.statHeaderText}>POS</Text>
                <Text style={styles.statHeaderText}>PTS</Text>
                <Text style={styles.statHeaderText}>LAST</Text>
                <Text style={styles.statHeaderText}>AVG</Text>
                <Text style={styles.statHeaderText}>POS RK</Text>
                <Text style={styles.statHeaderText}>PROJ</Text>
                <Text style={styles.statHeaderText}>SZN PROJ</Text>
                <Text style={styles.statHeaderText}>BOOM</Text>
                <Text style={styles.statHeaderText}>BUST</Text>
                <Text style={styles.statHeaderText}>GP</Text>
            </View>         
        <FlatList contentContainerStyle={styles.statBox2}
            data={player2Info}
                renderItem={({item})=>{
                    return (
                        <View>
                            <Text style={styles.statText}>{item.pos}</Text>
                            <Text style={styles.statText}>{item.pts}</Text>
                            <Text style={styles.statText}>{item.last}</Text>
                            <Text style={styles.statText}>{item.avg}</Text>
                            <Text style={styles.statText}>{item.rk}</Text>
                            <Text style={styles.statText}>{item.proj}</Text>
                            <Text style={styles.statText}>{item.szn}</Text>
                            <Text style={styles.statText}>{item.boom}</Text>
                            <Text style={styles.statText}>{item.bust}</Text>
                            <Text style={styles.statText}>{item.gp}</Text>
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
                                            setOverlay1Visible(false)
                                            setPlayer1(item.name)
                                            getPlayer1Stats(item.name)
                                            getPlayer1Stats(item.name)
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
                                            setOverlay1Visible(false)
                                            setPlayer1(item.name)
                                            getPlayer1Stats(item.name)
                                            getPlayer1Stats(item.name)
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
                                            setOverlay1Visible(false)
                                            setPlayer1(item.name)
                                            getPlayer1Stats(item.name)
                                            getPlayer1Stats(item.name)
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
                                            setOverlay1Visible(false)
                                            setPlayer1(item.name)
                                            getPlayer1Stats(item.name)
                                            getPlayer1Stats(item.name)
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
                                            setOverlay1Visible(false)
                                            setPlayer1(item.name)
                                            getPlayer1Stats(item.name)
                                            getPlayer1Stats(item.name)
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
                                            setOverlay1Visible(false)
                                            setPlayer1(item.name)
                                            getPlayer1Stats(item.name)
                                            getPlayer1Stats(item.name)
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

      {/* {OVERLAY 2} */}
      <Overlay 
        isVisible={overlay2Visible} 
        onBackdropPress={()=>setOverlay2Visible(false)}
        overlayStyle={styles.overlayView}
      >
        <View>
            <Text style={styles.overHeaderText} >Choose Player</Text>
        </View>
        <FlatList
        listKey='overlay2'
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
                                            setOverlay2Visible(false)
                                            setPlayer2(item.name)
                                            getPlayer2Stats(item.name)
                                            getPlayer2Stats(item.name)
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
                                            setOverlay2Visible(false)
                                            setPlayer2(item.name)
                                            getPlayer2Stats(item.name)
                                            getPlayer2Stats(item.name)
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
                                            setOverlay2Visible(false)
                                            setPlayer2(item.name)
                                            getPlayer2Stats(item.name)
                                            getPlayer2Stats(item.name)
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
                                            setOverlay2Visible(false)
                                            setPlayer2(item.name)
                                            getPlayer2Stats(item.name)
                                            getPlayer2Stats(item.name)
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
                                            setOverlay2Visible(false)
                                            setPlayer2(item.name)
                                            getPlayer2Stats(item.name)
                                            getPlayer2Stats(item.name)
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
                                            setOverlay2Visible(false)
                                            setPlayer2(item.name)
                                            getPlayer2Stats(item.name)
                                            getPlayer2Stats(item.name)
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
      paddingTop: '12%'
    },
    pageHeader: {
      flex: 0.16,
      flexDirection: 'column',
      justifyContent: 'space-evenly',
      marginVertical: 20
    },
    pageHeaderText: {
        fontSize: 35,
        fontWeight: 'bold',
        fontStyle: 'italic'
        //paddingBottom: 10
    },
    playerBox: {
        flex: .6,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
    },
    playerNames: {  
        flexDirection: 'row',
        marginTop: 10,
        justifyContent: 'space-evenly',
        width: '100%',
    },
    playerNamesText1: {
        fontSize: 15,
        fontWeight: 'bold',
        alignSelf: 'center',
        
    },
    playerNamesText2: {
        fontSize: 15,
        fontWeight: 'bold',
        alignSelf: 'center',
       
    },
    playerImages: {
        flexDirection: 'row',
    },
    playerImagesBox: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignSelf: 'center',
        //width: '60%',
        marginHorizontal: 10,
        marginVertical: 10,
        borderWidth: 1,
        borderRadius: 5,
        borderColor: 'grey',
        paddingVertical: 10,
        paddingHorizontal: 10,
        backgroundColor: 'white',
        shadowColor: '#171717',
        shadowOffset: {width: -2, height: 4},
        shadowOpacity: 0.2,
        shadowRadius: 3,
        
    },
    playerImagesPicture: {
        fontSize: 18,
        fontWeight: 'bold',
        fontStyle: 'italic',
        alignSelf: 'center'
    },
    info: {
        flexDirection: 'row',
    },
    tradeValue: {
        fontSize: 20,
        fontWeight: 'bold',
        marginHorizontal: 34,
    },
    tradeValueScore: {
        fontSize: 20,
        fontWeight: 'bold',
        marginHorizontal: 78,
        marginVertical: 5,
        color: '#2755F9'
    },
    swap: {
        backgroundColor: '#2755F9',
        paddingHorizontal: 30,
        paddingVertical: 10,
        marginTop: 10,
        marginHorizontal: 19,
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
        paddingLeft: 15
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
        paddingHorizontal: 20,
        paddingTop: 2,
        paddingBottom: 5,
    },
    seperator: {
        borderWidth: 1,
        borderBottomColor: 'grey',
        width: 1000,
        marginTop: 15,
    },
    statHeader: {
      marginTop: 10,
      marginLeft: 20,
      marginBottom: 5,
      alignSelf: 'flex-start'
    },
    statBoxContainer: {
        flex: .9,
        flexDirection: 'row',
        justifyContent: 'center',
        width: '95%',
        paddingVertical: 4,
    },
    statText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#2755F9',
        paddingVertical: 4,
        alignSelf: 'center'
    },
    statHeaderText: {
        fontSize: 16,
        fontWeight: 'bold',
        paddingVertical: 4,
        alignSelf: 'center',
    },
  });
  