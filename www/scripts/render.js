game.render = function() {

  for (var k = 0; k<game.groups.length; k++) {
    _visited.length = 0;
    if (game.groups[k].length>0) {
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
      if ( self[param].control.position.distanceTo( self.mesh.position ) > 7 && (self[param].nailed || self.neighbours[param].neighbour) ) {
        if (self[param].nailed) self[param].update = false;
        self[param].nailed = false;
        clearInterval( self.intervals[ 'move' + param ] );

        if ( s && s.neighbour ) {
          self.neighbours[param].neighbour.neighbours[ self.neighbours[param].name ] = {'neighbour': null,'name': null};
          self.neighbours[param] = {'neighbour': null,'name': null};
          self[param].update = false;
          s.neighbour[s.name].update = false;

          if (!self.neighbours['handL'].name && !self.neighbours['handR'].name && !self.neighbours['legL'].name && !self.neighbours['legR'].name) {
            game.groups.push( [self.id  ] );
            for (var p = 0; p<game.groups[ self.group ].length; p++) {
              if ( game.groups[ self.group ][ p ] == self.id - 1 ) {
                game.groups[ self.group ].splice( p, 1 );
                break;
              }
            }
            self.group = game.groups.length - 1;
          }

          if (!s.neighbour.neighbours['handL'].name && !s.neighbour.neighbours['handR'].name && !s.neighbour.neighbours['legL'].name && !s.neighbour.neighbours['legR'].name) {
            game.groups.push( [ s.neighbour.id ] );
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

  game.scene.simulate( undefined, 1);
  requestAnimationFrame( game.render );
  game.stats.update();

};
