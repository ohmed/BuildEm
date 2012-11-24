game.physics = ( function () {

  var moveId = null;
  var strechId = null;

  var strech = function ( minion ) {
    if ( strechId !== null ) clearInterval( strechId );

    var k = 1.2;
  
    strechId = setInterval( function () {

      var f = minion.handL.control.position.clone().subSelf( minion.mesh.position ).multiplyScalar( -k );

      if ( f.isZero() )
        clearInterval( strechId );

      var v = minion.mesh.position.clone().subSelf( f.clone().multiplyScalar( 1 / k ) );
      v.multiplyScalar( 1 / 40 );

      minion.handL.control.position.addSelf( v );
      minion.update();

    }, 50 );    

  }

  var move = function ( minion ) {
    if ( moveId !== null ) clearInterval( moveId );

    moveId = setInterval( function () {

      var axis = minion.handL.control.position;
      var force = axis.clone().subSelf( minion.mesh.position ).normalize().multiplyScalar( 25 );
      var offset = axis.clone().subSelf( minion.mesh.position );
      var dist = axis.clone().distanceTo( minion.mesh.position );

      minion.update();

      if ( dist > 8 ) 
        minion.mesh.applyCentralImpulse( force, offset );

    }, 50 ); 

  }

  var action = function ( activity ) {
    switch( activity ) {
      case 'move':
        move.apply( null, Array.prototype.slice.call( arguments, 1 ) );
        break; 
      case 'strech':
        strech.apply( null, Array.prototype.slice.call( arguments, 1 ) );
        break;
    }
  }

  return {
    action: action
  };


} () );