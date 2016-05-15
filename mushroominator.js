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
            console.error('[mushroominator::bake] unknown detail type');
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

    var geometry = new THREE.BoxGeometry(args.width, width, depth);
    var material = new THREE.MeshLambertMaterial({color: 0xff0000});
    var mushroomBox = new THREE.Mesh(geometry, material);

    mushroomBox.position.x = 0;
    mushroomBox.position.y = 0;
    mushroomBox.position.z = 0;

    mushroomBox.castShadow = true;
    //mushroomBox.receiveShadow = true;

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

    detail.intersectableObjects = corners;
    detail.intersectableObjects.extend(edges);

    return detail;
}

function createEdge(args, i, label)
{
    var edgeLength = args.width;
    var edgeWidth = 0.1 * args.width;
    var edgeDepth = 1.1 * args.depth;

    var geometry = new THREE.BoxGeometry(edgeDepth, edgeWidth, edgeLength);
    var material = new THREE.MeshLambertMaterial({color: 0x00FF00});
    var box = new THREE.Mesh(geometry, material);

    var radius = (args.width - edgeWidth) / 2 * 1.01;
    var angle = i * Math.PI / 2;
    box.position.x = radius * Math.sin(angle);
    box.position.y = radius * Math.cos(angle);

    box.rotateY(Math.PI / 2);
    box.rotateX(angle);

    box.castShadow = true;
    //box.receiveShadow = true;

    box.selectEdge = function() {
        console.log('selectEdge');
        this.material = new THREE.MeshLambertMaterial({color: 0xFFFFFF});
    };

    return box;
}

function createCorner(args, i, label)
{
    var cornerWidth = 0.2 * args.width;
    var cornerDepth = 1.2 * args.depth;

    var geometry = new THREE.BoxGeometry(cornerWidth, cornerWidth, cornerDepth);
    var material = new THREE.MeshLambertMaterial({color: 0xAA0000});
    var box = new THREE.Mesh(geometry, material);

    var radius = (args.width - cornerWidth) * Math.sqrt(2) / 2 * 1.02;
    var angle = Math.PI * (0.25 + 0.5 * i);
    box.position.x = radius * Math.sin(angle);
    box.position.y = radius * Math.cos(angle);
    box.position.z = 0;

    box.castShadow = true;
    //box.receiveShadow = true;

    box.selectCorner = function() {
        console.log('selectCorner');
        this.material = new THREE.MeshLambertMaterial({color: 0xFFFFFF});
    };

    return box;
}

exports.bake = bake;
exports.DetailType = DetailType;