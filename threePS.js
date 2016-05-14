//THREE = require('lib/three.js/build/three.min.js');
THREE = require('lib/three.js/build/three.js');
require('lib/three.js/examples/js/controls/OrbitControls.js');
require('utils');

var view = require('view');
view.create(view.ViewOptions.FullScreen | view.ViewOptions.ShowAxes);

var mushroominator = require('mushroominator');

var detail = mushroominator.bake([]);
var pos = new THREE.Vector3(0, 0, 0);
view.addDetail(detail, pos /*, orientation */);

var detail2 = mushroominator.bake([]);
var pos2 = new THREE.Vector3(0, 10, 0);
view.addDetail(detail2, pos2 /*, orientation */);

console.log(detail);
console.log(detail2);

view.startRendering();
