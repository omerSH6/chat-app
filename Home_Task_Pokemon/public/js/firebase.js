const chatMessages = document.getElementById('chat-messages');

saveButton.addEventListener('click',()=>{
    if(saveFirebaseBtn==false){
        saveButton.classList.remove('btn-warning');
        saveButton.classList.add('btn-success');
        saveFirebaseBtn=true;
    }
    var messages = [];
    for(var i=0;i<=chatMessages.children.length-1;i++){
        messages.push(formated(chatMessages.children[i].children));
    }
    firebase.database().ref('users/'+username).set({messages:messages});
})

function formated(element){
    var meta =  element[0].outerText.split(' ');
    var from = meta[0];
    var time = meta[1];
    var text = element[1].outerText;
    return {from:from,time:time, text:text};

}


