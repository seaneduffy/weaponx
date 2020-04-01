import THREE from './three';
require('three/examples/js/loaders/GLTFLoader.js');

import Character from './character';
import Camera from './camera';

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

		this.light1 = new THREE.AmbientLight(0xffffff);
		this.scene.add(this.light1);
		this.light2 = new THREE.PointLight(0xffffff, 1, 100);
		this.light2.position.set(0, 4, -10);
		this.scene.add(this.light2);
		this.renderer.setClearColor(0x808080);
		this.character = new Character();
		this.character.loadModel('/weaponx.glb').then(() => {
			this.scene.add(this.character.scene);
			this.animationObjects.push(this.character);
			this.character.scene.lookAt(1, 0, -1);
			this.camera.followCharacter(this.character);
			this.character.setWalkSpeed(0.04);
			this.character.setWalkSpeed(0.08);
			this.character.setTurnSpeed(Math.PI / 80);
		});
		this.walking = false;
		this.running = false;
		this.turningLeft = false;
		this.turningRight = false;
		this.shiftDown = false;
		this.forwardDown = false;
		window.character = this.character;
		document.body.addEventListener('keydown', (key) => {
			if (key.code === 'KeyW') {
				this.forwardDown = true;
				if (this.shiftDown) {
					this.running = true;
				} else {
					this.walking = true;
				}
			} else if (key.code === 'KeyS') {
				//
			} else if (key.code === 'KeyA') {
				this.turningLeft = true;
			} else if (key.code === 'KeyD') {
				this.turningRight = true;
			} else if (key.code === 'ShiftLeft') {
				this.shiftDown = true;
				if (this.forwardDown) {
					this.running = true;
				}
			}
		});
		document.body.addEventListener('keyup', (key) => {
			if (key.code === 'KeyW') {
				this.forwardDown = false;
				this.running = false;
				this.walking = false;
				this.character.stopMoving();
			} else if (key.code === 'KeyS') {
				//
			} else if (key.code === 'KeyA') {
				this.turningLeft = false;
			} else if (key.code === 'KeyD') {
				this.turningRight = false;
			} else if (key.code === 'ShiftLeft') {
				this.shiftDown = false;
				this.running = false;
			}
		});
		window.addEventListener('resize', () => {
			this.renderer.setSize(window.innerWidth, window.innerHeight);
			this.camera.updateViewport();
		});

		// Optional: Provide a DRACOLoader instance to decode compressed mesh data
		// var dracoLoader = new DRACOLoader();
		// dracoLoader.setDecoderPath( '/examples/jsm/libs/draco/' );
		// loader.setDRACOLoader( dracoLoader );
		this.tick();
	}
	tick() {
		if (this.running) {
			this.character.runForward();
		} else if (this.walking) {
			this.character.walkForward();
		}
		if (this.turningLeft) {
			this.character.turnLeft();
		}
		if (this.turningRight) {
			this.character.turnRight();
		}
		this.camera.update();
		const delta = this.clock.getDelta();
		this.animationObjects.forEach((animationObject) => {
			if (animationObject.animationsActive) {
				animationObject.animationMixer.update(delta);
			}
		});
		this.renderer.render(this.scene, this.camera.camera);
		requestAnimationFrame(() => {
			this.tick();
		});
	}
}