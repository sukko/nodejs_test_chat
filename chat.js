var express = require('express');
var app = express.createServer();
app.use(express.static(__dirname + '/public'));
app.listen(process.env.C9_PORT);

var nowjs = require("now");
var everyone = nowjs.initialize(app);

everyone.now.serverRoomsList = {'room1':'활기찬방','room2':'행복한방','room3':'꿈이있는방'};

everyone.now.distributeMessage = function(message){
    console.log(this.now.name + ' | ' + message + ' | ' + this.now.serverRoom);
    var group = nowjs.getGroup(this.now.serverRoom);
    group.now.receiveMessage(this.now.name+'@'+this.now.serverRoom, message);
};

everyone.now.changeRoom = function(newRoom){
    var oldRoom = this.now.serverRoom;
    if(oldRoom){
        var oldGroup = nowjs.getGroup(oldRoom);
        oldGroup.removeUser(this.user.clientId);
        oldGroup.now.receiveMessage('SERVER@'+oldRoom, this.now.name + ' has left the room and gone to '+newRoom);
    }
    var newGroup = nowjs.getGroup(newRoom);
    newGroup.addUser(this.user.clientId);
    newGroup.now.receiveMessage('SERVER@'+newRoom, this.now.name + ' has joined the room');
    this.now.serverRoom = newRoom;
};