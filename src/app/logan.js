import Sprite from './sprite';
import control from './control';
import timeout from './timeout';

export default class Logan extends Sprite {
	constructor() {
		super();
		this.walkSpeed = 0.04;
		this.runSpeed = 0.08;
		this.turnSpeed = Math.PI / 30;
		this.jumpSpeed = 1.2;

		control.onWalk(() => {
			this.changeState(Sprite.STATE.WALKING);
		});
		control.onStopMoving(() => {
			this.changeState(Sprite.STATE.STANDING);
		});
		control.onRun(() => {
			this.changeState(Sprite.STATE.RUNNING);
		});
		control.onPunch(() => {
			this.punch();
		});
		control.onJump(() => {
			this.jump();
		});
		control.onSwipe((direction) => {
			this.swipe(direction);
		});
	}
	update() {
		let velChange;
		if ((control.state.forwardDown && !control.state.shiftDown) || (control.state.walkThresholdHit && !control.state.runThresholdHit)) {
			velChange = this.object3d.getWorldDirection(this.tmpVec1).multiplyScalar(this.walkSpeed);
		} else if (control.state.forwardDown || control.state.runThresholdHit) {
			velChange = this.object3d.getWorldDirection(this.tmpVec1).multiplyScalar(this.runSpeed);
		}
		if (control.state.turnRightDown || control.state.turnRightThresholdHit) {
			this.object3d.rotation.y -= this.turnSpeed;
		}
		if (control.state.turnLeftDown || control.state.turnLeftThresholdHit) {
			this.object3d.rotation.y += this.turnSpeed;
		}
		super.update(velChange);
	}
	returnToState() {
		if (control.state.shiftDown && control.state.forwardDown) {
			this.changeState(Sprite.STATE.RUNNING);
		} else if (control.state.forwardDown) {
			this.changeState(Sprite.STATE.WALKING);
		} else {
			this.changeState(Sprite.STATE.STANDING);
		}
	}
	swipe(direction) {
		this.changeState(Sprite.STATE[`SWIPE_${direction}`]);
		timeout(600, () => {
			this.returnToState();
		});
	}
	punch() {
		this.changeState(Sprite.STATE.PUNCH_R);
		timeout(600, () => {
			this.returnToState();
		});
	}
}