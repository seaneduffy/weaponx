import timeout from './timeout';
import { GltfModel } from './models';

export default class Sprite {
	constructor() {
		this.animationsActive = false;
		this.tmpVec1 = new THREE.Vector3();
		this.currAnimation = null;
		this.model = new GltfModel();
	}

	get object3d() {
		return this.model.scene;
	}
	
	get gltf() {
		return this.model.gltf;
	}

	get bones() {
		return this.model.bones;
	}
	
	get animationMixer() {
		return this.model.animationMixer;
	}

	get actions() {
		return this.model.actions;
	}

	update(velChange) {
		if (velChange) {
			this.object3d.position.add(velChange);
		}
	}

	changeState(state) {
		if (this.state === state) {
			return;
		}
		this.lastState = state;
		this.state = state;
		if (this.currAnimation) {
			this.currAnimation.stop();
		}
		if (state === Sprite.STATE.WALKING) {
			this.currAnimation = this.actions.WalkCycle;
		} else if (state === Sprite.STATE.WAITING) {
			this.currAnimation = this.actions.WaitingCycle;
		} else if (state === Sprite.STATE.RUNNING) {
			this.currAnimation = this.actions.RunCycle || this.actions.RunningCycle;
		} else if (state === Sprite.STATE.STANDING) {
			this.currAnimation = this.actions.StandingCycle;
		} else if (state === Sprite.STATE.JUMPING) {
			this.currAnimation = this.actions.Jump;
		} else if (state === Sprite.STATE.LANDING) {
			this.currAnimation = this.actions.Land;
		} else if (state === Sprite.STATE.PUNCH_R) {
			this.currAnimation = this.actions.PunchR;
		} else if (state === Sprite.STATE.PUNCH_L) {
			this.currAnimation = this.actions.PunchL;
		} else if (state === Sprite.STATE.SWIPE_RU) {
			this.currAnimation = this.actions.SwipeRU;
		} else if (state === Sprite.STATE.SWIPE_RD) {
			this.currAnimation = this.actions.SwipeRD;
		} else if (state === Sprite.STATE.SWIPE_R) {
			this.currAnimation = this.actions.SwipeR;
		} else if (state === Sprite.STATE.SWIPE_L) {
			this.currAnimation = this.actions.SwipeL;
		} else if (state === Sprite.STATE.SWIPE_LU) {
			this.currAnimation = this.actions.SwipeLU;
		} else if (state === Sprite.STATE.SWIPE_LD) {
			this.currAnimation = this.actions.SwipeLD;
		} else if (state === Sprite.STATE.SWIPE_U) {
			this.currAnimation = this.actions.SwipeU;
		} else if (state === Sprite.STATE.SWIPE_D) {
			this.currAnimation = this.actions.SwipeD;
		} else if (state === Sprite.STATE.AIMING_HANDGUN) {
			this.currAnimation = this.actions.AimingHandgunCycle;
		} else if (state === Sprite.STATE.FIRING_HANDGUN) {
			this.currAnimation = this.actions.FiringHandgun;
		} else if (state === Sprite.STATE.STUN) {
			this.currAnimation = this.actions.Stun;
		}
		this.currAnimation.play();
	}

	jump() {
		this.physicsObject.accelerate(this.tmpVec1.set(0, this.jumpSpeed, 0));
		this.changeState(Sprite.STATE.JUMPING);
		const checkForLanding = () => {
			if (this.object3d.position.y <= 0) {
				this.land();
				return;
			}
			requestAnimationFrame(() => {
				checkForLanding();
			});
		};
		requestAnimationFrame(() => {
			checkForLanding();
		});
	}

	land() {
		this.changeState(Sprite.STATE.LANDING);
		timeout(300, () => {
			this.changeState(Sprite.STATE.STANDING);
		});
	}

	returnToState() {
		this.changeState(this.lastState);
	}
}

Sprite.STATE = {
	STANDING: 'state_standing',
	WAITING: 'state_waiting',
	WALKING: 'state_walking',
	RUNNING: 'state_running',
	JUMPING: 'state_jumping',
	LANDING: 'state_landing',
	PUNCH_L: 'state_punch_l',
	PUNCH_R: 'state_punch_r',
	SWIPE_RU: 'state_swipe_ru',
	SWIPE_RD: 'state_swipe_rd',
	SWIPE_R: 'state_swipe_r',
	SWIPE_LU: 'state_swipe_lu',
	SWIPE_LD: 'state_swipe_ld',
	SWIPE_L: 'state_swipe_l',
	SWIPE_U: 'state_swipe_u',
	SWIPE_D: 'state_swipe_d',
	AIMING_HANDGUN: 'state_aim',
	FIRING_HANDGUN: 'state_fire_handgun',
	STUN: 'state_stun'
};