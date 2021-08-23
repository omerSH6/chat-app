const users = [];

function joinUser(id,username,roomname){
  users.push({id,username,roomname});
  return ({id,username,roomname});
}
function getUser(id){
  return users.find(user=>user.id===id);
}
function userLeft(id){
    const index = users.findIndex(user=>user.id===id);
    if(index!==-1){
      return users.splice(index,1)[0];
    }
  }
  
  function getUsersInRoom(roomname){
    return users.filter(user=>user.roomname===roomname);
  }

  module.exports={
    joinUser,
    getUser,
    userLeft,
    getUsersInRoom
  };