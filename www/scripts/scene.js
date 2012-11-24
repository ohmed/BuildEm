
var DEBUG = true;

var game = {
  
  quality: 1,
  minions: [],

  showLoader: function() {

  },

  prepare: function() {
    game.modelLoader.finishCallback = game.init;
    game.modelLoader.totalModels = 1;
    game.modelLoader.load( { name: 'Minion1', model: 'resources/models/minion1.js' } );
  },

  setHandlers: function() {

  },

  init: function() {

    Physijs.scripts.worker = '/scripts/lib/physijs_worker.js';
    Physijs.scripts.ammo = '/scripts/lib/ammo.js';

    /* create scene */
    game.scene = new Physijs.Scene;
    game.scene.setGravity( new THREE.Vector3( 0, -30, 0 ) );

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
    document.body.appendChild( game.renderer.domElement );
    game.renderer.lastFrame = Date.now();

    game.render();

    game.minions.push( new Minion() );

    if (DEBUG) console.log( 'Scene INITED' );

  }

};