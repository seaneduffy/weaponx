import THREE from './three';

class Control {
	constructor() {
		this.state = {
			forwardDown: false,
			shiftDown: false,
			jumpDown: false,
			shiftDown: false,
			mouseDown: false,
			joystickActive: false,
			joystickWalkThresholdHit: false,
			joystickRunThresholdHit: false,
			joystickTurnLeftThresholdHit: false,
			joystickTurnRightThresholdHit: false,
			joystickAngle: 0,
			dragActive: false,
			moveLeftDown: false,
			moveRightDown: false
		};
		this.joystickDimensions = {
			width: 400,
			height: 400
		};
		this.walkHandlers = [];
		this.runHandlers = [];
		this.jumpHandlers = [];
		this.turnHandlers = [];
		this.moveLeftHandlers = [];
		this.moveRightHandlers = [];
		this.dragReleaseHandlers = [];
		this.stopMovingHandlers = [];
		this.attackHandlers = [];
		this.rightClickHandlers = [];
		this.rightMouseDownHandlers = [];
		this.mousePosition = new THREE.Vector2();
		this.lastMousePosition = new THREE.Vector2();
		this.firstMousePosition = new THREE.Vector2();
		this.angleVec = new THREE.Vector2();
		this.firstJoystickPosition = new THREE.Vector2();
		this.joystickPosition = new THREE.Vector2();
		this.joystickAngleVec = new THREE.Vector2();
		this.joystickRunThreshold = 100;
		this.joystickWalkThreshold = 30;
		this.joystickTurnThreshold = 30;
	}
	init() {
		const mouseElement = document.body.querySelector('canvas');
		document.body.addEventListener('keydown', (key) => {
			if (key.code === 'KeyW') {
				if (this.state.forwardDown) {
					return;
				}
				this.state.forwardDown = true;
				if (this.state.shiftDown) {
					this.callHandlers(this.runHandlers);
				} else {
					this.callHandlers(this.walkHandlers);
				}
			} else if (key.code === 'KeyA') {
				if (this.state.moveLeftDown) {
					return;
				}
				this.callHandlers(this.moveLeftHandlers);
				this.state.moveLeftDown = true;
			} else if (key.code === 'KeyD') {
				if (this.state.moveRightDown) {
					return;
				}
				this.callHandlers(this.moveRightHandlers);
				this.state.moveRightDown = true;
			} else if (key.code === 'ShiftLeft') {
				if (this.state.shiftDown) {
					return;
				}
				this.state.shiftDown = true;
				if (this.state.forwardDown) {
					this.callHandlers(this.runHandlers);
				}
			} else if (key.code === 'Space') {
				if (this.state.spaceDown) {
					return;
				}
				this.callHandlers(this.jumpHandlers);
				this.state.spaceDown = true;
			}
		});
		document.body.addEventListener('keyup', (key) => {
			if (key.code === 'KeyW') {
				this.state.forwardDown = false;
				this.callHandlers(this.stopMovingHandlers);
			} else if (key.code === 'KeyA') {
				this.state.turnLeftDown = false;
			} else if (key.code === 'KeyD') {
				this.state.turnRightDown = false;
			} else if (key.code === 'ShiftLeft') {
				this.state.shiftDown = false;
				if (this.state.forwardDown) {
					this.callHandlers(this.walkHandlers);
				}
			}
		});
		mouseElement.addEventListener('mousemove', (e) => {
			this.lastMousePosition.x = this.mousePosition.x;
			this.lastMousePosition.y = this.mousePosition.y;
			this.mousePosition.x = this.mousePosition.x + e.movementX; // e.screenX;
			this.mousePosition.y = this.mousePosition.y + e.movementY; // e.screenY;
			this.callHandlers(this.turnHandlers, this.mousePosition.x - this.lastMousePosition.x);
		});
		const mouseUpListener = () => {
			mouseElement.removeEventListener('mouseup', mouseUpListener);
			parseDrag();
		};
		const parseDrag = () => {
			const dist = this.firstMousePosition.distanceTo(this.mousePosition);
			if (dist >= 20) {
				const divisions = Math.PI / 8;
				let angle = this.angleVec.subVectors(this.mousePosition, this.firstMousePosition).angle();
				let direction;
				if (angle >= 11 * divisions && angle < 13 * divisions) {
					direction = 'U';
				} else if (angle >= 13 * divisions && angle < 15 * divisions) {
					direction = 'RU';
				} else if (angle >= 15 * divisions || angle < divisions) {
					direction = 'R';
				} else if (angle >= divisions && angle < 3 * divisions) {
					direction = 'RD';
				} else if (angle >= 3 * divisions && angle < 5 * divisions) {
					direction = 'D';
				} else if (angle >= 5 * divisions && angle < 7 * divisions) {
					direction = 'LD';
				} else if (angle >= 7 * divisions && angle < 9 * divisions) {
					direction = 'L';
				} else {
					direction = 'LU';
				}
				this.callHandlers(this.dragReleaseHandlers, direction);
			} else {
				this.callHandlers(this.attackHandlers);
			}
		};
		mouseElement.addEventListener('mousedown', (e) => {
			this.state.mouseDown = true;
			this.firstMousePosition.x = this.lastMousePosition.x = this.mousePosition.x = 0;// e.screenX;
			this.firstMousePosition.y = this.lastMousePosition.y = this.mousePosition.y = 0;// e.screenY;
			mouseElement.addEventListener('mouseup', mouseUpListener);
		});
		// mouseElement.addEventListener('contextmenu', (e) => {
		// 	e.preventDefault();
		// 	this.callHandlers(this.rightClickHandlers);
		// 	return false;
		// });
		const parseTouches = (e) => {
			const touches = {
				joystickTouch: null,
				dragTouch: null
			}
			Array.from(e.touches).forEach(touch => {
				if (touch.clientX < this.joystickDimensions.width && touch.clientY > window.innerHeight - this.joystickDimensions.height) {
					touches.joystickTouch = touch;
				} else {
					touches.dragTouch = touch;
				}
			});
			return touches;
		};
		mouseElement.addEventListener('touchmove', (e) => {
			e.preventDefault();
			let touches = parseTouches(e);
			if (touches.joystickTouch) {
				this.joystickPosition.set(touches.joystickTouch.clientX, touches.joystickTouch.clientY);
				this.joystickAngleVec.subVectors(this.firstJoystickPosition, this.joystickPosition);
				const runThresholdHit = this.joystickAngleVec.y >= this.joystickRunThreshold;
				const walkThresholdHit = this.joystickAngleVec.y >= this.joystickWalkThreshold;
				this.state.turnLeftThresholdHit = this.joystickAngleVec.x >= this.joystickTurnThreshold;
				this.state.turnRightThresholdHit = this.joystickAngleVec.x <= -this.joystickTurnThreshold;
				if (!this.state.runThresholdHit && runThresholdHit) {
					this.callHandlers(this.runHandlers);
				} else if ((!this.state.walkThresholdHit || (this.state.runThresholdHit && !runThresholdHit)) && walkThresholdHit && !runThresholdHit) {
					this.callHandlers(this.walkHandlers);
				} else if ((this.state.runThresholdHit || this.state.runThresholdHit) && !runThresholdHit && !runThresholdHit) {
					this.callHandlers(this.stopMovingHandlers);
				}
				this.state.runThresholdHit = runThresholdHit;
				this.state.walkThresholdHit = walkThresholdHit;
			}
			if (touches.dragTouch) {
				this.mousePosition.set(touches.dragTouch.clientX, touches.dragTouch.clientY);
			}
		});
		mouseElement.addEventListener('touchend', (e) => {
			let touches = parseTouches(e);
			if (!touches.joystickTouch && this.state.joystickActive) {
				this.state.joystickActive = false;
				this.callHandlers(this.stopMovingHandlers);
				this.state.runThresholdHit = false;
				this.state.walkThresholdHit = false;
				this.state.turnLeftThresholdHit = false;
				this.state.turnRightThresholdHit = false;
			}
			if (!touches.dragTouch && this.state.dragActive) {
				this.state.dragActive = false;
				parseDrag();
			}
		});
		mouseElement.addEventListener('touchstart', (e) => {
			let touches = parseTouches(e);
			if (touches.joystickTouch) {
				this.firstJoystickPosition.set(touches.joystickTouch.clientX, touches.joystickTouch.clientY);
				this.state.joystickActive = true;
			}
			if (touches.dragTouch) {
				this.state.dragActive = true;
				this.firstMousePosition.set(touches.dragTouch.clientX, touches.dragTouch.clientY);
			}
		});
	}
	callHandlers(handlers, param) {
		handlers.forEach(handler => {
			handler(param);
		});
	}
	onWalk(handler) {
		this.walkHandlers.push(handler);
	}
	onRun(handler) {
		this.runHandlers.push(handler);
	}
	onJump(handler) {
		this.jumpHandlers.push(handler);
	}
	onMoveLeft(handler) {
		this.moveLeftHandlers.push(handler);
	}
	onMoveRight(handler) {
		this.moveRightHandlers.push(handler);
	}
	onTurn(handler) {
		this.turnHandlers.push(handler);
	}
	onDragRelease(handler) {
		this.dragReleaseHandlers.push(handler);
	}
	onStopMoving(handler) {
		this.stopMovingHandlers.push(handler);
	}
	onAttack(handler) {
		this.attackHandlers.push(handler);
	}
	onRightClick(handler) {
		this.rightClickHandlers.push(handler);
	}
	onRightMouseDown(handler) {
		this.rightMouseDownHandlers.push(handler);
	}
};

const control = new Control();
export default control;