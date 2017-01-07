var mushroominator = require('Mushroominator');

var Geometry = {
    Chair : [
        { type : mushroominator.DetailGeometry.Square, pos : [0, 0, 0], rotation : [0, 0, 0] },
        { type : mushroominator.DetailGeometry.Square, pos : [0, 450, 0], rotation : [0, 0, 0] },
        { type : mushroominator.DetailGeometry.Square, pos : [225, 0, 225], rotation : [0, Math.PI / 2, 0] },
        { type : mushroominator.DetailGeometry.Square, pos : [-225, 0, 225], rotation : [0, Math.PI / 2, 0] },
        { type : mushroominator.DetailGeometry.Square, pos : [0, 225, 225], rotation : [Math.PI / 2, 0, 0] },
    ]
};

function create(geometry) {
    var creation = new THREE.Object3D();
    creation.selectableObjects = [];

    for (var i = 0; i < geometry.length; i++) {
        var args = geometry[i];
        var detail = mushroominator.bake(args.type);
        detail.position.x = args.pos[0];
        detail.position.y = args.pos[1];
        detail.position.z = args.pos[2];
        detail.rotateX(args.rotation[0]);
        detail.rotateY(args.rotation[1]);
        detail.rotateZ(args.rotation[2]);
        creation.add(detail);
        creation.selectableObjects.extend(detail.selectableObjects); // FIXME: who exactly must define the selection logic?
    }

    return creation;
}

exports.Geometry = Geometry;
exports.create = create;
