var Utils = require('utils');
var ThreeCSG = require('lib/ThreeCSG/ThreeCSG.js');
var PartsFactory = require('PartsFactory');

const PSElementType = {
    Rectangle : "RECTANGLE",
    Beam : "BEAM"
};

var PSElement = {
    rectangle_540_540 : {
        width : 450,
        depth : 20,
        cornerSize : 112.5,
        chamfer : 22.5,
        holeOffset : 25,
        holeWidth : 10
    },
    beam_7_495 : {
      length : 495,
      width : 45,
      holeCount : 7,
      holeWidth : 8,
      holeLength : 45
    }
};

function bake(type, element) {
    switch (type) {
      case PSElementType.Rectangle:
          return bakeRectangle(element);
      case PSElementType.Beam:
          return bakeBeam(element);
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

    detail.selectableObjects = corners;
    detail.selectableObjects.extend(edges);

    return detail;
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

    detail.selectableObjects = corners;
    detail.selectableObjects.extend(edges);

    return detail;
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

    var extrudeSettings = { amount: thickness, bevelEnabled: false };
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

    var extrudeSettings = { amount: edgeLength, bevelEnabled: false };
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

    var hole = new THREE.Path();
    hole.moveTo(20, 50);
    hole.lineTo(50, 20);
    hole.lineTo(70, 20);
    hole.lineTo(70, 40);
    hole.lineTo(40, 70);
    hole.lineTo(20, 70);
    shape.holes = [hole];

    var extrudeSettings = { amount: thickness, bevelEnabled: false };
    var geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    var corner = new THREE.Mesh(geometry);
    corner.position.z = -thickness / 2;
    var cornerBSP = new ThreeBSP(corner);

    var polyzapilivatel = createPolyzapilivatel(thickness, chamfer, size, 10);

    // Pass 1
    polyzapilivatel.rotateY(Math.PI / 2);
    polyzapilivatel.position.y = size;
    var polyzapilivatelBSP = new ThreeBSP(polyzapilivatel);
    var resultBSP = cornerBSP.subtract(polyzapilivatelBSP);

    // Pass 2
    polyzapilivatel.rotateX(Math.PI / 2);
    polyzapilivatel.position.x = size;
    polyzapilivatelBSP = new ThreeBSP(polyzapilivatel);
    resultBSP = resultBSP.subtract(polyzapilivatelBSP);

    geometry = resultBSP.toGeometry();
    corner = new PartsFactory.freeform(geometry, 0x947b5c, true, 0xFF0000, 0xbea689);

    // Rotate & Position
    var angle = i * Math.PI / 2;
    var radius = halfEdgeLength * Math.sqrt(2);
    corner.position.x = radius * Math.sin(angle + Math.PI / 4);
    corner.position.y = radius * Math.cos(angle + Math.PI / 4);
    corner.position.z = -thickness / 2;
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

    var extrudeSettings = { amount: length, bevelEnabled: false };
    var geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    var polyzapilivatel = new THREE.Mesh(geometry);

    return polyzapilivatel;
}

exports.bake = bake;
exports.PSElementType = PSElementType;
exports.PSElement = PSElement;
