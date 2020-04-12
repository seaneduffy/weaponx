import Hitbox from './hitbox';
import Attack from './attack';
import { removeFromArray } from './util';

export default class CombatObject {
	constructor(parent) {
		this.parent = parent;
		this.attacks = [];
		this.hitboxes = [];
	}
	addAttack(type, w, h, d, followObject, offsetX, offsetY, offsetZ) {
		const attack = new Attack(type, w, h, d, followObject, offsetX, offsetY, offsetZ);
		this.attacks.push(attack);
		return attack;
	}
	addHitbox(type, w, h, d, followObject, offsetX, offsetY, offsetZ) {
		const hitbox = new Hitbox(type, w, h, d, followObject, offsetX, offsetY, offsetZ);
		this.hitboxes.push(hitbox);
		return hitbox;
	}
	removeAttack(attack) {
		const found = removeFromArray(this.attacks, attack);
		if (found) {
			attack.hitbox.box.parent.remove(attack.hitbox.box);
		}
	}
	getHit(attack, hitbox) {
		this.parent.getHit(attack, hitbox);
	}
}
