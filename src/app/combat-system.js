import CombatObject from './combat-object';

class CombatSystem {
	constructor() {
		this.players = [];
		this.enemies = [];
	}
	addPlayer(player) {
		player.combatObject = new CombatObject(player);
		this.players.push(player.combatObject);
	}
	addEnemy(enemy) {
		enemy.combatObject = new CombatObject(enemy);
		this.enemies.push(enemy.combatObject);
	}
	updateCombatObject(combatObject, enemyCombatObjects) {
		combatObject.attacks.forEach(attack => {
			enemyCombatObjects.forEach(enemyCombatObject => {
				enemyCombatObject.hitboxes.forEach(hitbox => {
					if (attack.hitbox.checkCollision(hitbox)) {
						attack.hit();
						enemyCombatObject.getHit(attack, hitbox);
					}
				});
			});
		});
	}
	transformBoxes(combatObjects) {
		combatObjects.forEach(combatObject => {
			combatObject.attacks.forEach(attack => {
				attack.hitbox.transformBox();
			});
			combatObject.hitboxes.forEach(hitbox => {
				hitbox.transformBox();
			});
		});
	}
	update() {
		this.transformBoxes(this.players);
		this.transformBoxes(this.enemies);
		this.players.forEach(playerCombatObject => {
			this.updateCombatObject(playerCombatObject, this.enemies);
		});
		this.enemies.forEach(enemyCombatObject => {
			this.updateCombatObject(enemyCombatObject, this.players);
		});
	}
}

export default new CombatSystem();