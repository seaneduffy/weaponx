import THREE from './three';
require('three/examples/js/loaders/GLTFLoader.js');

import Logan from './logan';
import Soldier from './soldier';
import Camera from './camera';
import Physics from './physics';

export default class App {
	constructor() {
		this.clock = new THREE.Clock();
		this.scene = new THREE.Scene();
		this.camera = new Camera();
		this.worldHomePosition = new THREE.Vector3(0, 2, 0);
		this.renderer = new THREE.WebGLRenderer();
		this.renderer.setSize(window.innerWidth, window.innerHeight);
		document.body.appendChild(this.renderer.domElement);

		this.animationObjects = [];

		this.light1 = new THREE.PointLight(0x2819e1, 1);
		this.light2 = new THREE.PointLight(0xffffff, 1);
		this.light1.position.set(1000, 0, 0);
		this.light2.position.set(-1000, 0, 0);
		this.light1.lookAt(0, 0, 0);
		this.light2.lookAt(0, 0, 0);
		this.scene.add(this.light1);
		this.scene.add(this.light2);
		this.renderer.setClearColor(0x808080);
		this.physics = new Physics();
		this.logan = new Logan();
		this.logan.model.loadModel('/weaponx.glb').then(() => {
			this.scene.add(this.logan.object3d);
			this.animationObjects.push(this.logan);
			this.camera.followSprite(this.logan);
			this.logan.physicsObject = this.physics.addObject3d(this.logan.object3d);
			this.tick();
			window.logan = this.logan;
		});
		this.soldier = new Soldier();
		this.soldier.model.loadModel('/soldier.glb').then(() => {
			this.scene.add(this.soldier.object3d);
			this.animationObjects.push(this.soldier);
			this.soldier.physicsObject = this.physics.addObject3d(this.soldier.object3d);
			window.soldier = this.soldier;
		});
		this.shiftDown = false;
		this.forwardDown = false;
		this.stopCameraFollowingTimeout = null;
		this.cameraFollowing = false;
		this.startCameraFollowing();
		window.addEventListener('resize', () => {
			this.renderer.setSize(window.innerWidth, window.innerHeight);
			this.camera.updateViewport();
		});

		// Optional: Provide a DRACOLoader instance to decode compressed mesh data
		// var dracoLoader = new DRACOLoader();
		// dracoLoader.setDecoderPath( '/examples/jsm/libs/draco/' );
		// loader.setDRACOLoader( dracoLoader );
	}
	startCameraFollowing() {
		this.cameraFollowing = true;
		if (this.stopCameraFollowingTimeout) {
			clearTimeout(this.stopCameraFollowingTimeout);
			this.stopCameraFollowingTimeout = null;
		}
	}
	stopCameraFollowing() {
		if (this.stopCameraFollowingTimeout) {
			return;
		}
		this.stopCameraFollowingTimeout = setTimeout(() => {
			this.cameraFollowing = false;
			this.stopCameraFollowingTimeout = null;
		}, 1000);
	}
	tick() {
		this.physics.update();
		this.logan.update();
		this.soldier.update();
		if (this.cameraFollowing) {
			this.camera.update();
		}
		const delta = this.clock.getDelta();
		this.animationObjects.forEach((animationObject) => {
			if (animationObject.animationMixer) {
				animationObject.animationMixer.update(delta);
			}
		});
		this.renderer.render(this.scene, this.camera.camera);
		requestAnimationFrame(() => {
			this.tick();
		});
	}
}