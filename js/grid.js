class BattleGrid {
  constructor(rows, columns, currentWar) {
    this.rows = rows;
    this.columns = columns;
    this.currentWar = currentWar;
    this.unitPositions = {};
    this.inAttackMode = false;
    this.selectedUnitForAttack = null;
    this.grid = this.createGrid(rows, columns);
    this.tooltip = document.createElement("div");
    this.tooltip.className = "tooltip";
    this.unitActionTokens = {};
    document.body.appendChild(this.tooltip);
  }
  
  

  initializeUnitActionTokens() {
    // Assuming this.currentWar.player1.armiesByType has all the unit types
    Object.keys(this.currentWar.player1.armiesByType).forEach((unitType) => {
      this.unitActionTokens[unitType] = { moveToken: 1, attackToken: 1 };
    });
  }

  resetUnitActionTokens(unitType) {
    this.unitActionTokens[unitType].moveToken = 1;
    this.unitActionTokens[unitType].attackToken = 1;
  }


  resetActionTokensforAllUnits(){
    Object.keys(this.unitActionTokens).forEach(unitType => this.resetUnitActionTokens(unitType));
  }

  skipTurn(unitType) {
    this.unitActionTokens[unitType].moveToken = 0;
    this.unitActionTokens[unitType].attackToken = 0;
    // Execute skip turn logic...
  }

  skipTurnForAllUnits() {
    // Loop through each unit type and set their tokens to 0
    Object.keys(this.unitActionTokens).forEach(unitType => this.skipTurn(unitType));

    // Optionally, trigger any end-of-turn effects here
    console.log("All units have skipped their turn.");

    // Refresh the grid or update the UI as needed
    this.refreshGrid(); // Assuming you have a method like this to redraw the grid
  }
  // Checks if any units have action tokens left

  haveUnitsActionTokensLeft() {
    return Object.values(this.unitActionTokens).some(tokens => tokens.moveToken > 0 || tokens.attackToken > 0);
  }


  createGrid(rows, columns) {
    // Create a 2D array filled with nulls to represent an empty grid
    return Array.from({ length: rows }, () => Array(columns).fill(null));
  }

  refreshGrid() {
    console.log(`Refreshing GRID !`);
    this.tooltip.style.visibility = "hidden"; // Ensure tooltip is hidden
    const container = document.querySelector("#battle-grid-container");
    if (!container) return;

    this.displayGrid(container);

    // Re-place units at their remembered positions
    this.placeUnitsForSide(this.currentWar.player1, 6, 0, true);
    this.placeUnitsForSide(this.currentWar.player2, 6, this.columns - 1, false);
    document.querySelector("#action-bar").querySelectorAll(
      ".action-button:not(#back-button):not(#end-turn-button)"
    ).forEach((button) => button.remove());
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

  // Helper function to find the next available position
  findNextAvailablePosition(startRow, startCol, isPlayerUnit) {
    // Define search direction based on whether it's a player unit or enemy unit
    const direction = isPlayerUnit ? 1 : -1;

    for (let offset = 0; offset < this.rows; offset++) {
      const tryRow = startRow + offset * direction;
      if (tryRow < 0 || tryRow >= this.rows) continue; // Skip if outside grid bounds

      // Check if the position is available
      if (this.grid[tryRow][startCol] === null) {
        return [tryRow, startCol];
      }
    }
    // If no position is found, return null
    return null;
  }

  placeUnitsOnGrid() {
    // Example of placing units for player and enemy dynamically

    this.placeUnitsForSide(this.currentWar.player1, 6, 0, true);
    this.placeUnitsForSide(this.currentWar.player2, 6, this.columns - 1, false);
    console.log(`Refreshing grid `);
  }

  placeUnitsForSide(player, startRow, startCol, isPlayerUnit) {
    Object.entries(player.armiesByType).forEach(([unitType, unitGroup]) => {
      if (unitGroup.length === 0) return;

      let position;
      // Check if we already have a position for this unit type
      if (this.unitPositions[unitType]) {
        position = this.unitPositions[unitType];
      } else {
        // Find a new position and remember it
        position = this.findNextAvailablePosition(
          startRow,
          startCol,
          isPlayerUnit
        );
        this.unitPositions[unitType] = position;
      }
      if (position) {
        const [row, col] = position;
        this.placeUnitGroup(
          unitType,
          unitGroup,
          row,
          col,
          unitGroup[0].imagePath, // NEED TO ADD IT HERE
          isPlayerUnit
        );
      }
    });
  }

  // Place a group of units in one cell
  placeUnitGroup(unitType, groupReference, row, col, imagePath, isPlayerUnit) {
    // Check if the cell is empty or already contains the same unit type
    if (this.grid[row][col] === null || this.grid[row][col].type === unitType) {
      this.grid[row][col] = {
        type: unitType,
        groupReference, // Store the reference here
        imagePath,
        isPlayerUnit,
      };

      this.updateGridCellDisplayForGroup(
        row,
        col,
        unitType,
        groupReference.length, // Use the length from the reference
        imagePath,
        isPlayerUnit
      );

      // console.log(unitType, groupReference.length, row, col);
    } else {
      console.error("Grid cell is occupied by a different unit type.");
    }
  }

  updateGridCellDisplayForGroup(
    row,
    col,
    unitType,
    count,
    imagePath,
    isPlayerUnit
  ) {
    const gridCell = document.querySelector(
      `[data-row="${row}"][data-col="${col}"]`
    );

    if (gridCell) {
      // Set the background image and text for the unit group
      gridCell.style.backgroundImage = `url(${imagePath})`;
      // gridCell.textContent = `${unitType} (${count}) ${isPlayerUnit}`;
      gridCell.setAttribute("data-unit-type", unitType);
      gridCell.setAttribute("data-owner", isPlayerUnit.toString());
      gridCell.style.backgroundImage = `url(${imagePath})`;
      gridCell.style.backgroundSize = "cover";
      gridCell.style.cursor = "pointer";

      gridCell.addEventListener("mouseenter", (e) => {
        if (document.body.contains(gridCell)) {
          this.tooltip.textContent = `${unitType} (${count})`; // Dynamically set the content
          this.tooltip.style.visibility = "visible";
        }
      });

      gridCell.addEventListener("mousemove", (e) => {
        if (document.body.contains(gridCell)) {
          this.tooltip.style.left = e.pageX + 10 + "px"; // Position the tooltip near the cursor
          this.tooltip.style.top = e.pageY + 10 + "px";
        }
      });

      gridCell.addEventListener("mouseleave", () => {
        if (document.body.contains(gridCell)) {
          this.tooltip.style.visibility = "hidden"; // Hide the tooltip
        }
      });

      // Only set the click event for player units
      if (isPlayerUnit) {
        gridCell.addEventListener("click", () => {
          console.log(`${count} ${unitType} units at ${row},${col} selected.`);
          // Call function to show 'Move' and 'Attack' in action bar
          this.showUnitActions(unitType, gridCell, isPlayerUnit);
        });
      }
    }
  }


  showUnitActions(unitType, gridCell, isPlayerUnit) {
    // Select all action buttons except 'Back'
    this.battleActionBar = document.querySelector("#action-bar");
    const actionButtons = this.battleActionBar.querySelectorAll(".action-button:not(#back-button):not(#end-turn-button)");
  
    // If it's a player unit, show 'Move' and 'Attack' buttons; otherwise, hide them
    if (isPlayerUnit) {
      // Clear existing 'Move' and 'Attack' actions, if any
      actionButtons.forEach((button) => button.remove());

      // Create 'Move' button
      const moveButton = document.createElement("button");
      moveButton.textContent = "Move";
      moveButton.classList.add("action-button");
      moveButton.disabled = this.unitActionTokens[unitType].moveToken <= 0; // Disable if no move tokens
      moveButton.addEventListener("click", () => {
        console.log(`Move ${unitType}`);
        this.startMoveMode(unitType, gridCell);
      });

      // Create 'Attack' button
      const attackButton = document.createElement("button");
      attackButton.textContent = "Attack";
      attackButton.classList.add("action-button");
      attackButton.disabled = this.unitActionTokens[unitType].attackToken <= 0; // Disable if no attack tokens
      attackButton.addEventListener("click", () => {
        if (!attackButton.disabled) {
          this.toggleAttackMode(unitType, gridCell);
        } else {
          console.log("No attack tokens left for this unit type!");
        }
      });

      // Create 'Skip' button
      const skipButton = document.createElement("button");
      skipButton.textContent = "Skip";
      skipButton.classList.add("action-button");
      skipButton.addEventListener("click", () => {
        // Consume both move and attack tokens
        if (
          this.unitActionTokens[unitType].moveToken > 0 ||
          this.unitActionTokens[unitType].attackToken > 0
        ) {
          this.unitActionTokens[unitType].moveToken = 0;
          this.unitActionTokens[unitType].attackToken = 0;
          console.log(
            `Skipping turn for ${unitType}. Move and attack tokens consumed.`
            
          );


          // Update the state of the game as needed
          // ...

          actionButtons.forEach((button) => button.remove());
          this.refreshGrid();

      // Update the appearance of all action buttons
        this.updateButtonStyles(unitType,moveButton, attackButton, skipButton);
        } else {
          console.log("No actions left to skip!");
        }
      });

      // Add buttons to the action bar
      this.battleActionBar.appendChild(moveButton);
      this.battleActionBar.appendChild(attackButton);
      this.battleActionBar.appendChild(skipButton);

      // Update the appearance of buttons based on tokens
      this.updateButtonStyles(unitType,moveButton, attackButton, skipButton);
    } else {
      // If it's not a player unit, remove 'Move' and 'Attack' buttons
      actionButtons.forEach((button) => button.remove());
    }
  }

   
  updateButtonStyles(unitType, moveButton, attackButton, skipButton) {
    const disabledStyle = 'action-button-disabled'; // CSS class for disabled style
    const hasMoveToken = this.unitActionTokens[unitType].moveToken > 0;
    const hasAttackToken = this.unitActionTokens[unitType].attackToken > 0;
  
    // Update the disabled state and style for each button
    moveButton.disabled = !hasMoveToken;
    attackButton.disabled = !hasAttackToken;
    skipButton.disabled = !hasMoveToken && !hasAttackToken;
  
    // Apply the disabled style based on the disabled state
    moveButton.classList.toggle(disabledStyle, !hasMoveToken);
    attackButton.classList.toggle(disabledStyle, !hasAttackToken);
    skipButton.classList.toggle(disabledStyle, !hasMoveToken && !hasAttackToken);
  }

  

// ATTACK DISTANCE LOGIC 
//
//
// Method to enter attack mode

toggleAttackMode(unitType, gridCell) {
  // Enter or exit attack mode
  this.inAttackMode = !this.inAttackMode;
  this.selectedUnitForAttack = this.inAttackMode ? unitType : null;
  console.log(`${this.inAttackMode ? 'Entering' : 'Exiting'} attack mode.`);
  if (this.inAttackMode) {
    this.highlightEnemiesInRange(unitType, gridCell);
  } else {
    this.clearHighlightedCells();
  }
}



highlightEnemiesInRange(unitType, gridCell) {
  const unit = this.getUnitInstanceFromType(unitType);
  const attackRange = unit.attackRange; // Assuming attackRange is defined for the unit
  const currentPosition = this.getCellPosition(gridCell);

  // First, clear any previously highlighted targets
  this.clearHighlightedCells();

  // Then, highlight valid attack targets based on range
  const validTargets = this.calculateLocations(currentPosition, attackRange);

  validTargets.forEach(({ row, col }) => {
    const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
    // Highlight cell if it contains an enemy unit
    if (cell && this.isEnemyUnitAt(row, col)) {
      cell.classList.add("highlight-attack");
      // Setup click listener for executing the attack
      cell.addEventListener("click", () => this.executeAttack(unitType, currentPosition, {row, col}), { once: true });
    }
  });
}

// Method to calculate cell position from dataset attributes
getCellPosition(gridCell) {
  return {
    row: parseInt(gridCell.dataset.row, 10),
    col: parseInt(gridCell.dataset.col, 10)
  };
}

// Method to check if an enemy unit exists at a given grid location
isEnemyUnitAt(row, col) {
  // If the cell is not empty, check if the `isPlayerUnit` property is false
  const cellContent = this.grid[row][col];
  if (cellContent && cellContent.isPlayerUnit === false) {
    // The cell contains an enemy unit
    return true;
  }
  // The cell is either empty or contains a player unit
  return false;
}



clearHighlightedAttackTargets() {
  const highlightedTargets = document.querySelectorAll(".highlight-attack");
  highlightedTargets.forEach(target => {
    target.classList.remove("highlight-attack");
    // Clone and replace to remove event listeners
    const newTarget = target.cloneNode(true);
    target.parentNode.replaceChild(newTarget, target);
  });
}



// Execute attack from the selected unit to the target position
executeAttack(unitType, fromPosition, toPosition) {
  // You can add range validation here if needed, based on unitType's attackRange
  const { row: targetRow, col: targetCol } = toPosition;
  
  // Perform the attack logic
  if (this.isEnemyUnitAt(targetRow, targetCol)) {
    console.log(`Attacking enemy at ${targetRow}, ${targetCol}`);
    console.log (this.grid[targetRow][targetCol])
    this.currentWar.attack(unitType, this.grid[targetRow][targetCol].type);
    // Additional logic after successful attack, e.g., updating unit positions
    this.unitActionTokens[unitType].attackToken -= 1;
    // Reset UI elements
    this.clearHighlightedCells();
    this.refreshGrid(); // Refresh the grid to reflect changes after the attack
  } else {
    console.log("No enemy unit selected or out of range.");
  }

  // Reset attack mode
  this.inAttackMode = false;
  this.selectedUnitForAttack = null;
}












  
  // Method for starting movement mode
  startMoveMode(unitType, gridCell) {
    // Logic to highlight valid move locations
    console.log(`Prepare to move ${unitType}`);
    // Implement the logic to select valid cells
    const unitToMove = this.getUnitInstanceFromType(unitType);

    if (unitToMove) {
      this.highlightValidMoves(unitToMove, gridCell);
    }
  }

  getUnitFromType(unitType) {
    // Assuming you have a way to access the unit instances from unitType
    // For example, this could be a method in your currentWar instance:
    return this.currentWar.getUnitByType(unitType);
  }

  getUnitInstanceFromType(unitType) {
    // Here, you'll need to access the instance of the unit to move.
    // This could be stored in an array or object when units are created/placed.
    // For example:
    return this.currentWar.player1.armiesByType[unitType][0]; // Just as an example, taking the first unit of the type
  }

  // Method to highlight valid moves
  highlightValidMoves(unit, gridCell) {
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
      unit.movementRange
    );

    // Highlight the valid moves
    validMoves.forEach(({ row, col }) => {
      const cellToHighlight = document.querySelector(
        `[data-row="${row}"][data-col="${col}"]`
      );
        console.log(`THIS GRID ROW COL`,this.grid[row][col])
      if (cellToHighlight && this.grid[row][col] === null) {
        cellToHighlight.classList.add("highlight-move");
        cellToHighlight.addEventListener("click", () => {
          this.moveUnit(unit, { row: parseInt(gridCell.dataset.row, 10), col: parseInt(gridCell.dataset.col, 10) }, row, col);
        }, { once: true });
      }
    });
  }

  clearHighlightedCells() {
    const highlightedCells = document.querySelectorAll(".highlight-move");
    highlightedCells.forEach(cell => {
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
  const moveRange = unitType.movementRange;
  // The moveRange is an array, we assume [horizontalRange, verticalRange]
  
  // Calculate the horizontal and vertical distances
  const horizontalDistance = Math.abs(targetCol - parseInt(currentCell.col));
  const verticalDistance = Math.abs(targetRow - parseInt(currentCell.row));
  
  // Validate move for both horizontal and vertical ranges
  const isValidHorizontalMove = horizontalDistance <= moveRange[0];
  const isValidVerticalMove = verticalDistance <= moveRange[1];
  
  // Ensure that the target cell is within the unit's movement range and is not occupied
  const isTargetCellEmpty = this.grid[targetRow][targetCol] === null;
  
  return isValidHorizontalMove && isValidVerticalMove && isTargetCellEmpty;
}


  // THE ACTUAL MOVE HAPPENS HERE !
  // Method to move a unit to a new position
  moveUnit(unitType, currentCell, targetRow, targetCol) {
    // Step 1: Validate move (e.g., target cell is within range and not occupied)
    const isValidMove = this.validateDistance(
      unitType,
      currentCell,
      targetRow,
      targetCol
    );
    if (!isValidMove) {
      console.log("Invalid move");
      this.clearHighlightedCells();
      return;
    }

 // Step 2: Clear the unit's old position in the data model
 const oldRow = parseInt(currentCell.row, 10);
 const oldCol = parseInt(currentCell.col, 10);
 this.grid[oldRow][oldCol] = null;  // Clear the old position

 // Step 3: Update unit's position in the data model

 // REALLY NEED TO CLEAN UP THE VARIABLE NAMES !! 
//  IS A MESS 
 this.grid[targetRow][targetCol] = unitType;  // Set the new position
 this.unitPositions[unitType.type] = [targetRow, targetCol]; // Update the stored position
 this.unitActionTokens[unitType.type].moveToken -= 1;
 // Refresh the grid to reflect the updated positions
 this.refreshGrid(); // This function will redraw the grid based on the updated data model
}
  



  // Additional methods to manage grid state, place units, etc.
}

