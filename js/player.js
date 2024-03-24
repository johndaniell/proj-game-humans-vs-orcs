class Player {
    constructor(name) {
        this.name = name;
        this.army = [];
    }

    // Add a unit to the army
    addUnit(unit) {
        if (unit instanceof FootMan || unit instanceof Archer || unit instanceof Knight) {
            this.army.push(unit);
        } else {
            console.error("Invalid unit type");
        }
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
    constructor(name) {
        super(name);
        // Computer-specific attributes or methods
    }

    // AI methods for computer player
}



// // Usage example
// let humanPlayer = new HumanPlayer("Knight");
// let enemyPlayer = new ComputerPlayer("Orc");

// // Create units
// let footman = new FootMan();
// let archer = new Archer();
// let knight = new Knight();

// // Add units to player's army
// humanPlayer.addUnit(footman);
// humanPlayer.addUnit(archer);
// humanPlayer.addUnit(knight);

// // Now humanPlayer.army contains the units added