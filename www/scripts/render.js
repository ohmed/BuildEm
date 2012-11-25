game.render = function() {

  for (var k = 0; k<game.groups.length; k++) {
    _visited.length = 0;
    if (game.groups[k].length>0 && game.minions[ game.groups[k][0] ]) {
      var min = game.minions[ game.groups[k][0] ].mesh.position.y;
      var minID = 0;
      game.physics.affectAll( game.minions[ game.groups[k][0] ], game.groups[k].length );
    }
  }

  for (var i in game.minions) {
    game.minions[i].updateControls();
    if (!game.minions[i].handR.update) game.minions[i].update( 'handR' );
    if (!game.minions[i].handL.update) game.minions[i].update( 'handL' );
    if (!game.minions[i].legR.update) game.minions[i].update( 'legR' );
    if (!game.minions[i].legL.update) game.minions[i].update( 'legL' );
    game.minions[i].mesh.setAngularVelocity({x:0,y:0,z:0});
    game.minions[i].mesh.setAngularFactor({x:0,y:0,z:0});
    game.minions[i].mesh.__dirtyPosition = true;
    game.minions[i].mesh.position.z = 0;

    function checkConnection( param ) {
      self = game.minions[i];
      var s = self.neighbours[param] || false;
      if ( (self[param].control.position.distanceTo( self.mesh.position ) > 4 && self.neighbours[param].neighbour) || (self[param].nailed && ( !self.getNearestNail( self[ param ].control.position ) || self[param].control.position.distanceTo( self.mesh.position ) > 5 ) ) ) {
        if (self[param].nailed) {
          self[param].update = false;
        }
        self[param].nailed = false;
        clearInterval( self.intervals[ 'move' + param ] );

        if ( s && s.neighbour ) {
          self.neighbours[param].neighbour.neighbours[ self.neighbours[param].name ] = {'neighbour': null,'name': null};
          self.neighbours[param] = {'neighbour': null,'name': null};
          self[param].update = false;
          s.neighbour[s.name].update = false;
          if (!self.neighbours['handL'].name && !self.neighbours['handR'].name && !self.neighbours['legL'].name && !self.neighbours['legR'].name) {
            game.groups.push( [ self.id - 1 ] );
            for (var p = 0; p<game.groups[ self.group ].length; p++) {
              if ( game.groups[ self.group ][ p ] == self.id - 1 ) {
                //console.log(p);
                game.groups[ self.group ].splice( p, 1 );
                break;
              }
            }
            self.group = game.groups.length - 1;
          }

          if (!s.neighbour.neighbours['handL'].name && !s.neighbour.neighbours['handR'].name && !s.neighbour.neighbours['legL'].name && !s.neighbour.neighbours['legR'].name) {
            game.groups.push( [ s.neighbour.id - 1 ] );
            for (var p = 0; p<game.groups[ s.neighbour.group ].length; p++)
              if ( game.groups[ s.neighbour.group ][ p ] == s.neighbour.id - 1 ) {
                game.groups[ s.neighbour.group ].splice( p, 1 );
                break;
              }
            s.neighbour.group = game.groups.length - 1;
          }

        }

        game.physics.strech( self, param );
        if (s && s.neighbour) game.physics.strech( s.neighbour, s.name );
      }
    }

    checkConnection( 'handL' );
    checkConnection( 'handR' );
    checkConnection( 'legL' );
    checkConnection( 'legR' );

  }

  if (Date.now() - game.renderer.lastFrame >= 1000/12) {
    game.renderer.render( game.scene, game.camera );
    game.renderer.lastFrame = Date.now();
  }

  if (game.finish === 1) {
    var mesh = game.banana;
    var interpolation = mesh.duration / mesh.keyframes;
    var time = Date.now() % mesh.duration;
    mesh.keyframe = Math.floor( time / interpolation );
    if ( mesh.keyframe != mesh.currentKeyframe ) {
      mesh.count++;
      mesh.morphTargetInfluences[ mesh.lastKeyframe ] = 0;
      mesh.lastKeyframe = mesh.currentKeyframe;
      mesh.currentKeyframe = mesh.keyframe;
      if (mesh.count == 9) {
        game.finish = -1;
        var hadRotCount = 0;
        var rotHand = setInterval( function() {
          game.minions[ hadRotCount ].mesh.__dirtyRotation = true;
          game.minions[ hadRotCount ].mesh.rotation.y = -Math.PI / 2;
          hadRotCount++;
          if (hadRotCount - 1 === game.minions.length) clearInterval( rotHand );
        }, 800);
        setTimeout( function() {
          audio.play( 'banana' );
          setInterval( function() { game.banana.position.x -= 0.1; }, 50 );
          setTimeout( function() { 
            game.scene.remove( game.nails[0].mesh );
            game.physics.action( 'stopAll' );
          }, 1500 );
        }, 3000);
      }
    }
    mesh.position.x += 0.01;
    mesh.morphTargetInfluences[ mesh.keyframe ] = ( time % interpolation ) / interpolation;
    mesh.morphTargetInfluences[ mesh.lastKeyframe ] = 1 - mesh.morphTargetInfluences[ mesh.keyframe ];
  }

  function onWindowResize(event) {
    game.renderer.setSize(window.innerWidth * 1, window.innerHeight * 1);
    game.camera.aspect = window.innerWidth / window.innerHeight;
    game.camera.updateProjectionMatrix();
  }

  /* add resize event handler */
  window.addEventListener('resize', onWindowResize, false);

  game.scene.simulate( undefined, 1);
  requestAnimationFrame( game.render );
  game.stats.update();

};
