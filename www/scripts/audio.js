( function() {

  var namespace = 'audio';

  var fx = {};

  fx['banana'] = new Audio('resources/banana.ogg');

  function _play( name, volume ) {
    volume = volume || 1;
    if ( !name || !fx[ name ] ) return;    
    fx[ name ].volume = volume;
    fx[ name ].play();
  }

  function _pause( name ) {
    if ( !name || !fx[ name ] ) return;

    fx[ name ].pause();
  }
  var audio = {
    fx: fx,
    play: _play,
    pause: _pause
  }
  
  window[ namespace ] = audio;
} () )