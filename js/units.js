class UnitBase {
  constructor(health, strength, movementRange) {
    this.health = health;
    this.strength = strength;
    this.movementRange = movementRange; // Defines how far this unit can move, e.g., [3, 3] for 3x3 squares.
  }

  // Simulates the unit's movement on a grid, constrained by movementRange.
  move() {
    // This function can be expanded to interact with an actual grid in your game.
    console.log(
      `${this.constructor.name} moves up to ${this.movementRange[0]}x${this.movementRange[1]} squares.`
    );
  }

  // Attacks an enemy, with damage based on strength and a dice roll for variability.
  attack() {
    const baseDamage = this.strength;
    const diceRoll = Math.ceil(Math.random() * 6); // Simulates a D6 roll.
    const totalDamage = baseDamage + diceRoll; // Adds variability to the attack strength.
    console.log(`${this.constructor.name} attacks with ${totalDamage} damage.`);
    return totalDamage;
  }

  // Receives damage from an attack.
  receiveDamage(damage) {
    this.health -= damage;
    if (this.health > 0) {
      console.log(
        `${this.constructor.name} has received ${damage} points of damage.`
      );
    } else {
      console.log(`${this.constructor.name} has died in combat.`);
      // Additional logic for death, like removing from the grid, can be added here.
    }
  }
}

class Footman extends UnitBase {
  constructor(health = 100, strength = 10) {
    super(health, strength, [3, 3]); // Footman can move up to 3x3 squares.
    this.type = "FootMan";
  }

  // Footman-specific methods or overrides can go here.
}

class Archer extends UnitBase {
  constructor(health = 80, strength = 35) {
    super(health, strength, [2, 5]); // Archer has a different movement range, emphasizing range over breadth.
    this.type = "Archer";
  }

  // Archer-specific methods, possibly including ranged attack logic.
}

class Knight extends UnitBase {
  constructor(health = 150, strength = 20) {
    super(health, strength, [4, 4]); // Knights can move further, reflecting their mobility as cavalry.
    this.chargeDamageMultiplier = 2; // Represents additional damage during a charge.
    this.type = "Knight";
  }

  // Override the move method to show the knight's increased mobility.
  move() {
    console.log(
      `${this.constructor.name} gallops up to ${this.movementRange[0]}x${this.movementRange[1]} squares, faster than most units.`
    );
  }

  // Knights have a special charge attack, dealing extra damage.
  chargeAttack() {
    const baseDamage = this.strength;
    const diceRoll = Math.ceil(Math.random() * 6); // Simulates a D6 roll for variability.
    const totalDamage = (baseDamage + diceRoll) * this.chargeDamageMultiplier; // Charge damage is multiplied.
    console.log(
      `${this.constructor.name} charges, dealing an impressive ${totalDamage} damage.`
    );
    return totalDamage;
  }

  // Example of how you might handle receiving damage differently for a Knight, if desired.
  receiveDamage(damage) {
    super.receiveDamage(damage); // Call the base class method.
    // Additional logic specific to Knights could be added here, such as reduced damage from certain attacks.
  }
}

class Grunt extends UnitBase {
  constructor(health = 120, strength = 12) {
    super(health, strength, [3, 3]); // Standard infantry unit with balanced attributes.
  }

  // Grunt-specific methods or overrides can go here.
}

class WolfRider extends UnitBase {
  constructor(health = 140, strength = 18) {
    super(health, strength, [5, 5]); // Fast and agile, perfect for hit-and-run tactics.
  }

  // WolfRider can have special abilities like a fast attack or a retreat action.
  rapidAttack() {
    console.log(
      `${this.constructor.name} performs a rapid attack with increased chance to hit.`
    );
    // Implement the attack logic here, potentially with increased accuracy or multiple targets.
  }
}

class Shadowstalker extends UnitBase {
  constructor(health = 100, strength = 15) {
    super(health, strength, [2, 6]); // Emphasizes long-range movement and attacks.
  }

  // Shadowstalkers might have abilities like stealth or poison arrows.
  poisonArrow() {
    console.log(
      `${this.constructor.name} shoots a poison arrow, dealing damage over time.`
    );
    // Implement the poison effect here, potentially reducing enemy health gradually.
  }
}
