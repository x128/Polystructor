var ViewOptions = {
    FullScreen : 0x1,
    ShowAxes : 0x2
};

var m_scene, m_camera, m_renderer, m_orbitControls, m_raycaster;
var m_options, m_size;
var m_animationFrameRequest;
var m_intersectableObjects;

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


    if (m_options & ViewOptions.ShowAxes)
    {
        var axes = new THREE.AxisHelper(20);
        m_scene.add(axes);
    }


    var planeGeometry = new THREE.PlaneGeometry(50, 50);
    var planeMaterial = new THREE.MeshBasicMaterial({color: 0xFFFFFF});
    var floor = new THREE.Mesh(planeGeometry, planeMaterial);

    floor.rotation.x = -0.5 * Math.PI;
    floor.position.x = 0;
    floor.position.y = -5.05;
    floor.position.z = 0;

    m_scene.add(floor);
    floor.receiveShadow = true;


    // position and point the camera to the center of the scene
    m_camera.position.x = -30;
    m_camera.position.y = 10;
    m_camera.position.z = 30;

    var pos = m_scene.position;
    pos.y += 13;
    m_camera.lookAt(pos);

    var spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set(-60, 60, 20);
    spotLight.castShadow = true;
    m_scene.add(spotLight);



    var glDiv = document.createElement('div');
    glDiv.style.position = 'absolute';
    glDiv.style.left = 0;
    glDiv.style.top = 0;
    document.getElementsByTagName('body')[0].appendChild(glDiv);
    glDiv.appendChild(m_renderer.domElement);

    var ambientLight = new THREE.AmbientLight(0x0c0c0c);
//        ambientLight.castShadow = true;
    m_scene.add(ambientLight);

    createControls();
}

function createControls()
{
    setWindowResizeHandler(updateViewSize);

    m_orbitControls = new THREE.OrbitControls(m_camera, m_renderer.domElement);

    m_raycaster = new THREE.Raycaster();

    document.addEventListener('mousedown', onMouseDown);
    //document.addEventListener('mousemove', onMouseMove);
}

function objectUnderCursor()
{
    var x = (event.clientX / m_size.width) * 2 - 1;
    var y = -(event.clientY / m_size.height) * 2 + 1;
    var mouse = new THREE.Vector2(x, y);
    m_raycaster.setFromCamera(mouse, m_camera);
    var intersections = m_raycaster.intersectObjects(m_intersectableObjects, false);
    return intersections.length ? intersections[0] : null;
}

function onMouseMove()
{
}

function onMouseDown()
{
    // TODO: mouseDown + mouseUp not far from each other
    var obj = objectUnderCursor();
    if (obj && obj.object)
    {
        console.log(obj.object);
        obj.object.selectCorner();
    }
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

function addDetail(detail, pos)
{
    m_scene.add(detail);
    detail.position.x = pos.x;
    detail.position.y = pos.y;
    detail.position.z = pos.z;

    m_intersectableObjects = m_intersectableObjects || [];
    m_intersectableObjects.extend(detail.intersectableObjects);
}

function recalcIntersectableObjects()
{
    // TODO (on add/remove details)
}

exports.ViewOptions = ViewOptions;
exports.create = create;
exports.startRendering = startRendering;
exports.stopRendering = stopRendering;
exports.addDetail = addDetail;
