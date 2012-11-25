function init () {

  if (typeof webkitAudioContext !== "function") {
    $('.startBtn').html('РїРѕРєРё Р»РёС€Рµ Сѓ С…СЂРѕРјС– :(');
    $('.startBtn').css( { 'width': '220px', 'left': '10px' } );
  } else {
    $('.startBtn').click( game.prepare );
  }

  function active() {
    $('.startBtn').animate( { 'boxShadowBlur': '20px' }, 700, disactive);
  }

  function disactive() {
    $('.startBtn').animate( { 'boxShadowBlur': '50px' }, 700, active);
  }

  disactive(); 

}

$(document).ready( init );