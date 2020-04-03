import THREE from './three';

export default class PhysicsObject {
	constructor(object3d) {
		this.object3d = object3d;
		this.velocity = new THREE.Vector3();
		this.tmpVec1 = new THREE.Vector3();
		this.gravity = new THREE.Vector3(0, -PhysicsObject.GRAVITY, 0);
		this.airDrag = new THREE.Vector3(0, PhysicsObject.AIR_DRAG, 0);
	}
	accelerate(velocity) {
		this.velocity.add(velocity);
		if (this.object3d.position.y <= 0 && this.velocity.y < 0) {
			this.velocity.y = 0;
		}
	}
	drag(dragDirection, dragAmount) {
		const speed = this.velocity.distanceTo(0, 0, 0);
		const drag = dragAmount > speed ? speed : dragAmount;
		dragDirection.multiplyScalar(drag);
		this.velocity.add(dragDirection);
	}
	update() {
		this.object3d.position.add(this.velocity);
		this.drag(this.tmpVec1.copy(this.velocity).normalize().negate(), PhysicsObject.DRAG);
		let drag = PhysicsObject.DRAG;
		this.accelerate(this.gravity);
		this.object3d.position.y = this.object3d.position.y < 0 ? 0 : this.object3d.position.y;
	}
}


PhysicsObject.DRAG = 0.1;
PhysicsObject.AIR_DRAG = 0.2;
PhysicsObject.GRAVITY = 0.1;