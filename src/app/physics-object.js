import THREE from './three';

export default class PhysicsObject {
	constructor(object3d, gravity) {
		this.object3d = object3d;
		this.originVec = new THREE.Vector3();
		this.velocity = new THREE.Vector3();
		this.tmpVec1 = new THREE.Vector3();
		const gravityScalar = gravity || PhysicsObject.GRAVITY;
		this.gravity = new THREE.Vector3(0, -gravityScalar, 0);
		this.airDrag = new THREE.Vector3(0, PhysicsObject.AIR_DRAG, 0);
	}
	accelerate(velocity) {
		this.velocity.add(velocity);
		if (this.object3d.position.y <= 0 && this.velocity.y < 0) {
			this.velocity.y = 0;
		}
	}
	drag(dragDirection, dragAmount) {
		if (this.velocity.x === 0 && this.velocity.y === 0 && this.velocity.z === 0) {
			return;
		}
		const speed = this.velocity.distanceTo(this.originVec);
		const drag = dragAmount > speed ? speed : dragAmount;
		dragDirection.multiplyScalar(drag);
		this.velocity.add(dragDirection);
	}
	update() {
		this.object3d.position.add(this.velocity);
		const dragDirection = this.tmpVec1.copy(this.velocity);
		dragDirection.y = 0;
		dragDirection.normalize().negate();
		this.drag(dragDirection, PhysicsObject.DRAG);
		let drag = PhysicsObject.DRAG;
		this.accelerate(this.gravity);
		this.object3d.position.y = this.object3d.position.y < 0 ? 0 : this.object3d.position.y;
	}
}


PhysicsObject.DRAG = 0.025;
PhysicsObject.AIR_DRAG = 0.2;
PhysicsObject.GRAVITY = 0.1;
