import * as THREE from './lib/three.js/build/three.module.js';
import * as view from './view.js';
import * as assembler from './Assembler.js';
import * as parser from './Parser.js';

const scene = new THREE.Scene();

view.create(view.ViewOptions.FullScreen | view.ViewOptions.ShowAxes);

var room = assembler.create(assembler.Geometry.Room);
view.addObject(room, new THREE.Vector3());

var test = assembler.create(assembler.Geometry.Testing);
view.addObject(test, new THREE.Vector3());

var imported = parser.parse('xml/pyatrovich.xml');
var importedGeometry = assembler.create(imported);
view.addObject(importedGeometry, new THREE.Vector3());

view.startRendering();
