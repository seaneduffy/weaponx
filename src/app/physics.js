import PhysicsObject from './physics-object';

export default class Physics {
	constructor() {
		this.objects = [];
		this.objectsDict = {};
	}

	addObject3d(object3d, name) {
		const physicsObject = new PhysicsObject(object3d);
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