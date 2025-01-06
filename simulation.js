const fontLoader = new THREE.FontLoader();

fontLoader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', function (font) {

  
    const textGeometryA = new THREE.TextGeometry('A', {
        font: font,
        size: 0.3,  
        height: 0.05, 
        curveSegments: 4  
    });

    const textGeometryB = new THREE.TextGeometry('B', {
        font: font,
        size: 0.3,
        height: 0.05,  
        curveSegments: 4  
    });

    const textMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });

    const textMeshA = new THREE.Mesh(textGeometryA, textMaterial);
    const textMeshB = new THREE.Mesh(textGeometryB, textMaterial);

    textGeometryA.center();
    textGeometryB.center();

    textMeshA.position.set(-2.85, 0.1, 0.3);  

    textMeshB.position.set(2.85, 0.1, 0.3);   

    scene.add(textMeshA);
    scene.add(textMeshB);
});


const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 0.1, 1000); 
const renderer = new THREE.WebGLRenderer();

const container = document.getElementById('simulation-container');

renderer.setSize(container.offsetWidth, container.offsetHeight);
container.appendChild(renderer.domElement);

const electronGeometry = new THREE.SphereGeometry(0.3, 16, 16);
const electronMaterial1 = new THREE.MeshBasicMaterial({ color: 0xFF0000 }); 
const electronMaterial2 = new THREE.MeshBasicMaterial({ color: 0xFF0000 }); 
const electron1 = new THREE.Mesh(electronGeometry, electronMaterial1);
const electron2 = new THREE.Mesh(electronGeometry, electronMaterial2);

electron1.position.set(-3, 0, 0);  
electron2.position.set(3, 0, 0);   

scene.add(electron1);
scene.add(electron2);


const photonGeometry = new THREE.SphereGeometry(0.05, 16, 16);
const photonMaterial = new THREE.MeshBasicMaterial({ color: 0xFF00FF }); 
const photon = new THREE.Mesh(photonGeometry, photonMaterial);


const startPos1 = electron1.position.clone();
const endPos1 = electron2.position.clone();
const startPos2 = electron2.position.clone();
const endPos2 = electron1.position.clone();


scene.add(photon);

let photonSpeed = 0.14;
let photonDirection1 = new THREE.Vector3().subVectors(endPos1, startPos1).normalize();
let photonDirection2 = new THREE.Vector3().subVectors(endPos2, startPos2).normalize();
let photonPosition = startPos1.clone();

let photonEmitter = 1;  

function emitPhoton() {
    if (photonEmitter === 1) {
        electron1.material.color.set(0x6B8E23); 
        electron2.material.color.set(0x8B0000); 
        photonDirection1 = new THREE.Vector3().subVectors(endPos1, startPos1).normalize();
    } else {
        electron2.material.color.set(0x6B8E23); 
        electron1.material.color.set(0x8B0000); 
        photonDirection2 = new THREE.Vector3().subVectors(endPos2, startPos2).normalize();
    }
}

function resetElectronColors() {
    electron1.material.color.set(0xFF0000); 
    electron2.material.color.set(0xFF0000); 
}


camera.position.set(0, 1, 5);  
camera.aspect = container.offsetWidth / container.offsetHeight;
camera.updateProjectionMatrix();


function animate() {
    requestAnimationFrame(animate);

   
    if (photonEmitter === 1) {
        photonPosition.addScaledVector(photonDirection1, photonSpeed);
    } else {
        photonPosition.addScaledVector(photonDirection2, photonSpeed);
    }
    photon.position.copy(photonPosition);


    if (photonEmitter === 1 && photonPosition.distanceTo(endPos1) < 0.1) {
        photonPosition.copy(startPos2);
        photonEmitter = 2;  

        emitPhoton();
    } else if (photonEmitter === 2 && photonPosition.distanceTo(endPos2) < 0.1) {
      
        photonPosition.copy(startPos1);
        photonEmitter = 1; 

      
        emitPhoton();
    }

  
    renderer.render(scene, camera);
}

animate();


window.addEventListener('resize', function() {
    renderer.setSize(container.offsetWidth, container.offsetHeight);
    camera.aspect = container.offsetWidth / container.offsetHeight;
    camera.updateProjectionMatrix();
});

