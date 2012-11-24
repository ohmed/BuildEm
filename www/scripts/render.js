game.render = function() {

  requestAnimationFrame( game.render );
  
  for (var i in game.minions) {
    game.minions[i].updateControls();
    if ( !game.minions[i].handL.update ) {
      game.minions[i].update();
      game.minions[i].mesh.__dirtyRotation = true;
      game.minions[i].mesh.rotation.y = 0;
      game.minions[i].mesh.rotation.z = 0;
      game.minions[i].mesh.rotation.x = 0;
    }
  }

  if (Date.now() - game.renderer.lastFrame >= 1000/12) {
    game.renderer.render( game.scene, game.camera );
    game.renderer.lastFrame = Date.now();
  }

  game.scene.simulate( undefined, 1);
  game.stats.update();

};