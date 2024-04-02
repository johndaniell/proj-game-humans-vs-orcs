class UnitBase {
  constructor(health, strength) {
    this.health = health;
    this.strength = strength;
  //   this.movementRange = movementRange;
  //   this.type = type;
  //   this.attackRange = attackRange;
  //   this.imagePath = imagePath;
  //   this.color = color;
  // 
}

  attack(target) {
    let damageModifier = 1; // Default damage modifier

    // Determine damage modifier based on colors
    if (this.color === "GREEN") {
      if (target.color === "RED") {
        damageModifier = 1.2; // Green does 120% damage to Red
      } else if (target.color === "BLUE") {
        damageModifier = 0.5; // Green does 50% damage to Blue
      }
    } else if (this.color === "RED") {
      if (target.color === "BLUE") {
        damageModifier = 1.3; // Red does 130% damage to Blue
      } else if (target.color === "GREEN") {
        damageModifier = 0.6; // Red does 60% damage to Green
      }
    } else if (this.color === "BLUE") {
      if (target.color === "GREEN") {
        damageModifier = 1.5; // Blue does 150% damage to Green
      } else if (target.color === "RED") {
        damageModifier = 0.75; // Blue does 75% damage to Red
      }
    }

    // Calculate total damage
    const baseDamage = this.strength;
    const diceRoll = (Math.random() + 1 );
    const totalDamage = (baseDamage * diceRoll * damageModifier).toFixed(1);


    //  to much, redundancy
    // Display battle log message
    if (diceRoll === 2) {
      addBattleLogMessage(`${this.type} does double damage of ${totalDamage}!`);
    } else {
    //   addBattleLogMessage(`${this.type} attacks with ${totalDamage} damage.`);
    }

    // Return total damage
    return totalDamage;
  }

  receiveDamage(damage,defenderType) {
    (this.health -= damage).toFixed(1);
    if (this.health <= 0) {
      addBattleLogMessage(`${defenderType} has been defeated in combat.`);
      this.health = 0;
    } else {
      // addBattleLogMessage(`${defenderType} has received ${damage} points of damage, remaining health: ${this.health}.`);
    }
  }
}


// Adjust the factory function -- NEW
function createUnitClass(health, strength) {
  return class extends UnitBase {
    constructor() {
      super(health, strength);
    }

    static type = ""; // You can dynamically set this in the forEach loop below
    // Other static properties
  };
}


// Initialize UnitTypes as an empty object
const UnitTypes = {};

unitData.forEach(config => {
  const UnitClass = createUnitClass(config.health, config.strength);
  UnitClass.type = config.type;
  UnitClass.movementRange = config.movementRange;
  UnitClass.attackRange = config.attackRange;
  UnitClass.imagePath = config.imagePath;
  UnitClass.color = config.color;
  // Assign the newly created class to the UnitTypes object
  UnitTypes[config.type] = UnitClass;
});



// --- OLD CODE ----


// Factory function to create classes dynamically --- OLD 
// function createUnitClass(unitConfig) {
//   return class extends UnitBase {
//     constructor() {
//       super(
//         unitConfig.type,
//         unitConfig.health,
//         unitConfig.strength,
//         unitConfig.movementRange,
//         unitConfig.attackRange,
//         unitConfig.imagePath,
//         unitConfig.color,
//       );
//       // console.log(`THIS SHOULD BE THE IMAGE PATH FOR ${unitConfig.type}`,unitConfig.imagePath)
//     }

//     // Add any special methods for specific units
//     // This part could be extended to dynamically add methods based on unitConfig
//   };
// }






// const UnitTypes = {};
// unitData.forEach(config => {
//   UnitTypes[config.type] = createUnitClass(config);
// });

// Dynamically created unit classes can now be instantiated
// const footman = new UnitTypes["FootMan"]();
// const archer = new UnitTypes["Archer"]();
// const knight = new UnitTypes["Knight"]();

// footman.move();
// archer.attack();
// knight.receiveDamage(10);






// class UnitBase {
//   constructor(health, strength, movementRange) {
//     this.health = health;
//     this.strength = strength;
//     this.movementRange = movementRange; // Defines how far this unit can move, e.g., [3, 3] for 3x3 squares.
//   }

//   // Simulates the unit's movement on a grid, constrained by movementRange.
//   move() {
//     // This function can be expanded to interact with an actual grid in your game.
//     console.log(
//       `${this.constructor.name} moves up to ${this.movementRange[0]}x${this.movementRange[1]} squares.`
//     );
//   }

//   // Attacks an enemy, with damage based on strength and a dice roll for variability.
//   attack() {
//     const baseDamage = this.strength;
//     const diceRoll = Math.ceil(Math.random() * 6); // Simulates a D6 roll.
//     const totalDamage = baseDamage + diceRoll; // Adds variability to the attack strength.
//     console.log(`${this.constructor.name} attacks with ${totalDamage} damage.`);
//     return totalDamage;
//   }

//   // Receives damage from an attack.
//   receiveDamage(damage) {
//     this.health -= damage;
//     if (this.health > 0) {
//       console.log(
//         `${this.constructor.name} has received ${damage} points of damage.`
//       );
//     } else {
//       console.log(`${this.constructor.name} has died in combat.`);
//       // Additional logic for death, like removing from the grid, can be added here.
//     }
//   }
// }

// class Footman extends UnitBase {
//   constructor(health = 100, strength = 10) {
//     super(health, strength, [3, 3]); // Footman can move up to 3x3 squares.
//     this.type = "FootMan";
//   }

//   // Footman-specific methods or overrides can go here.
// }

// class Archer extends UnitBase {
//   constructor(health = 80, strength = 35) {
//     super(health, strength, [2, 5]); // Archer has a different movement range, emphasizing range over breadth.
//     this.type = "Archer";
//   }

//   // Archer-specific methods, possibly including ranged attack logic.
// }

// class Knight extends UnitBase {
//   constructor(health = 150, strength = 20) {
//     super(health, strength, [4, 4]); // Knights can move further, reflecting their mobility as cavalry.
//     this.chargeDamageMultiplier = 2; // Represents additional damage during a charge.
//     this.type = "Knight";
//   }

//   // Override the move method to show the knight's increased mobility.
//   move() {
//     console.log(
//       `${this.constructor.name} gallops up to ${this.movementRange[0]}x${this.movementRange[1]} squares, faster than most units.`
//     );
//   }

//   // Knights have a special charge attack, dealing extra damage.
//   chargeAttack() {
//     const baseDamage = this.strength;
//     const diceRoll = Math.ceil(Math.random() * 6); // Simulates a D6 roll for variability.
//     const totalDamage = (baseDamage + diceRoll) * this.chargeDamageMultiplier; // Charge damage is multiplied.
//     console.log(
//       `${this.constructor.name} charges, dealing an impressive ${totalDamage} damage.`
//     );
//     return totalDamage;
//   }

//   // Example of how you might handle receiving damage differently for a Knight, if desired.
//   receiveDamage(damage) {
//     super.receiveDamage(damage); // Call the base class method.
//     // Additional logic specific to Knights could be added here, such as reduced damage from certain attacks.
//   }
// }

// class Grunt extends UnitBase {
//   constructor(health = 120, strength = 12) {
//     super(health, strength, [3, 3]); // Standard infantry unit with balanced attributes.
//   }

//   // Grunt-specific methods or overrides can go here.
// }

// class WolfRider extends UnitBase {
//   constructor(health = 140, strength = 18) {
//     super(health, strength, [5, 5]); // Fast and agile, perfect for hit-and-run tactics.
//   }

//   // WolfRider can have special abilities like a fast attack or a retreat action.
//   rapidAttack() {
//     console.log(
//       `${this.constructor.name} performs a rapid attack with increased chance to hit.`
//     );
//     // Implement the attack logic here, potentially with increased accuracy or multiple targets.
//   }
// }

// class Shadowstalker extends UnitBase {
//   constructor(health = 100, strength = 15) {
//     super(health, strength, [2, 6]); // Emphasizes long-range movement and attacks.
//   }

//   // Shadowstalkers might have abilities like stealth or poison arrows.
//   poisonArrow() {
//     console.log(
//       `${this.constructor.name} shoots a poison arrow, dealing damage over time.`
//     );
//     // Implement the poison effect here, potentially reducing enemy health gradually.
//   }
// }
