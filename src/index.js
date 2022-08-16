import * as THREE from 'three'
import {
    OrbitControls
} from 'three/examples/jsm/controls/OrbitControls.js'
import {
    GLTFLoader
} from 'three/examples/jsm/loaders/GLTFLoader.js'

import './styles/main.scss'

import './scripts/actions/player_movement'
import './scripts/sprites/player_1'

// ------------------------- Canvas -------------------------
const canvas = document.querySelector('canvas.webgl')

// ------------------------- Scene -------------------------
const scene = new THREE.Scene()

// ------------------------- Fog -------------------------
const fog = new THREE.Fog('#262837', 1, 10)
scene.fog = fog

// ------------------------- Sizes -------------------------
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

// ------------------------- Camera -------------------------
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height)
camera.position.set(0, 0, 8)
scene.add(camera)

// ------------------------- Lights -------------------------
// Ambient
const ambientLight = new THREE.AmbientLight(0xffffff, 1)
scene.add(ambientLight)

// Point
const pointLight = new THREE.PointLight(0xffffff, 1)
pointLight.position.x = -2
pointLight.position.y = 2
pointLight.position.z = -2
pointLight.castShadow = true
pointLight.shadow.mapSize.width = 1024
pointLight.shadow.mapSize.height = 1024
scene.add(pointLight)

// ------------------------- Galaxy -------------------------
const parameters = {}
parameters.count = 100000
parameters.size = 0.01
parameters.radius = 5
parameters.randomness = 0.2
parameters.insideColor = '#ffffff'
parameters.outsideColor = '#ffff00'

const generateGalaxy = () => {

    // Geometry
    const geometry = new THREE.BufferGeometry()
    const positions = new Float32Array(parameters.count * 3)
    const colors = new Float32Array(parameters.count * 3)

    for (let i = 0; i < parameters.count; i++) {
        const i3 = i * 3

        const radius = Math.random() * parameters.radius

        const randomX = (Math.random() - 0.5) * parameters.randomness * radius
        const randomY = (Math.random() - 0.5) * parameters.randomness * radius
        const randomZ = (Math.random() - 0.5) * parameters.randomness * radius

        const colorInside = new THREE.Color(parameters.insideColor)
        const colorOutside = new THREE.Color(parameters.outsideColor)
        const mixedColor = colorInside.clone()
        mixedColor.lerp(colorOutside, radius / parameters.radius)

        positions[i3] = (Math.random() - 0.5) * 100
        positions[i3 + 1] = (Math.random() - 0.5) * 100
        positions[i3 + 2] = (Math.random() - 0.5) * 100

        colors[i3    ] = mixedColor.r
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
}

generateGalaxy()

// ------------------------- Object -------------------------
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshPhysicalMaterial({
    color: 0x7161F5,
    metalness: 1,
    roughness: 0.5,
    transmission: 0.5,
    thickness: 0.5,
})
const mesh = new THREE.Mesh(geometry, material)
mesh.position.set(0, -2, 0)

mesh.traverse(n => {
    if (n.isMesh) {
        n.castShadow = true
        n.receiveShadow = true
        if (n.material.map) n.material.map.anisotropy = 16
    }
})

scene.add(mesh)

// ------------------------- Models -------------------------
import model from './models/mars.glb'

let mars = new GLTFLoader()
mars.load(model, function (gltf) {
    mars = gltf.scene
    gltf.scene.scale.set(0.25, 0.25, 0.25)
    gltf.scene.position.set(2, 0, 0)

    mars.traverse(n => {
        if (n.isMesh) {
            n.castShadow = true
            n.receiveShadow = true
            if (n.material.map) n.material.map.anisotropy = 16
        }
    })

    scene.add(mars)
})

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