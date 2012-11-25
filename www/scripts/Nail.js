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
  var rand = Math.random;

  for ( var i = -20; i < 30; i++ ) {    
    var theta = 2 * Math.PI * i / 40;
    var r = 20;
    var x = -5 + Math.cos( theta ) * r;
    var y = Math.sin( theta ) * r;
    nails.push( ( new Nail() ).addToScene( new THREE.Vector3( x , y, 0 ) ) );
  }

  for ( var i = -20; i < 30; i+=2 ) {    
    var theta = 2 * Math.PI * i / 30;
    var r = 18;
    var x = -5 + Math.cos( theta ) * r;
    var y = Math.sin( theta ) * r;
    nails.push( ( new Nail() ).addToScene( new THREE.Vector3( x , y, 0 ) ) );
  }

  for ( var i = -20; i < 30; i+=3 ) {    
    var theta = 2 * Math.PI * i / 20;
    var r = 15;
    var x = -5 + Math.cos( theta ) * r;
    var y = Math.sin( theta ) * r;
    nails.push( ( new Nail() ).addToScene( new THREE.Vector3( x , y, 0 ) ) );
  }

  for ( var i = -20; i < 30; i+=4 ) {    
    var theta = 2 * Math.PI * i / 10;
    var r = 10;
    var x = -5 + Math.cos( theta ) * r;
    var y = Math.sin( theta ) * r;
    nails.push( ( new Nail() ).addToScene( new THREE.Vector3( x , y, 0 ) ) );
  }

  for ( var i = -20; i < 30; i+=4 ) {    
    var theta = 2 * Math.PI * i / 10;
    var r = 5;
    var x = -5 + Math.cos( theta ) * r;
    var y = Math.sin( theta ) * r;
    nails.push( ( new Nail() ).addToScene( new THREE.Vector3( x , y, 0 ) ) );
  }

  for ( var i = -20; i < 30; i++ ) {    
    var theta = 2 * Math.PI * i / 10;
    var r = 24;
    var x = -5 + Math.cos( theta ) * r;
    var y = Math.sin( theta ) * r;
    nails.push( ( new Nail() ).addToScene( new THREE.Vector3( x , y, 0 ) ) );
  }

  for ( var i = -20; i < 30; i++ ) {    
    var theta = 2 * Math.PI * i / 10;
    var r = 26;
    var x = -5 + Math.cos( theta ) * r;
    var y = Math.sin( theta ) * r;
    nails.push( ( new Nail() ).addToScene( new THREE.Vector3( x , y, 0 ) ) );
  }

  game.nails = nails;
}