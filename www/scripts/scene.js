
var DEBUG = true;

var game = {
  
  quality: 1,
  minions: [],
  DRAG: {
    object: false,
    id: false
  },

  showLoader: function() {

  },

  prepare: function() {
    game.modelLoader.finishCallback = game.init;
    game.modelLoader.totalModels = 1;
    game.modelLoader.load( { name: 'Minion1', model: 'resources/models/minion1.js' } );
  },

  setHandlers: function() {
    
    var mouseMove2D, mouseUp2D, mouseDown2D, minion;

    $('canvas').mousedown( function() {

      var projector = new THREE.Projector();
      mouseDown2D = new THREE.Vector3( 0, 10000, 0.5 );
      mouseDown2D.x = ( event.clientX / window.innerWidth ) * 2 - 1;
      mouseDown2D.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
      ray = projector.pickingRay( mouseDown2D.clone(), game.camera ); 
      var intersect = ray.intersectObjects( game.scene.__objects );
      if (intersect[0].object.oid) {

        game.DRAG.id = intersect[0].object.oid;
        game.DRAG.object = intersect[0].object.mid;

        minion = game.minions.filter(function (el) {
          return el.id === game.DRAG.object;
        })[0];

        game.physics.action( 'stop', minion );
        minion.mesh.__dirtyRotation = true;
        minion.mesh.rotation.y = 0;

      }

      return false;
    });

    $('canvas').mousemove( function( event ) {

      var projector = new THREE.Projector();
      mouseMove2D = new THREE.Vector3( 0, 10000, 0.5 );
      mouseMove2D.x = ( event.clientX / window.innerWidth ) * 2 - 1;
      mouseMove2D.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
      mouseMove2D.z = 1;
      ray = projector.pickingRay( mouseMove2D.clone(), game.camera ); 
      var intersect = ray.intersectObjects( game.scene.__objects );

      if ( intersect.length && intersect[0].object.oid.indexOf('Control') !== -1 ) {
        document.body.style.cursor = 'pointer';
      } else {
        document.body.style.cursor = 'default';
      }

      if (!game.DRAG.object) return;
      switch (game.DRAG.id) {
      case 'bControl':
        if (minion.move) clearInterval( minion.move );
        minion.move = setInterval( function() {
          minion.mesh.__dirtyPosition = true;
          minion.mesh.position.x = ray.origin.x;
          minion.mesh.position.y = ray.origin.y;          
        }, 5 );
        break;
      case 'lhControl':
        minion.handL.update = false;
        minion.handL.control.position.x = ray.origin.x;
        minion.handL.control.position.y = ray.origin.y;
        game.physics.action( 'move', minion );
        break;
      case 'rhControl':
        minion.handR.update = false;
        minion.handR.control.position.x = ray.origin.x;
        minion.handR.control.position.y = ray.origin.y;
        game.physics.action( 'move', minion );
        break;

      }

    });

    $('canvas').mouseup( function( event ) {

      mouseUp2D = new THREE.Vector3( 0, 10000, 0.5 );
      mouseUp2D.x = ( event.clientX / window.innerWidth ) * 2 - 1;
      mouseUp2D.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

      minion.handL.update = true;
      minion.handR.update = true;

      if (game.DRAG.id === 'bControl') {
        clearInterval( minion.move );
        game.physics.action( 'catapult', minion, mouseDown2D.clone().subSelf( mouseUp2D ) );
      } else if (game.DRAG.object && game.DRAG.id.indexOf('Control') !== -1) {
        game.physics.action( 'stop', minion );
      }

      game.DRAG = { object: false, id: false };

    });

  },

  init: function() {

    Physijs.scripts.worker = '/scripts/lib/physijs_worker.js';
    Physijs.scripts.ammo = '/scripts/lib/ammo.js';

    /* create scene */
    game.scene = new Physijs.Scene;
    game.scene.setGravity( new THREE.Vector3( 0, -40, 0 ) );

    /* adding camera */
    game.camera = new THREE.OrthographicCamera( -20, 20, 20 * window.innerHeight / window.innerWidth, -20 * window.innerHeight / window.innerWidth, - 2000, 1000 );
    game.camera.position.set(0, 0, 30);
    game.camera.lookAt(0, 0, 0);
    game.scene.add( game.camera );

    /* add global light */
    game.scene.add( new THREE.AmbientLight(0xcccccc) );
    var sunLight = new THREE.SpotLight(0xFFEDB3, 1);
    sunLight.target.position.set(0, 0, 0);
    sunLight.position.set(800, 600, 800);
    sunLight.shadowBias = 0.0001;
    sunLight.shadowDarkness = 0.3;
    sunLight.shadowMapWidth = 2048;
    sunLight.shadowMapHeight = 2048;
    sunLight.shadowCameraVisible = true;
    sunLight.castShadow = true;
    game.scene.add( sunLight );


    /* add stage */
    game.stage = new Physijs.BoxMesh(new THREE.CubeGeometry(1, 1, 1), Physijs.createMaterial( new THREE.MeshBasicMaterial({color: 0xaaaaaa}), .8, .4 ), 0 );
    game.stage.position.set(0, -9.8, 0);
    game.stage.scale.set( 40, 3, 400 );
    game.scene.add( game.stage );
    game.stage = new Physijs.BoxMesh(new THREE.CubeGeometry(1, 1, 1), Physijs.createMaterial( new THREE.MeshBasicMaterial({color: 0xaaaaaa}), .8, .4 ), 0 );
    game.stage.position.set(-20, 0, 0);
    game.stage.scale.set( 1, 100, 100 );
    game.scene.add( game.stage );
    game.stage = new Physijs.BoxMesh(new THREE.CubeGeometry(1, 1, 1), Physijs.createMaterial( new THREE.MeshBasicMaterial({color: 0xaaaaaa}), .8, .4 ), 0 );
    game.stage.position.set(20, 0, 0);
    game.stage.scale.set( 1, 100, 100 );
    game.scene.add( game.stage );

    /* render stat */
    var container = document.createElement( 'div' );
    document.body.appendChild( container );
    game.stats = new Stats();
    game.stats.domElement.style.position = 'absolute';
    game.stats.domElement.style.top = '0px';
    container.appendChild( game.stats.domElement );

    /* set WebGL rendering */
    game.renderer = new THREE.WebGLRenderer({antialias: true});
    game.renderer.setSize(window.innerWidth * game.quality, window.innerHeight * game.quality);
    game.renderer.domElement.id = 'renderArea';
    game.renderer.domElement.style.width = '100%';
    game.renderer.domElement.style.height = '100%';
    game.renderer.domElement.style.position = 'absolute';
    game.renderer.domElement.style.top = '0px';
    document.body.appendChild( game.renderer.domElement );
    game.renderer.lastFrame = Date.now();

    game.render();

    game.minions.push( new Minion() );

    game.setHandlers();

    if (DEBUG) console.log( 'Scene INITED' );

  }

};