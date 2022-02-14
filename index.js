var fs = require("fs");
var isRunning = false;
const {
    spawn
} = require("child_process");
var settings = JSON.parse(fs.readFileSync("settings.json").toString()).args.split(" ");
settings.push("-vnc");
settings.push("127.0.0.1:1");
const VncClient = require('vnc-rfb-client');
const Jimp = require('jimp');

spawn(`qemu-system-x86_64`, settings);
var index = 0;
const express = require('express');
const app = express();
const http = require('http');
var keysyms = require("./keysyms");
const server = http.createServer(app);
const {
    Server
} = require("socket.io");
const io = new Server(server);

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
    socket.on('run', () => {
		if (!isRunning) {
			isRunning = true;
			global.client = new VncClient();

        // Just 1 update per second
        client.changeFps(100);
        client.connect({
            host: '127.0.0.1',
            port: 5901
        });



        client.on('connectError', (err) => {
            console.log(err);
        });

        client.on('authError', () => {
            console.log('Authentication failed.');
        });

        client.on('frameUpdated', (data) => {
            new Jimp({
                width: client.clientWidth,
                height: client.clientHeight,
                data: client.getFb()
            }, (err, image) => {
                if (err) {
                    console.log(err);
                }
                const fileName = `a.jpg`;
                image.write(`${fileName}`);
            });
            io.emit("frame", "data:image/png;base64," + fs.readFileSync("a.jpg").toString("base64"));
        });
        socket.on('keydown', function(data) {
            var key = data;
            console.log(key, keysyms[key]);
            client.sendKeyEvent(keysyms[key], true);
        });
	  } else {
		    socket.on('keydown', function(data) {
            var key = data;
            console.log(key, keysyms[key]);
            client.sendKeyEvent(keysyms[key], true);
			});
			
			io.emit("frame", "data:image/png;base64," + fs.readFileSync("a.jpg").toString("base64"));			
	  }
    })
});

server.listen(3000, () => {
    console.log('listening on *:3000');
});
