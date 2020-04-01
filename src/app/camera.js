import THREE from './three';

export default class Camera {
	constructor() {
		this.tmpVec1 = new THREE.Vector3();
		this.tmpVec2 = new THREE.Vector3();
		this.tmpVec3 = new THREE.Vector3();
		this.tmpVec4 = new THREE.Vector3();
		this.tmpVec5 = new THREE.Vector3();
		this.camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 0.01, 1000);
		this.tanFOV = Math.tan(((Math.PI / 180 ) * this.camera.fov / 2));
		this.ogWindowHeight = window.innerHeight;
		this.camera.position.set(0, 2, 12);
		this.speed = 1;
		this.followDistance = 14;
		this.followHeight = 7;
		this.lookAtHeight = 3;
		this.lookAtVector = new THREE.Vector3();
		window.camera = this.camera;
	}
	updateViewport() {
		this.camera.aspect = window.innerWidth / window.innerHeight;
	    this.camera.fov = (360 / Math.PI) * Math.atan(this.tanFOV * (window.innerHeight / this.ogWindowHeight));
	    this.camera.updateProjectionMatrix();
	}
	followCharacter(character) {
		this.characterFollowing = character;
	}
	update() {
		if (this.characterFollowing) {
			const characterPosition = this.characterFollowing.scene.getWorldPosition(this.tmpVec1);
			const characterDirection = this.characterFollowing.scene.getWorldDirection(this.tmpVec2);
			const followPosition = characterDirection.negate().multiplyScalar(this.followDistance);
			followPosition.y += this.followHeight;
			const lookAtPosition = this.tmpVec3.copy(this.characterFollowing.scene.position);
			lookAtPosition.y += this.lookAtHeight;
			this.lookAtVector = this.updatePosition(this.lookAtVector, lookAtPosition, this.lookAtVector);
			this.camera.position.copy(this.updatePosition(this.camera.position, followPosition, this.tmpVec4));
			this.camera.lookAt(this.lookAtVector);
		}
	}
	updatePosition(oldPosition, newPosition, target) {
		const distance = oldPosition.distanceTo(newPosition);
		if (distance <= this.speed) {
			return target.copy(newPosition);
		}
		const fromOldToNew = this.tmpVec3.subVectors(newPosition, oldPosition);
		fromOldToNew.normalize();
		fromOldToNew.multiplyScalar(this.speed);
		return target.addVectors(oldPosition, fromOldToNew);
	}
}