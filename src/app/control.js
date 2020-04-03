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
			mouseDown: false
		};
		this.walkHandlers = [];
		this.runHandlers = [];
		this.jumpHandlers = [];
		this.turnRightHandlers = [];
		this.turnLeftHandlers = [];
		this.swipeUpHandlers = [];
		this.swipeRightHandlers = [];
		this.swipeLeftHandlers = [];
		this.swipeDownHandlers = [];
		this.stopMovingHandlers = [];
		this.punchHandlers = [];
		this.mousePosition = new THREE.Vector2();
		this.lastMousePosition = new THREE.Vector2();
		this.firstMousePosition = new THREE.Vector2();
		this.angleVec = new THREE.Vector2();
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
			const dist = this.firstMousePosition.distanceTo(this.mousePosition);
			if (dist >= 20) {
				const divisions = Math.PI / 10;
				let angle = this.angleVec.subVectors(this.mousePosition, this.firstMousePosition).angle();
				let direction;
				if (angle >= 14 * divisions && angle < 16 * divisions) {
					direction = 'U';
				} else if (angle >= 16 * divisions && angle < 17 * divisions) {
					direction = 'UR';
				} else if (angle >= 17 * divisions && angle < 19 * divisions) {
					direction = 'RU';
				} else if (angle >= 19 * divisions || angle < divisions) {
					direction = 'R';
				} else if (angle >= divisions && angle < 3 * divisions) {
					direction = 'RD';
				} else if (angle >= 3 * divisions && angle < 4 * divisions) {
					direction = 'DR';
				} else if (angle >= 4 * divisions && angle < 6 * divisions) {
					direction = 'D';
				} else if (angle >= 6 * divisions && angle < 7 * divisions) {
					direction = 'DL';
				} else if (angle >= 7 * divisions && angle < 9 * divisions) {
					direction = 'LD';
				} else if (angle >= 9 * divisions && angle < 11 * divisions) {
					direction = 'L';
				} else if (angle >= 11 * divisions && angle < 13 * divisions) {
					direction = 'LU';
				} else if (angle >= 13 * divisions && angle < 14 * divisions) {
					direction = 'UL';
				}
				if (angle >= 15 * divisions || angle < 5 * divisions) {
					this.callHandlers(this.swipeRightHandlers, direction);
				} else {
					this.callHandlers(this.swipeLeftHandlers, direction);
				}
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
	onSwipeRight(handler) {
		this.swipeRightHandlers.push(handler);
	}
	onSwipeLeft(handler) {
		this.swipeLeftHandlers.push(handler);
	}
	onSwipeUp(handler) {
		this.swipeUpHandlers.push(handler);
	}
	onSwipeDown(handler) {
		this.swipeDownHandlers.push(handler);
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