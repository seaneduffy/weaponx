import THREE from './three';
import Panel from './panel';

export default class Surface {
	constructor(data) {
		this.object3d = new THREE.Object3D();
		data.forEach(panelData => {
			this.addPanel(
				panelData.path,
				panelData.width,
				panelData.height,
				panelData.x,
				panelData.y
			);
		});
	}
	addPanel(path, width, height, x, y) {
		const panel = new Panel(path, width, height);
		panel.object3d.position.set(x, y, 0);
		this.object3d.add(panel.object3d);
	}
}
