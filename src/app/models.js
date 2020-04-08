import THREE from './three';

export class GltfModel {
	constructor() {
		this.actions = {};
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
					this.animationMixer = new THREE.AnimationMixer(this.gltf.scene);
					this.gltf.animations.forEach((anim) => {
						this.actions[anim.name] = this.animationMixer.clipAction(anim);
					});
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