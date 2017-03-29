/**
 * Create static http + io connection
 * @type {server}
 */
const express = require('express'),
  app = express(),
  server = require('http').Server(app),
  io = require('socket.io')(server),
  fs = require('fs'),
  _ = require('lodash');


/** add static root **/
app.use(express.static('../client/dist'));


/** handle new socket client**/
io.on('connection', socket=> {

  /** fire list event and transfer all available videos to client**/
  fs.readdir('video', (err, files) => {
    socket.emit('list', err ? [] : _.map(files, file=>{
      return {name: file.replace('.mp4', '')}
    }));
  });


  /** triggers from client. This will start file splitting to chunks and delivering data to frontend**/
  socket.on('video:fragment', (data)=> {

    let movieStream = fs.createReadStream(`./video/${data.name}.mp4`, { highWaterMark: 512 * 1024 });

    movieStream.on('error', ()=>{});

    /** send chunk to client**/
    movieStream.on('data', chunk=> {
      socket.emit('video:chunk', {chunk: new Uint8Array(chunk).buffer});
    });


    /** notify client, when file transfer completed **/
    movieStream.on('end', ()=> {
      socket.emit('video:chunk:end');
    })

  });

});

/** start server on port 8080 **/
server.listen(8080);
