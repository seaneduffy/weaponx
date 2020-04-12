import THREE from './three';

export default class Plane {
	constructor(path, width, height) {
		const texture = new THREE.TextureLoader().load(path);
		const mat = new THREE.MeshPhongMaterial({ map: texture });
		const geom = new THREE.PlaneBufferGeometry(width, height, 1);
		this.object3d = new THREE.Mesh(geom, mat);
	}
}
