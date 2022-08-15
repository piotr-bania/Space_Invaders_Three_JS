import * as THREE from 'three'
import {
    OrbitControls
} from 'three/examples/jsm/controls/OrbitControls.js'

import './styles/main.scss'

import './scripts/actions/player_movement'
import './scripts/sprites/player_1'

// ------------------------- Canvas -------------------------
const canvas = document.querySelector('canvas.webgl')

// ------------------------- Scene -------------------------
const scene = new THREE.Scene()

// ------------------------- Fog -------------------------
const fog = new THREE.Fog('#262837', 1, 7)
scene.fog = fog

// ------------------------- Sizes -------------------------
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

// ------------------------- Camera -------------------------
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height)
camera.position.set(0, -2, 5)
scene.add(camera)

// ------------------------- Lights -------------------------
// Ambient
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
scene.add(ambientLight)

// Point
const pointLight = new THREE.PointLight(0xffffff, 0.5)
pointLight.position.x = -2
pointLight.position.y = 2
pointLight.position.z = -2
pointLight.castShadow = true
pointLight.shadow.mapSize.width = 1024
pointLight.shadow.mapSize.height = 1024
scene.add(pointLight)

// const pointLightHelper = new THREE.CameraHelper(pointLight.shadow.camera)
// scene.add(pointLightHelper)

// ------------------------- Object -------------------------
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshLambertMaterial()
const mesh = new THREE.Mesh(geometry, material)
mesh.position.set(0, 0, 0)

const geometry2 = new THREE.SphereGeometry(1, 32, 32)
const mesh2 = new THREE.Mesh(geometry2, material)
mesh2.position.set(-2, 0, 0)

scene.add(mesh, mesh2)

geometry2.castShadow = true
geometry.receiveShadow = true

// ------------------------- Renderer -------------------------
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha: true
})

renderer.setSize(sizes.width, sizes.height)
renderer.render(scene, camera)
renderer.setClearColor('#262837')
renderer.shadowMap.enabled = true

// ------------------------- Controls -------------------------
const controls = new OrbitControls(camera, renderer.domElement)
controls.autoRotate = true
controls.autoRotateSpeed = -0.5
controls.enableDamping = true
controls.enableZoom = false

// ------------------------- Player controls -------------------------



// ------------------------- Clock -------------------------
const clock = new THREE.Clock()

// ------------------------- Tick function -------------------------
const tick = () => {
    const elapsedTime = clock.getElapsedTime()

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
})