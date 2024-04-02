window.onload = function () {
    const startButton = document.querySelector("#start-button");
    const restartButton = document.querySelector("#restart-button");
    const playerNameInput = document.querySelector("#player-name-input");

    let game ;
  
    startButton.addEventListener("click",  async function () {
      const playerName = playerNameInput.value.trim() || getRandomName() || "Player";
      game= new Game(encounters,playerName); // Initialize the game
      game.start(); // Start the game
    });
  
    restartButton.addEventListener("click", function () {
      // Alternatively, restart the game entirely
      window.location.reload()
    });
};


function getRandomName() {
  const vowels = ['A', 'E', 'I', 'O', 'U'];
  const consonants = [
      'B', 'C', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'M',
      'N', 'P', 'Q', 'R', 'S', 'T', 'V', 'W', 'X', 'Y', 'Z'
  ];

  // Choose a random start - consonant or vowel
  const startWithConsonant = Math.random() > 0.5;

  let name = '';

  // If we start with consonant, add one then a vowel, otherwise start with vowel
  if (startWithConsonant) {
      name += getRandomElement(consonants) + getRandomElement(vowels);
  } else {
      name += getRandomElement(vowels) + getRandomElement(consonants);
  }

  // Add random consonants and vowels to make the name longer, e.g., 3 more characters
  for (let i = 0; i < 3; i++) {
      name += getRandomElement(i % 2 === 0 ? consonants : vowels);
  }

  return name;
}

// Helper function to get a random element from an array
function getRandomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}









