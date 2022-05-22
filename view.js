import * as THREE from './lib/three.js/build/three.module.js';
import { OrbitControls } from './lib/three.js/examples/jsm/controls/OrbitControls.js';
import * as Colors from './Colors.js';
import * as mushroominator from './mushroominator.js';

var ViewOptions = {
    FullScreen : 0x1,
    ShowAxes : 0x2
};

var m_scene, m_camera, m_renderer, m_orbitControls, m_raycaster;
var m_options, m_size;
var m_animationFrameRequest;
var m_selectableObjects = [];

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

    m_camera = new THREE.PerspectiveCamera(45, m_size.aspectRatio, 100, 25000);

    m_renderer = new THREE.WebGLRenderer({ antialias : true });
    m_renderer.setClearColor(new THREE.Color(Colors.space));
    m_renderer.setSize(m_size.width, m_size.height);
    m_renderer.shadowMap.enabled = true;
    m_renderer.shadowMap.type=THREE.PCFShadowMap;
    //  m_renderer.shadowMapSoft = true;


    if (m_options & ViewOptions.ShowAxes) {
        var axes = new THREE.AxesHelper(20);
        m_scene.add(axes);
    }

    // position and point the camera to the center of the scene
    m_camera.position.x = -mushroominator.PSElement.room_5000_4000_3000.length;
    m_camera.position.y = -mushroominator.PSElement.room_5000_4000_3000.width;
    m_camera.position.z = mushroominator.PSElement.room_5000_4000_3000.height;

    m_camera.up.set(0, 0, 1);

    var pos = m_scene.position;
    m_camera.lookAt(pos);

    var spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set(mushroominator.PSElement.room_5000_4000_3000.length/2-500, -mushroominator.PSElement.room_5000_4000_3000.width/2+500, mushroominator.PSElement.room_5000_4000_3000.height-500);
    spotLight.power=3;
    spotLight.castShadow = true;
    spotLight.target.position.x=0;
    spotLight.target.position.y=0;
    spotLight.target.position.z=0;
    spotLight.angle=0.7;
    spotLight.distance=6000;
    spotLight.shadow.camera.far=25000;
    spotLight.shadow.camera.visible=true;
    spotLight.shadow.camera.near=2000;
    spotLight.shadow.camera.fov=90;
    spotLight.shadow.mapSize.width=1024;
    spotLight.shadow.mapSize.height=1024;

    var spotLightHelper = new THREE.SpotLightHelper( spotLight );
    m_scene.add( spotLightHelper );
    //spotLight.shadow.bias=0.00001

    //console.log(mushroominator.room);
    m_scene.add(spotLight);
    m_scene.add(spotLight.target);

    var sky = new THREE.AmbientLight(0xeeeeff, 1);
    m_scene.add(sky);


    var glDiv = document.createElement('div');
    glDiv.style.position = 'absolute';
    glDiv.style.left = 0;
    glDiv.style.top = 0;
    document.getElementsByTagName('body')[0].appendChild(glDiv);
    glDiv.appendChild(m_renderer.domElement);

    var ambientLight = new THREE.AmbientLight();
  //m_scene.add(ambientLight);

    createControls();
}

function createControls() {
    setWindowResizeHandler(updateViewSize);

    m_orbitControls = new OrbitControls(m_camera, m_renderer.domElement);

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
}

function onMouseDown() {
    // TODO: mouseDown + mouseUp not far from each other
    performUnderCursor(
        function(obj) { obj.select(); },
        function(obj) { if (obj.selected) obj.deselect(); }
    );
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

    m_selectableObjects = m_selectableObjects.concat(detail.selectableObjects);
}
// + TODO:
function recalcSelectableObjects()
{
}

export { ViewOptions, create, startRendering, stopRendering, addObject };
