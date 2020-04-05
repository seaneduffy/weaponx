import THREE from './three';

class Control {
	constructor() {
		this.state = {
			forwardDown: false,
			shiftDown: false,
			turnLeftDown: false,
			turnRightDown: false,
			jumpDown: false,
			shiftDown: false,
			swiping: false,
			swipingRight: false,
			swipingLeft: false,
			swipingUp: false,
			swipingDown: false,
			mouseDown: false,
			joystickActive: false,
			joystickWalkThresholdHit: false,
			joystickRunThresholdHit: false,
			joystickTurnLeftThresholdHit: false,
			joystickTurnRightThresholdHit: false,
			joystickAngle: 0,
			swipeActive: false
		};
		this.joystickDimensions = {
			width: 400,
			height: 400
		};
		this.walkHandlers = [];
		this.runHandlers = [];
		this.jumpHandlers = [];
		this.turnRightHandlers = [];
		this.turnLeftHandlers = [];
		this.swipeHandlers = [];
		this.stopMovingHandlers = [];
		this.punchHandlers = [];
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
		document.body.addEventListener('keydown', (key) => {
			if (key.code === 'KeyW') {
				this.state.forwardDown = true;
				if (this.state.shiftDown) {
					this.callHandlers(this.runHandlers);
				} else {
					this.callHandlers(this.walkHandlers);
				}
			} else if (key.code === 'KeyA') {
				this.callHandlers(this.turnLeftHandlers);
				this.state.turnLeftDown = true;
			} else if (key.code === 'KeyD') {
				this.callHandlers(this.turnRightHandlers);
				this.state.turnRightDown = true;
			} else if (key.code === 'ShiftLeft') {
				this.state.shiftDown = true;
				if (this.state.forwardDown) {
					this.callHandlers(this.runHandlers);
				}
			} else if (key.code === 'Space') {
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
		const mouseMoveListener = (e) => {
			this.lastMousePosition.x = this.mousePosition.x;
			this.lastMousePosition.y = this.mousePosition.y;
			this.mousePosition.x = e.screenX;
			this.mousePosition.y = e.screenY;

		};
		const mouseUpListener = () => {
			document.body.removeEventListener('mousemove', mouseMoveListener);
			document.body.removeEventListener('mouseup', mouseUpListener);
			parseSwipe();
		};
		const parseSwipe = () => {
			const dist = this.firstMousePosition.distanceTo(this.mousePosition);
			if (dist >= 20) {
				const divisions = Math.PI / 8;
				let angle = this.angleVec.subVectors(this.mousePosition, this.firstMousePosition).angle();
				let direction;
				// if (angle >= 14 * divisions && angle < 16 * divisions) {
				// 	direction = 'U';
				// } else if (angle >= 16 * divisions && angle < 17 * divisions) {
				// 	direction = 'UR';
				// } else if (angle >= 17 * divisions && angle < 19 * divisions) {
				// 	direction = 'RU';
				// } else if (angle >= 19 * divisions || angle < divisions) {
				// 	direction = 'R';
				// } else if (angle >= divisions && angle < 3 * divisions) {
				// 	direction = 'RD';
				// } else if (angle >= 3 * divisions && angle < 4 * divisions) {
				// 	direction = 'DR';
				// } else if (angle >= 4 * divisions && angle < 6 * divisions) {
				// 	direction = 'D';
				// } else if (angle >= 6 * divisions && angle < 7 * divisions) {
				// 	direction = 'DL';
				// } else if (angle >= 7 * divisions && angle < 9 * divisions) {
				// 	direction = 'LD';
				// } else if (angle >= 9 * divisions && angle < 11 * divisions) {
				// 	direction = 'L';
				// } else if (angle >= 11 * divisions && angle < 13 * divisions) {
				// 	direction = 'LU';
				// } else if (angle >= 13 * divisions && angle < 14 * divisions) {
				// 	direction = 'UL';
				// }
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
				// if (angle >= 15 * divisions || angle < 5 * divisions) {
				// 	direction = `R_${direction}`;
				// } else {
				// 	direction = `L_${direction}`;
				// }
				this.callHandlers(this.swipeHandlers, direction);
			} else {
				this.callHandlers(this.punchHandlers);
			}
		};
		document.body.addEventListener('mousedown', (e) => {
			this.state.mouseDown = true;
			this.firstMousePosition.x = this.lastMousePosition.x = this.mousePosition.x = e.screenX;
			this.firstMousePosition.y = this.lastMousePosition.y = this.mousePosition.y = e.screenY;
			document.body.addEventListener('mousemove', mouseMoveListener);
			document.body.addEventListener('mouseup', mouseUpListener);
		});
		const parseTouches = (e) => {
			const touches = {
				joystickTouch: null,
				swipeTouch: null
			}
			Array.from(e.touches).forEach(touch => {
				if (touch.clientX < this.joystickDimensions.width && touch.clientY > window.innerHeight - this.joystickDimensions.height) {
					touches.joystickTouch = touch;
				} else {
					touches.swipeTouch = touch;
				}
			});
			return touches;
		};
		document.body.addEventListener('touchmove', (e) => {
			e.preventDefault();
			let touches = parseTouches(e);
			if (touches.joystickTouch) {
				this.joystickPosition.set(touches.joystickTouch.clientX, touches.joystickTouch.clientY);
				this.joystickAngleVec.subVectors(this.firstJoystickPosition, this.joystickPosition);
				const runThresholdHit = this.joystickAngleVec.y >= this.joystickRunThreshold;
				const walkThresholdHit = this.joystickAngleVec.y >= this.joystickWalkThreshold;
				console.log(this.joystickAngleVec.x, this.joystickTurnThreshold);
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
				// this.state.joystickRunThresholdHit = this.firstJoystickPosition.distanceTo(this.joystickPosition);
				// this.state.joystickAngle = this.joystickAngleVec.angle();
				// this.state.joystickAngle -= Math.PI / 2;
				// if (this.state.joystickAngle < 0) {
				// 	this.state.joystickAngle += 2 * Math.PI;
				// }
			}
			if (touches.swipeTouch) {
				this.mousePosition.set(touches.swipeTouch.clientX, touches.swipeTouch.clientY);
			}
		});
		document.body.addEventListener('touchend', (e) => {
			let touches = parseTouches(e);
			if (!touches.joystickTouch && this.state.joystickActive) {
				this.state.joystickActive = false;
				this.callHandlers(this.stopMovingHandlers);
				this.state.runThresholdHit = false;
				this.state.walkThresholdHit = false;
				this.state.turnLeftThresholdHit = false;
				this.state.turnRightThresholdHit = false;
			}
			if (!touches.swipeTouch && this.state.swipeActive) {
				this.state.swipeActive = false;
				parseSwipe();
			}
		});
		document.body.addEventListener('touchstart', (e) => {
			let touches = parseTouches(e);
			if (touches.joystickTouch) {
				this.firstJoystickPosition.set(touches.joystickTouch.clientX, touches.joystickTouch.clientY);
				this.state.joystickActive = true;
			}
			if (touches.swipeTouch) {
				this.state.swipeActive = true;
				this.firstMousePosition.set(touches.swipeTouch.clientX, touches.swipeTouch.clientY);
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
	onTurnRight(handler) {
		this.turnRightHandlers.push(handler);
	}
	onTurnLeft(handler) {
		this.turnLeftHandlers.push(handler);
	}
	onSwipe(handler) {
		this.swipeHandlers.push(handler);
	}
	onStopMoving(handler) {
		this.stopMovingHandlers.push(handler);
	}
	onPunch(handler) {
		this.punchHandlers.push(handler);
	}
};

const control = new Control();
export default control;