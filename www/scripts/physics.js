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
    clearInterval( strechId );

    var k = 1.2;
  
    strechId = setInterval( function () {

      var f = minion.handL.control.position.clone().subSelf( minion.mesh.position ).multiplyScalar( -k );

      if ( f.isZero() )
        clearInterval( strechId );

      var v = minion.mesh.position.clone().subSelf( f.clone().multiplyScalar( 1 / k ) );
      v.multiplyScalar( 1 / 40 );

      minion.handL.control.position.addSelf( v );

    }, 50 );    

  }

  var move = function ( minion ) {

    minion.mesh.setDamping( 0.8, 0.8 );

    clearInterval( moveId );

    var prevC = minion.mesh.position.clone();

    moveId = setInterval( function () {

      var axis = minion.handL.control.position;
      var force = axis.clone().subSelf( minion.mesh.position ).normalize().multiplyScalar( 25 );
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
  }

  var catapult = function ( minion, d ) {
    minion.mesh.setDamping( 0.1, 0.8 );
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