//THREE = require('lib/three.js/build/three.min.js');
THREE = require('lib/three.js/build/three.js');
require('lib/three.js/examples/js/controls/OrbitControls.js');
require('utils');

var view = require('view');
view.create(view.ViewOptions.FullScreen | view.ViewOptions.ShowAxes);

var Mushroominator = require('Mushroominator');

var detail = Mushroominator.bake({
    type : Mushroominator.DetailType.Square,
    width : 450,
    depth : 20,
    cornerSize : 112.5,
    chamfer : 22.5,
    holeOffset : 25,
    holeWidth : 10
});
var pos = new THREE.Vector3(0, 0, 0);
view.addDetail(detail, pos /*, orientation */);

// var detail2 = Mushroominator.bake({
//     type : Mushroominator.DetailType.Square,
//     width : 5,
//     depth : 2
// });
// var pos2 = new THREE.Vector3(0, 10, 0);
//view.addDetail(detail2, pos2 /*, orientation */);
// detail2.rotateY(Math.PI / 3);

view.startRendering();
