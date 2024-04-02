class Player {
  constructor(name) {
    this.name = name;
    this.armies = []; // Keyed by unique type identifiers
  }


  addUnit(type, count) {
    if (!UnitTypes[type]) {
      console.error("Invalid unit type:", type);
      return;
    }

    // Create a unique army ID
    let armyId = `${type}-${this.armies.length + 1}`;
    // console.log(`ARMIEEEEEEEEEEEEEEESSSSSSSSSSSSSS`,this.armies)

    // Instantiate unit instances
    let unitInstances = Array.from({ length: count }, () => new UnitTypes[type]());

    // Create the new army object
    let newArmy = {
      id: armyId,
      type: type,
      count: count,
      units: unitInstances,
      movementRange: UnitTypes[type].movementRange,
      attackRange: UnitTypes[type].attackRange,
      imagePath: UnitTypes[type].imagePath,
      color: UnitTypes[type].color,
    };

    // Add the new army to the player's collection
    this.armies.push(newArmy);
  }

    // Method to split an army - this is a placeholder, implementation depends on game logic
    splitArmy(armyId, newCount) {
      // Find the army to split
      let armyIndex = this.armies.findIndex(army => army.id === armyId);
      if (armyIndex === -1) {
          console.error("Army not found:", armyId);
          return;
      }

      let army = this.armies[armyIndex];

      // Ensure there are enough units to split
      if (army.count < newCount) {
          console.error("Not enough units in the army to split:", armyId);
          return;
      }

      // Reduce the original army's count
      army.count -= newCount;

      // Create a new army with the split-off units
      this.addUnit(army.type, newCount);
  }

  getTotalArmyCount() {
    return this.armies.reduce((total, army) => total + army.count, 0);
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

  this.battleGrid.currentWar.player2.armies.forEach(aiArmyType => {
      // console.log(`PlayerArmyType.id AT THE BEGINNING` , aiArmyType.id);
        // Perform a check to decide whether to attack directly or move closer
        if (!this.checkAndAttack(aiArmyType.id)) {
        // If no attack was possible, move the unit type closer to the target
        this.moveArmyTypeCloser(aiArmyType.id);
        // After moving, check again for attack opportunities
        this.checkAndAttack(aiArmyType.id);
        }
  });
    // Call any necessary callbacks or signal that the AI's turn is over
  }


  // Basic pathfinding algorithm to find the nearest player unit

  calculateDistance(ArmyPos1, ArmyPos2) {
    // Adjusted to work with positions represented as arrays
    // console.log(`calculateDistance(ArmyPos1, ArmyPos2)`,  ArmyPos1, ArmyPos2)
    return (
      Math.abs(ArmyPos1.row - ArmyPos2.row) + // Calculate row distance
      Math.abs(ArmyPos1.col - ArmyPos2.col)   // Calculate column distance
    );
  }
  
  findNearestPlayerArmy(aiArmyType) {
    // console.log(`aiArmyType`,aiArmyType )
    // console.log(`this.battleGrid.armyPositions[aiArmyType], inside findNearestPlayerArmy`, this.battleGrid.armyPositions[aiArmyType])
    const aiArmyPos = this.battleGrid.armyPositions[aiArmyType];
    let nearestDistanceToPlayer = Infinity;
    let nearestPlayerArmyType = null;
    let nearestPlayerArmyPos = null;
    // Ensure positions for AI unit type exist
    if (!aiArmyPos) {
      console.error(`Position for AI unit type ${aiArmyType} not found.`);
      return null;
    }
    // console.log(`this.battleGrid.armyPositionsplayerArmyType.isPlayer`, this.battleGrid.armyPositions.playerArmyType)
    // Loop through player unit types and their positions
    Object.entries(this.battleGrid.armyPositions)
  .filter(([_, armyDetails]) => armyDetails.isPlayer === true) // Adjust true/false based on your need
  .forEach(([playerArmyType, playerArmyPos]) => {
      // Ensure we're only considering player units and the position is defined
      // console.log(`playerArmyType, playerArmyPos inside the loop findNearestPlayerArmy`, playerArmyType, playerArmyPos)
      // console.log(`DOES THIS EXISTS ?  this.battleGrid.currentWar.player1.armies.playerArmyType`, this.battleGrid.currentWar.player1.armies.playerArmyType)
      if (playerArmyPos) {
        const distance = this.calculateDistance(aiArmyPos, playerArmyPos);
        // console.log(`Distance from AI to PLyaer POSITION: `, distance)
        if (distance < nearestDistanceToPlayer) {
          nearestDistanceToPlayer = distance;
          nearestPlayerArmyType = playerArmyType;
          nearestPlayerArmyPos = playerArmyPos;
          // console.log(`nearestPlayerArmyPos`, nearestPlayerArmyPos)
          // console.log(`nearestPlayerArmyType`, nearestPlayerArmyType)
        }
      }
    });
  
    // console.log(`Nearest player unit ${nearestPlayerArmyType} at psotion  ${nearestPlayerArmyPos.col}, ${nearestPlayerArmyPos.row} at distance ${nearestDistanceToPlayer}`);
    return { nearestPlayerArmyType, nearestPlayerArmyPos, nearestDistanceToPlayer };
  }
  
  
  isArmyInAttackRange(aiArmyId, targetPosition) {
    // Assuming `aiArmyId` is used to find the army's current position
    const aiUnitPos = this.battleGrid.armyPositions[aiArmyId];
    // console.log (aiUnitPos,targetPosition )

    // Validate that we found the AI army position
    if (!aiUnitPos) {
        console.error(`Position for army ID ${aiArmyId} not found.`);
        return false;
    }

    // Get the attack range for this army
    // Note: getAttackRangeForArmy should return the actual numeric range, not an array
    const attackRange = this.getAttackRangeForArmy(aiArmyId, this.battleGrid.currentWar.player2); // Getting the attack range for COMPUTER

    // Calculate the horizontal and vertical distances between the AI unit and the target
    const horizontalDistance = Math.abs(aiUnitPos.col - targetPosition.col); // Difference in columns
    const verticalDistance = Math.abs(aiUnitPos.row - targetPosition.row); // Difference in rows
// console.log(`attackRange`, attackRange)
// console.log(`horizontalDistance`, horizontalDistance)
// console.log(`verticalDistance`, verticalDistance)

    // Check if the target is within the attack range
    const isWithinAttackRange = horizontalDistance <= attackRange[0] && verticalDistance <= attackRange[1];

    // console.log(`isWithinAttackRange`, isWithinAttackRange)
    return isWithinAttackRange;
}

  

  

checkAndAttack(aiArmyType) {
    // Find the nearest player unit and its type
    console.log ( `checkAndAttack aiArmyType`, aiArmyType)
    const { nearestPlayerArmyType, nearestPlayerArmyPos, nearestDistanceToPlayer } = this.findNearestPlayerArmy(aiArmyType);
    // console.log(`nearestUnitType, nearestUnitPos, nearestDistance`, nearestPlayerArmyType, nearestPlayerArmyPos, nearestDistanceToPlayer)

    
    // Check if the nearest player unit is within attack range
    if (nearestPlayerArmyType && this.isArmyInAttackRange(aiArmyType, nearestPlayerArmyPos)) {
        addBattleLogMessage(`AI (${aiArmyType}) trying to attack nearest player unit (${nearestPlayerArmyType}) located at`, [nearestPlayerArmyPos.row, nearestPlayerArmyPos.col]);
  


        const aiArmyDetails = this.battleGrid.currentWar.player2.armies.find(army => army.id === aiArmyType);
        const PlayerArmyDetails = this.battleGrid.currentWar.player1.armies.find(army => army.id === nearestPlayerArmyType);

      console.log(`THISSSSSSSSSSSS BATTLEGRID INSIDE PLAYER`,this.battleGrid)

      

      this.battleGrid.currentWar.attack(
        aiArmyType,
        nearestPlayerArmyType,
        aiArmyDetails,
        PlayerArmyDetails,
        [this.battleGrid ,[nearestPlayerArmyPos.row,nearestPlayerArmyPos.col]],
      );

        
        // Make sure to access the row and col correctly from armyPositions
        const attackerPosition = this.battleGrid.armyPositions[aiArmyType];
        const defenderPosition = nearestPlayerArmyPos;

        if (attackerPosition && defenderPosition) {
          // Now we have valid positions, we can flash the cells
          this.battleGrid.flashCell(attackerPosition.row, attackerPosition.col, "#FFFF00"); // Flash attacker
          this.battleGrid.flashCell(defenderPosition.row, defenderPosition.col, "#FF0000"); // Flash defender
        }

      return true;
    } else {
      console.log(`No player units in attack range for ${aiArmyType} or nearest unit not found.`);
      return false;
    }
  }



  // DO WE NEED THIS ?

  getArmyTypeAtPosition(position) {
    // Iterate through all player unit positions to find the unit type at the given position
    for (const [unitType, unitPos] of Object.entries(this.battleGrid.currentWar.player1.unitPositions)) {
      if (unitPos.row === position.row && unitPos.col === position.col) {
        return unitType;
      }
    }
    return null; // No unit found at the position
  }


  getAttackRangeForArmy(armyType, player) {
    // Find the army within the player's armies array using the unique army ID
    const army = player.armies.find(army => army.id === armyType);
    if (!army) {
      console.error(`Army with ID ${armyType} not found for player.`);
      return null;
    }
    console.log(`Attack Range for army ${armyType}:`, army.attackRange);
    return army.attackRange;
  }
  

    getMovementRangeForArmy(armyType, player) {
      // Assuming player is an instance of the Player class and has an 'armies' array
      const armyToMove = player.armies.find(army => army.id === armyType);
      if (!armyToMove) {
        console.error(`Army with ID ${armyType} not found for player.`);
        return null;
      }
      // console.log(`Army Movement Range for ${armyType}:`, armyToMove.movementRange);
      return armyToMove.movementRange;
    }



    moveArmyTypeCloser(aiArmyType) {
      // console.log(`moveArmyTypeCloser aiArmyType`,aiArmyType)
      const { nearestPlayerArmyType, nearestPlayerArmyPos, nearestDistanceToPlayer } = this.findNearestPlayerArmy(aiArmyType);
      // console.log(`AI Unit Type: ${aiArmyType}, Nearest Player Unit Type: ${nearestPlayerArmyType}, Nearest Unit Position:`, nearestPlayerArmyPos, nearestDistanceToPlayer);
  
      if (!nearestPlayerArmyPos) {
        console.log(`No target found for ${aiArmyType}.`);
        return;
      }

          // Find the AI army object based on aiArmyType
    const aiArmy = this.battleGrid.currentWar.player2.armies.find(army => army.id === aiArmyType);
    if (!aiArmy) {
        console.error(`Army ${aiArmyType} not found.`);
        return;
    }
  
      const aiArmyPos = this.battleGrid.armyPositions[aiArmyType];
      const movementRange = this.getMovementRangeForArmy(aiArmyType, this.battleGrid.currentWar.player2); // GETTING THE MOVEMENT RANGE FOR COMPUTER
  
      // Find the best target position for the AI army
      const bestTargetPos = this.findBestTargetPosition(aiArmyPos, movementRange, nearestPlayerArmyPos);
  


      if (bestTargetPos && nearestDistanceToPlayer !== 1) {
        const gridCellSelector = `[data-row="${aiArmyPos.row}"][data-col="${aiArmyPos.col}"]`;
        const currentGridCell = document.querySelector(gridCellSelector);
    
        // Temporarily clear the background image of the current cell
        if (currentGridCell) {
          currentGridCell.style.backgroundImage = 'none'
          // console.log(`REMOVING IMAGEEEEEEEEEEEEEEE FROM `,`[data-row="${currentCell.row}"][data-col="${currentCell.col}"]`);
        }




        addBattleLogMessage(`Moving ${aiArmyType} closer to player unit ${nearestPlayerArmyType} at position Row ${bestTargetPos.row}, Col ${bestTargetPos.col}`);
          this.battleGrid.moveArmy(aiArmy, aiArmyPos, bestTargetPos.row, bestTargetPos.col);
      } else {
        console.log(`No valid move found for ${aiArmyType}.`);
      }
    }


    findBestTargetPosition(aiArmyPos, movementRange, nearestPlayerArmyPos) {
      let bestTargetPos = null;
      let minDistanceToNearest = Infinity;

      // Assuming movementRange is an array where both row and col have the same range
      const [rowRange, colRange] = movementRange;

      for (let rowOffset = -rowRange; rowOffset <= rowRange; rowOffset++) {
        for (let colOffset = -colRange; colOffset <= colRange; colOffset++) {
          const targetRow = aiArmyPos.row + rowOffset;
          const targetCol = aiArmyPos.col + colOffset;

          // Simulate unitType object expected by validateDistance 
          // IS A HACK !!!  not gonna refactor anymore :D
          const unitTypeSimulated = { movementRange: [rowRange, colRange] };
          // Current cell object expected by validateDistance
          const currentCell = { row: aiArmyPos.row, col: aiArmyPos.col };

          // Call validateDistance with the correctly structured arguments
          if (this.battleGrid.validateDistance(unitTypeSimulated, currentCell, targetRow, targetCol)) {
            const targetPos = { row: targetRow, col: targetCol };
            const potentialDistance = this.calculateDistance(targetPos, nearestPlayerArmyPos);

            if (potentialDistance < minDistanceToNearest) {
              minDistanceToNearest = potentialDistance;
              bestTargetPos = targetPos;
            }
          }
        }
      }

      return bestTargetPos;
    }

  

// moveArmyTypeCloser(aiArmyType) {
//   // takes in the AI army ID, flind the closes player and take ACTION :D
//   const { nearestPlayerArmyType, nearestPlayerArmyPos, nearestDistance } = this.findNearestPlayerArmy(aiArmyType);
//   console.log(`AI Unit Type: ${aiArmyType}, Nearest Player Unit Type: ${nearestPlayerArmyType}, Nearest Unit Position:`, nearestPlayerArmyPos);

//   if (!nearestPlayerArmyPos) {
//     console.log(`No target found for ${nearestPlayerArmyPos}.`);
//     return;
//   }

//   // Convert aiUnitPos array to object format
//   const aiUnitPosArray = this.battleGrid.armyPositions[aiArmyType];


//   const movementRange = this.getMovementRangeForArmy(aiArmyType, this.battleGrid.currentWar.player1);


//   let bestTargetPos = null;
//   let minDistanceToNearest = Infinity;

//   for (let rowOffset = -movementRange[0]; rowOffset <= movementRange[0]; rowOffset++) {
//     for (let colOffset = -movementRange[1]; colOffset <= movementRange[1]; colOffset++) {
//       const targetRow = aiUnitPosArray[0] + rowOffset;
//       const targetCol = aiUnitPosArray[1] + colOffset;

//     //   console.log(`Checking potential position: Row ${targetRow}, Col ${targetCol}`);
//     //   console.log(`IS THE DISTANCE VALID ? `, this.battleGrid.validateDistance(this.battleGrid.currentWar.player2.armiesByType[aiUnitType][0], aiUnitPosArray, targetRow, targetCol))

//       if (this.battleGrid.validateDistance(this.battleGrid.currentWar.player2.armiesByType[aiUnitType][0], {row: aiUnitPosArray[0], col: aiUnitPosArray[1]}, targetRow, targetCol)) {
//         const targetPos = [targetRow,targetCol];

//         const potentialDistance = this.calculateDistance(targetPos, nearestUnitPos);
//         // console.log(`Potential position at Row ${targetRow}, Col ${targetCol} has a distance of`, potentialDistance, `to the nearest player unit`);

//         if (potentialDistance < minDistanceToNearest) {
//           minDistanceToNearest = potentialDistance;
//           bestTargetPos = targetPos;
//         //   console.log(`New best target position found at Row ${targetRow}, Col ${targetCol} with distance`, potentialDistance);
//         }
//       }
//     }
//   }
// // console.log(`ACTUAL DISTANCE`,nearestDistance);
//   if (bestTargetPos && nearestDistance !== 1 ) {
//     addBattleLogMessage(`Moving ${aiUnitType} closer to player unit ${nearestUnitType} at position Row ${bestTargetPos[0]}, Col ${bestTargetPos[1]}`);
//     this.battleGrid.moveArmy(this.battleGrid.currentWar.player2.armiesByType[aiUnitType][0], {row: aiUnitPosArray[0], col: aiUnitPosArray[1]}, bestTargetPos[0], bestTargetPos[1]);
//   } else {
//     console.log(`No valid move found for ${aiUnitType}.`);
//   }
// }

 

// }
  }

