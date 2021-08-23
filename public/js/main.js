const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const saveButton = document.getElementById('FirebaseSave');
const username = urlParams.get('username')
const roomname = urlParams.get('room')
var saveFirebaseBtn = false;


const socket = io();
socket.emit('user_joined_room',{username,roomname});

//message from server
socket.on('message',message=>{
    printMessage(message);
})

//print message to chat by given message object.
function printMessage(message){
    if(saveFirebaseBtn==true){
        saveButton.classList.remove('btn-success');
        saveButton.classList.add('btn-warning');
        saveFirebaseBtn=false;
    }
    var messageElement = document.createElement('div');
    var chatBoxElement = document.querySelector('.chat-messages');
    messageElement.classList.add('message');
    messageElement.innerHTML=
        `<p class="meta">${message.from} <span>${message.time}</span></p>
        <p class="text">
            ${message.text}
        </p>`;
    document.getElementById('chat-messages').appendChild(messageElement);
    chatBoxElement.scrollTop = chatBoxElement.scrollHeight;
}

//update list of online users and room name
socket.on('onlineUsersUpdate',users=>{
    const usersElement = document.getElementById('users');
    const roomname = document.getElementById('room-name');
    usersElement.innerHTML = `${users.usersList.map(user=>`<li>${user.username}</li>`).join('')}`;
    roomname.innerText = users.roomname;
})

//update list of typing users
socket.on('typingUsersUpdate',typers=>{
    const typersElement = document.getElementById('typing_users');
    typersElement.innerHTML = `${typers.map(typer=>`<li>${typer.username} is typing...</li>`).join('')}`;
})

//submiting massage to server
const chat = document.getElementById('chat-form');
chat.addEventListener('submit',e=>{
    e.preventDefault();
    const message = e.target.elements.msg.value;
    socket.emit('messageFromChat',message);
    e.target.elements.msg.value='';
    e.target.elements.msg.focus();
})

//track typing users
const inputLine = document.getElementById('msg');
var typing = false;
inputLine.onkeyup = e => {
    if(typing==false){
        typing=true;
        socket.emit('typing',{username,roomname});
    }
    if (e.target.value === '') {
        socket.emit('stopTyping',{username,roomname});
        typing = false;
    }
}
//read only mode, for viewing saved messages.
socket.on('readonly',()=>{
    const roomname = document.getElementById('room-name');
    roomname.innerText = "readonly mode : view the messages you saved";
    document.getElementById("sidbar-data").style.display = "none";
    document.getElementById("FirebaseSave").style.display = "none";
    document.getElementById("msg").setAttribute("disabled","true");
    document.getElementById("send-btn").setAttribute("disabled","true");
    firebase.database().ref('users/'+username).on('value',(snapshot)=>{
        snapshot.val().messages.forEach(message => {
            printMessage(message);
        });
    });
});

//append icon to input field
function appendicon(icon){
    var input = document.getElementById('msg');
    if(icon=='smile'){
        input.value = input.value +'😄';
    }
    if(icon=='thumbs-up'){
        input.value = input.value +'👍';
    }
}
