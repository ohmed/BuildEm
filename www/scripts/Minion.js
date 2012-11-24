var Minion = function () {

  var self = this;
  this.id = Minion.count++;
  this.intervals = {};

  this.body = {
    control: {},
    update: true
  };

  this.handL = {
    control: {},
    update: true,
    verts: [721, 722, 723, 724, 1263, 1264, 1265, 1266, 1267, 1268, 1269, 1270, 1279, 1280, 1281, 1282, 1283, 1284, 1285, 1286, 1287, 1288, 1289, 1290, 1291, 1292, 1293, 1294, 1295, 1296, 1297, 1298, 1299, 1300, 1301, 1302, 1303, 1304, 1305, 1306, 1307, 1308, 1309, 1310, 1311, 1312, 1313, 1314, 1315, 1316, 1317, 1318, 1319, 1320, 1321, 1322, 1323, 1324, 1325, 1326, 1327, 1328, 1329, 1330, 1332, 1336, 1338, 1342, 1344, 1348, 1350, 1354, 1371],
    rotation: -Math.PI / 2,
    parent: this
  };

  this.handR = {
    control: {},
    update: true,
    verts: [48, 49, 50, 51, 538, 539, 540, 541, 542, 543, 544, 545, 554, 555, 556, 557, 558, 559, 560, 561, 562, 563, 564, 565, 566, 567, 568, 569, 570, 571, 572, 573, 574, 575, 576, 577, 578, 579, 580, 581, 582, 583, 584, 585, 586, 587, 588, 589, 590, 591, 592, 593, 594, 595, 596, 597, 598, 599, 600, 601, 602, 603, 604, 605, 607, 611, 613, 617, 619, 623, 625, 629, 645],
    rotation: Math.PI / 2,
    parent: this
  };

  this.legL = {
    control: {},
    update: true,
    verts: [],
    rotation: 0,
    parent: this
  };

  this.legR = {
    control: {},
    update: true,
    verts: [],
    rotation: 0,
    parent: this
  };

  this.create = function () {

    /* create minion */
    var model = game.modelLoader.get('Minion1');
    this.mesh = new Physijs.ConeMesh(model.geometry, Physijs.createMaterial(new THREE.MeshFaceMaterial(), .4, .6), 10);
    this.mesh.position.set(13, 0, 0);
    this.mesh.scale.set(1, 1, 1);
    this.mesh.oid = 'minion';
    this.mesh.mid = this.id;
    game.scene.add(this.mesh);

    /* create control Body */
    this.body.control = new THREE.Mesh(new THREE.CubeGeometry(1.7, 1.8, 2, 1, 1, 1), new THREE.MeshBasicMaterial({
      color: 0xff0000
    }));
    this.body.control.material.opacity = 0;
    this.body.control.material.transparent = true;
    this.body.control.position = this.mesh.position;
    this.body.control.oid = 'bControl';
    this.body.control.mid = this.id;
    game.scene.add(this.body.control);

    /* create control LH */
    var vector = this.mesh.geometry.vertices[1317].clone();
    this.handL._initial = vector.clone();
    this.mesh.matrixWorld.multiplyVector3(vector);
    this.handL.control = new THREE.Mesh(new THREE.CubeGeometry(0.8, 0.8, 5, 1, 1, 1), new THREE.MeshBasicMaterial({
      color: 0xff0000
    }));
    this.handL.control.material.opacity = 0;
    this.handL.control.material.transparent = true;
    this.handL.control.position = vector;
    this.handL.control.oid = 'handLControl';
    this.handL.control.mid = this.id;
    game.scene.add(this.handL.control);

    /* create control RH */
    vector = this.mesh.geometry.vertices[this.handR.verts[0]].clone();
    this.mesh.matrixWorld.multiplyVector3(vector);
    this.handR.control = new THREE.Mesh(new THREE.CubeGeometry(0.8, 0.8, 5, 1, 1, 1), new THREE.MeshBasicMaterial({
      color: 0xff0000
    }));
    this.handR.control.material.opacity = 0;
    this.handR.control.material.transparent = true;
    this.handR.control.position = vector;
    this.handR.control.oid = 'handRControl';
    this.handR.control.mid = this.id;
    game.scene.add(this.handR.control);

    /* create control LL */

    /* create control RL */


  };

  this.update = function (param) {

    function updateHand(mesh, hand) {
      var g, m, v, handVector;

      /* move hand parts */

      var handVector = mesh.geometry.vertices[hand.verts[0]].clone();
      mesh.matrixWorld.multiplyVector3(handVector);

      g = new THREE.Geometry();
      for (var j = 0; j < hand.verts.length; j++) {
        v = mesh.geometry.vertices[hand.verts[j]].clone();
        mesh.matrixWorld.multiplyVector3(v);
        v.x -= handVector.x;
        v.y -= handVector.y;
        g.vertices.push(v);
      }
      var teta = Math.atan((hand.control.position.x - mesh.position.x) / (hand.control.position.y - mesh.position.y));
      var alpha = hand.rotation - teta;
      hand.rotation = teta;
      if (hand.control.position.y - mesh.position.y < 0) {
        alpha -= Math.PI;
        hand.rotation -= Math.PI;
      }
      g.applyMatrix(new THREE.Matrix4().makeRotationZ(alpha));
      g.applyMatrix(new THREE.Matrix4().makeTranslation(hand.control.position.x - mesh.position.x, hand.control.position.y - mesh.position.y, 0));
      for (var j = 0; j < hand.verts.length; j++) {
        v = g.vertices[j].clone();
        mesh.geometry.vertices[hand.verts[j]] = v;
      }

      mesh.geometry.verticesNeedUpdate = true;
    }

    function updateLeg(param) {

    }

    updateHand(this.mesh, this[param]);

  };

  this.updateControls = function (param) {


    if (this.handR.update) {
      var v = this.mesh.geometry.vertices[this.handR.verts[0]].clone();
      this.mesh.matrixWorld.multiplyVector3(v);
      v.z = 0;
      this.handR.control.position = v;
    }

    if (this.handL.update) {
      var v = this.mesh.geometry.vertices[this.handL.verts[0]].clone();
      this.mesh.matrixWorld.multiplyVector3(v);
      v.z = 0;
      this.handL.control.position = v;
    }

    this.body.control.position = this.mesh.position;

  };

  this.create();

  this.getNearestLimb = function (v) {
    var ar = game.minions;
    for (var i in ar) {
      var minion = ar[i];
      if (minion.id === this.id) continue;
      if (v.distanceTo(minion.handL.control.position) < 1) {
        return minion.handL;
      }
      if (v.distanceTo(minion.handR.control.position) < 1) {
        return minion.handR;
      }
    }
    return false;
  }

};

Minion.count = 1;