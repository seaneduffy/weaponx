import THREE from './three';
import Plane from './plane';

export default class Panel {
	constructor(path, width, height) {
		this.object3d = new THREE.Object3D();
		this.plane = new Plane(path, width, height);
		this.object3d.add(this.plane.object3d);
		this.plane.object3d.position.set(width * 0.5, height * 0.5, 0);
	}
}
