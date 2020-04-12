import THREE from './three';

import scene from './scene';
import physics from './physics';

export default class Blood {
	constructor() {
		const maxScale = 0.11;
		const minScale = 0.08;
		const scale = Math.random() * (maxScale - minScale) + minScale;
		const geom = new THREE.BoxBufferGeometry(scale, scale, scale);
		const mat = new THREE.MeshBasicMaterial({ color: 0xbe0000 });
		this.object3d = new THREE.Mesh(geom, mat);
		this.physicsObject = physics.addObject3d(this.object3d, 0.01);
	}
	add(position, vel) {
		this.object3d.position.copy(position);
		scene.add(this.object3d);
		this.physicsObject.accelerate(vel);
		Blood.bloodObjects.push(this);
	}
	remove() {
		scene.remove(this.object3d);
		physics.removeObject3d(this.object3d);
	}
}

Blood.bloodObjects = [];
Blood.clearBlood = () => {
	Blood.bloodObjects.forEach(blood => {
		blood.remove();
	});
	Blood.bloodObjects = [];
};
