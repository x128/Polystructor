var mushroominator = require('Mushroominator');

var Geometry = {
    Empty : [],
    Chair : [
        { type : mushroominator.DetailGeometry.Square, pos : [0, 0, 0], rotation : [0, 0, 0] },
        { type : mushroominator.DetailGeometry.Square, pos : [0, 450, 0], rotation : [0, 0, 0] },
        { type : mushroominator.DetailGeometry.Square, pos : [225, 0, 225], rotation : [0, 90, 0] },
        { type : mushroominator.DetailGeometry.Square, pos : [-225, 0, 225], rotation : [0, 90, 0] },
        { type : mushroominator.DetailGeometry.Square, pos : [0, 225, 225], rotation : [90, 0, 0] },
    ],
    Table : [
        { type : mushroominator.DetailGeometry.Square, pos : [0, 0, -450], rotation : [90, 0, 0] },
        { type : mushroominator.DetailGeometry.Square, pos : [450, 0, -450], rotation : [90, 0, 0] },
        { type : mushroominator.DetailGeometry.Square, pos : [450, 0, 0], rotation : [90, 0, 0] },
        { type : mushroominator.DetailGeometry.Square, pos : [0, 0, 0], rotation : [90, 0, 0] },
        { type : mushroominator.DetailGeometry.Square, pos : [450, 0, 0], rotation : [90, 0, 0] },
        { type : mushroominator.DetailGeometry.Square, pos : [450, 0, 450], rotation : [90, 0, 0] },
        { type : mushroominator.DetailGeometry.Square, pos : [0, 0, 450], rotation : [90, 0, 0] },
        { type : mushroominator.DetailGeometry.Square, pos : [0, 0, 900], rotation : [90, 0, 0] },
        { type : mushroominator.DetailGeometry.Square, pos : [450, 0, 900], rotation : [90, 0, 0] },
        { type : mushroominator.DetailGeometry.Square, pos : [900, 0, 0], rotation : [90, 0, 0] },
        { type : mushroominator.DetailGeometry.Square, pos : [900, 0, 450], rotation : [90, 0, 0] },
        { type : mushroominator.DetailGeometry.Square, pos : [900, 0, 900], rotation : [90, 0, 0] },
    ]
};

function create(details) {
    var creation = new THREE.Object3D();
    creation.selectableObjects = [];
    creation.details = details;

    var deg2rad = Math.PI / 180;
    for (var i = 0; i < details.length; i++) {
        var args = details[i];
        var detail = mushroominator.bake(args.type, function() {
            // console.log('mushroominator');
            
        });
        detail.position.x = args.pos[0];
        detail.position.y = args.pos[1];
        detail.position.z = args.pos[2];
        detail.rotateX(args.rotation[0] * deg2rad);
        detail.rotateY(args.rotation[1] * deg2rad);
        detail.rotateZ(args.rotation[2] * deg2rad);
        creation.add(detail);
        creation.selectableObjects.extend(detail.selectableObjects); // FIXME: who exactly must define the selection logic?
        
        // TODO: move this to Detail class
        // detail.
    }

    return creation;
}

exports.Geometry = Geometry;
exports.create = create;
