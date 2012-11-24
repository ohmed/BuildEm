var Minion = function() {
  
  var self = this;
  self.id = Minion.count++;

  this.body = {
    control: {},
    update: true
  };

  this.handL = {
    control: {},
    update: true,
    verts: [721,722,723,724,1263,1264,1265,1266,1267,1268,1269,1270,1279,1280,1281,1282,1283,1284,1285,1286,1287,1288,1289,1290,1291,1292,1293,1294,1295,1296,1297,1298,1299,1300,1301,1302,1303,1304,1305,1306,1307,1308,1309,1310,1311,1312,1313,1314,1315,1316,1317,1318,1319,1320,1321,1322,1323,1324,1325,1326,1327,1328,1329,1330,1332,1336,1338,1342,1344,1348,1350,1354,1371],
    rotation: - Math.PI/2
  };

  this.handR = {
    control: {},
    update: true,
    verts: [],
    rotation: 0
  };

  this.legL = {
    control: {},
    update: true,
    verts: [],
    rotation: 0
  };

  this.legR = {
    control: {},
    update: true,
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

    var mesh = self.mesh;

    /* create control Body */
    self.body.control = new THREE.Mesh(new THREE.CubeGeometry(1.7, 1.8, 2, 1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}) );
    self.body.control.material.opacity = 0.5;
    self.body.control.material.transparent = true;
    self.body.control.position = mesh.position;
    self.body.control.oid = 'bControl';
    self.body.control.mid = self.id;
    game.scene.add( self.body.control );

    /* create control LH */
    setTimeout( function() {
      var vector = mesh.geometry.vertices[1317].clone();
      self.handL._initial = vector.clone();
      mesh.matrixWorld.multiplyVector3( vector );
      self.handL.control = new THREE.Mesh(new THREE.CubeGeometry(0.8, 0.8, 5, 1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}) );
      self.handL.control.material.opacity = 0.5;
      self.handL.control.material.transparent = true;
      self.handL.control.position = vector;
      self.handL.control.oid = 'lhControl';
      self.handL.control.mid = self.id;
      game.scene.add( self.handL.control );
    }, 100);

    /* create control RH */

    /* create control LL */

    /* create control RL */


  };

  this.update = function() {

    var mesh = self.mesh;

    function updateGand( hand ) {
      var g, m, v, handVector;

      /* move hand parts */

      var handVector = mesh.geometry.vertices[ hand.verts[0] ].clone();
      mesh.matrixWorld.multiplyVector3( handVector );

      g = new THREE.Geometry();
      for (var j = 0; j<hand.verts.length; j++) {
        v = mesh.geometry.vertices[ hand.verts[j] ].clone();
        mesh.matrixWorld.multiplyVector3( v );
        v.x -= handVector.x;
        v.y -= handVector.y;
        g.vertices.push( v );
      }
      var teta = Math.atan( (hand.control.position.x - mesh.position.x) / (hand.control.position.y - mesh.position.y) );
      var alpha = hand.rotation - teta;
      hand.rotation = teta;
      if (hand.control.position.y - mesh.position.y < 0) {
        alpha -= Math.PI;
        hand.rotation -= Math.PI;
      }
      g.applyMatrix( new THREE.Matrix4().makeRotationZ( alpha ) );
      g.applyMatrix( new THREE.Matrix4().makeTranslation( hand.control.position.x - mesh.position.x, hand.control.position.y - mesh.position.y, 0 ) );
      for (var j = 0; j<hand.verts.length; j++) {
        v = g.vertices[j].clone();
        v.z = mesh.position.z;
        mesh.geometry.vertices[ hand.verts[j] ] = v;
      }

      mesh.geometry.verticesNeedUpdate = true;
    }

    function updateLeg( param ) {

    }

    updateGand( self.handL );

  };

  this.updateControls = function( param ) {

    var mesh = self.mesh;

    /*if (param === 'handL' || param === 'mouseup') {
      self.update();
      if (param === 'handL') self.DetectMagnet(callback);
    }*/

    if (self.handL.update) {
      var v = mesh.geometry.vertices[ self.handL.verts[0] ].clone();
      mesh.matrixWorld.multiplyVector3( v );
      self.handL.control.position = v;
    }

    self.body.control.position = mesh.position;

  };

  this.create();

};

Minion.count = 1;