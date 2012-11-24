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

  var strech = function ( minion ) {
    
    if (game.DRAG.id) return;

    clearInterval( strechId );

    strechId = setInterval( function () {

      if ( minion.handL.control.position.distanceTo( minion.mesh.position ) < 2 ) {
        clearInterval( strechId );
        minion.handL.update = true;
        return;
      }
      minion.handL.control.position.x += ( minion.mesh.position.x - 2 - minion.handL.control.position.x ) * 0.1;
      minion.handL.control.position.y += ( minion.mesh.position.y - minion.handL.control.position.y ) * 0.1;

    }, 50 );

  }

  var move = function ( minion ) {

    minion.mesh.setDamping( 0.8, 0.8 );

    clearInterval( moveId );

    moveId = setInterval( function () {

      var dist = minion.handL.control.position.distanceTo( minion.mesh.position );
      var forceStrength = dist / 10;
      var axis = minion.handL.control.position;
      var force = axis.clone().subSelf( minion.mesh.position ).normalize().multiplyScalar( 25 * forceStrength );
      var dist = axis.clone().distanceTo( minion.mesh.position );

      if ( dist > 8 ) {
        minion.mesh.applyCentralImpulse( force );
      } 

    }, 50 ); 

  }

  var stop = function ( minion ) {
    var force = new THREE.Vector3();
    minion.mesh.applyCentralImpulse( force );
    clearInterval( moveId );
    strech( minion );
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