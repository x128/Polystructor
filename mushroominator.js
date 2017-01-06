var Utils = require('utils');
var ThreeCSG = require('lib/ThreeCSG/ThreeCSG.js');

var DetailType = {
    Square : 'square'
};

function bake(args)
{
    switch (args.type)
    {
        case DetailType.Square:
            return bakeSquare(args);
        default:
            console.error('[mushroominator::bake] unknown detail requested');
    }
}

function bakeSquare(args)
{
    var width = args.width;
    var depth = args.depth;

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
    for (var i = 0; i < 4; i++)
    {
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
    shape.moveTo( halfEdgeLength,  halfEdgeLength);
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
    var material = new THREE.MeshBasicMaterial( {color: 0xb6afa5 } );
    var mushroom = new THREE.Mesh( geometry, material );

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
    var material = new THREE.MeshBasicMaterial( {color: 0x978F82 } );
    var edge = new THREE.Mesh( geometry, material );

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
    var material = new THREE.MeshLambertMaterial( {color: 0x947b5c } );
    var corner = new THREE.Mesh( geometry, material );
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

    corner = resultBSP.toMesh();
    corner.geometry.computeVertexNormals();

    // Rotate & Position
    var angle = Math.PI * (0.5 * i);
    var radius = halfEdgeLength * Math.sqrt(2);
    corner.position.x = radius * Math.sin(angle + Math.PI / 4);
    corner.position.y = radius * Math.cos(angle + Math.PI / 4);
    corner.rotateZ(-angle);
    return corner;
}

function createPolyzapilivatel(thickness, chamfer, length, tolerance)
{
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
    var material = new THREE.MeshBasicMaterial( {color: 0xFF0000 } );
    var polyzapilivatel = new THREE.Mesh(geometry, material);

    return polyzapilivatel;
}

// FIXME: we definitely need some better polymorphism here
//Box.prototype = new THREE.Mesh();
//Box.prototype.constructor = Box;
function Box(width, height, depth, color, selectable, selectionColor, highlightColor)
{
    var geometry = new THREE.BoxGeometry(width, height, depth);
    var material = new THREE.MeshLambertMaterial({ color : color });
    var box = new THREE.Mesh(geometry, material);

    box.selectable = selectable;
    if (selectable)
    {
        box.selected = false;
        box.originalMaterial = material;
        box.selectionMaterial = new THREE.MeshLambertMaterial({ color : selectionColor });

        if (!highlightColor)
            highlightColor = Utils.averageColor(color, selectionColor);
        box.highlightMaterial = new THREE.MeshLambertMaterial({ color : highlightColor });

        box.select = function() {
            this.material = this.selectionMaterial;
            this.selected = true;
        };
        box.deselect = function() {
            this.material = this.originalMaterial;
            this.selected = false;
        };

        box.highlight = function() {
            this.material = this.selected ? this.selectionMaterial : this.highlightMaterial;
            this.highlighted = true;
        };
        box.fadetoblack = function() {
            this.material = this.selected ? this.selectionMaterial : this.originalMaterial;
            this.highlighted = false;
        };
    }

    box.castShadow = true;
    //box.receiveShadow = true; TODO

    return box;
}

exports.bake = bake;
exports.DetailType = DetailType;