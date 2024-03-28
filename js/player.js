class Player {
    constructor(name) {
        this.name = name;
        this.armiesByType = {};
    }

    // Add a unit to the army
    addUnit(type, count = 1) {
        // Check if the type is valid
        const UnitClass = UnitTypes[type];
        if (!UnitClass) {
            console.error("Invalid unit type:", type);
            return;
        }

        // Initialize the army type array if it doesn't exist
        if (!this.armiesByType[type]) {
            this.armiesByType[type] = [];
            
            // DEBUG
            // console.log(this.armiesByType[type])
        }

        // Create and add the units
        for (let i = 0; i < count; i++) {
            const unit = new UnitClass();
            this.armiesByType[type].push(unit);
        }
    }


    getTotalArmyCount(type = null) {
        if (type) {
            // Return the count for the specific type
            return this.armiesByType[type]?.length || 0;
        } else {
            // Return an object with each type as a key and the count of units as the value
            const typeCounts = {};
            for (const typeKey in this.armiesByType) {
                typeCounts[typeKey] = this.armiesByType[typeKey].length;
            }
            return typeCounts;
        }
    }

    // Other methods for managing the player's army and actions
}

// Derived classes for Human and Computer players could add specific logic
class HumanPlayer extends Player {
    constructor(name) {
        super(name);
        // Human-specific attributes or methods
    }

    // Human-specific methods
}

class ComputerPlayer extends Player {
  constructor(name, gameInstanceId) {
    super(name);
    this.game = gameInstanceId;
    this.battleGrid = null;
  }

  // Add a method to set the battleGrid instance
  setBattleGrid(battleGrid) {
    this.battleGrid = battleGrid;
  }

  // Example AI Method: Take AI's turn
  takeTurn() {
    addBattleLogMessage(`${this.name} is taking its turn...`);
    if (!this.battleGrid) {
      console.error("BattleGrid instance not set for AI player.");
      return;
    }
    // Implement AI logic here...
    // 1. Assess the current state of the game
    // 2. Make decisions about which units to move and where
    // 3. Decide which enemy units to attack
    // 4. Execute those decisions using methods available to Player

    // Example: Move and attack with each unit
  // Loop through each unit type the AI controls
    Object.keys(this.armiesByType).forEach(unitType => {
        // Perform a check to decide whether to attack directly or move closer
        if (!this.checkAndAttack(unitType)) {
        // If no attack was possible, move the unit type closer to the target
        this.moveUnitTypeCloser(unitType);
        // After moving, check again for attack opportunities
        this.checkAndAttack(unitType);
        }
  });
    // Call any necessary callbacks or signal that the AI's turn is over
  }

  // Decide whether to move closer or attack, then perform the action
//   decideAndAct(unitType) {
//     console.log(`THIS SHOULD BE ALL UNIT POSITIONS !!!!`, this.battleGrid);
//     // Assume you can get the AI unit's position similarly
//     const aiUnitPos = this.battleGrid.unitPositions[unitType];
//     console.log(`AI HAS ${unitType} AT `, aiUnitPos);

//     const nearestPlayerUnitPos = this.findNearestPlayerUnit(unitType);

//     if (nearestPlayerUnitPos) {
//       const distance = this.calculateDistance(aiUnitPos, nearestPlayerUnitPos);

//       // Determine if an attack is possible based on the unit's attack range
//       if (distance <= unitType.attackRange) {
//         this.attackWithUnit(unitType, nearestPlayerUnitPos);
//       } else {
//         // Determine the direction to move closer based on the positions
//         this.moveUnitTowards(unitType, nearestPlayerUnitPos);
//       }
//     }
//   }

  // Basic pathfinding algorithm to find the nearest player unit

  calculateDistance(unitPos1, unitPos2) {
    // Adjusted to work with positions represented as arrays
    return (
      Math.abs(unitPos1[0] - unitPos2[0]) + // Calculate row distance
      Math.abs(unitPos1[1] - unitPos2[1])   // Calculate column distance
    );
  }
  
  findNearestPlayerUnit(aiUnitType) {
    const aiUnitPos = this.battleGrid.unitPositions[aiUnitType];
    let nearestDistance = Infinity;
    let nearestUnitType = null;
    let nearestUnitPos = null;
  
    // Ensure positions for AI unit type exist
    if (!aiUnitPos) {
      console.error(`Position for AI unit type ${aiUnitType} not found.`);
      return null;
    }
  
    // Loop through player unit types and their positions
    Object.entries(this.battleGrid.unitPositions).forEach(([playerUnitType, unitPos]) => {
      // Ensure we're only considering player units and the position is defined
      if (this.battleGrid.currentWar.player1.armiesByType[playerUnitType] && unitPos) {
        const distance = this.calculateDistance(aiUnitPos, unitPos);
        if (distance < nearestDistance) {
          nearestDistance = distance;
          nearestUnitType = playerUnitType;
          nearestUnitPos = unitPos;
        }
      }
    });
  
    // console.log(`Nearest player unit to ${aiUnitType}: ${nearestUnitType} at distance ${nearestDistance}`);
    return { nearestUnitType, nearestUnitPos, nearestDistance };
  }
  
  
  isUnitInAttackRange(unitType, targetPosition) {
    // Get the AI unit's current position
    const aiUnitPos = this.battleGrid.unitPositions[unitType];
    // Get the attack range for this unit type (assuming it's an array [horizontalRange, verticalRange])
    const attackRange = this.getAttackRangeForUnit(unitType);
    
    // Calculate the horizontal and vertical distances between the AI unit and the target
    const horizontalDistance = Math.abs(aiUnitPos[1] - targetPosition[1]); // Difference in columns
    const verticalDistance = Math.abs(aiUnitPos[0] - targetPosition[0]); // Difference in rows
    
    // console.log(`Horizontal Distance: ${horizontalDistance}, Vertical Distance: ${verticalDistance}, Attack Range:`, attackRange);
  
    // Check if the target is within both the horizontal and vertical attack ranges
    const isWithinHorizontalAttackRange = horizontalDistance <= attackRange[0];
    const isWithinVerticalAttackRange = verticalDistance <= attackRange[1];
  
    // console.log(`Within Horizontal Attack Range: ${isWithinHorizontalAttackRange}, Within Vertical Attack Range: ${isWithinVerticalAttackRange}`);
  
    return isWithinHorizontalAttackRange && isWithinVerticalAttackRange;
  }
  

  

  checkAndAttack(unitType) {
    // Find the nearest player unit and its type
    const { nearestUnitType, nearestUnitPos, nearestDistance } = this.findNearestPlayerUnit(unitType);
    
    
    // Check if the nearest player unit is within attack range
    if (nearestUnitType && this.isUnitInAttackRange(unitType, nearestUnitPos)) {
        addBattleLogMessage(`AI (${unitType}) trying to attack nearest player unit (${nearestUnitType}) located at`, nearestUnitPos);
  
      console.log(`${unitType} attacking ${nearestUnitType} at position`, nearestUnitPos);
      this.battleGrid.currentWar.attack(unitType, nearestUnitType, this.battleGrid.currentWar.player2,this.battleGrid.currentWar.player1, [this.battleGrid, nearestUnitPos]);
      return true;
    } else {
      console.log(`No player units in attack range for ${unitType} or nearest unit not found.`);
      return false;
    }
  }


  getUnitTypeAtPosition(position) {
    // Iterate through all player unit positions to find the unit type at the given position
    for (const [unitType, unitPos] of Object.entries(this.battleGrid.currentWar.player1.unitPositions)) {
      if (unitPos.row === position.row && unitPos.col === position.col) {
        return unitType;
      }
    }
    return null; // No unit found at the position
  }


  getAttackRangeForUnit(unitType) {
    // Placeholder: Return the attack range for the given unit type
    // Example:
    return this.battleGrid.currentWar.player2.armiesByType[unitType][0].attackRange; // Assuming the first unit of this type represents the attack range for all units of this type
  }

  getMovementRangeForUnit(unitType) {
    // Placeholder: Return the attack range for the given unit type
    // Example:
    return this.battleGrid.currentWar.player2.armiesByType[unitType][0].movementRange; // Assuming the first unit of this type represents the attack range for all units of this type
  }

moveUnitTypeCloser(aiUnitType) {
  const { nearestUnitType, nearestUnitPos, nearestDistance } = this.findNearestPlayerUnit(aiUnitType);
//   console.log(`AI Unit Type: ${aiUnitType}, Nearest Player Unit Type: ${nearestUnitType}, Nearest Unit Position:`, nearestUnitPos);

  if (!nearestUnitPos) {
    // console.log(`No target found for ${aiUnitType}.`);
    return;
  }

  // Convert aiUnitPos array to object format
  const aiUnitPosArray = this.battleGrid.unitPositions[aiUnitType];
//   console.log(`AI Unit Position Array:`, aiUnitPosArray);

  const movementRange = this.getMovementRangeForUnit(aiUnitType);
//   console.log(`Movement Range for ${aiUnitType}:`, movementRange);

  let bestTargetPos = null;
  let minDistanceToNearest = Infinity;

  for (let rowOffset = -movementRange[0]; rowOffset <= movementRange[0]; rowOffset++) {
    for (let colOffset = -movementRange[1]; colOffset <= movementRange[1]; colOffset++) {
      const targetRow = aiUnitPosArray[0] + rowOffset;
      const targetCol = aiUnitPosArray[1] + colOffset;

    //   console.log(`Checking potential position: Row ${targetRow}, Col ${targetCol}`);
    //   console.log(`IS THE DISTANCE VALID ? `, this.battleGrid.validateDistance(this.battleGrid.currentWar.player2.armiesByType[aiUnitType][0], aiUnitPosArray, targetRow, targetCol))

      if (this.battleGrid.validateDistance(this.battleGrid.currentWar.player2.armiesByType[aiUnitType][0], {row: aiUnitPosArray[0], col: aiUnitPosArray[1]}, targetRow, targetCol)) {
        const targetPos = [targetRow,targetCol];

        const potentialDistance = this.calculateDistance(targetPos, nearestUnitPos);
        // console.log(`Potential position at Row ${targetRow}, Col ${targetCol} has a distance of`, potentialDistance, `to the nearest player unit`);

        if (potentialDistance < minDistanceToNearest) {
          minDistanceToNearest = potentialDistance;
          bestTargetPos = targetPos;
        //   console.log(`New best target position found at Row ${targetRow}, Col ${targetCol} with distance`, potentialDistance);
        }
      }
    }
  }
// console.log(`ACTUAL DISTANCE`,nearestDistance);
  if (bestTargetPos && nearestDistance !== 1 ) {
    addBattleLogMessage(`Moving ${aiUnitType} closer to player unit ${nearestUnitType} at position Row ${bestTargetPos[0]}, Col ${bestTargetPos[1]}`);
    this.battleGrid.moveUnit(this.battleGrid.currentWar.player2.armiesByType[aiUnitType][0], {row: aiUnitPosArray[0], col: aiUnitPosArray[1]}, bestTargetPos[0], bestTargetPos[1]);
  } else {
    console.log(`No valid move found for ${aiUnitType}.`);
  }
}

  
  
  









  moveUnitTowards(unitType, unitId, targetPosition) {
    // Logic to move the AI unit closer to targetPosition
}

  attackWithUnit(unitType, unit) {
    // Logic for making this unit attack
  }

  findAttackableTarget(unitType, unitId) {
    // Logic to find and return a player unit within attack range of the AI unit
    // Placeholder: returns a target object if found, or null
}

  // Additional AI methods as needed...
}


