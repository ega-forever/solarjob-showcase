/**
 * main app
 */
angular.module('app', [])
  .run(($rootScope)=> {
    $rootScope.io = io('http://localhost:8080');
    $rootScope.io.emit('list');
  })

  /**
   * video controller
   * @type {controller}
   */
  .controller('videoCtrl', ($scope, $rootScope)=> {

    let chunks = [];
    $rootScope.io.on('video:chunk', (data)=> {
      chunks = _.concat(chunks, Array.from(new Uint8Array(data.chunk)));
    });
    $rootScope.io.on('video:chunk:end', ()=> {
      let blob = new Blob([new Uint8Array(chunks)], {type: 'video/mp4'});
      let player = document.querySelector('video');
      player.src = URL.createObjectURL(blob);
    });

    $rootScope.play = (name)=>{
      $scope.name = name;
      let player = document.querySelector('video');
      player.pause();
      player.remove();
      player = document.createElement('video');
      player.autoplay = true;
      document.querySelector('.jumbotron .container').appendChild(player);
      chunks = [];
      $rootScope.io.emit('video:fragment', {name: name});
    }

  })
  /**
   * videoList controller
   * @type {controller}
   */
  .controller('videoListCtrl', ($scope, $rootScope)=> {

    $rootScope.io.on('list', data=> {
      $scope.items = data;
      $scope.$apply()
    });

  });