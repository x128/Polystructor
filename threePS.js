//THREE = require('lib/three.js/build/three.min.js');
THREE = require('lib/three.js/build/three.js');
require('lib/three.js/examples/js/controls/OrbitControls.js');
require('utils');

var view = require('view');
view.create(view.ViewOptions.FullScreen | view.ViewOptions.ShowAxes);

var mushroominator = require('mushroominator');
var detail = mushroominator.bake([]);

console.log(mushroominator);
console.log(detail);

var pos = new THREE.Vector3(0, 0, 0);
view.addDetail(detail, pos /*, orientation */);

view.startRendering();

//var detail = new Detail(args);
//var detail = Mushroominator.createDetail(args);
//view.add(detail);
