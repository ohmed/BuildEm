var Nail = function () {

  this.id = Nail.count++;

  var material = new THREE.MeshBasicMaterial( {
    color: 0x444444
  } );

  this.mesh = new THREE.Mesh( new THREE.CylinderGeometry( 0.5, 0.5, 1, 20, 3 ), material );
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

  nails.push( ( new Nail() ).addToScene( new THREE.Vector3( -2 , 6, -10 ) ) );
  nails.push( ( new Nail() ).addToScene( new THREE.Vector3( -7 , 7, -10 ) ) );
  nails.push( ( new Nail() ).addToScene( new THREE.Vector3( 3 , 7, -10 ) ) );

  game.nails = nails;
}