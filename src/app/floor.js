import Surface from './surface';

export default class Floor {
	constructor(data) {
		this.surface = new Surface(data.panels);
		this.surface.object3d.rotation.x = Math.PI * 3 / 2;
		this.surface.object3d.position.y = data.y;
	}
}
