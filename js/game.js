class Game {
  constructor(encounters,playerName) {
    this.currentState = "intro";
    // Initialize the player with a starting army
    // need a better sollution :D


    this.humanPlayer = new HumanPlayer(playerName);
    this.humanPlayer.addUnit("Pikeman", 100 ); // Initial army composition
    this.humanPlayer.addUnit("Halberdier", 70);
    this.humanPlayer.addUnit("Archer", 70);
    this.humanPlayer.addUnit("Marksman", 50);
    this.humanPlayer.addUnit("Crusader", 70);
    this.humanPlayer.addUnit("Champion", 50);
    this.humanPlayer.addUnit("Zealot", 60);
    this.humanPlayer.addUnit("Griffin", 80);
    
    
    
    this.encounters = encounters;
    this.wars = {}; // Stores War instances by encounter ID
    this.battleGrids = {};
    this.worldItemPositions = []; // Initialize in your game class constructor
    this.statusScreen = document.querySelector("#status-screen"); // Reference to the status screen element
    this.worldScreen = document.querySelector("#game-screen");
    this.gameScreen = document.querySelector("#game-intro");
    this.battleScreen = document.querySelector("#battle-screen");
    this.endScreen = document.querySelector("#game-end");
    this.worldContainer = document.querySelector("#world-container");
    this.battleGridContainer = document.querySelector("#battle-grid-container");
    this.battleActionBar = document.querySelector("#action-bar");
    this.restartButton = document.querySelector("#restart-button");
    // Initialize more properties as needed
  }

  // Method to start the game from the intro screen
  start() {
    addBattleLogMessage("Game is starting");
    this.currentState = "world";
    if(this.humanPlayer.name === `Zauriel`){
      this.humanPlayer.addUnit("Archangel", 50 )
    }

    this.initializeWorld();
    // More initialization code as needed
  }

  // Method to set up the world state
  initializeWorld() {
    console.log("Initializing world...");
    this.gameScreen.style.display = "none";
    this.worldScreen.style.display = "flex";
    this.battleScreen.style.display = "none";

    decorativeItemsData.forEach(itemData => {
      this.addDecorativeWorldItem(itemData);
  });
  
    // Add each world item
    this.encounters.forEach((itemData, index) => {
      this.addWorldItem(itemData, index + 1); // Use index + 1 as a simple way to generate unique encounter IDs
    });
    this.worldContainer.addEventListener("click", (evt) => {
      // Check if the clicked element is not an item
      if (evt.target === this.worldContainer) {
        this.hideStatusScreen();
      }
    });
  }

  startBattle(encounterId) {
    const encounter = this.encounters.find((enc) => enc.id === encounterId);
    if (!encounter) {
      console.error("Encounter not found:", encounterId);
      return;
    }

    let currentWar = this.wars[encounterId];
    let battleGrid = this.battleGrids[encounterId];

    if (!currentWar || !battleGrid) {


      // Create an enemy player for this specific encounter
      const enemyPlayer = new ComputerPlayer(encounter.enemyArmy.name, encounterId );
      let randomizer = Math.ceil(Math.random() * 3);
      encounter.enemyArmy.units.forEach((unit) => {
        enemyPlayer.addUnit(unit.type, unit.count * randomizer,encounter.enemyArmy.name );
      });

      // Create new instances of War and BattleGrid
      currentWar = new War(this.humanPlayer, enemyPlayer, encounterId, {
        onBattleEnd: (winner) => this.showOutcomePopup(winner, encounterId),
        gameOver: () => this.gameOver(winner),
      });
      battleGrid = new BattleGrid(12, 16, currentWar); // Adjust dimensions as needed

      // Store the instances for future use
      this.wars[encounterId] = currentWar;
      this.battleGrids[encounterId] = battleGrid;
      enemyPlayer.setBattleGrid(battleGrid); // Passing the battlegrid because is now ready :D
      this.battleGrids[encounterId].initializeUnitActionTokens();
    }

    this.currentState = "battle";
    this.setupBattle(currentWar, battleGrid);
    this.hideStatusScreen();
  }

  // Method to set up the battle screen
  setupBattle(currentWar, battleGrid) {
    this.gameScreen.style.display = "none";
    this.battleScreen.style.display = "flex";
    this.worldScreen.style.display = "none";

    // Use the passed battleGrid instance to display the grid
    battleGrid.displayGrid(this.battleGridContainer);
    battleGrid.placeUnitsOnGrid();
    this.setupActionBar(currentWar,battleGrid,);
  }
  // Initialize the battle, setting up player and enemy units on the battle screen

  // Method to end the current battle and return to the world view
  endBattle(winner, encounterId) {
    this.currentState = "world";
    this.battleScreen.style.display = "none";
    this.worldScreen.style.display = "flex";
    //cleaning up the Action bar
    this.battleActionBar.innerHTML = "";
    delete this.wars[encounterId];

    this.removeWorldItem(encounterId);

    // Handle the aftermath of the battle, such as updating unit stats or the game world
    // PLACEHOLDER !!!
    if (
      this.encounters.filter((encounter) => encounter.isEnemy === true)
        .length === 0
    ) {
      this.gameOver(winner);
    }
  }

  // Method to handle the game over state
  gameOver(winner) {

    this.currentState = "gameOver";
    this.battleScreen.style.display = "none";
    this.gameScreen.style.display = "none";
    this.endScreen.style.display = "flex";
    // Handle game over logic, such as displaying scores or restart options
    addBattleLogMessage(`Congrats `, winner);
    // this.restartButton.addEventListener(`click`, )
  }

  // Method to add a world item
  addWorldItem(itemData, encounterId) {
    // Create the element that represents the item
    const itemElement = document.createElement("div");
    itemElement.classList.add("world-item"); // Add class for styling and event listening

    //  we could further refactor it to have all the itemdata into another object and just loop over them to set the style
    itemElement.style.width = itemData.width;
    itemElement.style.height = itemData.height;
    itemElement.style.position = "absolute"; // Position the item absolutely within the relatively positioned world-container
    itemElement.style.backgroundPosition = `center`;
    itemElement.style.backgroundRepeat = `no-repeat`;
    // Set the background image
    itemElement.style.backgroundImage = `url(${itemData.imagePath})`; // Use your actual image path property
    itemElement.style.backgroundSize = "contain"; // Ensure the image covers the item
    


    // Randomly position the item inside the world-container
    const maxWidth = this.worldContainer.offsetWidth - 50; // Subtract the item width to keep within bounds
    const maxHeight = this.worldContainer.offsetHeight - 50; // Subtract the item height to keep within bounds
    const randomX = Math.floor(Math.random() * maxWidth);
    const randomY = Math.floor(Math.random() * maxHeight);

    itemElement.style.left = `${randomX}px`;
    itemElement.style.top = `${randomY}px`;

    // Set data attributes if needed for later use
    for (const key in itemData) {
      itemElement.dataset[key] = itemData[key];
    }

    itemElement.dataset.encounterId = encounterId.toString();

    // Add the item to the world-container
    this.worldContainer.appendChild(itemElement);

    // Set up the click event listener for the newly added world item
    itemElement.addEventListener("click", (evt) => {
      evt.stopPropagation();
      this.showStatusScreen(itemElement); // Pass the clicked item element to the method
      // Update the content of the status screen based on the item clicked
      this.updateStatusScreen(itemData.info);
    });
  }


// Method to add a decorative world item
addDecorativeWorldItem(itemData) {
  const itemElement = document.createElement("div");
  itemElement.classList.add("world-item-decorative");
  itemElement.style.width = itemData.width + 'px';
  itemElement.style.height = itemData.height + 'px';
  itemElement.style.position = "absolute";
  itemElement.style.backgroundPosition = "center";
  itemElement.style.backgroundRepeat = "no-repeat";
  itemElement.style.backgroundImage = `url(${itemData.imagePath})`;
  itemElement.style.backgroundSize = "contain";

  let randomX, randomY;
  let overlap;
  do {
      overlap = false;
      // Adjust these based on your actual item sizes and world container dimensions
      const maxWidth = this.worldContainer.offsetWidth - parseInt(itemData.width);
      const maxHeight = this.worldContainer.offsetHeight - parseInt(itemData.height);
      randomX = Math.floor(Math.random() * maxWidth);
      randomY = Math.floor(Math.random() * maxHeight);

      // Check for overlap with existing items
      for (const position of this.worldItemPositions) {
          if (randomX < position.x + position.width &&
              randomX + parseInt(itemData.width) > position.x &&
              randomY < position.y + position.height &&
              randomY + parseInt(itemData.height) > position.y) {
              overlap = true;
              break;
          }
      }
  } while (overlap); // Keep trying until no overlap

  itemElement.style.left = `${randomX}px`;
  itemElement.style.top = `${randomY}px`;

  // Track the position and size of this item to prevent future overlap
  this.worldItemPositions.push({
      x: randomX,
      y: randomY,
      width: parseInt(itemData.width),
      height: parseInt(itemData.height)
  });

  this.worldContainer.appendChild(itemElement);
}




  removeWorldItem(encounterId) {
    const itemElement = this.worldContainer.querySelector(
      `[data-encounter-id="${encounterId}"]`
    );
    if (itemElement) {
      this.worldContainer.removeChild(itemElement);
    } else {
      console.log("Item with encounterId", encounterId, "not found.");
    }

    this.encounters = this.encounters.filter(
      (encounter) => encounter.id !== encounterId
    );
  }

  // Method to show the status screen
  showStatusScreen(itemElement) {
    const itemData = {
      id: itemElement.dataset.id,
      name: itemElement.dataset.name,
      info: itemElement.dataset.info,
      imagePath: itemElement.dataset.imagePath,
    };

    // Clear any existing status screen first
    if (this.statusScreen) {
      this.statusScreen.remove();
    }

    // Dynamically create the status screen elements
    this.statusScreen = document.createElement("div");
    this.statusScreen.id = "status-screen";
    this.statusScreen.classList.add("status-screen");

    const statusContent = document.createElement("p");
    statusContent.classList.add("status-content");

    const attackButton = document.createElement("button");
    attackButton.classList.add("status-action");
    attackButton.textContent = "Enter Battle";

    const inspectButton = document.createElement("button");
    inspectButton.classList.add("status-action");
    inspectButton.textContent = "Inspect";

    // Append the newly created elements to the status screen
    this.statusScreen.appendChild(statusContent);
    this.statusScreen.appendChild(attackButton);
    this.statusScreen.appendChild(inspectButton);

    // Set styles for dynamic positioning
    this.statusScreen.style.position = "absolute";
    this.statusScreen.style.display = "block"; // Prepare to measure dimensions

    // Temporarily add status screen to body to measure dimensions
    document.body.appendChild(this.statusScreen);

    // Measure the status screen and item element
    const statusRect = this.statusScreen.getBoundingClientRect();
    const itemRect = itemElement.getBoundingClientRect();

    // Determine the best position for the status screen
    let top, left;
    if (window.innerHeight - itemRect.bottom > statusRect.height) {
      // Position below the item if there's enough space
      top = itemRect.bottom + window.scrollY;
    } else if (itemRect.top > statusRect.height) {
      // Position above the item if there's enough space
      top = itemRect.top - statusRect.height + window.scrollY;
    } else {
      // Default to below the item
      top = itemRect.bottom + window.scrollY;
    }

    if (window.innerWidth - itemRect.left > statusRect.width) {
      // Position to the right of the item if there's enough space
      left = itemRect.left + window.scrollX;
    } else if (itemRect.right > statusRect.width) {
      // Position to the left of the item if there's enough space
      left = itemRect.right - statusRect.width + window.scrollX;
    } else {
      // Default to the right of the item
      left = itemRect.left + window.scrollX;
    }

    // Apply the calculated position
    this.statusScreen.style.top = `${top}px`;
    this.statusScreen.style.left = `${left}px`;

    // Adding event listeners to the buttons
    attackButton.addEventListener("click", () => {
      const encounterId = parseInt(itemElement.dataset.encounterId, 10); // Ensure encounterId is an integer
      this.startBattle(encounterId);
    });

    inspectButton.addEventListener("click", () => {
      const encounterId = parseInt(itemElement.dataset.encounterId, 10); // Ensure encounterId is an integer
      this.inspect(encounterId);
    });

    // Update the content of the status screen based on the item
    this.updateStatusScreen(itemElement.dataset.info);
  }

  // Method to hide the status screen
  hideStatusScreen() {
    if (this.statusScreen) {
      this.statusScreen.style.display = "none"; // Hide the status screen
    }
  }

  updateStatusScreen(info) {
    const statusContent = document.querySelector(
      "#status-screen .status-content"
    );
    statusContent.textContent = info;
  }

  setupActionBar(currentWar, battleGrid) {
    // Create the 'Back' button only if it doesn't already exist
    if (!document.querySelector("#back-button")) {
      this.battleActionBar.style.display = "block";
      const backButton = document.createElement("button");
      backButton.textContent = "Back";
      backButton.id = "back-button"; // Add an ID for easier selection
      backButton.classList.add("action-button");

      // Event listener for the 'Back' button
      backButton.addEventListener("click", () => {
        this.currentState = "world";
        this.battleScreen.style.display = "none";
        this.worldScreen.style.display = "flex";
        //cleaning up the Action bar
        this.battleActionBar.innerHTML = "";
      });

      // Append the 'Back' button to the action bar
      this.battleActionBar.appendChild(backButton);
    }

    // Add or update 'End Turn' button
    let endTurnButton = document.querySelector("#end-turn-button");
    if (!endTurnButton) {
      endTurnButton = document.createElement("button");
      endTurnButton.id = "end-turn-button";
      endTurnButton.classList.add("action-button", "action-button-disabled"); // Initially appears disabled
      endTurnButton.textContent = "End Turn";
      
    }

    endTurnButton.addEventListener("click", () => {

      // Logic to end the turn, reset tokens, etc.
      // Note: Ensure this doesn't add multiple event listeners over time
      battleGrid.skipTurnForAllUnits(); // You'll need to implement this in BattleGrid
      this.updateEndTurnButtonState(battleGrid);
      addBattleLogMessage(`Computer attacks !`);
      // console.log(`CURRENT WAR AND BATTLE GRID`, currentWar, battleGrid);

      // AI MAGIC HAPPENS HERE
      // AI MAGIC HAPPENS HERE
      // AI MAGIC HAPPENS HERE
      const computerAi = battleGrid.currentWar.player2;
      computerAi.takeTurn();
      // AI MAGIC HAPPENS HERE
      // AI MAGIC HAPPENS HERE
      // AI MAGIC HAPPENS HERE

      // Give the player tokens back
      battleGrid.resetActionTokensforAllUnits();
    })

    this.battleActionBar.appendChild(endTurnButton);
    // Update 'End Turn' button appearance based on unit token state
    this.updateEndTurnButtonState(battleGrid);
  }

  updateEndTurnButtonState(battleGrid) {
    const endTurnButton = document.querySelector("#end-turn-button");
    if (endTurnButton) {
      const tokensLeft = battleGrid.haveUnitsActionTokensLeft(); // Should return true if any tokens are left
      // If tokensLeft is true, button should be enabled, hence "action-button-disabled" is false
      endTurnButton.classList.toggle("action-button-disabled", !tokensLeft);
    }
  }
  

  showOutcomePopup(winner, encounterId) {
    this.battleGrids[encounterId].refreshGrid()
    const popup = document.createElement("div");
    popup.id = "outcome-popup";
    popup.style.position = "absolute";
    popup.style.top = "50%";
    popup.style.left = "50%";
    popup.style.transform = "translate(-50%, -50%)";
    popup.style.padding = "20px";
    popup.style.backgroundColor = "#fff";
    popup.style.boxShadow = "0 4px 8px rgba(0,0,0,0.1)";
    popup.style.zIndex = "1000"; // Ensure it's above everything else
    popup.textContent =
      winner === this.humanPlayer.name
        ? "You won! Click OK to continue."
        : "You lost! Click RESTART to try again.";

    const button = document.createElement("button");
    button.textContent = winner === this.humanPlayer.name ? "OK" : "RESTART";
    button.addEventListener("click", () => {
      if (winner === this.humanPlayer.name) {
        // Hide popup and return to world view

        document.body.removeChild(popup);
        this.battleActionBar.style.display = "none";
        // Re-enable the action bar
        this.endBattle(winner, encounterId); // Assuming endBattle method resets the view
      } else {
        // Restart the game
        this.gameOver(winner);
        this.battleGrids[encounterId].refreshGrid()
        window.location.reload()
        }
    });

    popup.appendChild(button);
    document.body.appendChild(popup);

    // Disable the action bar
    this.battleActionBar.style.display = "none";
  }

  // Additional methods as needed for game logic, such as handling turns in battle
}



function addBattleLogMessage(message) {
  const logContainer = document.querySelector('#battle-log');
  const messageElement = document.createElement('div');
  messageElement.textContent = message;
  logContainer.appendChild(messageElement);

  // Scroll to the bottom to ensure the latest message is visible
  logContainer.scrollTop = logContainer.scrollHeight;
}
