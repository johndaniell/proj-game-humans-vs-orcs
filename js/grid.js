class BattleGrid {
  constructor(rows, columns, currentWar) {
    this.rows = rows;
    this.columns = columns;
    this.currentWar = currentWar;
    this.armyPositions = {};
    this.inAttackMode = false;
    this.selectedUnitForAttack = null;
    this.grid = this.createGrid(rows, columns);
    this.tooltip = document.createElement("div");
    this.tooltip.className = "tooltip";
    this.unitActionTokens = {};
    document.body.appendChild(this.tooltip);
  }

  initializeUnitActionTokens() {
    // Reset tokens at the beginning for player1's armies
    this.unitActionTokens = {}; // Ensure it's clear before initializing
  
    // Initialize tokens for player1's armies
    this.currentWar.player1.armies.forEach(army => {
      this.unitActionTokens[army.id] = { moveToken: 1, attackToken: 1 };
    });
  
  }

  resetUnitActionTokens(unitType) {
    this.unitActionTokens[unitType].moveToken = 1;
    this.unitActionTokens[unitType].attackToken = 1;
  }

  resetActionTokensforAllUnits() {
    Object.keys(this.unitActionTokens).forEach((unitType) =>
      this.resetUnitActionTokens(unitType)
    );
  }

  skipTurn(unitType) {
    this.unitActionTokens[unitType].moveToken = 0;
    this.unitActionTokens[unitType].attackToken = 0;
    // Execute skip turn logic...
  }

  skipTurnForAllUnits() {
    // Loop through each unit type and set their tokens to 0
    Object.keys(this.unitActionTokens).forEach((unitType) => {
      this.skipTurn(unitType)

    }
    );
    

    // Optionally, trigger any end-of-turn effects here
    addBattleLogMessage("All units have skipped their turn.");

    // Refresh the grid or update the UI as needed
    this.refreshGrid(); // Assuming you have a method like this to redraw the grid
  }
  // Checks if any units have action tokens left

  haveUnitsActionTokensLeft() {
    return Object.values(this.unitActionTokens).some(
      (tokens) => tokens.moveToken > 0 || tokens.attackToken > 0
    );
  }

  createGrid(rows, columns) {
    // Create a 2D array filled with nulls to represent an empty grid
    return Array.from({ length: rows }, () => Array(columns).fill(null));
  }

  refreshGrid() {
    // console.log(`Refreshing GRID !`);
    this.tooltip.style.visibility = "hidden"; // Ensure tooltip is hidden
    const container = document.querySelector("#battle-grid-container");
    if (!container) return;

    this.displayGrid(container);

    // Re-place units at their remembered positions
    this.placeUnitsOnGrid()
    document
      .querySelector("#action-bar")
      .querySelectorAll(
        ".action-button:not(#back-button):not(#end-turn-button)"
      )
      .forEach((button) => button.remove());
  }

  displayGrid(container) {
    // Clear the current grid container
    container.innerHTML = "";

    // Create grid elements
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.columns; col++) {
        const gridCell = document.createElement("div");
        gridCell.classList.add("grid-cell");
        gridCell.setAttribute("data-row", row); // Set data-row attribute
        gridCell.setAttribute("data-col", col); // Set data-col attribute
        // gridCell.textContent = `${row},${col}`; // Placeholder text to show coordinates
        container.appendChild(gridCell);
      }
    }
  }




  placeUnitsOnGrid() {
    // Place player's units
    this.placeUnitsForSide(this.currentWar.player1.armies, 6, 0, true);
  
    // Place AI's (enemy) units
    this.placeUnitsForSide(this.currentWar.player2.armies, 6, this.columns - 1, false);
  }
  
  placeUnitsForSide(armies, startRow, startCol, isPlayer) {
    armies.forEach(armyDetails => {
      if (armyDetails.units.length === 0) return; // Skip empty armies
  
      // Check if we already have a position for this army

      let position = this.armyPositions[armyDetails.id];
      if (!position) {
        // Find a new position for this army
        position = this.findNextAvailablePosition(startRow, startCol);
        if (position) {
          // Save the new position with the army ID
          this.armyPositions[armyDetails.id] = { row: position[0], col: position[1], isPlayer };
        } else {
          console.error(`No available position found for army : ${armyDetails.id}`);
          return; // Skip placing this army if no position is found
        }
      }
  
      // Use the position to place the army on the grid
      this.placeUnitGroup(
        armyDetails.id, // Use the army ID here
        armyDetails.units,
        this.armyPositions[armyDetails.id].row, // Accessing the row directly from the object
        this.armyPositions[armyDetails.id].col, // use object property
        armyDetails.imagePath,
        isPlayer,
        armyDetails.color
      );
    });
  }
  
  

  
  

  findNextAvailablePosition(startRow, startCol) {
    let offsetDirection = 1;  // This will alternate between -1 (up) and 1 (down)
  
    // Start with the startRow, and check upwards and downwards alternately
    for (let offset = 0; offset < this.rows; offset++) {
      const tryRow = startRow + Math.ceil(offset / 2) * offsetDirection;
      
      // After each check, switch direction
      offsetDirection *= -1;
      
      // Skip if we're checking outside the grid's bounds
      if (tryRow < 0 || tryRow >= this.rows) continue;
      
      // Check if the cell is available. Note that we don't check for specific unit types here
      if (this.grid[tryRow][startCol] === null) {
        return [tryRow, startCol];
      }
    }
    
    // If no available position is found, return null
    return null;
  }
  
  


placeUnitGroup(armyId, armyUnits, row, col, imagePath, isPlayer,color) {
  // Boundary checks


  if (row < 0 || row >= this.rows || col < 0 || col >= this.columns) {
    console.error("Grid position is out of bounds.");
    return;
  }
  // Initialize the row if necessary
  // this.grid[row] = this.grid[row] || [];

  const cell = this.grid[row][col];

  // Check if the cell is empty, or it's occupied by the same armyId
  if (!cell || (cell && cell.armyId === armyId)) {
    this.grid[row][col] = {
      armyId: armyId,
      armyUnits,
      imagePath,
      isPlayer,
    };

    // Update the cell display based on the new unit group
    this.updateGridCellDisplayForGroup(row, col, armyId, armyUnits.length, imagePath, isPlayer,color);
    
    // Apply visual transformation for enemy units
    if (!isPlayer) {
      this.applyVisualTransformForEnemyUnits(row, col);
    }
  } else if (cell && cell.armyId !== armyId) {
    // If the cell is occupied by a different army, log an error
    console.error(`Cell at [${row}, ${col}] is occupied by a different army: ${cell.armyId}.`);
  }
}


applyVisualTransformForEnemyUnits(row, col) {
  const cellElement = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
  if (cellElement) {
    cellElement.style.transform = 'scaleX(-1)';
  }
}




updateGridCellDisplayForGroup(row, col, armyId, count, imagePath, isPlayer,color) {
  const gridCell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
  // console.log(gridCell)
  // gridCell.addEventListener("click", () => {
  //   console.log(`${armyId} at Row: ${row}, Col: ${col} clicked.`);
  //   // Rest of the click handling code...
  // });

  if (gridCell) {
    // Set the background image and text for the unit group
    gridCell.style.backgroundImage = `url(${imagePath})`;
    gridCell.setAttribute("data-army-id", armyId); // Changed to 'data-army-type' to match the new terminology
    gridCell.setAttribute("data-owner", isPlayer.toString());
    gridCell.setAttribute("data-owner", color);
    gridCell.style.backgroundSize = "contain";
    gridCell.style.cursor = "pointer";

    gridCell.addEventListener("mouseenter", (e) => {
      this.showTooltip(armyId, count,color, e);
    });

    gridCell.addEventListener("mousemove", (e) => {
      this.moveTooltip(e);
    });

    gridCell.addEventListener("mouseleave", () => {
      this.hideTooltip();
    });

    // Only set the click event for player units
    if (isPlayer) {
      gridCell.addEventListener("click", () => {
        this.selectUnit(armyId, gridCell, count, row, col);
      });
    } else {
      // Apply visual transformation for enemy units
      gridCell.style.transform = 'scaleX(-1)';
    }
  }
}


showTooltip(armyId, count, color, e) {
    // Create the tooltip content with the specified color
    const tooltipContent = `${armyId} (${count})\n<span style="color: ${color};">-${color}-</span>`;

    // Set the tooltip content dynamically
    this.tooltip.innerHTML = tooltipContent;
  this.tooltip.style.visibility = "visible";
  this.tooltip.style.left = e.pageX + 10 + "px"; // Position the tooltip near the cursor
  this.tooltip.style.top = e.pageY + 10 + "px";
}

moveTooltip(e) {
  if (this.tooltip.style.visibility === "visible") {
    this.tooltip.style.left = e.pageX + 10 + "px"; // Position the tooltip near the cursor
    this.tooltip.style.top = e.pageY + 10 + "px";
  }
}

hideTooltip() {
  this.tooltip.style.visibility = "hidden"; // Hide the tooltip
}

selectUnit(armyId, gridCell, count, row, col) {
  addBattleLogMessage(`${count} ${armyId} units at ${row},${col} selected.`);
  this.inAttackMode = false;
  this.clearHighlightedAttackTargets();
  this.clearHighlightedCells();
  this.refreshGrid();
  // Call function to show 'Move' and 'Attack' in action bar
  this.showUnitActions(armyId, gridCell, count);
}


/////////////// BUTTTTTTTTTTOOOOOOOOOOOOOONNNNNNNNNNNNNNSSSSSSSSSSSSSSSS 

showUnitActions(armyId, gridCell, count) {
  // Select all action buttons except 'Back'
  this.battleActionBar = document.querySelector("#action-bar");
  const actionButtons = this.battleActionBar.querySelectorAll(
    ".action-button:not(#back-button):not(#end-turn-button)"
  );

  // Clear existing 'Move' and 'Attack' actions, if any
  actionButtons.forEach((button) => button.remove());

  // Assuming isPlayer is a boolean that indicates if this is the current player's army
  const isPlayer = this.currentWar.player1.armies.some(army => army.id === armyId);

  if (isPlayer) {
      // Create 'Move' button
      const moveButton = this.createActionButton("Move", armyId, gridCell, 'moveToken', 'move');
      const attackButton = this.createActionButton("Attack", armyId, gridCell, 'attackToken', 'attack');
      // Create 'Skip' button
      const skipButton = this.createSkipButton(armyId);

      // Add buttons to the action bar
      this.battleActionBar.append(moveButton, attackButton, skipButton);

      // Update the appearance of buttons based on tokens
      this.updateButtonStyles(armyId, moveButton, attackButton, skipButton);
  }
}

createActionButton(actionName, armyId, gridCell, tokenType, actionType) {
  const actionButton = document.createElement("button");
  actionButton.textContent = actionName;
  actionButton.classList.add("action-button");
  actionButton.disabled = this.unitActionTokens[armyId][tokenType] <= 0;

  // Determine the correct method to call based on the actionType
  actionButton.addEventListener("click", () => {
    
      if (!actionButton.disabled) {
          switch (actionType) {
              case 'move':
                  this.startMoveMode(armyId, gridCell);
                  break;
              case 'attack':
                  this.toggleAttackMode(armyId, gridCell);
                  break;
              default:
                  console.error("Invalid action type");
          }
      } else {
          addBattleLogMessage(`No ${actionName.toLowerCase()}s left for this army!`);
      }
  });

  return actionButton;
}


createSkipButton(armyId) {
  const skipButton = document.createElement("button");
  skipButton.textContent = "Skip";
  skipButton.classList.add("action-button");
  skipButton.addEventListener("click", () => {
      // Consume both move and attack tokens
      if (this.unitActionTokens[armyId].moveToken > 0 ||
          this.unitActionTokens[armyId].attackToken > 0) {
          this.unitActionTokens[armyId].moveToken = 0;
          this.unitActionTokens[armyId].attackToken = 0;
          addBattleLogMessage(`Skipping turn for army ${armyId}. Move and attack consumed.`);
          // Refresh grid and update action buttons here
          this.refreshGrid();
          // Additional game state updates as needed
      } else {
          addBattleLogMessage("No actions left to skip!");
      }
  });
  return skipButton;
}


updateButtonStyles(armyId, moveButton, attackButton, skipButton) {
  // Update the style of buttons based on the availability of action tokens
  const tokens = this.unitActionTokens[armyId];
  const disabledStyle = "action-button-disabled"; 
  // console.log(`TOKENS`, tokens)
  moveButton.disabled = tokens.moveToken <= 0;
  attackButton.disabled = tokens.attackToken <= 0;


    // Update the disabled state and style for each button
    moveButton.disabled = !tokens.moveToken;
    attackButton.disabled = !tokens.attackToken;
    skipButton.disabled = !tokens.moveToken && !tokens.attackToken;

    // Apply the disabled style based on the disabled state
    moveButton.classList.toggle(disabledStyle, !tokens.moveToken);
    attackButton.classList.toggle(disabledStyle, !tokens.attackToken);
    skipButton.classList.toggle(
      disabledStyle,
      !tokens.moveToken && !tokens.attackToken
    );

}




  // ATTACK DISTANCE LOGIC
  //
  //
  // Method to enter attack mode

  toggleAttackMode(armyId, gridCell) {
    this.clearHighlightedAttackTargets();
    this.clearHighlightedCells();
    this.refreshGrid();
    // Enter or exit attack mode
    this.inAttackMode = !this.inAttackMode;
    this.selectedUnitForAttack = this.inAttackMode ? armyId : null;
    addBattleLogMessage(
      `${this.inAttackMode ? "Entering" : "Exiting"} attack mode for army : ${armyId}.`
    );
    if (this.inAttackMode) {
      // Pass armyId to the highlighting functions
      this.highlightEnemiesInRange(armyId, gridCell);
      this.highlightValidAttacks(armyId, gridCell);
    } else {
      this.clearHighlightedCells();
    }
  }
  

  // Method to calculate cell position from dataset attributes
  getCellPosition(gridCell) {
    return {
      row: parseInt(gridCell.dataset.row, 10),
      col: parseInt(gridCell.dataset.col, 10),
    };
  }

  // Method to check if an enemy unit exists at a given grid location
  isEnemyUnitAt(row, col) {
    // If the cell is not empty, check if the `isPlayerUnit` property is false
    const cellContent = this.grid[row][col];
    // console.log(`WHAT DO WE HAVE IN HERE ?? BEFORE CONDITION`, cellContent);
    if (cellContent && cellContent.isPlayer === false) {
      // The cell contains an enemy unit
      // console.log(`WHAT DO WE HAVE IN HERE ??`, cellContent);
      return true;
    }
    // The cell is either empty or contains a player unit
    return false;
  }

  clearHighlightedAttackTargets() {
    const highlightedTargets = document.querySelectorAll(
      ".highlight-attack-enemy"
    );
    highlightedTargets.forEach((target) => {
      target.classList.remove("highlight-attack-enemy");
      // console.log(`REMOVE HIGHLIGHTS`);
      // Clone and replace to remove event listeners
      const newTarget = target.cloneNode(true);
      target.parentNode.replaceChild(newTarget, target);
    });
  }

  clearHighlightedAttacks() {
    const highlightedTargets = document.querySelectorAll(
      ".highlight-attack"
    );
    highlightedTargets.forEach((target) => {
      target.classList.remove("highlight-attack");
      // console.log(`REMOVE HIGHLIGHTS`);
      // Clone and replace to remove event listeners
      const newTarget = target.cloneNode(true);
      target.parentNode.replaceChild(newTarget, target);
    });
  }


  highlightValidAttacks(armyId, gridCell) {
    // Get the current position
    // console.log(`Trying to highlight the attack`, armyId, gridCell)
    const armyDetails = this.currentWar.player1.armies.find(army => army.id === armyId);
    if (!armyDetails) {
      console.error(`Army with ID ${armyId} not found.`);
      return;
    }
    const currentPosition = this.getCellPosition(gridCell);

    // Clear any previous highlights
    // this.clearHighlightedCells();

    // Determine the valid move locations based on move range
    const validAttacks = this.calculateLocations(currentPosition, armyDetails.attackRange);
        // console.log(`Trying to highlight the attack`, armyId, gridCell)
    // Highlight the valid moves
    validAttacks.forEach(({ row, col }) => {
      const cellToHighlight = document.querySelector(
        `[data-row="${row}"][data-col="${col}"]`
      );
      // console.log(`THIS GRID ROW COL`,this.grid[row][col])
      if (cellToHighlight && this.grid[row][col] === null) {
        cellToHighlight.classList.add("highlight-attack");
        // console.log(`HIGHLIGHTING CELL `,cellToHighlight)
        cellToHighlight.addEventListener(
          "click",
          () => {
            addBattleLogMessage("No enemy unit selected or out of range.");
            this.clearHighlightedAttacks()
            this.clearHighlightedAttackTargets();
            this.refreshGrid();
            this.inAttackMode = false;
            this.selectedUnitForAttack = null;
          },
          { once: true }
        );
      }
    });
  }

  


  highlightEnemiesInRange(armyId, gridCell) {
    // Retrieve the army details using armyId
    const armyDetails = this.currentWar.player1.armies.find(army => army.id === armyId);
    
    // If armyDetails or attackRange is not found, we cannot highlight enemies
    if (!armyDetails || !armyDetails.attackRange) return;
  
    const attackRange = armyDetails.attackRange; // Now this is defined for the army
    const currentPosition = this.getCellPosition(gridCell); // Assuming this function extracts the row and col from the grid cell
  
    // Calculate valid attack targets based on range
    const validTargets = this.calculateLocations(currentPosition, attackRange);
  
    validTargets.forEach(({ row, col }) => {
      const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
      
      // Highlight the cell if it contains an enemy unit
      if (cell && this.isEnemyUnitAt(row, col)) {
        cell.classList.add("highlight-attack-enemy");
  
        // Set up a click listener for executing the attack
        cell.addEventListener("click", () => {
          this.executeAttack(armyId, currentPosition, { row, col });
        }, { once: true });
      }
    });
  }
  


  // Execute attack from the selected army to the target position
async executeAttack(attackingArmyId, fromPosition, toPosition) {
  const attackerArmyDetails = this.currentWar.player1.armies.find(army => army.id === attackingArmyId);
  const defenderArmyType = this.grid[toPosition.row][toPosition.col]?.armyId;
  const defenderArmyDetails = this.currentWar.player2.armies.find(army => army.id === defenderArmyType);

  if (!attackerArmyDetails || !defenderArmyDetails) {
    addBattleLogMessage("Invalid attacker or defender army.");
    return;
  }

  // Assuming attackRange is an array [minRange, maxRange] and calculateDistance returns the distance between two points.
  // const distance = this.calculateDistance(fromPosition, toPosition);
  // const attackRange = attackerArmyDetails.attackRange;

  // if (distance >= attackRange[0] && distance <= attackRange[1]) {
    // addBattleLogMessage(`Army ${attackingArmyId} attacks ${defenderArmyId} at position [${toPosition.row}, ${toPosition.col}]`);

 

    // Conduct the attack - this is a simplified representation
    // You will need to replace it with the actual logic of your attack
    this.currentWar.attack(
      attackingArmyId,
      defenderArmyType,
      attackerArmyDetails,
      defenderArmyDetails,
      [this , [toPosition.row,toPosition.col]]
    );



    // Update tokens and UI after attack
    this.unitActionTokens[attackingArmyId].attackToken -= 1;
    this.clearHighlightedAttackTargets();
    this.clearHighlightedCells();

    await this.flashCell(fromPosition.row, fromPosition.col,"#FFFF00");
    await this.flashCell(toPosition.row, toPosition.col,"#FF0000");



    this.refreshGrid(); // Reflect changes on the grid after the attack



    // Additional post-attack logic goes here...

  // } else {
  //   addBattleLogMessage("Target is out of range or no target selected.");
  //   this.clearHighlightedAttackTargets();
  //   this.clearHighlightedCells();
  //   this.refreshGrid();
  // }

  // Reset attack mode
  this.inAttackMode = false;
  this.selectedUnitForAttack = null;
}

  





flashCell(row, col, flashColor) {
  return new Promise((resolve, reject) => {
    const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
    if (!cell) {
      console.error(`Cell not found at [${row}, ${col}]`);
      reject(`Cell not found at [${row}, ${col}]`);
      return;
    }

    const animationName = `flash-${flashColor.replace("#", "")}`;
    const keyframes = `
      @keyframes ${animationName} {
        0%, 100% { filter: brightness(100%); }
        25%, 75% { filter: brightness(200%); background-color: ${flashColor}; }
      }
    `;

    console.log(`FLASHING`)
    const styleElement = document.createElement('style');
    document.head.appendChild(styleElement);
    styleElement.sheet.insertRule(keyframes, 0);

    cell.style.animation = `${animationName} 0.2s 3`;

    cell.addEventListener('animationend', () => {
      cell.style.animation = '';
      document.head.removeChild(styleElement);
      resolve(); // This will allow the execution to continue after the animation
    }, { once: true });
  });
}








  ///////////////// ---------------- MOVE ---------------------\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

  // Method for starting movement mode
  startMoveMode(armyId, gridCell) {
    this.clearHighlightedAttackTargets();
    this.clearHighlightedCells();
    this.refreshGrid();
    // Logic to highlight valid move locations
    addBattleLogMessage(`Prepare to move ${armyId}`);
    // Implement the logic to select valid cells
    const armyToMove = this.currentWar.player1.armies.find(army => army.id === armyId);

    if (armyToMove) {
      this.highlightValidMoves(armyToMove, gridCell);
    }
  }


  // Method to highlight valid moves
  highlightValidMoves(armyToMove, gridCell) {
    // Get the current position
    const currentPosition = {
      row: parseInt(gridCell.dataset.row, 10),
      col: parseInt(gridCell.dataset.col, 10),
    };

    // Clear any previous highlights
    // this.clearHighlightedCells();

    // Determine the valid move locations based on move range
    const validMoves = this.calculateLocations(
      currentPosition,
      armyToMove.movementRange
    );

    // Highlight the valid moves
    validMoves.forEach(({ row, col }) => {
      const cellToHighlight = document.querySelector(
        `[data-row="${row}"][data-col="${col}"]`
      );
      // console.log(`THIS GRID ROW COL`,this.grid[row][col])
      if (cellToHighlight && this.grid[row][col] === null) {
        cellToHighlight.classList.add("highlight-move");
        cellToHighlight.addEventListener(
          "click",
          () => {
            this.moveArmy(
              armyToMove,
              {
                row: parseInt(gridCell.dataset.row, 10),
                col: parseInt(gridCell.dataset.col, 10),
              },
              row,
              col
            );
          },
          { once: true }
        );
      }
    });
  }

  clearHighlightedCells() {
    const highlightedCells = document.querySelectorAll(".highlight-move");
    highlightedCells.forEach((cell) => {
      cell.classList.remove("highlight-move");
      const newCell = cell.cloneNode(true); // Clones the cell without event listeners
      cell.parentNode.replaceChild(newCell, cell);
    });
    // Now refresh the grid to reflect any state changes
    this.refreshGrid();
  }

  // Helper function to calculate valid move locations
  // NEED TO FIX IT :D
  // THE SOURCE ROW COL is somehow reversed with the range COL ROW . need  to later fix it .
  calculateLocations({ row, col }, [moveRangeCol, moveRangeRow]) {
    const moves = [];
    for (let r = row - moveRangeRow; r <= row + moveRangeRow; r++) {
      for (let c = col - moveRangeCol; c <= col + moveRangeCol; c++) {
        if (r >= 0 && r < this.rows && c >= 0 && c < this.columns) {
          moves.push({ row: r, col: c });
        }
      }
    }

    return moves;
  }

  // Helper method to validate if the move is allowed
  validateDistance(unitType, currentCell, targetRow, targetCol) {
    // console.log(`WE WANT TO MOVE ${unitType.type} to ${targetRow},${targetCol} from ${currentCell}`)
    const moveRange = unitType.movementRange;


       // Check if the target position is outside the grid bounds
       if (targetRow < 0 || targetRow >= this.rows || targetCol < 0 || targetCol >= this.columns) {
        // console.log(`Target position ${targetRow},${targetCol} is out of bounds.`);
        return false; // The target position is invalid because it's outside the grid
    }

    // Calculate the horizontal and vertical distances
    const horizontalDistance = Math.abs(targetCol - parseInt(currentCell.col));
    const verticalDistance = Math.abs(targetRow - parseInt(currentCell.row));

    // Validate move for both horizontal and vertical ranges
    // console.log(`MOVE RANGE ${moveRange[0]} and  ${moveRange[1]}`)
    const isValidHorizontalMove = horizontalDistance <= moveRange[0];
    const isValidVerticalMove = verticalDistance <= moveRange[1];

    // Ensure that the target cell is within the unit's movement range and is not occupied
    const isTargetCellEmpty = this.grid[targetRow][targetCol] === null;

    return isValidHorizontalMove && isValidVerticalMove && isTargetCellEmpty;
  }




  // THE ACTUAL MOVE HAPPENS HERE !
  // Method to move a unit to a new position
  // Method to move an army to a new position using armyId
  async moveArmy(armyToMove, currentCell, targetRow, targetCol) {
  // Validate move based on army's movement range and target cell availability
  const isValidMove = this.validateDistance(armyToMove, currentCell, targetRow, targetCol);
  if (!isValidMove) {
    console.error("Invalid move");
    this.clearHighlightedCells();
    return;
  }


  // Update army's position in the data model
  this.grid[targetRow][targetCol] = {
    armyId: armyToMove.id,
    armyUnits: armyToMove.units,
    imagePath: armyToMove.imagePath,
    isPlayer: armyToMove.isPlayer // Assuming isPlayer is a flag indicating player ownership
  };

  
  // Clear the army's old position
  const oldRow = parseInt(currentCell.row, 10);
  const oldCol = parseInt(currentCell.col, 10);
  // Assuming the grid stores armies or null for empty
  this.grid[currentCell.row][currentCell.col] = null;
  this.refreshGrid();
  // console.log (`await this.animateMove(armyToMove, ) `, armyToMove,)
  // console.log (`await this.animateMove( currentCell, ) `, currentCell,)
  // console.log (`await this.animateMove( targetRow, ) `,  targetRow,)
  // console.log (`await this.animateMove( targetCol) `,  targetCol)
  await this.animateMove(armyToMove, currentCell, targetRow, targetCol) 

  this.grid[oldRow][oldCol] = null;
  this.armyPositions[armyToMove.id] = { row: targetRow, col: targetCol,  isPlayer: this.armyPositions[armyToMove.id].isPlayer}

  if (
    this.unitActionTokens &&
    this.unitActionTokens[armyToMove.id] &&
    typeof this.unitActionTokens[armyToMove.id].moveToken === "number"
  ) {
    this.unitActionTokens[armyToMove.id].moveToken -= 1;
  }

  // Refresh the grid to reflect updated positions
  this.refreshGrid();

}

// Helper method to find army by ID (You need to implement this based on your data structure)
findArmyById(armyId) {
  // Example implementation, adjust based on how you store armies
  return this.currentWar.player1.armies.find(army => army.id === armyId)
      || this.currentWar.player2.armies.find(army => army.id === armyId);
}

// Note: You'll need to adjust or implement `validateDistance` to work with the new parameters

  // Additional methods to manage grid state, place units, etc.







 animateMove(armyToMove, currentCell, targetRow, targetCol) {
    // Convert grid coordinates to pixel/screen coordinates

    return new Promise((resolve) => {

      const gridCellSelector = `[data-row="${currentCell.row}"][data-col="${currentCell.col}"]`;
      const currentGridCell = document.querySelector(gridCellSelector);
  
      // Temporarily clear the background image of the current cell
      if (currentGridCell) {
        currentGridCell.style.backgroundImage = 'none'
        // console.log(`REMOVING IMAGEEEEEEEEEEEEEEE FROM `,`[data-row="${currentCell.row}"][data-col="${currentCell.col}"]`);
      }
      // this.refreshGrid();


    const startPosition = this.getPixelPositionForGridCell(currentCell.row, currentCell.col);
    const targetPosition = this.getPixelPositionForGridCell(targetRow, targetCol);
  
    // Calculate the time it should take to move from the start position to the target position
    const distance = Math.sqrt(Math.pow(targetRow - currentCell.row, 2) + Math.pow(targetCol - currentCell.col, 2));
    const animationTime = 0.2 * distance; // time in seconds
  
    // Determine direction of movement to apply scaleX if moving left
    const isMovingLeft = targetCol < currentCell.col;

    // Create a container for the image
    const movingContainer = document.createElement('div');
    movingContainer.style.position = 'absolute';
    movingContainer.style.width = '80px'; // Match the grid cell size
    movingContainer.style.height = '80px'; // Match the grid cell size
    movingContainer.style.left = `${startPosition.x}px`;
    movingContainer.style.top = `${startPosition.y}px`;
    movingContainer.style.backgroundImage = `url(${armyToMove.imagePath})`;
    movingContainer.style.backgroundSize = 'contain';
    movingContainer.style.backgroundPosition = 'center';
    movingContainer.style.backgroundRepeat = 'no-repeat';
    movingContainer.style.transition = `all ${animationTime}s ease-in-out`;
    // Apply scaleX transformation if moving left
    movingContainer.style.transform = isMovingLeft ? 'scaleX(-1)' : '';
    // Add the image to the document
    document.body.appendChild(movingContainer);


    this.grid[currentCell.row][currentCell.col] = null
    // this.refreshGrid();
    // Move the image to the target position
    setTimeout(() => {
      movingContainer.style.left = targetPosition.x  + 'px';
      movingContainer.style.top = targetPosition.y  + 'px';
      movingContainer.style.transform = isMovingLeft ? 'scaleX(-1)' : '';
    }, 1000 / 30); // Start moving after ~33ms for approx. 30 FPS



    // Remove the image and update the grid after the animation is done
    setTimeout(() => {
      document.body.removeChild(movingContainer);
      
      resolve();// Resolve the promise here
    }, animationTime * 1000);
  });
  }

// Helper function to convert grid position to pixel position
getPixelPositionForGridCell(row, col) {
  const cellSize = 80; // The size of the cell
  const borderSize = 1; // The size of the border
  const gridContainer = document.getElementById('battle-grid-container');
  const gridRect = gridContainer.getBoundingClientRect();

  // Include the grid container's offset in the calculation
  const x = gridRect.left + (col * (cellSize + borderSize/2 ));
  const y = gridRect.top + (row * (cellSize + borderSize/2 ));

  return { x, y };
}



}