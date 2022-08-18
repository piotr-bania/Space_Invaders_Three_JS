import './styles/main.scss'
import * as THREE from 'three'
import * as dat from 'lil-gui'
import {
    OrbitControls
} from 'three/examples/jsm/controls/OrbitControls.js'
import {
    GLTFLoader
} from 'three/examples/jsm/loaders/GLTFLoader.js'
import {
    RGBELoader
} from 'three/examples/jsm/loaders/RGBELoader'
import {
    gsap
} from 'gsap'

// ------------------------- Canvas -------------------------
const canvas = document.querySelector('canvas.webgl')

// ------------------------- Scene -------------------------
const scene = new THREE.Scene()

// ------------------------- Sizes -------------------------
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

// ------------------------- Camera -------------------------
const camera = new THREE.PerspectiveCamera(90, sizes.width / sizes.height)
camera.position.set(0, 0, 20)
scene.add(camera)

// const helper = new THREE.CameraHelper(camera)
// scene.add(helper)

// ------------------------- Lights -------------------------
// Ambient
const ambientLight = new THREE.AmbientLight(0x7161F5, 0.75)
scene.add(ambientLight)

// Point
// const orangePointLight = new THREE.PointLight(0xcc6600, 1)
// orangePointLight.position.set(1, - 0.5, 1)
// scene.add(orangePointLight)

// const sphereSize = 1;
// const pointLightHelper = new THREE.PointLightHelper( orangePointLight, sphereSize );
// scene.add( pointLightHelper )

// Directional
const directionalLight = new THREE.DirectionalLight(0x03544e, 0.5)
directionalLight.position.set(0, 0, 1)
scene.add(directionalLight)

// const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 1)
// scene.add(directionalLightHelper)

// Hemisphere
const hemisphereLight = new THREE.HemisphereLight(0x0000ff, 0x00ff00, 0.75)
hemisphereLight.position.set(1, -1, 0)
scene.add(hemisphereLight)

// const hemisphereLightHelper = new THREE.HemisphereLightHelper(hemisphereLight, 1)
// scene.add(hemisphereLightHelper)

// ------------------------- Debug -------------------------
const gui = new dat.GUI()

// ------------------------- Fog -------------------------
const fog = new THREE.Fog('#7161F5', 1, 5)
scene.fog = fog

// ------------------------- HDRI -------------------------
import hdri from './hdri/nebula-003-demo.hdr'

new RGBELoader()
    .load(hdri, function (texture) {
        texture.mapping = THREE.EquirectangularReflectionMapping
        scene.environment = texture
        scene.background = texture
    })

// ------------------------- Galaxy -------------------------
const parameters = {}
parameters.count = 1000000
parameters.size = 0.01
parameters.radius = 1
parameters.randomness = 0.25
parameters.blue = '#13A4EB'
parameters.turquoise = '#1180D3'

const stars = () => {

    // Geometry
    const geometry = new THREE.SphereGeometry(1, 32, 32)
    const positions = new Float32Array(parameters.count * 3)
    const colors = new Float32Array(parameters.count * 3)

    for (let i = 0; i < parameters.count; i++) {
        const i3 = i * 3

        const radius = Math.random() * parameters.radius

        const blue = new THREE.Color(parameters.blue)
        const turquoise = new THREE.Color(parameters.outsideColor)
        const mixedColor = blue.clone()
        mixedColor.lerp(turquoise, radius / parameters.radius)

        positions[i3] = (Math.random() - 0.5) * 50
        positions[i3 + 1] = (Math.random() - 0.5) * 50
        positions[i3 + 2] = (Math.random() - 0.5) * 50

        colors[i3] = mixedColor.r
        colors[i3 + 1] = mixedColor.g
        colors[i3 + 2] = mixedColor.b
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

    // Material
    const material = new THREE.PointsMaterial({
        size: parameters.size,
        sizeAttenuation: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        vertexColors: true
    })

    // Points
    const points = new THREE.Points(geometry, material)
    scene.add(points)

    // Animation
    gsap.to(points.rotation, {
        duration: 1000,
        delay: 0,
        x: 5,
        repeat: -1
    })
}

stars()

// ------------------------- Space Invader -------------------------
function createSquares() {
    const geometry = new THREE.BoxBufferGeometry(0.8, 0.8, 0.8)
    const material = new THREE.MeshLambertMaterial({
        color: 0x333333
    })
    const square = new THREE.Mesh(geometry, material)
    return square
}

function createSpaceInvader() {
    const spaceInvader = new THREE.Group()

     // Layer 1
     const square27 = createSquares()
     square27.position.x = -3
     square27.position.y = 3
     spaceInvader.add(square27)
 
     const square28 = createSquares()
     square28.position.x = 3
     square28.position.y = 3
     spaceInvader.add(square28)

      // Layer 2
    const square29 = createSquares()
    square29.position.x = -2
    square29.position.y = 2
    spaceInvader.add(square29)

    const square30 = createSquares()
    square30.position.x = 2
    square30.position.y = 2
    spaceInvader.add(square30)

    // Layer 3
    const square1 = createSquares()
    square1.position.x = -3
    square1.position.y = 1
    spaceInvader.add(square1)

    const square2 = createSquares()
    square2.position.x = -2
    square2.position.y = 1
    spaceInvader.add(square2)

    const square3 = createSquares()
    square3.position.x = -1
    square3.position.y = 1
    spaceInvader.add(square3)

    const square4 = createSquares()
    square4.position.x = 0
    square4.position.y = 1
    spaceInvader.add(square4)

    const square5 = createSquares()
    square5.position.x = 1
    square5.position.y = 1
    spaceInvader.add(square5)

    const square6 = createSquares()
    square6.position.x = 2
    square6.position.y = 1
    spaceInvader.add(square6)

    const square7 = createSquares()
    square7.position.x = 3
    square7.position.y = 1
    spaceInvader.add(square7)

    // Layer 4
    const square8 = createSquares()
    square8.position.x = -4
    square8.position.y = 0
    spaceInvader.add(square8)

    const square9 = createSquares()
    square9.position.x = -3
    square9.position.y = 0
    spaceInvader.add(square9)

    const square10 = createSquares()
    square10.position.x = -1
    square10.position.y = 0
    spaceInvader.add(square10)

    const square11 = createSquares()
    square11.position.x = 0
    square11.position.y = 0
    spaceInvader.add(square11)

    const square12 = createSquares()
    square12.position.x = 1
    square12.position.y = 0
    spaceInvader.add(square12)

    const square13 = createSquares()
    square13.position.x = 3
    square13.position.y = 0
    spaceInvader.add(square13)

    const square14 = createSquares()
    square14.position.x = 4
    square14.position.y = 0
    spaceInvader.add(square14)

    // Layer 5
    const square16 = createSquares()
    square16.position.x = -5
    square16.position.y = -1
    spaceInvader.add(square16)

    const square17 = createSquares()
    square17.position.x = -4
    square17.position.y = -1
    spaceInvader.add(square17)

    const square18 = createSquares()
    square18.position.x = -3
    square18.position.y = -1
    spaceInvader.add(square18)

    const square19 = createSquares()
    square19.position.x = -2
    square19.position.y = -1
    spaceInvader.add(square19)

    const square20 = createSquares()
    square20.position.x = -1
    square20.position.y = -1
    spaceInvader.add(square20)

    const square21 = createSquares()
    square21.position.x = 0
    square21.position.y = -1
    spaceInvader.add(square21)

    const square22 = createSquares()
    square22.position.x = 1
    square22.position.y = -1
    spaceInvader.add(square22)

    const square23 = createSquares()
    square23.position.x = 2
    square23.position.y = -1
    spaceInvader.add(square23)

    const square24 = createSquares()
    square24.position.x = 3
    square24.position.y = -1
    spaceInvader.add(square24)

    const square25 = createSquares()
    square25.position.x = 4
    square25.position.y = -1
    spaceInvader.add(square25)

    const square26 = createSquares()
    square26.position.x = 5
    square26.position.y = -1
    spaceInvader.add(square26)

    // Layer 6
    const square31 = createSquares()
    square31.position.x = -5
    square31.position.y = -2
    spaceInvader.add(square31)

    const square32 = createSquares()
    square32.position.x = -3
    square32.position.y = -2
    spaceInvader.add(square32)

    const square33 = createSquares()
    square33.position.x = -2
    square33.position.y = -2
    spaceInvader.add(square33)

    const square34 = createSquares()
    square34.position.x = -1
    square34.position.y = -2
    spaceInvader.add(square34)

    const square35 = createSquares()
    square35.position.x = 0
    square35.position.y = -2
    spaceInvader.add(square35)

    const square36 = createSquares()
    square36.position.x = 1
    square36.position.y = -2
    spaceInvader.add(square36)

    return spaceInvader
}

const finalSpaceInvader = createSpaceInvader()
finalSpaceInvader.position.set(0, 0, 0)
scene.add(finalSpaceInvader)

// // Animation
// gsap.to(finalSpaceInvader.rotation, {
//     duration: 100,
//     delay: 0,
//     z: 5,
//     x: 3,
//     y: 8,
//     repeat: -1
// })


// ------------------------- Object -------------------------
// const geometry = new THREE.BoxGeometry(1, 1, 1)
// const material = new THREE.MeshPhysicalMaterial({
//     color: 0xF5D261,
//     metalness: 1,
//     roughness: 0.5,
//     transmission: 0.5,
//     thickness: 0.5,
// })
// const mesh = new THREE.Mesh(geometry, material)
// mesh.position.set(-3, -2, -1)

// mesh.traverse(n => {
//     if (n.isMesh) {
//         n.castShadow = true
//         n.receiveShadow = true
//         if (n.material.map) n.material.map.anisotropy = 16
//     }
// })

// // Animation
// gsap.to(mesh.rotation, {
//     duration: 300,
//     delay: 0,
//     z: 5,
//     x: 3,
//     repeat: -1
// })

// scene.add(mesh)

// const geometry2 = new THREE.BoxGeometry(0.5, 0.5, 0.5)
// const material2 = new THREE.MeshPhysicalMaterial({
//     color: 0x61F570,
//     metalness: 0,
//     roughness: 1,
//     transmission: 0,
//     thickness: 1,
// })
// const mesh2 = new THREE.Mesh(geometry2, material2)
// mesh2.position.set(2, 2, -10)

// mesh2.traverse(n => {
//     if (n.isMesh) {
//         n.castShadow = true
//         n.receiveShadow = true
//         if (n.material.map) n.material.map.anisotropy = 16
//     }
// })

// Animation
// gsap.fromTo(mesh2.position, {
//     z: -1
// }, {
//     z: 1,
//     duration: 5,
//     yoyo: true,
//     ease: "sine.inOut",
//     repeat: -1
// })

// scene.add(mesh2)

// ------------------------- Models -------------------------
// import model from './models/spaceship.glb'

// let mars = new GLTFLoader()
// mars.load(model, function (gltf) {
//     mars = gltf.scene
//     gltf.scene.scale.set(0.15, 0.15, 0.15)
//     gltf.scene.position.set(0, -4, 0)
//     gltf.scene.rotation.set(1.5, 0, 0)

//     mars.traverse(n => {
//         if (n.isMesh) {
//             n.castShadow = true
//             n.receiveShadow = true
//             if (n.material.map) n.material.map.anisotropy = 16
//         }
//     })

//     // Animation
//     gsap.fromTo(mars.rotation, {
//         z: -0.1
//     }, {
//         z: 0.1,
//         duration: 1.5,
//         yoyo: true,
//         ease: "sine.inOut",
//         repeat: -1
//     })

//     scene.add(mars)
// })

// ------------------------- Renderer -------------------------
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha: true
})

renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.toneMappingExposure = 0.4
renderer.outputEncoding = THREE.sRGBEncoding

renderer.setSize(sizes.width, sizes.height)
renderer.render(scene, camera)
renderer.setClearColor(fog)
renderer.shadowMap.enabled = true

// ------------------------- Controls -------------------------
const controls = new OrbitControls(camera, renderer.domElement)
controls.autoRotate = false
controls.enableDamping = true
controls.enableZoom = false

// ------------------------- Debugging -------------------------
// gui.add(camera.position, 'z', 1, 50, 1, ).name('Nebula zoom')

// ------------------------- Player controls -------------------------
// document.onkeydown = function (e) {
//     var keyCode = event.which
//     if (keyCode === 37) {
//         mars.position.x -= 0.1
//         controls.autoRotate = true
//         controls.autoRotateSpeed = +1
//     }
//     if (keyCode === 39) {
//         mars.position.x += 0.1
//         controls.autoRotate = true
//         controls.autoRotateSpeed = -1
//     }
//     // if (keyCode === 38) {
//     //     mars.position.y += 0.1
//     // }
//     // if (keyCode === 40) {
//     //     mars.position.y -= 0.1
//     // }
// }

// document.onkeyup = function (e) {
//     controls.autoRotate = false
// }

// ------------------------- Clock -------------------------
const clock = new THREE.Clock()

// ------------------------- Tick function -------------------------
const tick = () => {
    const elapsedTime = clock.getElapsedTime()
    // mesh2.position.z = Math.sin(elapsedTime * 0.25) * 0.5
    // mesh2.position.x = Math.cos(elapsedTime * 0.15) * 1
    // mesh2.position.y = -Math.cos(elapsedTime * 0.35) * 0.25

    // cloudParticles.forEach(p => {
    //     p.rotation.z -= 0.001
    // })

    // Render
    renderer.render(scene, camera)

    // Controls
    controls.update()

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}
tick()

// // ----------------- Animation -----------------
// function animate() {
//     requestAnimationFrame(animate)
//     renderer.render(scene, camera)
// }
// animate()

// ------------------------- Resize window -------------------------
window.addEventListener('resize', () => {

    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    // Casting shadows
    renderer.shadowMap.enabled = true
})