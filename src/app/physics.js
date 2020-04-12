import PhysicsObject from './physics-object';
import { removeFromArray } from './util';

class Physics {
	constructor() {
		this.objects = [];
	}

	addObject3d(object3d, gravity) {
		const physicsObject = new PhysicsObject(object3d, gravity);
		this.objects.push(physicsObject);
		return physicsObject;
	}

	removeObject3d(object3d) {
		removeFromArray(this.objects, physicsObject => object3d === physicsObject.object3d);
	}

	update() {
		this.objects.forEach((object) => {
			object.update();
		});
	}
}

export default new Physics();
