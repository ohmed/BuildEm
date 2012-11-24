game.modelLoader = {

  totalModels: 0,
  loadedModels: 0,
  
  textures: [],
  objects: [],
  
  load: function( params ) {

    var modelLoader = this;
    var loader = new THREE.JSONLoader();

    var callback = function( geometry ) {
      
      geometry.materials[0].shading = THREE.SmoothShading;
      
      var object = {};
      object.material = geometry.materials[0];
      object.geometry = geometry;
      object.name = params.name;
      
      modelLoader.objects.push( object );
      modelLoader.loadedModels++;

      if (DEBUG) console.log( 'Model [' + params.name + '] loaded.' );

      if (modelLoader.totalModels === modelLoader.loadedModels)
        modelLoader.finishCallback();
      
    }
      
    loader.load( params.model, callback );

  },
  
  loadTexture: function( params ) {
    var texture = THREE.ImageUtils.loadTexture( params.url );
    texture.name = params.name;
    this.textures.push( texture );
  },

  get: function( name ) {

    function cloneGeometry(obj) {
      var copy = new THREE.Geometry();
      for (var attr in obj) {
        if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
      }

      var materials = [];
      for (var i = 0; i<obj.materials.length; i++) {
        materials[i] = obj.materials[i].clone();
      }

      copy.materials = materials;

      return copy;
    }

    for ( var i = 0; i<this.objects.length; i++ ) {
      if ( this.objects[i].name === name ) {
        this.objects[i].geometry = cloneGeometry( this.objects[i].geometry );
        return this.objects[i];
      }
    }
    
    return false;
  },

  getTexture: function( name ) {
    for (var i = 0; i<this.textures.length; i++) {
      if (this.textures[i].name === name)
        return this.textures[i];
    }
    
    return false;
  }

};