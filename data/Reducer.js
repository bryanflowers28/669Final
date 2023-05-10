const LOAD_PLAYERS = 'LOAD_PLAYERS';
const LOAD_USERS = 'LOAD_USERS';
const ADD_USER = 'ADD_USER';
const SET_NAME = 'SET_NAME';
const SET_EMAIL = 'SET_EMAIL';
const UPDATE_TEAM = 'UPDATE_TEAM';
const SET_USER = 'SET_USER';
const SET_ROSTER = 'SET_ROSTER';
const UPDATE_TRADES = 'UPDATE_TRADES'
// const LOAD_CURR = 'LOAD_CURR';
const SET_ID = 'SET_ID';



const initialState = {
  playerItems: [],
  users: [],
  currTeam: '',
  currEmail: '',
  currID: '',
  currUser: []
}

const loadPlayers = (state, newPlayers) => {
  return {
    ...state, 
    playerItems: newPlayers
  }
}

const loadUsers = (state, newUsers) => {
  return {
    ...state, 
    users: newUsers
  }
}

// const loadCurrentUser = (state, currUser, email) => {
//   return {
//     ...state, 
//     currentUser: currUser,
//     currEmail: email
//   }
// }

const addUser = (state, newName, newEmail) => {
  let { users } = state;
  let newUsers = users.concat({
    teamName: newName,
    email: newEmail,
    roster: [],
    trades: [],
    card: Date.now()
  });
  return {
    ...state, 
    users: newUsers
  };
}

const updateCurrTeam = (state, newName) => {
  return {
    ...state, 
    currTeam: newName
  }
}

const updateCurrEmail = (state, newEmail) => {
  return {
    ...state, 
    currEmail: newEmail
  }
}

const updateID = (state, id) => {
  return {
    ...state, 
    currID: id
  }
}

const updateUser = (state, usr) => {
  return {
    ...state, 
    currUser: usr
  }
}

// const updateCurrItem = (state, item) => {
//   return {
//     ...state, 
//     currItem: item
//   }
// }

const updateUserTeam = (state, currItem, team, email, newRoster) => {
  let { users } = state;
  // console.log('update team (reducer) current item')
  // console.log(currItem)
  let newUser1 = users.filter(elem=>elem !== currItem);
  let newUsers2 = newUser1.concat({
    key: currItem.key,
    teamName: team,
    email: email,
    roster: newRoster,
  });
    return {
      ...state, 
      users: newUsers2
  };
}

const updateSavedTrades = (state, currItem, newSave) => {
  let { users } = state;
  let newUser1 = users.filter(elem=>elem !== currItem);
  let newUsers2 = newUser1.concat({
    key: currItem.key,
    trades: newSave,
  });
  // let updateUser = users.filter(elem=>elem == currUser); // current user
  // let updateUser2 = updateUser[0].trades.concat({newSave}); //updated user
  // let updateUser3 = users.filter(elem=>elem !== currUser) // everything but the current user
  // let updateUser4 = updateUser3.concat(updateUser2) // combined users with updated user
    return {
      ...state, 
      users: newUsers2
  };
}

function rootReducer(state=initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case LOAD_PLAYERS:
      return loadPlayers(state, payload.newPlayers);
    case LOAD_USERS:
      return loadUsers(state, payload.newUsers);
    // case LOAD_CURR:
    //   return loadCurrentUser(state, payload.currUser, payload.email);
    case ADD_USER:
      return addUser(state, payload.teamName, payload.email, payload.roster, payload.trades);
    case SET_NAME:
      return updateCurrTeam(state, payload.currTeam)
    case SET_ID:
      return updateID(state, payload.currID)
    case SET_EMAIL:
      return updateCurrEmail(state, payload.currEmail)
    case SET_USER:
      return updateUser(state, payload.currUser)
    case SET_ROSTER:
      return updateCurrRoster(state, payload.currRoster)
    case UPDATE_TEAM:
      return updateUserTeam(state, payload.teamName, payload.email, payload.roster)
    case UPDATE_TRADES:
      return updateSavedTrades(state, payload.key, payload.trades)
    default:
      return state;
  }
}

export { rootReducer, LOAD_PLAYERS, LOAD_USERS, ADD_USER, SET_NAME, SET_EMAIL, SET_ROSTER, UPDATE_TEAM, UPDATE_TRADES, SET_ID, SET_USER};