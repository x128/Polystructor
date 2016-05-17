//THREE = require('lib/three.js/build/three.min.js');
THREE = require('lib/three.js/build/three.js');
require('lib/three.js/examples/js/controls/OrbitControls.js');
require('lib/three.js/examples/js/modifiers/SubdivisionModifier.js');
require('utils');
THREEx = require('lib/threex.js');
console.log(THREEx);

var View = require('view');
var view = View.create(View.ViewOptions.FullScreen | View.ViewOptions.ShowAxes);

var mushroominator = require('mushroominator');

var detail = mushroominator.bake({
    type : mushroominator.DetailType.Square,
    width : 10,
    depth : 0.5,
    view : view
});
var pos = new THREE.Vector3(0, 0, 0);
View.addDetail(detail, pos /*, orientation */);

var detail2 = mushroominator.bake({
    type : mushroominator.DetailType.Square,
    width : 5,
    depth : 2,
    view : view
});
var pos2 = new THREE.Vector3(0, 10, 0);
View.addDetail(detail2, pos2 /*, orientation */);
detail2.rotateY(Math.PI / 3);
// TODO: on 1st hover the detail looks up its view?

View.startRendering();
