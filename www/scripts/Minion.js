var Minion = function() {
  
  var self = this;
  self.id = Minion.count++;

  this.handL = {
    control: {},
    verts: [],
    rotation: 0
  };

  this.handR = {
    control: {},
    verts: [],
    rotation: 0
  };

  this.legL = {
    control: {},
    verts: [],
    rotation: 0
  };

  this.legR = {
    control: {},
    verts: [],
    rotation: 0
  };

  this.create = function() {

    /* create minion */
    var model = game.modelLoader.get( 'Minion1' );
    self.mesh = new Physijs.ConeMesh( model.geometry, Physijs.createMaterial( new THREE.MeshFaceMaterial(),  .4, .6 ), 5 );
    self.mesh.position.set( 13, 0, 0 );
    self.mesh.scale.set(1, 1, 1);
    self.mesh.oid = 'minion';
    self.mesh.mid = self.id;
    game.scene.add( self.mesh );

    /* create control LH */

    /* create control RH */

    /* create control LL */

    /* create control RL */


  };

  this.update = function() {

  };

  this.updateControls = function() {

  };

  this.create();

};

Minion.count = 0;