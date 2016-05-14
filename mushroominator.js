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
    detail.intersectableObjects = [];
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
        createEdge(0, 'N')/*,
        createEdge(1, 'E'),
        createEdge(2, 'S'),
        createEdge(3, 'W')*/];

    detail.add(mushroomBox);

    for (var i = 0; i < 4; i++)
    {
        detail.add(corners[i]);
        //detail.add(edges[i]);
    }
    console.log(edges[0]);
    //detail.add(edges[0]);

    detail.intersectableObjects = corners;
    //detail.intersectableObjects = corners.extend(edges);

    return detail;
}

function createEdge(args, i, label)
{
    var edgeLength = args.width;
    var edgeDepth = 1.1 * args.depth;

    var geometry = new THREE.BoxGeometry(edgeDepth, edgeDepth, edgeLength);
    var material = new THREE.MeshLambertMaterial({color: 0x00FF00});
    var box = new THREE.Mesh(geometry, material);

    box.position.x = (edgeLength - edgeDepth) / 2;
    box.position.y = 0;//2.05 * cornerWidth * (Math.floor(i / 2) * 2 - 1);
    box.position.z = 0;

    box.castShadow = true;
    box.receiveShadow = true;

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

// TODO: align 'em N E S W
    // this is a wrong formula
    box.position.x = 2.05 * cornerWidth * ((i % 2) * 2 - 1);
    box.position.y = 2.05 * cornerWidth * (Math.floor(i / 2) * 2 - 1);
    box.position.z = 0;

    box.castShadow = true;
    box.receiveShadow = true;

    box.selectCorner = function() {
        console.log('selectCorner');
        this.material = new THREE.MeshLambertMaterial({color: 0xFFFFFF});
    };

    return box;
}

exports.bake = bake;
exports.DetailType = DetailType;