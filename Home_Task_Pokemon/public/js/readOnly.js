const readOnlyButton = document.getElementById('readOnlyButton');

readOnlyButton.addEventListener('click',e=>{
    const usernamevalue = document.getElementById('username');
    if(usernamevalue.value!=""){
        window.location.href = `room.html?username=${usernamevalue.value}&room=readonly`;
    }else{
        alert("username is requried for view last saved chat");
    }
})

