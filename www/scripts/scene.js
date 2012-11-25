
var DEBUG = true;

var game = {
  
  quality: 1,
  minions: [],
  groups: [],
  finish: false,
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
    $('.gears').show();
    $('.startBtn, .warning').hide();
    $('body').css('background','white');
  },

  setHandlers: function() {
    
    var mouseMove2D, mouseUp2D, mouseDown2D, minion;

    $('canvas').mousedown( function( event ) {

      document.oncontextmenu = function() { return false; };

      var projector = new THREE.Projector();
      mouseDown2D = new THREE.Vector3( 0, 10000, 0.5 );
      mouseDown2D.x = ( event.clientX / window.innerWidth ) * 2 - 1;
      mouseDown2D.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

      ray = projector.pickingRay( mouseDown2D.clone(), game.camera ); 
      var intersect = ray.intersectObjects( game.scene.__objects );

      if (intersect[0].object.oid) {

        game.DRAG.id = intersect[0].object.oid;
        game.DRAG.object = intersect[0].object.mid;

        for ( var i in game.minions ) {
          if ( game.minions[ i ].id === game.DRAG.object )
            minion = game.minions[ i ];
        }

        //game.physics.action( 'stop', minion );

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

      minion.mesh.rotation.y = -2 * Math.PI;
      minion.mesh.__dirtyRotation = true;

      switch (game.DRAG.id) {
      case 'bControl':
        if (minion.move) clearInterval( minion.move );
        minion.move = setInterval( function() {
          minion.mesh.__dirtyPosition = true;
          minion.mesh.position = ray.origin.clone();
          minion.mesh.position.z = 0;
        }, 5 );

        clearInterval( minion.intervals[ 'movehandR' ] );
        clearInterval( minion.intervals[ 'movehandL' ] );
        clearInterval( minion.intervals[ 'movelegR' ] );
        clearInterval( minion.intervals[ 'movelegF' ] );
        if ( minion.neighbours.handL.neighbour || minion.handL.nailed ) minion.handL.update = false;
        if ( minion.neighbours.handR.neighbour || minion.handR.nailed ) minion.handR.update = false;
        if ( minion.neighbours.legL.neighbour || minion.legL.nailed ) minion.legL.update = false;
        if ( minion.neighbours.legR.neighbour || minion.legR.nailed ) minion.legR.update = false;
        break;
      case 'handLControl':
        if ( minion.handL.control.position.distanceTo( minion.mesh.position ) > 5 ) {
          minion.mesh.__dirtyPosition = true;
          minion.mesh.position.x += ( minion.handL.control.position.x - minion.mesh.position.x ) * 0.3;
          minion.mesh.position.y += ( minion.handL.control.position.y - minion.mesh.position.y ) * 0.3;
        }
        minion.handL.update = false;
        if (minion.neighbours.handR.neighbour || minion.handR.nailed) minion.handR.update = false; else minion.handR.update = true;
        minion.handL.control.position = ray.origin.clone();
        minion.handL.control.position.z = 0;
        var neighbour, nearestLimb = minion.getNearestLimb( minion.handL.control.position );
        if ( nearestLimb ) {
          neighbour = nearestLimb.parent;
          minion.handL.control.position = nearestLimb.control.position.clone();
          minion.neighbours[ 'handL' ].neighbour = neighbour;
          minion.neighbours[ 'handL' ].name = nearestLimb.name; 
          neighbour.neighbours[ nearestLimb.name ].neighbour = minion;
          neighbour.neighbours[ nearestLimb.name ].name = 'handL'; 
          var nG = Math.min( minion.group, neighbour.group );
          var oG = Math.max( minion.group, neighbour.group );
          for (var k = 0; k<game.groups[oG].length; k++) {
            game.minions[ game.groups[oG][k] ].group = nG;
            game.groups[nG].push( game.groups[oG][k] );
          }
          game.groups[oG].length = 0;
          game.DRAG = { id: false, object: false };
          minion = false;
          return;
        }
        clearInterval( minion.intervals[ 'movehandL' ] );
        game.physics.action( 'move', minion, 'handL' );
        break;
      case 'handRControl':
        if ( minion.handR.control.position.distanceTo( minion.mesh.position ) > 5 ) {
          minion.mesh.__dirtyPosition = true;
          minion.mesh.position.x += ( minion.handR.control.position.x - minion.mesh.position.x ) * 0.3;
          minion.mesh.position.y += ( minion.handR.control.position.y - minion.mesh.position.y ) * 0.3;
        }
        minion.handR.update = false;
        if (minion.neighbours.handL.neighbour || minion.handL.nailed ) minion.handL.update = false; else minion.handL.update = true;
        minion.handR.control.position = ray.origin.clone();
        minion.handR.control.position.z = 0;
        var neighbour, nearestLimb = minion.getNearestLimb( minion.handR.control.position );
        if ( nearestLimb ) {
          neighbour = nearestLimb.parent;
          minion.handR.control.position = nearestLimb.control.position.clone();
          minion.neighbours[ 'handR' ].neighbour = neighbour;
          minion.neighbours[ 'handR' ].name = nearestLimb.name; 
          neighbour.neighbours[ nearestLimb.name ].neighbour = minion;
          neighbour.neighbours[ nearestLimb.name ].name = 'handR';
          var nG = Math.min( minion.group, neighbour.group );
          var oG = Math.max( minion.group, neighbour.group );
          for (var k = 0; k<game.groups[oG].length; k++) {
            game.minions[ game.groups[oG] ].group = nG;
            game.groups[nG].push( game.groups[oG] );
          }
          game.groups[oG].length = 0;
          game.DRAG = { id: false, object: false };
          minion = false;
          return;
        }
        clearInterval( minion.intervals[ 'movehandR' ] );
        game.physics.action( 'move', minion, 'handR' );
        break;
      case 'legLControl':
        if ( minion.legL.control.position.distanceTo( minion.mesh.position ) > 5 ) {
          minion.mesh.__dirtyPosition = true;
          minion.mesh.position.x += ( minion.legL.control.position.x - minion.mesh.position.x ) * 0.3;
          minion.mesh.position.y += ( minion.legL.control.position.y - minion.mesh.position.y ) * 0.3;
        }
        minion.legL.update = false;
        if (minion.neighbours.legR.neighbour || minion.legR.nailed) minion.legR.update = false; else minion.legR.update = true;
        minion.legL.control.position = ray.origin.clone();
        minion.legL.control.position.z = 0;
        var neighbour, nearestLimb = minion.getNearestLimb( minion.legL.control.position );
        if ( nearestLimb ) {
          neighbour = nearestLimb.parent;
          minion.legL.control.position = nearestLimb.control.position.clone();
          minion.neighbours[ 'legL' ].neighbour = neighbour;
          minion.neighbours[ 'legL' ].name = nearestLimb.name; 
          neighbour.neighbours[ nearestLimb.name ].neighbour = minion;
          neighbour.neighbours[ nearestLimb.name ].name = 'legL'; 
          var nG = Math.min( minion.group, neighbour.group );
          var oG = Math.max( minion.group, neighbour.group );
          if (nG !== oG) {
            for (var k = 0; k<game.groups[oG].length; k++) {
              game.minions[ game.groups[oG][k] ].group = nG;
              game.groups[nG].push( game.groups[oG][k] );
            }
            game.groups[oG].length = 0;
          }
          game.DRAG = { id: false, object: false };
          minion = false;
          return;
        }
        game.physics.action( 'move', minion, 'legL' );
        break;
      case 'legRControl':
        if ( minion.legR.control.position.distanceTo( minion.mesh.position ) > 5 ) {
          minion.mesh.__dirtyPosition = true;
          minion.mesh.position.x += ( minion.legR.control.position.x - minion.mesh.position.x ) * 0.3;
          minion.mesh.position.y += ( minion.legR.control.position.y - minion.mesh.position.y ) * 0.3;
        }
        minion.legR.update = false;
        if (minion.neighbours.legL.neighbour || minion.legL.nailed ) minion.legL.update = false; else minion.legL.update = true;
        minion.legR.control.position = ray.origin.clone();
        minion.legR.control.position.z = 0;
        var neighbour, nearestLimb = minion.getNearestLimb( minion.legR.control.position );
        if ( nearestLimb ) {
          neighbour = nearestLimb.parent;
          minion.legR.control.position = nearestLimb.control.position.clone();
          minion.neighbours[ 'legR' ].neighbour = neighbour;
          minion.neighbours[ 'legR' ].name = nearestLimb.name; 
          neighbour.neighbours[ nearestLimb.name ].neighbour = minion;
          neighbour.neighbours[ nearestLimb.name ].name = 'legR';
          var nG = Math.min( minion.group, neighbour.group );
          var oG = Math.max( minion.group, neighbour.group );
          if (nG !== oG) {
            for (var k = 0; k<game.groups[oG].length; k++) {
              game.minions[ game.groups[oG] ].group = nG;
              game.groups[nG].push( game.groups[oG] );
            }
            game.groups[oG].length = 0;
          }
          game.DRAG = { id: false, object: false };
          minion = false;
          return;
        }
        game.physics.action( 'move', minion, 'legR' );
        break;
      }

    });

    $('canvas').mouseup( function( event ) {

      mouseUp2D = new THREE.Vector3( 0, 10000, 0.5 );
      mouseUp2D.x = ( event.clientX / window.innerWidth ) * 2 - 1;
      mouseUp2D.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

      if ( ( game.DRAG.id.replace('Control', '').indexOf('hand') !== -1 || game.DRAG.id.replace('Control', '').indexOf('leg') !== -1 ) && minion.getNearestNail( minion[ game.DRAG.id.replace('Control', '') ].control.position ) ) {
        minion[ game.DRAG.id.replace('Control', '') ].nailed = true;
        game.DRAG = { object: false, id: false };
        minion = false;
      }

      if (game.DRAG.id === 'bControl') {
        clearInterval( minion.move );
        if (minion.neighbours.handL.neighbour || minion.handL.nailed || minion.neighbours.handR.neighbour || minion.handR.nailed || minion.neighbours.legL.neighbour || minion.legL.nailed || minion.neighbours.legR.neighbour || minion.legR.nailed ) {} else game.physics.action( 'catapult', minion, mouseDown2D.clone().subSelf( mouseUp2D ) );
      } else if (game.DRAG.object && game.DRAG.id.indexOf('Control') !== -1) {
        game.DRAG = { object: false, id: false };
        if ( minion.neighbours.handL.neighbour || minion.handL.nailed ) minion.handL.update = false; else {
          game.physics.strech( minion, 'handL' );
        }
        if ( minion.neighbours.handR.neighbour || minion.handR.nailed ) minion.handR.update = false; else {
          game.physics.strech( minion, 'handR' );
        }
        if ( minion.neighbours.legL.neighbour || minion.legL.nailed ) minion.legL.update = false; else {
          game.physics.strech( minion, 'legL' );
        }
        if ( minion.neighbours.legR.neighbour || minion.legR.nailed ) minion.legR.update = false; else {
          game.physics.strech( minion, 'legR' );
        }
      }

      game.DRAG = { object: false, id: false };
      minion = false;

    });

  },

  init: function() {

    Physijs.scripts.worker = '/scripts/lib/physijs_worker.js';
    Physijs.scripts.ammo = '/scripts/lib/ammo.js';

    /* create scene */
    game.scene = new Physijs.Scene;
    game.scene.setGravity( new THREE.Vector3( 0, -60, 0 ) );

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
    game.stage = new Physijs.BoxMesh(new THREE.CubeGeometry(1, 23, 1), Physijs.createMaterial( new THREE.MeshBasicMaterial({color: 0xaaaaaa}), .8, .4 ), 0 );
    game.stage.position.set(0, -20, 0);
    game.stage.scale.set( 40, 1, 400 );
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

    game.setHandlers();

    var m = new Minion();
    game.minions.push( m );
    m.group = 0;
    game.groups[0] = [];
    game.groups[0].push( m.id-1 );

    m = new Minion();
    game.minions.push( m );
    m.group = 1;
    game.groups[1] = [];
    game.groups[1].push( m.id-1 );

    m = new Minion();
    game.minions.push( m );
    m.group = 2;
    game.groups[2] = [];
    game.groups[2].push( m.id-1 );

    m = new Minion();
    game.minions.push( m );
    m.group = 3;
    game.groups[3] = [];
    game.groups[3].push( m.id-1 );

    /*m = new Minion();
    game.minions.push( m );
    m.group = 4;
    game.groups[4] = [];
    game.groups[4].push( m.id-1 );*/


    Nail.build();

    if (DEBUG) console.log( 'Scene INITED' );

  },

  WON: function() {
    game.finish = true;
    alert('YOU WON!');
  }

};