game.render = function() {

  requestAnimationFrame( game.render );
  
  if (Date.now() - game.renderer.lastFrame >= 1000/12) {
    game.renderer.render( game.scene, game.camera );
    game.renderer.lastFrame = Date.now();
  }

  game.scene.simulate( undefined, 1);
  game.stats.update();

};