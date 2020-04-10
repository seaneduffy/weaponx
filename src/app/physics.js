import PhysicsObject from './physics-object';

class Physics {
	constructor() {
		this.objects = [];
		this.objectsDict = {};
	}

	addObject3d(object3d, gravity) {
		const physicsObject = new PhysicsObject(object3d, gravity);
		this.objects.push(physicsObject);
		this.objectsDict[name] = physicsObject;
		return physicsObject;
	}

	update() {
		this.objects.forEach((object) => {
			object.update();
		});
	}
}

export default new Physics();