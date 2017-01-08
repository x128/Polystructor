var ViewOptions = {
    FullScreen : 0x1,
    ShowAxes : 0x2
};

var m_scene, m_camera, m_renderer, m_orbitControls, m_raycaster;
var m_options, m_size;
var m_animationFrameRequest;
var m_selectableObjects;
var m_roomBG;

function updateViewSize() {
    if (m_options & ViewOptions.FullScreen) {
        m_size = {
            width : window.innerWidth,
            height : window.innerHeight,
            aspectRatio : window.innerWidth / window.innerHeight
        };
    } else {
        console.error('[view::updateViewSize] unknown options');
    }

    if (m_renderer)
        m_renderer.setSize(m_size.width, m_size.height);

    if (m_camera) {
        m_camera.aspect = m_size.aspectRatio;
        m_camera.updateProjectionMatrix();
    }
}

function create(options) {
    m_options = options;

    updateViewSize();

    m_scene = new THREE.Scene();

    m_camera = new THREE.PerspectiveCamera(45, m_size.aspectRatio, 100, 20000);

    m_renderer = new THREE.WebGLRenderer({ antialias : true });
    m_renderer.setClearColor(new THREE.Color(0x6e7788));
    m_renderer.setSize(m_size.width, m_size.height);
    m_renderer.shadowMap.enabled = true;
    m_renderer.shadowMap.type = THREE.PCFSoftShadowMap;


    if (m_options & ViewOptions.ShowAxes) {
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
    m_camera.position.x = -1000;
    m_camera.position.y = 500;
    m_camera.position.z = 2500;

    var pos = m_scene.position;
    pos.y += 13;
    m_camera.lookAt(pos);

    var spotLight = new THREE.SpotLight(0xffffff, 1, 10000);
    spotLight.position.set(0, 4500, 0);
    spotLight.castShadow = true;
    spotLight.angle = Math.PI / 4;
    // m_scene.add(spotLight);

    var sky = new THREE.AmbientLight(0xffffff, 0.1);
    m_scene.add(sky);

    var glDiv = document.createElement('div');
    glDiv.style.position = 'absolute';
    glDiv.style.left = 0;
    glDiv.style.top = 0;
    document.getElementsByTagName('body')[0].appendChild(glDiv);
    glDiv.appendChild(m_renderer.domElement);

    var ambientLight = new THREE.AmbientLight(0x0c0c0c);
    // ambientLight.castShadow = true;
    m_scene.add(ambientLight);

    createControls();
}

function createControls() {
    setWindowResizeHandler(updateViewSize);

    m_orbitControls = new THREE.OrbitControls(m_camera, m_renderer.domElement);

    m_raycaster = new THREE.Raycaster();

    document.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mousemove', onMouseMove);
}

function objectUnderCursor() {
    var x = (event.clientX / m_size.width) * 2 - 1;
    var y = -(event.clientY / m_size.height) * 2 + 1;
    var mouse = new THREE.Vector2(x, y);
    m_raycaster.setFromCamera(mouse, m_camera);
    var intersections = m_raycaster.intersectObjects(m_selectableObjects, false);
    return intersections.length ? intersections[0] : null;
}

function performUnderCursor(callbackUnderCursor, callbackForOthers) {
    var smth = objectUnderCursor();
    if (smth && smth.object && smth.object.selectable) {
        m_selectableObjects.forEach(function(o) {
            if (o != smth.object)
                callbackForOthers(o);
        });
        callbackUnderCursor(smth.object);
    } else {
        m_selectableObjects.forEach(callbackForOthers);
    }
}

function onMouseMove() {
    performUnderCursor(
        function(obj) { obj.highlight(); },
        function(obj) { if (obj.highlighted) obj.fadetoblack(); }
    );

    var q = m_camera.getWorldQuaternion();

    var l = 100;
    var x = -m_camera.position.x //- m_camera.rotation.x * l;
    var y = -m_camera.position.y //- m_camera.rotation.y * l;
    var z = -m_camera.position.z //- m_camera.rotation.z * l;

    m_roomBG.position.x = x + 1000;
    m_roomBG.position.y = y;
    m_roomBG.position.z = z;

    m_roomBG.quaternion.x = q.x;
    m_roomBG.quaternion.y = q.y;
    m_roomBG.quaternion.z = q.z;
    m_roomBG.quaternion.w = q.w;

}

function onMouseDown(event) {
    // TODO: mouseDown + mouseUp not far from each other
    performUnderCursor(
        function (obj) {
            obj.select();
        },
        function (obj) {
            if (obj.selected) obj.deselect();
        }
    );

    if (event.button == 2) {
        var q = m_camera.getWorldQuaternion();

        m_roomBG.quaternion.x = q.x;
        m_roomBG.quaternion.y = q.y;
        m_roomBG.quaternion.z = q.z;
        m_roomBG.quaternion.w = q.w;
    }
}

function setWindowResizeHandler(callback) {
    window.addEventListener('resize', callback, false);
    return {
        stop : function() {
            window.removeEventListener('resize', callback);
        }
    };
}

function renderLoop() {
    m_camera.position.x += 0.01;
    var pos = m_scene.position;
    m_camera.lookAt(pos);

    m_animationFrameRequest = window.requestAnimationFrame(renderLoop);
    m_renderer.render(m_scene, m_camera);
}

function startRendering() {
    renderLoop();
}

function stopRendering() {
    window.cancelAnimationFrame(m_animationFrameRequest);
}

function addObject(detail, pos) {
    m_scene.add(detail);
    detail.position.x = pos.x;
    detail.position.y = pos.y;
    detail.position.z = pos.z;

    m_selectableObjects = m_selectableObjects || [];
    m_selectableObjects.extend(detail.selectableObjects);
}
function addTmpRoomBg(detail, pos) {
    m_scene.add(detail);
    detail.position.x = pos.x;
    detail.position.y = pos.y;
    detail.position.z = pos.z;

    m_roomBG = detail;




    var matFloor = new THREE.MeshPhongMaterial();
    var matBox = new THREE.MeshPhongMaterial( { color: 0x4080ff } );

    var geoFloor = new THREE.BoxGeometry( 2000, 1, 2000 );
    var geoBox = new THREE.BoxGeometry( 30, 10, 20 );

    var mshFloor = new THREE.Mesh( geoFloor, matFloor );
    var mshBox = new THREE.Mesh( geoBox, matBox );

    var spotLight = new THREE.SpotLight( 0xffffff, 1, 10000 );

    spotLight.position.set( 0, 200, -200 );
    spotLight.castShadow = true;

    mshFloor.receiveShadow = true;
    mshFloor.position.set( 0, - 0.05, 0 );

    mshBox.castShadow = true;
    mshBox.position.set( 40, 100, 0 );


    m_scene.add( mshFloor );
    // m_scene.add( mshBox );
    m_scene.add( spotLight );
}
// + TODO:
function recalcSelectableObjects()
{
}

exports.ViewOptions = ViewOptions;
exports.create = create;
exports.startRendering = startRendering;
exports.stopRendering = stopRendering;
exports.addObject = addObject;
exports.addTmpRoomBg = addTmpRoomBg;