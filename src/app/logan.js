import THREE from './three';
import Sprite from './sprite';
import control from './control';
import timeout from './timeout';
import combatSystem from './combat-system';
import Hitbox from './hitbox';
import Attack from './attack';

export default class Logan extends Sprite {
	constructor() {
		super();
		this.walkSpeed = 0.04;
		this.runSpeed = 0.32;
		this.turnSpeed = Math.PI / 180 * 1.2;
		this.jumpSpeed = 1.2;
		this.punchSpeed = 0.3;
		this.swipeSpeed = 0.5;
		this.attacking = false;
		this.velChange = new THREE.Vector3();
		this.swipeDirectionVec = new THREE.Vector3();
		this.directionVec = new THREE.Vector3();

		control.onWalk(() => {
			this.walk();
		});
		control.onStopMoving(() => {
			this.stopMoving();
		});
		control.onRun(() => {
			this.run();
		});
		control.onClick(() => {
			this.punch();
		});
		control.onJump(() => {
			this.jump();
		});
		control.onDragRelease((direction) => {
			this.swipe(direction);
		});
		control.onTurn(amount => {
			if (this.object3d) {
				this.object3d.rotation.y += this.turnSpeed * -amount;
			}
		});
	}
	loadModel(path) {
		return super.loadModel(path).then(() => {
			combatSystem.addPlayer(this);
			this.combatObject.addHitbox(Hitbox.TYPE.HEAD, 0.7, 0.7, 0.7, this.model.bonesDict.Head);
		});
	}
	update() {
		if (this.attacking) {
			return;
		}
		let velChange;
		if ((control.state.forwardDown && !control.state.shiftDown) || (control.state.walkThresholdHit && !control.state.runThresholdHit)) {
			velChange = this.object3d.getWorldDirection(this.velChange).multiplyScalar(this.walkSpeed);
		} else if (control.state.forwardDown || control.state.runThresholdHit) {
			velChange = this.object3d.getWorldDirection(this.velChange).multiplyScalar(this.runSpeed);
		}
		if (control.state.turnRightDown || control.state.turnRightThresholdHit) {
			this.object3d.rotation.y -= this.turnSpeed;
		}
		if (control.state.turnLeftDown || control.state.turnLeftThresholdHit) {
			this.object3d.rotation.y += this.turnSpeed;
		}
		super.update(velChange);
	}
	returnToState(time) {
		if (control.state.shiftDown && control.state.forwardDown) {
			this.changeState(Sprite.STATE.RUNNING, time);
		} else if (control.state.forwardDown) {
			this.changeState(Sprite.STATE.WALKING, time);
		} else {
			this.changeState(Sprite.STATE.STANDING, time);
		}
	}
	swipe(direction) {
		if (this.attacking) {
			return;
		}
		this.attacking = true;
		const velChange = this.object3d.getWorldDirection(this.velChange).multiplyScalar(this.swipeSpeed);
		timeout(250, () => {
			this.physicsObject.accelerate(velChange);
		});
		this.changeState(Sprite.STATE[`SWIPE_${direction}`], 100);
		let bone;
		if (direction === 'U') {
			this.swipeDirectionVec.set(0, 1, 0);
			bone = this.model.bonesDict.HandR;
		} else if (direction === 'RU') {
			this.swipeDirectionVec.set(-0.5, 0.5, 0);
			bone = this.model.bonesDict.HandL;
		} else if (direction === 'R') {
			this.swipeDirectionVec.set(-1, 0, 0);
			bone = this.model.bonesDict.HandL;
		} else if (direction === 'RD') {
			this.swipeDirectionVec.set(-0.5, -0.5, 0);
			bone = this.model.bonesDict.HandL;
		} else if (direction === 'D') {
			this.swipeDirectionVec.set(0, -1, 0);
			bone = this.model.bonesDict.HandR;
		} else if (direction === 'LD') {
			this.swipeDirectionVec.set(0.5, -0.5, 0);
			bone = this.model.bonesDict.HandR;
		} else if (direction === 'L') {
			this.swipeDirectionVec.set(1, 0, 0);
			bone = this.model.bonesDict.HandR;
		} else if (direction === 'LU') {
			this.swipeDirectionVec.set(0.5, 0.5, 0);
			bone = this.model.bonesDict.HandR;
		}
		this.swipeDirectionVec.applyQuaternion(this.object3d.quaternion);
		const attack = this.combatObject.addAttack(Attack.TYPE.CLAW, 0.2, 1, 0.2, bone, 0, 0.6, 0);
		attack.direction = this.swipeDirectionVec;
		timeout(900, () => {
			this.returnToState(100);
			this.attacking = false;
			this.combatObject.removeAttack(attack);
		});
	}
	punch() {
		if (this.attacking) {
			return;
		}
		this.attacking = true;
		const velChange = this.object3d.getWorldDirection(this.velChange).multiplyScalar(this.punchSpeed);
		timeout(250, () => {
			this.physicsObject.accelerate(velChange);
		});
		this.changeState(Sprite.STATE.PUNCH_R, 100);
		timeout(400, () => {
			this.changeState(Sprite.STATE.PUNCH_L, 200);
			timeout(500, () => {
				this.returnToState(100);
				this.attacking = false;
			});
		});
	}
	run() {
		if (this.attacking) {
			return;
		}
		super.run();
	}
	walk() {
		if (this.attacking) {
			return;
		}
		super.walk();
	}
	stopMoving() {
		if (this.attacking) {
			return;
		}
		super.stopMoving();
	}
}
