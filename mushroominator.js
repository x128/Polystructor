var Utils = require('utils');

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

    var mushroomBox = new Box(width, width, depth, 0xb6afa5, false);
    mushroomBox.position.x = 0;
    mushroomBox.position.y = 0;
    mushroomBox.position.z = 0;

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

function createEdge(args, i, label)
{
    var edgeLength = args.width;
    var edgeWidth = 0.1 * args.width;
    var edgeDepth = 1.1 * args.depth;

    var box = new Box(edgeDepth, edgeWidth, edgeLength, 0x00FF00, true, 0xFFFFFF);

    var radius = (args.width - edgeWidth) / 2 * 1.01;
    var angle = i * Math.PI / 2;
    box.position.x = radius * Math.sin(angle);
    box.position.y = radius * Math.cos(angle);
    box.rotateY(Math.PI / 2);
    box.rotateX(angle);

    return box;
}

function createCorner(args, i, label)
{
    var cornerWidth = 0.2 * args.width;
    var cornerDepth = 1.2 * args.depth;

    var box = new Box(cornerWidth, cornerWidth, cornerDepth, 0xAA0000, true, 0xFFFFFF);

    var radius = (args.width - cornerWidth) * Math.sqrt(2) / 2 * 1.02;
    var angle = Math.PI * (0.25 + 0.5 * i);
    box.position.x = radius * Math.sin(angle);
    box.position.y = radius * Math.cos(angle);
    box.position.z = 0;

    return box;
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