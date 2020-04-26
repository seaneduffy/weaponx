import THREE from './three';
require('three/examples/js/loaders/GLTFLoader.js');

import Logan from './logan';
import Soldier from './soldier';
import camera from './camera';
import physics from './physics';
import scene from './scene';
import combatSystem from './combat-system';
import Blood from './blood';
import Level from './level';
import control from './control';

export default class App {
	constructor() {
		this.clock = new THREE.Clock();
		this.combatSystem = combatSystem;
		this.physics = physics;
		this.scene = scene;
		this.camera = camera;
		this.worldHomePosition = new THREE.Vector3(0, 2, 0);
		this.renderer = new THREE.WebGLRenderer();
		this.renderer.setSize(window.innerWidth, window.innerHeight);
		this.startButton = document.body.querySelector('button');
		this.animationObjects = [];
		this.light1 = new THREE.PointLight(0x2819e1, 1);
		this.light2 = new THREE.PointLight(0xffffff, 1);
		this.light1.position.set(1000, 20, 0);
		this.light2.position.set(-1000, 20, 0);
		this.light1.lookAt(0, 0, 0);
		this.light2.lookAt(0, 0, 0);
		this.light3 = new THREE.DirectionalLight( 0xffffff );
		this.light3.position.set( 0, 30, 0 );
		this.scene.add(this.light3);
		this.scene.add(this.light1);
		this.scene.add(this.light2);
		this.renderer.setClearColor(0x808080);
		this.logan = new Logan();
		this.logan.loadModel('/weaponx.glb').then(() => {
			this.scene.add(this.logan.object3d);
			this.animationObjects.push(this.logan);
			this.camera.followSprite(this.logan);
			this.startButton.addEventListener('click', () => {
				document.body.appendChild(this.renderer.domElement);
				this.tick();
				this.renderer.domElement.requestPointerLock = this.renderer.domElement.requestPointerLock ||
					this.renderer.domElement.mozRequestPointerLock;
				this.renderer.domElement.requestPointerLock();
				control.init();
				this.startButton.style.display = 'none';
			});
		});
		this.soldier = new Soldier();
		this.soldier.loadModel('/soldier.glb').then(() => {
			this.scene.add(this.soldier.object3d);
			this.soldier.object3d.position.set(0, 0, 20);
			this.animationObjects.push(this.soldier);
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
		const oReq = new XMLHttpRequest();
		oReq.addEventListener('load', (e) => {
			const levelData = JSON.parse(e.target.response);
			const level = new Level(levelData);
			this.scene.add(level.object3d);
		});
		oReq.open('GET', '/level1.json');
		oReq.send();

		window.app = this;

		// Optional: Provide a DRACOLoader instance to decode compressed mesh data
		// var dracoLoader = new DRACOLoader();
		// dracoLoader.setDecoderPath( '/examples/jsm/libs/draco/' );
		// loader.setDRACOLoader( dracoLoader );
	}
	clearBlood() {
		Blood.clearBlood();
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
		combatSystem.update();
		this.renderer.render(this.scene, this.camera.camera);
		requestAnimationFrame(() => {
			this.tick();
		});
	}
}
