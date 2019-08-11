//THREE = require('lib/three.js/build/three.min.js');
THREE = require('lib/three.js/build/three.js');
require('lib/three.js/examples/js/controls/OrbitControls.js');
require('utils');
require('Parser');

var view = require('View');
view.create(view.ViewOptions.FullScreen | view.ViewOptions.ShowAxes);

var assembler = require('Assembler');
var parser = require('Parser');

var room = assembler.create(assembler.Geometry.Room);
view.addObject(room, new THREE.Vector3());

var test = assembler.create(assembler.Geometry.Testing);
view.addObject(test, new THREE.Vector3());

var imported = parser.parse('xml/pyatrovich.xml');
var importedGeometry = assembler.create(imported);
view.addObject(importedGeometry, new THREE.Vector3());

view.startRendering();
