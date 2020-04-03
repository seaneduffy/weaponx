import THREE from './three';

import control from './control';
import Tween from './tween';
import timeout from './timeout';

window.sr = {
	x: 0,
	y: 0,
	z: 0
};

export default class Character {
	constructor() {
		this.animationsActive = false;
		this.actions = {};
		this.walkSpeed = 1;
		this.runSpeed = 1;
		this.turnSpeed = Math.PI / 180;
		this.jumpSpeed = 1.2;
		this.tmpVec1 = new THREE.Vector3();
		this.currAnimation = null;
		control.onWalk(() => {
			this.changeState(Character.STATE.WALKING);
		});
		control.onStopMoving(() => {
			this.changeState(Character.STATE.STANDING);
		});
		control.onRun(() => {
			this.changeState(Character.STATE.RUNNING);
		});
		control.onPunch(() => {
			this.punch();
		});
		control.onJump(() => {
			this.jump();
		});
		control.onSwipeRight((angle) => {
			this.swipeRight(angle);
		});
		control.onSwipeUp((angle) => {
			this.swipeUp(angle);
		});
		control.onSwipeDown((angle) => {
			this.swipeDown(angle);
		});
		control.onSwipeLeft((angle) => {
			this.swipeLeft(angle);
		});
	}

	setWalkSpeed(speed) {
		this.walkSpeed = speed;
	}

	setRunSpeed(speed) {
		this.runSpeed = speed;
	}

	setTurnSpeed(speed) {
		this.turnSpeed = speed;
	}

	loadModel(path) {
		const promise = new Promise((res, rej) => {
			const loader = new THREE.GLTFLoader();
			loader.load(
				path,
				gltf => {
					this.gltf = gltf;
					this.scene = gltf.scene;
					this.bones = gltf.scene.children;
					this.bonesDict = {};
					const tmpbones = [];
					this.iterateBones(bone => {
						if (bone.type === 'Bone') {
							this.bonesDict[bone.name] = bone;
							tmpbones.push(bone);
						}
					});
					this.bones = tmpbones;
					const baseSwipeAnimations = [
						'SwipeR',
						'SwipeL'
					];
					const bonesForSwipe = [
						'HandControl',
						'ElbowPoint',
						'Hand',
						'LowerArm',
						'UpperArm',
						'Digit_1_1',
						'Digit_1_2',
						'Digit_1_3',
						'Digit_2_1',
						'Digit_2_2',
						'Digit_2_3',
						'Digit_3_1',
						'Digit_3_2',
						'Digit_3_3',
						'Digit_4_1',
						'Digit_4_2',
						'Digit_4_3',
						'Digit_5_1',
						'Digit_5_2',
						'Digit_5_3',
						'Shoulder'
					];
					const directions = [
						'RU',
						'R',
						'RD',
						'DL',
						'D',
						'DR',
						'LU',
						'L',
						'LD',
						'U',
						'UL',
						'UR'
					];
					const swipeTracks = '';
					const removeTrack = (tracks, trackName) => {
						let index;
						tracks.forEach((track, i) => {
							if (track.name === trackName) {
								index = i;
							}
						});
						if (typeof index === 'number') {
							tracks.splice(index, 1);
						}
					};
					const removeTrackInSet = (tracks, keepName) => {
						let index;
						tracks.forEach((track, i) => {
							if (track.name === trackToRemoveName) {
								index = i;
							}
						});
						if (typeof index === 'number') {
							tracks.splice(index, 1);
						}
					};
					baseSwipeAnimations.forEach((animName) => {
						let append = animName[animName.length - 1];
						append = append === 'R' ? 'L' : 'R';
						this.gltf.animations.forEach((anim) => {
							if (anim.name === animName) {
								bonesForSwipe.forEach(bone => {
									removeTrack(anim.tracks, `${bone}${append}.position`);
									removeTrack(anim.tracks, `${bone}${append}.quaternion`);
								});
							} else {
								directions.forEach(direction => {
									if (anim.name === `${animName}_${direction}`) {
										const newTracks = [];
										anim.tracks.forEach(track => {
											bonesForSwipe.forEach(bone => {
												if (track.name === `${bone}${append}.position` || track.name === `${bone}${append}.quaternion`) {
													newTracks.push(track);
												}
											});
										});
										anim.tracks = newTracks;
									}
								});
							}
						});
					});
					this.animationMixer = new THREE.AnimationMixer(this.gltf.scene);
					this.gltf.animations.forEach((anim) => {
						this.actions[anim.name] = this.animationMixer.clipAction(anim);
					});
					// remove swipe tracks
					this.animationsActive = true;
					this.changeState(Character.STATE.STANDING);
					res();
				},
				xhr => {
					console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
				},
				error => {
					console.log( 'An error happened', error);
					rej();
				}
			);
		});
		return promise;
	}

	update() {
		let velChange;
		if (control.state.forwardDown && !control.state.shiftDown) {
			velChange = this.scene.getWorldDirection(this.tmpVec1).multiplyScalar(this.walkSpeed);
		} else if (control.state.forwardDown) {
			velChange = this.scene.getWorldDirection(this.tmpVec1).multiplyScalar(this.runSpeed);
		}
		if (velChange) {
			this.scene.position.add(velChange);
		}
		if (control.state.turnRightDown) {
			this.scene.rotation.y -= this.turnSpeed;
		}
		if (control.state.turnLeftDown) {
			this.scene.rotation.y += this.turnSpeed;
		}
	}

	changeState(state) {
		if (this.state === state) {
			return;
		}
		this.state = state;
		if (this.currAnimation) {
			this.currAnimation.stop();
		}
		if (state === Character.STATE.WALKING) {
			this.currAnimation = this.actions.WalkCycle;
		} else if (state === Character.STATE.WAITING) {
			this.currAnimation = this.actions.WaitingCycle;
		} else if (state === Character.STATE.RUNNING) {
			this.currAnimation = this.actions.RunCycle;
		} else if (state === Character.STATE.STANDING) {
			this.currAnimation = this.actions.StandingCycle;
		} else if (state === Character.STATE.JUMPING) {
			this.currAnimation = this.actions.Jump;
		} else if (state === Character.STATE.LANDING) {
			this.currAnimation = this.actions.Land;
		} else if (state === Character.STATE.PUNCH_R) {
			this.currAnimation = this.actions.PunchR;
		} else if (state === Character.STATE.PUNCH_L) {
			this.currAnimation = this.actions.PunchL;
		} else if (state === Character.STATE.SWIPE_L) {
			this.currAnimation = this.actions.SwipeL;
		} else if (state === Character.STATE.SWIPE_R) {
			this.currAnimation = this.actions.SwipeR;
		}
		this.currAnimation.play();
	}

	jump() {
		this.physicsObject.accelerate(this.tmpVec1.set(0, this.jumpSpeed, 0));
		this.changeState(Character.STATE.JUMPING);
		const checkForLanding = () => {
			if (this.scene.position.y <= 0) {
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
		this.changeState(Character.STATE.LANDING);
		setTimeout(() => {
			this.changeState(Character.STATE.STANDING);
		}, 300);
	}

	swipeRight(direction) {
		this.changeState(Character.STATE.SWIPE_R);
		this.swipe('SwipeR', direction);
	}

	swipeLeft(direction) {
		this.changeState(Character.STATE.SWIPE_L);
		this.swipe('SwipeL', direction);
	}

	swipe(state, direction) {
		const action = this.actions[`${state}_${direction}`];
		action.play();

		setTimeout(() => {
			action.stop();
			this.returnToState();
		}, 600);
	}

	returnToState() {
		if (control.state.shiftDown && control.state.forwardDown) {
			this.changeState(Character.STATE.RUNNING);
		} else if (control.state.forwardDown) {
			this.changeState(Character.STATE.WALKING);
		} else {
			this.changeState(Character.STATE.STANDING);
		}
	}

	punch() {
		this.changeState(Character.STATE.PUNCH_R);
		setTimeout(() => {
			this.returnToState();
		}, 600);
	}

	iterateBones(iterator) {
		const rec = (bone) => {
			iterator(bone);
			if (bone.children) {
				bone.children.forEach(child => {
					rec(child);
				});
			}
		};
		this.bones.forEach(bone => {
			rec(bone);
		});
	}

	logBonePositions() {
		this.iterateBones(bone => {
			console.log(`${bone.name} - x:${bone.position.x} y:${bone.position.y} z:${bone.position.z} rx:${bone.rotation.x} ry:${bone.rotation.y} rz:${bone.rotation.z}`);
		});
	}
}

Character.STATE = {
	STANDING: 'state_standing',
	WAITING: 'state_waiting',
	WALKING: 'state_walking',
	RUNNING: 'state_running',
	JUMPING: 'state_jumping',
	LANDING: 'state_landing',
	PUNCH_L: 'state_punch_l',
	PUNCH_R: 'state_punch_r',
	SWIPE_R: 'state_swipe_r',
	SWIPE_L: 'state_swipe_l',
	SWIPE_U: 'state_swipe_u',
	SWIPE_D: 'state_swipe_d'
};