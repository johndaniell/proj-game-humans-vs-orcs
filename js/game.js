class Game {
  constructor() {
    this.currentState = "intro"; // Possible states: 'intro', 'world', 'battle', 'gameOver'

    this.humanPlayer = new HumanPlayer("Gogu");
    this.humanPlayer.addUnit("FootMan", 50);
    this.humanPlayer.addUnit("Archer", 650);
    this.enemyPlayer = new ComputerPlayer("Orc");
    this.enemyPlayer.addUnit("FootMan", 10)
    this.enemyPlayer.addUnit("Knight", 100)
    this.statusScreen = document.querySelector("#status-screen"); // Reference to the status screen element
    this.worldScreen = document.querySelector("#game-screen");
    this.gameScreen = document.querySelector("#game-intro");
    this.battleScreen = document.querySelector("#battle-screen");
    this.endScreen = document.querySelector("#game-end");
    this.worldContainer = document.querySelector("#world-container");
    this.battleGridContainer = document.querySelector('#battle-grid-container');
    this.battleActionBar = document.querySelector('#action-bar');
    // Initialize more properties as needed
  }

  // Method to start the game from the intro screen
  start() {
    console.log("Game is starting");
    this.currentState = "world";
    this.initializeWorld();
    // More initialization code as needed
  }

  // Method to set up the world state
  initializeWorld() {
    console.log("Initializing world...");
    this.gameScreen.style.display = "none";
    this.worldScreen.style.display = "flex";
    this.battleScreen.style.display = "none";

    // This should be moved OUTSIDE
    const itemsData = [
      {
        id: 1,
        name: "Item 1",
        info: "This is item 1.",
        imagePath: `./images/footman.png`,
        width: "50px",
        height: "50px",
      },
      {
        id: 2,
        name: "Item 2",
        info: "This is item 2.",
        imagePath: `./images/footman.png`,
        width: "50px",
        height: "50px",
      },
      // ... more items
    ];

    // Add each world item
    itemsData.forEach((itemData) => this.addWorldItem(itemData));
    this.worldContainer.addEventListener("click", (evt) => {
      // Check if the clicked element is not an item
      if (evt.target === this.worldContainer) {
        this.hideStatusScreen();
      }
    });
  }

  // Method to start a battle
  startBattle() {
    this.currentWar = new War(this.humanPlayer, this.enemyPlayer);
    this.battleGrid = new BattleGrid(12, 16, this.currentWar ); // Example: 10 rows and 16 columns

    this.currentState = "battle";
    this.setupBattle();
    this.hideStatusScreen();
    this.battleGrid.placeUnitsOnGrid();


  }

  

  // Method to set up the battle screen
  setupBattle() {
    this.gameScreen.style.display = "none";
    this.battleScreen.style.display = "flex";
    this.worldScreen.style.display = "none";
    this.battleGrid.displayGrid(this.battleGridContainer);
    this.setupActionBar();

    // Initialize the battle, setting up player and enemy units on the battle screen

  }


  // Method to end the current battle and return to the world view
  endBattle() {
    this.currentState = "world";
    this.battleScreen.style.display = "none";
    this.worldScreen.style.display = "flex";
    //cleaning up the Action bar
    this.battleActionBar.innerHTML = '';

    this.cleanupBattle()

    // Handle the aftermath of the battle, such as updating unit stats or the game world
  }

  

  // Method to handle the game over state
  gameOver() {
    this.currentState = "gameOver";
    this.battleScreen.style.display = "none";
    this.gameScreen.style.display = "none";
    this.endScreen.style.display = "flex";
    // Handle game over logic, such as displaying scores or restart options
  }

  // Method to add a world item
  addWorldItem(itemData) {
    // Create the element that represents the item
    const itemElement = document.createElement("div");
    itemElement.classList.add("world-item"); // Add class for styling and event listening

    //  we could further refactor it to have all the itemdata into another object and just loop over them to set the style
    itemElement.style.width = itemData.width;
    itemElement.style.height = itemData.height;
    itemElement.style.position = "absolute"; // Position the item absolutely within the relatively positioned world-container

    // Set the background image
    itemElement.style.backgroundImage = `url(${itemData.imagePath})`; // Use your actual image path property
    itemElement.style.backgroundSize = "cover"; // Ensure the image covers the item

    // Randomly position the item inside the world-container
    const maxWidth = this.worldContainer.offsetWidth - 25; // Subtract the item width to keep within bounds
    const maxHeight = this.worldContainer.offsetHeight - 25; // Subtract the item height to keep within bounds
    const randomX = Math.floor(Math.random() * maxWidth);
    const randomY = Math.floor(Math.random() * maxHeight);

    itemElement.style.left = `${randomX}px`;
    itemElement.style.top = `${randomY}px`;

    // Set data attributes if needed for later use
    for (const key in itemData) {
      itemElement.dataset[key] = itemData[key];
    }

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

  // Method to show the status screen
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
    attackButton.textContent = "Attack";

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
      this.startBattle(itemData);
    });

    inspectButton.addEventListener("click", () => {
      this.inspect(itemData);
    });

    // Update the content of the status screen based on the item
    this.updateStatusScreen(itemElement.dataset.info);
  }

  // Method to hide the status screen
  hideStatusScreen() {
    this.statusScreen.style.display = "none"; // Hide the status screen
  }

  updateStatusScreen(info) {
    const statusContent = document.querySelector(
      "#status-screen .status-content"
    );
    statusContent.textContent = info;
  }


  setupActionBar() {
    // Create the 'Back' button only if it doesn't already exist
    if (!document.querySelector('#back-button')) {
      const backButton = document.createElement('button');
      backButton.textContent = 'Back';
      backButton.id = 'back-button'; // Add an ID for easier selection
      backButton.classList.add('action-button');
      
      // Event listener for the 'Back' button
      backButton.addEventListener('click', () => {
        this.endBattle();
      });
      
      // Append the 'Back' button to the action bar
      this.battleActionBar.appendChild(backButton);
    }
  }
  

  cleanupBattle() {
    // ...additional cleanup logic...
  }

  // Additional methods as needed for game logic, such as handling turns in battle
}
