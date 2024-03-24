window.onload = function () {
    const startButton = document.getElementById("start-button");
    const restartButton = document.getElementById("restart-button");
    let game = new Game(); // Initialize the game
  
    startButton.addEventListener("click", function () {
      game.start(); // Start the game
    });
  
    restartButton.addEventListener("click", function () {
      game.gameOver(); // End the game and show the game over screen
      // Alternatively, restart the game entirely
    });
};
