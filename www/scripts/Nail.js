var Nail = function () {

  this.id = Nail.count++;

  var material = new THREE.MeshBasicMaterial( {
    color: 0x666666
  } );

  this.mesh = new THREE.Mesh( new THREE.CylinderGeometry( 0.3, 0.3, 1, 20, 3 ), material );
  this.mesh.rotation.set( Math.PI / 2, 0, 0 );

  this.addToScene = function ( position ) {
    this.mesh.position = position.clone();
    game.scene.add(this.mesh);
    return this;
  }

}

Nail.count = 1;

Nail.build = function () {
  var nails = [];
  var rand = Math.random;

  for ( var i = 0; i < 5; i++ ) {
    for ( var j = 0; j < 10; j++ ) {
      nails.push( ( new Nail() ).addToScene( new THREE.Vector3( -i * 4 + rand() * 25 - 10, j * 3 + rand() * 2 - 1, 0 ) ) );
    }
  }

  game.nails = nails;
}