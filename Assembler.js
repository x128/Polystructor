var mushroominator = require('Mushroominator');

var Geometry = {
    Chair : [
        { type : mushroominator.PSElementType.Rectangle, element : mushroominator.PSElement.rectangle_540_540, pos : [0, 0, 0], rotation : [0, 0, 0] },
        { type : mushroominator.PSElementType.Rectangle, element : mushroominator.PSElement.rectangle_540_540, pos : [0, 450, 0], rotation : [0, 0, 0] },
        { type : mushroominator.PSElementType.Rectangle, element : mushroominator.PSElement.rectangle_540_540, pos : [225, 0, 225], rotation : [0, 90, 0] },
        { type : mushroominator.PSElementType.Rectangle, element : mushroominator.PSElement.rectangle_540_540, pos : [-225, 0, 225], rotation : [0, 90, 0] },
        { type : mushroominator.PSElementType.Rectangle, element : mushroominator.PSElement.rectangle_540_540, pos : [0, 225, 225], rotation : [90, 0, 0] },
    ]
};

function create(geometry) {
    var creation = new THREE.Object3D();
    creation.selectableObjects = [];

    var deg2rad = Math.PI / 180;
    for (var i = 0; i < geometry.length; i++) {
        var args = geometry[i];
        var detail = mushroominator.bake(args.type, args.element);
        detail.position.x = args.pos[0];
        detail.position.y = args.pos[1];
        detail.position.z = args.pos[2];
        detail.rotateX(args.rotation[0] * deg2rad);
        detail.rotateY(args.rotation[1] * deg2rad);
        detail.rotateZ(args.rotation[2] * deg2rad);
        creation.add(detail);
        creation.selectableObjects.extend(detail.selectableObjects); // FIXME: who exactly must define the selection logic?
    }

    return creation;
}

exports.Geometry = Geometry;
exports.create = create;
