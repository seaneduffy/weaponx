import THREE from './three';
import Sprite from './sprite';
import control from './control';
import timeout from './timeout';
import combatSystem from './combat-system';
import Hitbox from './hitbox';
import BloodSpurt from './blood-spurt';

export default class Soldier extends Sprite {
	constructor() {
		super();
		this.walkSpeed = 0.04;
		this.runSpeed = 0.08;
		this.turnSpeed = Math.PI / 30;
		this.jumpSpeed = 1.2;
		this.tmpVec1 = new THREE.Vector3();

		// control.onWalk(() => {
		// 	this.changeState(Sprite.STATE.WALKING);
		// });
		// control.onStopMoving(() => {
		// 	this.changeState(Sprite.STATE.STANDING);
		// });
		// control.onRun(() => {
		// 	this.changeState(Sprite.STATE.RUNNING);
		// });
		// control.onClick(() => {
		// 	this.fire();
		// });
		// control.onJump(() => {
		// 	this.jump();
		// });
		// control.onDragRelease((direction) => {
		// 	this.swipe(direction);
		// });
	}
	getHit(attack, hitbox) {
		const bloodSpurt = new BloodSpurt();
		this.tmpVec1.copy(attack.direction);
		this.tmpVec1.y += 0.2;
		bloodSpurt.add(attack.hitbox.position, attack.direction);
	}
	loadModel(path) {
		return super.loadModel(path).then(() => {
			combatSystem.addEnemy(this);
			window.bodyHitbox = this.combatObject.addHitbox(Hitbox.TYPE.BODY, 0.6, 1.5, 0.8, this.model.bonesDict.Hip, 0, 0.5, 0);
		});
	}
	aim() {
		this.changeState(Sprite.STATE.AIMING_HANDGUN);
	}
	fire() {
		this.changeState(Sprite.STATE.FIRING_HANDGUN);
		timeout(600, () => {
			this.returnToState();
		});
	}
	stun() {
		this.changeState(Sprite.STATE.STUN);
		timeout(600, () => {
			this.returnToState();
		});
	}
}