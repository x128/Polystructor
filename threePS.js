//THREE = require('lib/three.js/build/three.min.js');
THREE = require('lib/three.js/build/three.js');
require('lib/three.js/examples/js/controls/OrbitControls.js');
require('utils');

var view = require('view');
view.create(view.ViewOptions.FullScreen | view.ViewOptions.ShowAxes);

var assembler = require('Assembler');

var chair = assembler.create(assembler.Geometry.Chair);
view.addObject(chair, new THREE.Vector3(0, 0, 500));
var chair2 = chair.clone();
var chair3 = chair.clone();
view.addObject(chair2, new THREE.Vector3(1000, 0, 1500));
view.addObject(chair3, new THREE.Vector3(1000, 0, 1500));
chair2.rotateY(-Math.PI / 2);
chair3.rotateY(Math.PI / 2);

var table = assembler.create(assembler.Geometry.Table);
view.addObject(table, new THREE.Vector3(0, 400, 400));

var boyarin = assembler.create(assembler.Geometry.Empty);
// boyarin.geometry...

var material = new THREE.MeshBasicMaterial({
    map : THREE.ImageUtils.loadTexture('images/stairs.jpg')
});
material.map.needsUpdate = true;
var roomBg = new THREE.Mesh(new THREE.PlaneGeometry(1.5*5572, 1.5*3714), material);
roomBg.overdraw = true;
view.addTmpRoomBg(roomBg, new THREE.Vector3(700, 600, -100));

view.startRendering();
