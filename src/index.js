import './styles/main.scss'
import * as THREE from 'three'
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

// ------------------------- Fog -------------------------
const fog = new THREE.Fog('#07032E', 1, 13)
scene.fog = fog

// ------------------------- Sizes -------------------------
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

// ------------------------- Camera -------------------------
const camera = new THREE.PerspectiveCamera(90, sizes.width / sizes.height)
camera.position.set(0, 0, 5)
scene.add(camera)

// const helper = new THREE.CameraHelper(camera)
// scene.add(helper)

// ------------------------- Lights -------------------------
// Ambient
const ambientLight = new THREE.AmbientLight(0x7161F5, 0.75)
scene.add(ambientLight)

// Point
// const pointLight = new THREE.PointLight(0xff9000, 0.5)
// pointLight.position.set(1, - 0.5, 1)
// scene.add(pointLight)

// const sphereSize = 1;
// const pointLightHelper = new THREE.PointLightHelper( pointLight, sphereSize );
// scene.add( pointLightHelper )

// Directional
const directionalLight = new THREE.DirectionalLight(0x7161F5, 0.75)
directionalLight.position.set(-0.25, 0.5, 0.25)
scene.add(directionalLight)

// const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 1)
// scene.add(directionalLightHelper)

// Hemisphere
const hemisphereLight = new THREE.HemisphereLight(0x0000ff, 0x00ff00, 0.75)
hemisphereLight.position.set(1, -1, 0)
scene.add(hemisphereLight)

// const hemisphereLightHelper = new THREE.HemisphereLightHelper(hemisphereLight, 1)
// scene.add(hemisphereLightHelper)

// ------------------------- HDRI -------------------------
import hdri from './hdri/rooftop_night_2k.hdr'

new RGBELoader()
    .load(hdri, function (texture) {
        texture.mapping = THREE.EquirectangularReflectionMapping
        scene.environment = texture
    })

// ------------------------- Galaxy -------------------------
const parameters = {}
parameters.count = 100000
parameters.size = 0.01
parameters.radius = 1
parameters.randomness = 0.25
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

        const colorInside = new THREE.Color(parameters.insideColor)
        const colorOutside = new THREE.Color(parameters.outsideColor)
        const mixedColor = colorInside.clone()
        mixedColor.lerp(colorOutside, radius / parameters.radius)

        positions[i3] = (Math.random() - 0.5) * 100
        positions[i3 + 1] = (Math.random() - 0.5) * 100
        positions[i3 + 2] = (Math.random() - 0.5) * 100

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
}

generateGalaxy()

// ------------------------- Object -------------------------
// const geometry = new THREE.BoxGeometry(1, 1, 1)
// const material = new THREE.MeshPhysicalMaterial({
//     color: 0x7161F5,
//     metalness: 1,
//     roughness: 0.5,
//     transmission: 0.5,
//     thickness: 0.5,
// })
// const mesh = new THREE.Mesh(geometry, material)
// mesh.position.set(0, 0, 0)

// mesh.traverse(n => {
//     if (n.isMesh) {
//         n.castShadow = true
//         n.receiveShadow = true
//         if (n.material.map) n.material.map.anisotropy = 16
//     }
// })

// scene.add(mesh)

// ------------------------- Models -------------------------
import model from './models/spaceship.glb'

let mars = new GLTFLoader()
mars.load(model, function (gltf) {
    mars = gltf.scene
    gltf.scene.scale.set(0.25, 0.25, 0.25)
    gltf.scene.position.set(0, -5, -2)
    gltf.scene.rotation.set(1.5, 0, 0)

    mars.traverse(n => {
        if (n.isMesh) {
            n.castShadow = true
            n.receiveShadow = true
            if (n.material.map) n.material.map.anisotropy = 16
        }
    })

    // Animation
    gsap.fromTo(mars.rotation, {
        z: -0.1
    }, {
        z: 0.1,
        duration: 1.5,
        yoyo: true,
        ease: "sine.inOut",
        repeat: -1
    })

    scene.add(mars)
})

// ------------------------- Renderer -------------------------
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha: true
})

renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.toneMappingExposure = 0.75
renderer.outputEncoding = THREE.sRGBEncoding

renderer.setSize(sizes.width, sizes.height)
renderer.render(scene, camera)
renderer.setClearColor(fog)
renderer.shadowMap.enabled = true

// ------------------------- Controls -------------------------
// const controls = new OrbitControls(camera, renderer.domElement)
// controls.autoRotate = false
// controls.autoRotateSpeed = -1.5
// controls.enableDamping = true
// controls.enableZoom = false

// ------------------------- Player controls -------------------------
document.onkeydown = function (e) {
    var keyCode = event.which
    if (keyCode === 37) {
        mars.position.x -= 0.1
    }
    if (keyCode === 39) {
        mars.position.x += 0.1
    }
    if (keyCode === 38) {
        mars.position.y += 0.1
    }
    if (keyCode === 40) {
        mars.position.y -= 0.1
    }
}

// ------------------------- Clock -------------------------
const clock = new THREE.Clock()

// ------------------------- Tick function -------------------------
const tick = () => {
    const elapsedTime = clock.getElapsedTime()

    // Render
    renderer.render(scene, camera)

    // Controls
    // controls.update()

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