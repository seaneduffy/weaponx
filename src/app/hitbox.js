import THREE from './three';

export default class Hitbox {
	constructor(type, w, h, d, followObject, offsetX, offsetY, offsetZ) {
		this.type = type;
		this.geom = new THREE.BoxBufferGeometry(w, h, d);
		const mat = new THREE.MeshBasicMaterial({ color: 0x00f300, transparent: true, opacity: 0.6 });
		this.box = new THREE.Mesh(this.geom, mat);
		this.box.position.set(offsetX || 0, offsetY || 0, offsetZ || 0);
		this.geom.computeBoundingSphere();
		this.radius = this.geom.boundingSphere.radius;
		this.followObject = followObject;
		followObject.add(this.box);
		this.geom.computeBoundingBox();
		this.boundingBox = this.geom.boundingBox;
		this.testBox = new THREE.Box3();
		this.tmpVec = new THREE.Vector3();
		this.box.visible = false;
	}
	get position() {
		return this.box.getWorldPosition(this.tmpVec);
	}
	intersectsHitBox(hitbox) {
		return hitbox.testBox.intersectsBox(this.testBox);
	}
	checkCollision(hitbox) {
		const distance = this.position.distanceTo(hitbox.position);
		const radiusDistance = this.radius + hitbox.radius;
		return distance <= radiusDistance && this.intersectsHitBox(hitbox);
	}
	transformBox() {
		const position = this.position;
		this.testBox.copy(this.boundingBox);
		this.testBox.applyMatrix4(this.box.matrix);
		this.testBox.min.add(position);
		this.testBox.max.add(position);
	}
}

Hitbox.TYPE = {
	HEAD: 'hitbox_type_head',
	BODY: 'hitbox_type_body',
	LEFT_ARM: 'hitbox_type_leftarm',
	RIGHT_ARM: 'hitbox_type_rightarm',
	LEFT_LEG: 'hitbox_type_leftleg'
};
