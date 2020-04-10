import Hitbox from './hitbox';

export default class Attack {
	constructor(type, w, h, d, followObject, offsetX, offsetY, offsetZ) {
		this.type = type;
		this.hitHandlers = [];
		this.hitbox = new Hitbox(type, w, h, d, followObject, offsetX, offsetY, offsetZ);
	}
	onHit(handler) {
		this.hitHandlers.push(handler);
	}
	hit(hitbox) {
		this.hitHandlers.forEach(handler => {
			handler(hitbox);
		});
	}
}

Attack.TYPE = {
	BULLET: 'attack_type_bullet',
	CLAW: 'attack_type_claw'
};
