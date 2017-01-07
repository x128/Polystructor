//THREE = require('lib/three.js/build/three.min.js');
THREE = require('lib/three.js/build/three.js');
require('lib/three.js/examples/js/controls/OrbitControls.js');
require('utils');

var view = require('view');
view.create(view.ViewOptions.FullScreen | view.ViewOptions.ShowAxes);

var assembler = require('Assembler');

var chair = assembler.create(assembler.Geometry.Chair);
view.addObject(chair, new THREE.Vector3());

view.startRendering();
