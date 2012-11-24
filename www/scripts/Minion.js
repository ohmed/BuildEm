var Minion = function() {
  
  var self = this;
  self.id = Minion.count++;

  this.handL = {
    control: {},
    verts: [],
    rotation: 0
  };

  this.handR = {
    control: {},
    verts: [],
    rotation: 0
  };

  this.legL = {
    control: {},
    verts: [],
    rotation: 0
  };

  this.legR = {
    control: {},
    verts: [],
    rotation: 0
  };

  this.create = function() {

    /* create minion */

    /* create control LH */

    /* create control RH */

    /* create control LL */

    /* create control RL */


  };

  this.update = function() {

  };

  this.updateControls = function() {

  };

  this.create();

};

Minion.count = 0;