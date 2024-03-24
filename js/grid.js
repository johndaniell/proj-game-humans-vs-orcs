class BattleGrid {
  constructor(rows, columns) {
    this.rows = rows;
    this.columns = columns;
    this.grid = this.createGrid(rows, columns);
  }

  createGrid(rows, columns) {
    // Create a 2D array filled with nulls to represent an empty grid
    return Array.from({ length: rows }, () => Array(columns).fill(null));
  }
  displayGrid(container) {
    // Clear the current grid container
    container.innerHTML = "";
  
    // Create grid elements
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.columns; col++) {
        const gridCell = document.createElement("div");
        gridCell.classList.add("grid-cell");
        gridCell.textContent = `${row},${col}`; // Placeholder text to show coordinates
        // Width and height are now handled by CSS grid
        container.appendChild(gridCell);
      }
    }
  }
  


  placeUnit(unit, row, col) {
    if (this.grid[row][col] === null) {
      this.grid[row][col] = unit;
      this.updateGridCellDisplay(row, col, unit);
    } else {
      console.error("Grid cell is already occupied.");
    }
  }

  // // Usage example: placing a unit on the grid
  // const someUnit = {
  //     name: 'Knight',
  //     imagePath: './path-to-knight-sprite.png',
  //     // other properties...
  //   };
  //   battleGrid.placeUnit(someUnit, 5, 5); // Place the knight at row 5, column 5

  updateGridCellDisplay(row, col, unit) {
    // Find the div for the grid cell using a data-attribute or another method
    const gridCell = document.querySelector(
      `[data-row="${row}"][data-col="${col}"]`
    );
    if (gridCell) {
      // Assuming `unit` has properties like `imagePath` for the sprite
      gridCell.style.backgroundImage = `url(${unit.imagePath})`;
      // Add any other visual updates here
    }
  }

  // Additional methods to manage grid state, place units, etc.
}

// Usage
//   const battleContainer = document.getElementById('battle-screen');
//   const battleGrid = new BattleGrid(10, 16); // Example: 10 rows and 16 columns
//   battleGrid.displayGrid(battleContainer);
