function bake()
{
    var detail = new THREE.Object3D();

    var geometry = new THREE.BoxGeometry(10, 10, 0.5);
    var material = new THREE.MeshLambertMaterial({color: 0xff0000});
    var mushroomBox = new THREE.Mesh(geometry, material);

    mushroomBox.position.x = 0;
    mushroomBox.position.y = 0;
    mushroomBox.position.z = 0;

    mushroomBox.castShadow = true;
    //mushroomBox.receiveShadow = true;

    var corner = function(dx, dy) {

        var geometry = new THREE.BoxGeometry(2.5, 2.5, 0.6);
        var material = new THREE.MeshLambertMaterial({color: 0xAA0000});
        var box = new THREE.Mesh(geometry, material);

        box.position.x = 3.8 * dx;
        box.position.y = 3.8 * dy;
        box.position.z = 0;

        box.castShadow = true;
        box.receiveShadow = true;

        return box;
    };

    var corners = [
        corner(1, 1),
        corner(1, -1),
        corner(-1, 1),
        corner(-1, -1)];

    detail.add(mushroomBox);

    for (var i = 0; i < 4; i++)
        detail.add(corners[i]);


    detail.intersectableObjects = corners;

    return detail;
}

exports.bake = bake;
