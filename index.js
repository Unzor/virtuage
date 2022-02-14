var fs = require("fs");
var isRunning = false;
const {
  spawn
} = require("child_process");
var settings = JSON.parse(fs.readFileSync("settings.json").toString());
settings.vnc = "127.0.0.1:1";

function json_to_args(e) {
  var n = [];
  for (var t in e) {
    n.push("-" + e + " " + e[t]);
    console.log(e, e[t])
  }
  return n.join(" ")
}
settings = json_to_args(settings);
const VncClient = require("vnc-rfb-client");
const Jimp = require("jimp");
spawn(`qemu-system-x86_64 ${settings}`, {
  shell: true
});
var index = 0;
const express = require("express");
const app = express();
const http = require("http");
var keysyms = require("./keysyms");
const server = http.createServer(app);
const {
  Server
} = require("socket.io");
const io = new Server(server);
app.get("/", (e, n) => {
  n.sendFile(__dirname + "/index.html")
});
io.on("connection", e => {
  e.on("run", () => {
    if (!isRunning) {
      isRunning = true;
      global.client = new VncClient;
      client.changeFps(100);
      client.connect({
        host: "127.0.0.1",
        port: 5901
      });
      client.on("connectError", e => {
        console.log(e)
      });
      client.on("authError", () => {
        console.log("Authentication failed.")
      });
      client.on("frameUpdated", e => {
        new Jimp({
          width: client.clientWidth,
          height: client.clientHeight,
          data: client.getFb()
        }, (e, n) => {
          if (e) {
            console.log(e)
          }
          const t = `a.jpg`;
          n.write(`${t}`)
        });
        io.emit("frame", "data:image/png;base64," + fs.readFileSync("a.jpg").toString("base64"))
      });
      e.on("keydown", function(e) {
        var n = e;
        console.log(n, keysyms[n]);
        client.sendKeyEvent(keysyms[n], true)
      })
    } else {
      e.on("keydown", function(e) {
        var n = e;
        console.log(n, keysyms[n]);
        client.sendKeyEvent(keysyms[n], true)
      });
      io.emit("frame", "data:image/png;base64," + fs.readFileSync("a.jpg").toString("base64"))
    }
  })
});
server.listen(3e3, () => {
  console.log("listening on localhost:3000")
});
