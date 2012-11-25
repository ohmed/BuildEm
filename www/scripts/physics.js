var _visited = [];

game.physics = ( function () {

  var moveId = null;
  var strechId = null;

  var affectAll = function ( minion, groupElementCount ) {

    if ( !game.minions.length ) return;

    minion = minion || game.minions[ 0 ];

    if ( _visited.indexOf( minion.id ) !== -1 ) {
      if ( _visited.length === groupElementCount ) {
        _visited.length = 0;
        return;
      } else {
        return;
      }
    }

    for ( var i in minion.neighbours ) {

      if (!minion.neighbours[ i ].neighbour) continue;

      var neighbour = minion.neighbours[ i ].neighbour;
      var type = minion.neighbours[ i ].name;

      minion[ i ].update = false;
      neighbour[type].update = false;
      var newPos = new THREE.Vector3(
        neighbour.mesh.position.x - (neighbour.mesh.position.x - minion.mesh.position.x) / 2,
        neighbour.mesh.position.y - (neighbour.mesh.position.y - minion.mesh.position.y) / 2,
        0
      );

      minion[ i ].control.position = newPos.clone();
      neighbour[type].control.position = newPos.clone();
      
      minion.mesh.applyImpulse( minion.mesh.position.clone().subSelf( neighbour[type].control.position ).negate().normalize().multiplyScalar( 5 ), minion.mesh.position.clone().subSelf( neighbour[type].control.position ) );

      _visited.push( minion.id );
      affectAll( neighbour, groupElementCount );

    }

  }

  var strech = function ( minion, type ) {
    
    //if (game.DRAG.id) return;

    clearInterval( minion.intervals[ 'strech' + type ] );

    minion.intervals[ 'strech' + type ] = setInterval( function () {

      if ( minion[ type ].control.position.distanceTo( minion.mesh.position ) < 2 ) {
        clearInterval( minion.intervals[ 'strech' + type ] );
        minion[ type ].update = true;
        return;
      }
      var q;
      if ( type === 'handL') q = -2;
      if ( type === 'handR') q = 2;
      if ( type === 'legL') q = -2;
      if ( type === 'legR') q = 2;
      minion[ type ].control.position.x += ( minion.mesh.position.x + q - minion[ type ].control.position.x ) * 0.1;
      minion[ type ].control.position.y += ( minion.mesh.position.y - minion[ type ].control.position.y ) * 0.1;

    }, 50 );

  }

  var move = function ( minion, type ) {

    minion.mesh.setDamping( 0.8, 0.8 );

    clearInterval( minion.intervals[ 'move' + type ] );

    minion.intervals[ 'move' + type ] = setInterval( function () {

      var dist = minion[ type ].control.position.distanceTo( minion.mesh.position );
      var forceStrength = dist / 5;
      var axis = minion[ type ].control.position;
      var force = axis.clone().subSelf( minion.mesh.position ).normalize().multiplyScalar( 25 * forceStrength );
      var dist = axis.clone().distanceTo( minion.mesh.position );

      if ( dist > 3 ) {
        minion.mesh.applyCentralImpulse( force );
      } 

    }, 20 ); 

  }

  var stop = function ( minion ) {
    var force = new THREE.Vector3();
    minion.mesh.applyCentralImpulse( force );
    clearInterval( minion.intervals[ 'strechhandL' ] );
    clearInterval( minion.intervals[ 'strechhandR' ] );
    clearInterval( minion.intervals[ 'strechlegL' ] );
    clearInterval( minion.intervals[ 'strechlegR' ] );
    clearInterval( minion.intervals[ 'movehandL' ] );
    clearInterval( minion.intervals[ 'movehandR' ] );
    clearInterval( minion.intervals[ 'movelegL' ] );
    clearInterval( minion.intervals[ 'movelegR' ] );
    strech( minion, 'handL' );
    strech( minion, 'handR' );
    strech( minion, 'legL' );
    strech( minion, 'legR' );
  }

  var catapult = function ( minion, d ) {
    minion.mesh.setDamping( 0, 0.8 );
    var force = d.clone().normalize().multiplyScalar( 200 ).negate();
    minion.mesh.applyCentralImpulse( force );
  }

  var run = function ( minion ) {    
    minion.mesh.setDamping( 0.3, 0.8 );      
    var end = new THREE.Vector3( -35, 35, 0 );
    var angle = Math.atan2( minion.mesh.position.z, minion.mesh.position.y - end.y ) - Math.PI / 2;
    minion.mesh.rotation.y = angle;
    minion.mesh.rotation.x = 0;
    minion.mesh.__dirtyRotation = true;
    var id_ = setInterval(function () {
      minion.mesh.applyCentralImpulse( end.clone().subSelf( minion.mesh.position ).normalize().multiplyScalar( 30 ) );
      if ( minion.mesh.position.x < -10 ) {
        clearInterval( id_ );
        stop( game.minions[ i ] );
      }
    }, 50);      
  }

  var banana = function () {
    /* create minion */
    var model = game.modelLoader.get('Minion2');
    var mesh = new THREE.Mesh(model.geometry, new THREE.MeshFaceMaterial());
    mesh.position.x = -20;
    mesh.position.y = -7;
    mesh.scale.set(1, 1, 1);
    game.scene.add(mesh);
  }

  var action = function ( activity ) {
    switch( activity ) {
      case 'move':
        move.apply( null, Array.prototype.slice.call( arguments, 1 ) );
        break; 
      case 'strech':
        strech.apply( null, Array.prototype.slice.call( arguments, 1 ) );
        break;
      case 'affectAll':
        affectAll.apply( null, Array.prototype.slice.call( arguments, 1 ) );
        break;
      case 'catapult':
        catapult.apply( null, Array.prototype.slice.call( arguments, 1 ) );
        break;
      case 'stop':
        stop.apply( null, Array.prototype.slice.call( arguments, 1 ) );
        break;
      case 'stopAll':
        for ( var i in game.minions ) {          
          // game.minions[i].mesh.setAngularVelocity( { x: 1, y: 1, z: 1 } );
          // game.minions[i].mesh.setAngularFactor( { x: 1, y: 1, z: 1 } );
          // game.minions[ i ].mesh.position.z += Math.random() * 4 - 1;
          // game.minions[ i ].mesh.__dirtyPosition = true;
          run( game.minions[ i ] );
        }
        break;
      case 'banana':
        banana();
        break;
    }
  }

  return {
    action: action,
    affectAll: affectAll,
    strech: strech
  };


} () );