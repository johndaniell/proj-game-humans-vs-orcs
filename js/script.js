window.onload = function () {
    const startButton = document.querySelector("#start-button");
    const restartButton = document.querySelector("#restart-button");
    let game = new Game(encounters); // Initialize the game
  
    startButton.addEventListener("click", function () {
      game.start(); // Start the game
    });
  
    restartButton.addEventListener("click", function () {
      // Alternatively, restart the game entirely
      window.location.reload()
    });
};
