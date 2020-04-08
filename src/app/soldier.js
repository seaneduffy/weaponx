import Sprite from './sprite';
import control from './control';
import timeout from './timeout';

export default class Soldier extends Sprite {
	constructor() {
		super();
		this.walkSpeed = 0.04;
		this.runSpeed = 0.08;
		this.turnSpeed = Math.PI / 30;
		this.jumpSpeed = 1.2;

		// control.onWalk(() => {
		// 	this.changeState(Sprite.STATE.WALKING);
		// });
		// control.onStopMoving(() => {
		// 	this.changeState(Sprite.STATE.STANDING);
		// });
		// control.onRun(() => {
		// 	this.changeState(Sprite.STATE.RUNNING);
		// });
		// control.onPunch(() => {
		// 	this.punch();
		// });
		// control.onJump(() => {
		// 	this.jump();
		// });
		// control.onSwipe((direction) => {
		// 	this.swipe(direction);
		// });
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