import THREE from './three';
import Wall from './wall';
import Floor from './floor';

export default class Level {
	constructor(data) {
		this.floors = [];
		this.walls = [];
		this.object3d = new THREE.Object3D();
		data.floors.forEach(floorData => {
			const floor = new Floor(floorData);
			this.object3d.add(floor.surface.object3d);
			this.floors.push(floor);
		});
		data.walls.forEach(wallData => {
			const wall = new Wall(wallData);
			this.object3d.add(wall.surface.object3d);
			this.walls.push(wall);
		});
	}
}
