var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
const uuidV1 = require('uuid/v1');

const { spawn } = require('child_process');
/*const ls = spawn('../Build/flux.exe');
ls.on('close', (code) => {
  console.log(`child process exited with code ${code}`);
});*/

global.__root = __dirname + '/';

var baseport = 7777;

var servers = [];
var clients = [];
var matches = [];
var playerqueue = [];
var portsInUse = [];

let pqueue = setInterval(function(){ queuetimer() }, 1000);

function queuetimer() {
	//console.log("Queue Timer Beat");
	if (playerqueue.length >= 5) 
	{
		var players = [];
		for (var i = 0; i < 5; i++) {
			players.push(playerqueue.shift());
		}
		createMatch(uuidV1(), players);
	}
	//console.log(playerqueue);
}

function createMatch(id, players) {
	var port = 7777;
	for (var i = 7777; i < 7799; i++) {
		if (portsInUse.indexOf(i) == -1) {
			portsInUse.push(i);
			port = i;
			break;
		}
	}
	console.log("Creating Match: " + id + ", Port: " + port);
	var matchid = uuidV1();
	var enemyplayer = players[Math.floor(Math.random() * 5)].name;
	console.log('EnemyPlayer: ' + enemyplayer);
	ls = spawn('../test/WindowsNoEditor/FinalProj/Binaries/Win64/FinalProjServer.exe', ['Map?PlayerCount=5?IsServer=1?EnemyPlayer=' + enemyplayer, '-log', '-Port=' + port ], {
    detached: true ,
    stdio: [ 'ignore', 'ignore', 'ignore' ]
});
	for (var i = 0; i < players.length; i++) {
		console.log(players[i].id);
		io.to(players[i].id).emit('joinserver', '' + port + '?PlayerName=' + players[i].name );
	}
	ls.on('close', (code) => {
		console.log(`Match Ended: ` + matchid);
		var index = portsInUse.indexOf(port);
		if (index != -1) portsInUse.splice(index, 1);
	});

	matches.push({ id: matchid, players: players });
}

io.on('connection', function(socket) {
    console.log('Someone connected!!');

    socket.on('helloserver', data => {
        console.log("Server hello: " + data);
        servers.push({ id: socket.id });
        console.log(servers);
    });

    socket.on('queueup', (data, fn) => {
        console.log('"' + data + '"' + " entered the queue." );
        playerqueue.push({ id: socket.id, name: String(data) });
        fn('success');
        console.log(playerqueue);
    });

});

module.exports = http;