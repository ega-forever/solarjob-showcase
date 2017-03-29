# Video streaming demo for solarjob

An mp4 streamer, implemented in node.js / socket.io + angular.


# Get started

Install client
```sh
cd client
npm install -g gulp bower
bower install && npm install -d
gulp build
```
install server
```sh
cd server
npm install
```

# Usage

Copy your videos to server/video dir. All video files should be mp4 format. Then run server:
```sh
cd server
node .
```
This will start app on 8080 port


License
----

MIT