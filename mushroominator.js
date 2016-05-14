function bake()
{
    var detail = new THREE.Object3D();

    var cubeGeometry = new THREE.BoxGeometry(10, 10, 0.5);
    var cubeMaterial = new THREE.MeshLambertMaterial({color: 0xff0000});
    var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);

    cube.position.x = 0;
    cube.position.y = 0;
    cube.position.z = 0;

    cube.castShadow = true;
    cube.receiveShadow = true;

    var corner = function(dx, dy) {

        var cubeGeometry2 = new THREE.BoxGeometry(2.5, 2.5, 0.6);
        var cubeMaterial2 = new THREE.MeshLambertMaterial({color: 0xAA0000});
        var cube2 = new THREE.Mesh(cubeGeometry2, cubeMaterial2);

        cube2.position.x = 3.8 * dx;
        cube2.position.y = 3.8 * dy;
        cube2.position.z = 0;

        cube2.castShadow = true;
        cube2.receiveShadow = true;

        return cube2;
    };

    var corners = [
        corner(1, 1),
        corner(1, -1),
        corner(-1, 1),
        corner(-1, -1)];

    detail.add(cube);

    for (var i = 0; i < 4; i++)
        detail.add(corners[i]);


    detail.intersectableObjects = corners;

    return detail;
}

exports.bake = bake;
