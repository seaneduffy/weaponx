import THREE from './three';

class Camera {
	constructor() {
		this.tmpVec1 = new THREE.Vector3();
		this.tmpVec2 = new THREE.Vector3();
		this.tmpVec3 = new THREE.Vector3();
		this.speed = 0.2;
		this.camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 0.01, 1000);
		this.tanFOV = Math.tan(((Math.PI / 180 ) * this.camera.fov / 2));
		this.ogWindowHeight = window.innerHeight;
		window.followPosition = this.followPosition = new THREE.Vector3(-3, 3.5, -10);
		window.lookAtPosition = this.lookAtPosition = new THREE.Vector3(0, 3.5, 3);
	}
	updateViewport() {
		this.camera.aspect = window.innerWidth / window.innerHeight;
	    this.camera.fov = (360 / Math.PI) * Math.atan(this.tanFOV * (window.innerHeight / this.ogWindowHeight));
	    this.camera.updateProjectionMatrix();
	}
	followSprite(sprite) {
		this.spriteFollowing = sprite;
	}
	update() {
		if (this.spriteFollowing) {
			const object3d = this.spriteFollowing.object3d;
			this.tmpVec1.copy(this.followPosition);
			this.tmpVec2.copy(this.lookAtPosition);
			this.tmpVec1.applyQuaternion(object3d.quaternion);
			this.tmpVec2.applyQuaternion(object3d.quaternion);
			this.tmpVec2.add(object3d.position);
			this.camera.position.addVectors(object3d.position, this.tmpVec1);
			this.camera.lookAt(this.tmpVec2);
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

export default new Camera();
