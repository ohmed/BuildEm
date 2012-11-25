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
      if ( self[param].control.position.distanceTo( self.mesh.position ) > 5 && (self[param].nailed || self.neighbours[param].neighbour) ) {
        if (self[param].nailed) self[param].update = false;
        self[param].nailed = false;
        if ( self.neighbours[param].neighbour ) {
          self[param].update = false;
          self.neighbours[param].neighbour.neighbours[ self.neighbours[param].name ] = {'neighbour': null,'name': null};
          self.neighbours[param] = {'neighbour': null,'name': null};
        }
        game.physics.strech( self, param );
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
