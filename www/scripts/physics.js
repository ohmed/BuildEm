game.physics = ( function () {

  var moveId = null;
  var strechId = null;

  var _visited = [];

  var affectAll = function ( minion ) {
    if ( _visited.indexOf( minion.id ) !== -1 ) return;

    _visited.push( minion.id );
    console.log( 'affected(', minion.id, ')' );

    for ( var i in minion.neigbours ) {
      affectAll( minion.neigbours[ i ] );
    }
  }

  var strech = function ( minion, type ) {
    
    if (game.DRAG.id) return;

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
      minion[ type ].control.position.x += ( minion.mesh.position.x + q - minion[ type ].control.position.x ) * 0.1;
      minion[ type ].control.position.y += ( minion.mesh.position.y - minion[ type ].control.position.y ) * 0.1;

    }, 50 );

  }

  var move = function ( minion, type ) {

    minion.mesh.setDamping( 0.8, 0.8 );

    clearInterval( minion.intervals[ 'move' + type ] );

    minion.intervals[ 'move' + type ] = setInterval( function () {

      var dist = minion[ type ].control.position.distanceTo( minion.mesh.position );
      var forceStrength = dist / 2;
      var axis = minion[ type ].control.position;
      var force = axis.clone().subSelf( minion.mesh.position ).normalize().multiplyScalar( 25 * forceStrength );
      var dist = axis.clone().distanceTo( minion.mesh.position );

      if ( dist > 4 ) {
        minion.mesh.applyCentralImpulse( force );
      } 

    }, 50 ); 

  }

  var stop = function ( minion ) {
    var force = new THREE.Vector3();
    minion.mesh.applyCentralImpulse( force );
    clearInterval( minion.intervals[ 'strechhandL' ] );
    clearInterval( minion.intervals[ 'strechhandR' ] );
    clearInterval( minion.intervals[ 'movehandL' ] );
    clearInterval( minion.intervals[ 'movehandR' ] );
    strech( minion, 'handL' );
    strech( minion, 'handR' );
  }

  var catapult = function ( minion, d ) {
    minion.mesh.setDamping( 0, 0.8 );
    var force = d.clone().normalize().multiplyScalar( 200 ).negate();
    minion.mesh.applyCentralImpulse( force );
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
    }
  }

  return {
    action: action
  };


} () );