game.render = function() {

  requestAnimationFrame( game.render );
  
  for (var i in game.minions) {
    game.minions[i].updateControls();
    if (!game.minions[i].handR.update) game.minions[i].update( 'handR' );
    if (!game.minions[i].handL.update) game.minions[i].update( 'handL' );
    game.minions[i].mesh.setAngularVelocity({x:0,y:0,z:0});
    game.minions[i].mesh.setAngularFactor({x:0,y:0,z:0});
  }

  if (Date.now() - game.renderer.lastFrame >= 1000/12) {
    game.renderer.render( game.scene, game.camera );
    game.renderer.lastFrame = Date.now();
  }

  game.scene.simulate( undefined, 1);
  game.stats.update();

};