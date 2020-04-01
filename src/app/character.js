import THREE from './three';

export default class Character {
	constructor() {
		this.animationsActive = false;
		this.actions = {};
		this.walkSpeed = 1;
		this.runSpeed = 1;
		this.turnSpeed = Math.PI / 180;
		this.tmpVec1 = new THREE.Vector3();
		this.currAnimation = null;
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
					this.bones = gltf.scene.children; // .slice(0, gltf.scene.children[0].children.length);
					this.bonesDict = {};
					const tmpbones = [];
					this.iterateBones(bone => {
						if (bone.type === 'Bone') {
							this.bonesDict[bone.name] = bone;
							tmpbones.push(bone);
						}
					});
					this.bones = tmpbones;
					this.animationMixer = new THREE.AnimationMixer(this.gltf.scene);
					this.gltf.animations.forEach((anim) => {
						this.actions[anim.name] = this.animationMixer.clipAction(anim);
					});
					this.animationsActive = true;
					this.changeAnimation(Character.ANIMATION_STATE.STANDING);
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

	changeAnimation(state) {
		if (this.animationState === state) {
			return;
		}
		this.animationState = state;
		if (this.currAnimation) {
			this.currAnimation.stop();
		}
		if (state === Character.ANIMATION_STATE.WALKING) {
			this.currAnimation = this.actions.WalkCycle;
		} else if (state === Character.ANIMATION_STATE.WAITING) {
			this.currAnimation = this.actions.WaitingCycle;
		} else if (state === Character.ANIMATION_STATE.RUNNING) {
			this.currAnimation = this.actions.RunCycle;
		} else if (state === Character.ANIMATION_STATE.STANDING) {
			this.currAnimation = this.actions.StandCycle;
		}
		this.currAnimation.play();
	}

	turnRight() {
		this.scene.rotation.y += this.turnSpeed;
	}

	turnLeft() {
		this.scene.rotation.y -= this.turnSpeed;
	}

	walkForward() {
		this.scene.position.add(this.scene.getWorldDirection(this.tmpVec1).multiplyScalar(this.walkSpeed));
		this.changeAnimation(Character.ANIMATION_STATE.WALKING);
	}

	stopMoving() {
		this.changeAnimation(Character.ANIMATION_STATE.STANDING);
	}

	runForward() {
		this.scene.position.add(this.scene.getWorldDirection(this.tmpVec1).multiplyScalar(this.runSpeed));
		this.changeAnimation(Character.ANIMATION_STATE.RUNNING);
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

Character.ANIMATION_STATE = {
	STANDING: 'state_standing',
	WAITING: 'state_waiting',
	WALKING: 'state_walking',
	RUNNING: 'state_running'
};