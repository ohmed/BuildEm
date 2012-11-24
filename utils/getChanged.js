
fs = require('fs');

var frameStart = 0;
var frameEnd = 1;
var fileName = 'minion1.js';
var destFile = fileName + '.changedVert.js'

function process( v1, v2 ) {
  if (v1.length !== v2.length) {
    console.log( 'something is invalid [0]');
    return;
  }
  var changedV = [];
  for (var i = 0; i<v1.length; i+=3) {
    if (v1[i] !== v2[i] || v1[i + 1] !== v2[i + 1] || v1[i + 2] !== v2[i + 2]) {
      changedV.push( i/3 );
    }
  }
  console.log( changedV.length + ' vertices vere changed.' );
  save( changedV );
}

function save( data ) {
  fs.writeFile( destFile, JSON.stringify( data ), function (err) {
    if (err) throw err;
      console.log('Finished & saved!');
  });
}

fs.readFile( fileName, 'ascii', function (err, data) {

  if (err) throw err;

  data = JSON.parse( data );

  process( data.morphTargets[ frameStart ].vertices, data.morphTargets[ frameEnd ].vertices );

});