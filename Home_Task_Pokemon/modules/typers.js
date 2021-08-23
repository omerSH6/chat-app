const typers = [];

function jointyper(id,username,roomname){
  typers.push({id,username,roomname});
  return ({id,username,roomname});
}

function typerLeft(id){
    const index = typers.findIndex(typer=>typer.id===id);
    if(index!==-1){
      return typers.splice(index,1)[0];
    }
  }
  
  function gettypersInRoom(roomname){
    return typers.filter(typer=>typer.roomname===roomname);
  }

  module.exports={
    jointyper,
    typerLeft,
    gettypersInRoom
  };