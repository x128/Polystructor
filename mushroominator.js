var Utils = require('utils');

var DetailType = {
    Square : 'square'
};

var m_highlightHelper;
function setHighlightHelper(highlightHelper) // TODO: Mushroominator() ?
{
    m_highlightHelper = highlightHelper;
}

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

    var mushroomBox = new Box(width, width, depth, args.color.main, false);
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
    var edgeDepth = 1.01 * args.depth;

    var box = new Box(edgeDepth, edgeWidth, edgeLength, args.color.main, true, args.color.selection);

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

    var box = new Box(cornerWidth, cornerWidth, cornerDepth, args.color.corner, true, args.color.selection);

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
function Box(width, height, depth, color, highlightable, selectionColor)
{
    var geometry = new THREE.BoxGeometry(width, height, depth);
    var material = new THREE.MeshLambertMaterial({ color : color });
    var box = new THREE.Mesh(geometry, material);

    if (highlightable)
    {
        var hoverColor = Utils.averageColor(color, selectionColor);
        m_highlightHelper.makeObjectHighlightable(box, hoverColor, selectionColor);
    }
/*
    box.selectable = selectable;
    if (selectable)
    {
        box.selected = false;

        if (!hoverColor)
            hoverColor = Utils.averageColor(color, selectionColor);

        box.materials = {};
        box.materials[HL.HighlightMode.None] = material;
        box.materials[HL.HighlightMode.Hover] = new THREE.MeshLambertMaterial({ color : hoverColor });
        box.materials[HL.HighlightMode.Select] = new THREE.MeshLambertMaterial({ color : selectionColor });

        //box.originalMaterial = material;
        //box.selectionMaterial = ;
        //box.highlightMaterial = ;

        box.select = function() {
            this.material = this.materials[HL.HighlightMode.Select];
            this.selected = true;
        };
        box.deselect = function() {
            this.material = this.materials[HL.HighlightMode.None];
            this.selected = false;
        };

        box.highlight = function() {
            this.material = this.materials[this.selected ? HL.HighlightMode.Select : HL.HighlightMode.Hover];
            this.highlighted = true;
        };
        box.fadetoblack = function() {
            this.material = this.materials[this.selected ? HL.HighlightMode.Select : HL.HighlightMode.None];
            this.highlighted = false;
        };
    }
    */

    box.castShadow = true;
    //box.receiveShadow = true; TODO

    return box;
}

exports.DetailType = DetailType;
exports.setHighlightHelper = setHighlightHelper;
exports.bake = bake;
