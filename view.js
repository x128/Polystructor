var ViewOptions = {
    FullScreen : 0x1
};

var m_scene, m_camera, m_renderer;
var m_size;
var m_options;
var m_animationFrameRequest;

function updateViewSize()
{
    if (m_options & ViewOptions.FullScreen)
    {
        m_size = {
            width : window.innerWidth,
            height : window.innerHeight,
            aspectRatio : window.innerWidth / window.innerHeight
        };
    }
    else
        console.error('[view::updateViewSize] unknown options');

    if (m_renderer)
        m_renderer.setSize(m_size.width, m_size.height);

    if (m_camera)
    {
        m_camera.aspect = m_size.aspectRatio;
        m_camera.updateProjectionMatrix();
    }
}

function create(options)
{
    m_options = options;

    updateViewSize();

    m_scene = new THREE.Scene();

    m_camera = new THREE.PerspectiveCamera(45, m_size.aspectRatio, 1, 100);

    m_renderer = new THREE.WebGLRenderer();
    m_renderer.setClearColor(new THREE.Color(0x111C32));
    m_renderer.setSize(m_size.width, m_size.height);
    m_renderer.shadowMapEnabled = true;





    // show axes in the screen
//        var axes = new THREE.AxisHelper(20);
//        scene.add(axes);

    // create the ground plane
    var planeGeometry = new THREE.PlaneGeometry(50, 50);
    var planeMaterial = new THREE.MeshBasicMaterial({color: 0xFFFFFF});
    var plane = new THREE.Mesh(planeGeometry, planeMaterial);

    // rotate and position the plane
    plane.rotation.x = -0.5 * Math.PI;
    plane.position.x = 0;
    plane.position.y = -5.05;
    plane.position.z = 0;

    // add the plane to the scene
    m_scene.add(plane);
    plane.receiveShadow = true;

    // create a cube
    var cubeGeometry = new THREE.BoxGeometry(10, 10, 0.5);
    var cubeMaterial = new THREE.MeshLambertMaterial({color: 0xff0000});
    var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);

    // position the cube
    cube.position.x = 0;
    cube.position.y = 0;
    cube.position.z = 0;

//        cube.receiveShadow = true;
    cube.castShadow = true;


    var corner = function(dx, dy) {

        // create a cube
        var cubeGeometry2 = new THREE.BoxGeometry(2.5, 2.5, 0.6);
        var cubeMaterial2 = new THREE.MeshLambertMaterial({color: 0xAA0000});
        var cube2 = new THREE.Mesh(cubeGeometry2, cubeMaterial2);

        // position the cube
        cube2.position.x = 3.8 * dx;
        cube2.position.y = 3.8 * dy;
        cube2.position.z = 0;

        cube2.receiveShadow = true;
        cube2.castShadow = true;

        return cube2;
    };

    var corners = [
        corner(1, 1),
        corner(1, -1),
        corner(-1, 1),
        corner(-1, -1)];

    var group = new THREE.Object3D();
    group.add(cube);

    for (var i = 0; i < 4; i++)
        group.add(corners[i]);

    m_scene.add(group);

    // position and point the camera to the center of the scene
    m_camera.position.x = -30;
    m_camera.position.y = 10;
    m_camera.position.z = 30;

    var pos = m_scene.position;
    pos.y += 13;

//        camera.lookAt(scene.position);
    m_camera.lookAt(pos);

    var spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set(-60, 60, 20);
    spotLight.castShadow = true;
    m_scene.add(spotLight);




    var webGLDiv = document.createElement('div');
    webGLDiv.style.position = 'absolute';
    webGLDiv.style.left = 0;
    webGLDiv.style.top = 0;
    document.getElementsByTagName('body')[0].appendChild(webGLDiv);
    webGLDiv.appendChild(m_renderer.domElement);

    //document.getElementsByTagName('body')[0].appendChild(renderer.domElement);

    var ambientLight = new THREE.AmbientLight(0x0c0c0c);
//        ambientLight.castShadow = true;
    m_scene.add(ambientLight);

    setWindowResizeHandler(updateViewSize);
}

function setWindowResizeHandler(callback)
{
    window.addEventListener('resize', callback, false);
    return {
        stop : function() {
            window.removeEventListener('resize', callback);
        }
    };
}

function renderLoop()
{
    m_camera.position.x += 0.01;
    var pos = m_scene.position;
    m_camera.lookAt(pos);

    m_animationFrameRequest = window.requestAnimationFrame(renderLoop);
    m_renderer.render(m_scene, m_camera);
}

function startRendering()
{
    renderLoop();
}

function stopRendering()
{
    window.cancelAnimationFrame(m_animationFrameRequest);
}

exports.ViewOptions = ViewOptions;
exports.create = create;
exports.startRendering = startRendering;
exports.stopRendering = stopRendering;
