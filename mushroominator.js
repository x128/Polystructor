import * as THREE from './lib/three.js/build/three.module.js';
import * as Utils from './utils.js';
import CSG from './lib/three-csgmesh/three-csg.js';
import * as PartsFactory from './PartsFactory.js';
import Colors from './Colors.js';
import { PSElement, PSElementType } from './PSElements.js';

function bake(type, element) {
    switch (type) {
      case PSElementType.Rectangle:
          return bakeRectangle(element);
      case PSElementType.Beam:
          return bakeBeam(element);
      case PSElementType.LBeam:
          return bakeLBeam(element);
          case PSElementType.Room:
              return bakeRoom(element);
      default:
          console.error('[Mushroominator::bake] what?');
    }
}

function bakeRectangle(args) {
    var detail = new THREE.Object3D();
    detail.selectEdge = function(arg) {
        console.log(arg);
    };

    var mushroomBox = createMushroomBox(args);

    var corners = [
        createCorner(args, 0, 'NE'),
        createCorner(args, 1, 'SE'),
        createCorner(args, 2, 'SW'),
        createCorner(args, 3, 'NW')];

    var edges = [
        createEdge(args, 0, 'N'),
        createEdge(args, 1, 'E'),
        createEdge(args, 2, 'S'),
        createEdge(args, 3, 'W')];

    detail.add(mushroomBox);
    for (var i = 0; i < 4; i++) {
        detail.add(corners[i]);
        detail.add(edges[i]);
    }

    detail.selectableObjects = [];
    for (i = 0; i < corners.length; i++) {
      detail.selectableObjects.push(corners[i]);
    }
    detail.selectableObjects.extend(edges);
    detail.castShadow=true;

    return detail;
}

function bakeBeam(args) {
    var detail = new THREE.Object3D();
    var beamBase = createBeamBase(args);
    detail.add(beamBase);
    return detail;
}

function bakeLBeam(args) {
    var detail = new THREE.Object3D();
    var argsCopy = args;
    argsCopy.length = args.length1;
      argsCopy.holeCount = args.holeCount1;
        var beamY = createBeamBase(argsCopy);
        beamY.translateY(args.length1 / 2 - args.width / 2);
    argsCopy.length = args.length2 - args.width / 2;
      argsCopy.holeCount = args.holeCount2;
    var beamX = createBeamBase(argsCopy);
    beamX.rotateZ(Math.PI / 2);
    beamX.translateY(args.length2 / 2 - args.holeWidth);
    detail.add(beamX);
    detail.add(beamY);
    return detail;
}

function bakeRoom(args) {
  var roomGeometry = new THREE.BoxGeometry(args.length, args.width, args.height);
  roomGeometry.translate(0, 0, args.height / 2);
  var wallMaterial = new THREE.MeshStandardMaterial({ color : Colors.sky, side: THREE.BackSide, roughness : 1 });
  var floorMaterial = new THREE.MeshStandardMaterial({ color : Colors.floor, side: THREE.BackSide, roughness : 1 });
  var roomMaterial = [wallMaterial, wallMaterial, wallMaterial, wallMaterial, wallMaterial, floorMaterial ];
  var room = new THREE.Mesh(roomGeometry, roomMaterial);
   room.receiveShadow = true;

    return room;
}

function createMushroomBox(args) {
    var cornerSize = args.cornerSize;
    var thickness = args.depth;
    var halfEdgeLength = args.width / 2 - cornerSize;
    var halfWidth = args.width / 2 - args.chamfer;

    var shape = new THREE.Shape();
    shape.moveTo( halfEdgeLength,  halfWidth);
    shape.lineTo( halfEdgeLength,  halfEdgeLength);
    shape.lineTo( halfWidth,       halfEdgeLength);
    shape.lineTo( halfWidth,      -halfEdgeLength);
    shape.lineTo( halfEdgeLength, -halfEdgeLength);
    shape.lineTo( halfEdgeLength, -halfWidth);
    shape.lineTo(-halfEdgeLength, -halfWidth);
    shape.lineTo(-halfEdgeLength, -halfEdgeLength);
    shape.lineTo(-halfWidth,      -halfEdgeLength);
    shape.lineTo(-halfWidth,       halfEdgeLength);
    shape.lineTo(-halfEdgeLength,  halfEdgeLength);
    shape.lineTo(-halfEdgeLength,  halfWidth);

    var extrudeSettings = { depth: thickness, bevelEnabled: false };
    var geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    var mushroom = new PartsFactory.freeform(geometry, 0xb6afa5, false);

    mushroom.position.z = -thickness / 2;

    return mushroom;
}

function createEdge(args, i, label)
{
    var cornerSize = args.cornerSize;
    var edgeLength = args.width - 2 * cornerSize;
    var thickness = args.depth;
    var chamfer = args.chamfer;

    var shape = new THREE.Shape();
    shape.moveTo(-thickness / 2, -chamfer);
    shape.lineTo(0, 0);
    shape.lineTo(thickness / 2, -chamfer);

    var extrudeSettings = { depth: edgeLength, bevelEnabled: false };
    var geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    var edge = new PartsFactory.freeform(geometry, 0x978F82, true, 0xFF0000, 0xd2cbc0);

    var radius = args.width / 2;
    var angle = i * Math.PI / 2;
    edge.rotateY(Math.PI / 2);
    edge.rotateX(angle);
    edge.position.x = radius * Math.sin(angle) - edgeLength / 2 * Math.cos(angle);
    edge.position.y = radius * Math.cos(angle) + edgeLength / 2 * Math.sin(angle);

    return edge;
}

function createCorner(args, i, label)
{
    var size = args.cornerSize;
    var thickness = args.depth;
    var halfEdgeLength = args.width / 2 - args.cornerSize;
    var halfWidth = args.width / 2;
    var holeOffset = args.holeOffset;
    var holeWidth = args.holeWidth;
    var chamfer = args.chamfer;

    // Corner itself
    var shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.lineTo(0, size);
    shape.lineTo(size, size);
    shape.lineTo(size, 0);

//    var hole = new THREE.Path();
//    hole.moveTo(20, 50);
//    hole.lineTo(50, 20);
//    hole.lineTo(70, 20);
//    hole.lineTo(70, 40);
//    hole.lineTo(40, 70);
//    hole.lineTo(20, 70);
//    shape.holes = [hole];

    var extrudeSettings = { depth: thickness, bevelEnabled: false };
    var geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    var corner = new THREE.Mesh(geometry);
    corner.position.z = -thickness / 2;
    corner.updateMatrix();
    var cornerBSP = CSG.fromMesh(corner);

    var polyzapilivatel = createPolyzapilivatel(thickness, chamfer, size, 10);

    // Pass 1
    polyzapilivatel.rotateY(Math.PI / 2);
    polyzapilivatel.position.y = size;
    polyzapilivatel.updateMatrix();
    var polyzapilivatelBSP = CSG.fromMesh(polyzapilivatel);
    var resultBSP = cornerBSP.subtract(polyzapilivatelBSP);

    // Pass 2
    polyzapilivatel.rotateX(Math.PI / 2);
    polyzapilivatel.position.x = size;
    polyzapilivatel.updateMatrix();
    polyzapilivatelBSP = CSG.fromMesh(polyzapilivatel);
    resultBSP = resultBSP.subtract(polyzapilivatelBSP);

    geometry = CSG.toGeometry(resultBSP);
    corner = new PartsFactory.freeform(geometry, 0x947b5c, true, 0xFF0000, 0xbea689);

    // Rotate & Position
    var angle = i * Math.PI / 2;
    var radius = halfEdgeLength * Math.sqrt(2);
    corner.position.x = radius * Math.sin(angle + Math.PI / 4);
    corner.position.y = radius * Math.cos(angle + Math.PI / 4);
    //corner.position.z = -thickness / 2;
    corner.rotateZ(-angle);

    return corner;
}

function createPolyzapilivatel(thickness, chamfer, length, tolerance) {
    var shape = new THREE.Shape();
    shape.moveTo(-thickness / 2, -chamfer);
    shape.lineTo(0, 0);
    shape.lineTo(thickness / 2, -chamfer);
    shape.lineTo(thickness / 2 + tolerance, -chamfer);
    shape.lineTo(thickness / 2 + tolerance, tolerance);
    shape.lineTo(-thickness / 2 - tolerance, tolerance);
    shape.lineTo(-thickness / 2 - tolerance, -chamfer);

    var extrudeSettings = { depth: length, bevelEnabled: false };
    var geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    var polyzapilivatel = new THREE.Mesh(geometry);

    return polyzapilivatel;
}

function createBeamBase(args) {
  var shape = new THREE.Shape();

  shape.moveTo(args.width / 2, (args.length - args.width) / 2);
  shape.absarc(0, (args.length - args.width) / 2, args.width / 2, 0 * Math.PI, Math.PI, false);
  shape.lineTo(-args.width / 2, -(args.length - args.width) / 2);
  shape.absarc(0, -(args.length - args.width) / 2, -args.width / 2, 2 * Math.PI, Math.PI, false);
  shape.lineTo(args.width / 2, (args.length - args.width) / 2);

  var extrudeSettings = { depth: args.width, bevelEnabled: false };
  var geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
  var beam = new THREE.Mesh(geometry);



  var beamBSP = CSG.fromMesh(beam);
var resultBSP = beamBSP;

  var slot = createSlot(args.holeWidth, args.holeLength + args.holeWidth, 0, args.width);


var x = -args.length / 2 + args.width / 2 + args.holeLength / 2;

var step = 0;
if (args.holeCount > 1) {
  step = args.holeLength + (args.length - args.holeCount * (args.holeLength) - (args.width - args.holeWidth)) / (args.holeCount - 1);
}


for (var i = 0; i < args.holeCount; i++) {

  // Pass 1
  slot.position.x = 0;
  slot.position.y = x;
  slot.position.z = 0;
  var slotBSP = CSG.fromMesh(slot);
  resultBSP = resultBSP.subtract(slotBSP);

  // Pass 2
  slot.rotateY(Math.PI / 2);
  slot.position.x = -args.width / 2;
  slot.position.y = x;
  slot.position.z = args.width / 2;
  var slotBSP = CSG.fromMesh(slot);
  resultBSP = resultBSP.subtract(slotBSP);

slot.rotateY(-Math.PI / 2);

x += step;

}


  geometry = CSG.toGeometry(resultBSP);




  beam = new PartsFactory.freeform(geometry, Colors.beam, false);

  beam.position.z = -args.width / 2;

  return beam;
}

function createSlot(width, length, offset, depth) {
    var shape = new THREE.Shape();

    var cornerSize = width / (1 + Math.SQRT2) / Math.SQRT2;

    shape.moveTo(-width / 2 + cornerSize, length / 2);
    shape.lineTo(width / 2 - cornerSize, length / 2);
    shape.lineTo(width / 2, length / 2 - cornerSize);
    shape.lineTo(width / 2, -length / 2 + cornerSize);
    shape.lineTo(width / 2 - cornerSize, -length / 2);
    shape.lineTo(-width / 2 + cornerSize, -length / 2);
    shape.lineTo(-width / 2, -length / 2 + cornerSize);
    shape.lineTo(-width / 2, length / 2 - cornerSize);
    shape.lineTo(-width / 2 + cornerSize, length / 2);

    var extrudeSettings = { depth: depth, bevelEnabled: false, bevelSegments: 1 };
    var geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    var slot = new THREE.Mesh(geometry);

    return slot;
}

export { bake, PSElementType, PSElement };
