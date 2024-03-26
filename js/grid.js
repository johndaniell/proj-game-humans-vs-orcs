class BattleGrid {
  constructor(rows, columns, currentWar) {
    this.rows = rows;
    this.columns = columns;
    this.currentWar = currentWar;
    this.inAttackMode = false;
    this.selectedUnitForAttack = null;
    this.grid = this.createGrid(rows, columns);
    this.tooltip = document.createElement('div');
    this.tooltip.className = 'tooltip';
    document.body.appendChild(this.tooltip);

  }

  createGrid(rows, columns) {
    // Create a 2D array filled with nulls to represent an empty grid
    return Array.from({ length: rows }, () => Array(columns).fill(null));
  }


  refreshGrid() {
    const container = document.querySelector('#battle-grid-container'); // Assuming the ID of your grid container
    if (!container) return;

    this.displayGrid(container);
    this.placeUnitsOnGrid(); // Ensure this method updates the display based on current state
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
    // Assuming the human player's units are already added to their army
   this.humanFootmenGroup = this.currentWar.player1.armiesByType['FootMan'];
   this.humanArcherGroup = this.currentWar.player1.armiesByType['Archer'];
    if (this.humanFootmenGroup && this.humanFootmenGroup.length > 0) {
      // Pass the entire group as a reference
      this.placeUnitGroup('FootMan', this.humanFootmenGroup, 6, 0, './images/footman.png', true);
    }
    if (this.humanArcherGroup && this.humanArcherGroup.length > 0) {
      // Pass the entire group as a reference
      this.placeUnitGroup('Archer', this.humanArcherGroup, 7, 0, './images/footman.png', true);
    }
  
    // Assuming the enemy player's units are already added to their army
    this.enemyFootmenGroup = this.currentWar.player2.armiesByType['FootMan'];
    this.enemyKnightGroup = this.currentWar.player2.armiesByType['Knight'];

    if (this.enemyFootmenGroup && this.enemyFootmenGroup.length > 0) {
      // Pass the entire group as a reference
      this.placeUnitGroup('FootMan', this.enemyFootmenGroup, 6, 15, './images/footman.png', false);
    }
    if (this.enemyKnightGroup && this.enemyKnightGroup.length > 0) {
      // Pass the entire group as a reference
      this.placeUnitGroup('Knight', this.enemyKnightGroup, 7, 15, './images/footman.png', false);
    }
  }
  

  // Place a group of units in one cell
  placeUnitGroup(unitType, groupReference, row, col, imagePath, isPlayerUnit) {
    // Check if the cell is empty or already contains the same unit type
    if (this.grid[row][col] === null || this.grid[row][col].type === unitType) {
      this.grid[row][col] = { type: unitType, groupReference, // Store the reference here
        imagePath
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
  

  // // Usage example: placing a unit on the grid
  // const someUnit = {
  //     name: 'Knight',
  //     imagePath: './path-to-knight-sprite.png',
  //     // other properties...
  //   };
  //   battleGrid.placeUnit(someUnit, 5, 5); // Place the knight at row 5, column 5

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
      gridCell.style.cursor = 'pointer'



      gridCell.addEventListener('mouseenter', (e) => {
        this.tooltip.textContent = `${unitType} (${count})`; // Dynamically set the content
        this.tooltip.style.visibility = 'visible';
      });
        
      gridCell.addEventListener('mousemove', (e) => {
        this.tooltip.style.left = e.pageX + 10 + 'px'; // Position the tooltip near the cursor
        this.tooltip.style.top = e.pageY + 10 + 'px';
      });
        
      gridCell.addEventListener('mouseleave', () => {
        this.tooltip.style.visibility = 'hidden'; // Hide the tooltip
      });
      


      // Only set the click event for player units
      if (isPlayerUnit){
      gridCell.addEventListener("click", () => {
        console.log(`${count} ${unitType} units at ${row},${col} selected.`);
        // Call function to show 'Move' and 'Attack' in action bar
        this.showUnitActions(unitType, gridCell, isPlayerUnit);
      })};
    }
  }

  showUnitActions(unitType, gridCell, isPlayerUnit) {
    // Select all action buttons except 'Back'
    this.battleActionBar = document.querySelector("#action-bar");
    const actionButtons = this.battleActionBar.querySelectorAll(
      ".action-button:not(#back-button)"
    );

    // If it's a player unit, show 'Move' and 'Attack' buttons; otherwise, hide them
    if (isPlayerUnit) {
      // Clear existing 'Move' and 'Attack' actions, if any
      actionButtons.forEach((button) => button.remove());

      // Create 'Move' button
      const moveButton = document.createElement("button");
      moveButton.textContent = "Move";
      moveButton.classList.add("action-button");
      moveButton.addEventListener("click", () => {
        // Logic to move the selected unit group
        console.log(`Move ${unitType}`);
      });

      // Create 'Attack' button
      const attackButton = document.createElement("button");
      attackButton.textContent = "Attack";
      attackButton.classList.add("action-button");
      attackButton.addEventListener("click", () => {
        // Enter attack mode
        if (this.inAttackMode) {
          console.log('i think is a bug')
          return
        }
        else {
        this.inAttackMode = true;
        this.selectedUnitForAttack = unitType;
        console.log(`Ready to attack with ${unitType}. Select a target.`);
        this.getEnemy()

    }});

      // Add buttons to the action bar
      this.battleActionBar.appendChild(moveButton);
      this.battleActionBar.appendChild(attackButton);
    } else {
      // If it's not a player unit, remove 'Move' and 'Attack' buttons

    }
  }

  getEnemy() {
    if (!this.inAttackMode) {
      console.log("Not in attack mode. Click 'Attack' first.");
      return;
    }
  
    // Query only enemy cells
    const enemyCells = document.querySelectorAll(".grid-cell[data-unit-type]:not([owner='true'])");
  
    // Create a reusable listener function
    const clickListener = (evt) => {
      this.selectTargetForAttack(evt);
      // Remove listeners from all cells after one is clicked
      enemyCells.forEach(cell => cell.removeEventListener("click", clickListener));
    };
  
    // Add the listener to each enemy cell
    enemyCells.forEach(cell => {
      cell.addEventListener("click", clickListener, { once: true });
    });
  }
  
  selectTargetForAttack(evt) {
    const clickedCell = evt.target;
    const enemyUnitType = clickedCell.dataset.unitType;
    const isPlayerUnit = clickedCell.dataset.owner === 'true';
  
  
    const actionButtons = this.battleActionBar.querySelectorAll(
      ".action-button:not(#back-button)"
    );
    // Assuming each cell knows its content, e.g., through data attributes or internal state



    if (enemyUnitType && !isPlayerUnit) {

      // Proceed with your attack logic here, for example:
      this.currentWar.attack(this.selectedUnitForAttack, enemyUnitType);

      // Reset the attack mode
      this.inAttackMode = false;
      this.selectedUnitForAttack = null;

      actionButtons.forEach((button) => button.remove());
      console.log(`Done Attacking`);
      this.refreshGrid()
      
    } else {
      console.log("No enemy unit selected.");
      this.inAttackMode = false;
      this.selectedUnitForAttack = null;
    }
  }
  // Additional methods to manage grid state, place units, etc.
}

// Usage
//   const battleContainer = document.getElementById('battle-screen');
//   const battleGrid = new BattleGrid(10, 16); // Example: 10 rows and 16 columns
//   battleGrid.displayGrid(battleContainer);
