//THREE = require('lib/three.js/build/three.min.js');
THREE = require('lib/three.js/build/three.js');
require('lib/three.js/examples/js/controls/OrbitControls.js');
require('utils');

var highlightHelper = require('highlight');

var view = require('view');
view.create(view.ViewOptions.FullScreen | view.ViewOptions.ShowAxes, highlightHelper);

var mushroominator = require('mushroominator');
mushroominator.setHighlightHelper(highlightHelper);

var color = {
    main : 0xFF0000,
    corner : 0xAA0000,
    selection : 0xFFE299
};

var detail = mushroominator.bake({
    type : mushroominator.DetailType.Square,
    width : 10,
    depth : 0.5,
    color : color
});
var pos = new THREE.Vector3(0, 0, 0);
view.addDetail(detail, pos /*, orientation */);

var detail2 = mushroominator.bake({
    type : mushroominator.DetailType.Square,
    width : 5,
    depth : 2,
    color : color
});
var pos2 = new THREE.Vector3(0, 10, 0);
view.addDetail(detail2, pos2 /*, orientation */);
detail2.rotateY(Math.PI / 3);

view.startRendering();
