import THREE from './three';
import Blood from './blood';

export default class BloodSpurt {
	constructor() {
		const maxScale = 100;
		const minScale = 60;
		const scale = Math.floor(Math.random() * (maxScale - minScale) + minScale);
		let counter = scale;
		this.minSpeed = 0.08;
		this.maxSpeed = 0.5;
		this.maxAngle = Math.PI / 180 * 10;
		this.minAngle = 0;
		this.bloods = [];
		this.xAxis = new THREE.Vector3(1, 0, 0);
		this.yAxis = new THREE.Vector3(0, 1, 0);
		this.zAxis = new THREE.Vector3(0, 0, 1);
		this.tmpVec = new THREE.Vector3();
		while (counter > 0) {
			const blood = new Blood();
			this.bloods.push(blood);
			counter -= 1;
		}
	}
	rotateDirection(direction, axis) {
		const angle = Math.random() * (this.maxAngle - this.minAngle) + this.minAngle;
		this.tmpVec.applyAxisAngle(axis, angle);
	}
	add(position, direction) {
		this.bloods.forEach(blood => {
			const speed = Math.random() * (this.maxSpeed - this.minSpeed) + this.minSpeed;
			this.tmpVec.copy(direction);
			this.tmpVec.normalize().multiplyScalar(speed);
			this.rotateDirection(this.tmpVec, this.xAxis);
			this.rotateDirection(this.tmpVec, this.yAxis);
			this.rotateDirection(this.tmpVec, this.zAxis);
			blood.add(position, this.tmpVec);
		});
	}
	remove() {
		this.bloods.forEach(blood => {
			blood.remove();
		});	
	}
}
