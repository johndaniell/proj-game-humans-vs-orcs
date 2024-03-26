class Player {
    constructor(name) {
        this.name = name;
        this.armiesByType = {};
    }

    // Add a unit to the army
    addUnit(type, count = 1) {
        // Check if the type is valid
        const UnitClass = UnitTypes[type];
        if (!UnitClass) {
            console.error("Invalid unit type:", type);
            return;
        }

        // Initialize the army type array if it doesn't exist
        if (!this.armiesByType[type]) {
            this.armiesByType[type] = [];
            
            // DEBUG
            // console.log(this.armiesByType[type])
        }

        // Create and add the units
        for (let i = 0; i < count; i++) {
            const unit = new UnitClass();
            this.armiesByType[type].push(unit);
        }
    }


    getTotalArmyCount(type = null) {
        if (type) {
            // Return the count for the specific type
            return this.armiesByType[type]?.length || 0;
        } else {
            // Return an object with each type as a key and the count of units as the value
            const typeCounts = {};
            for (const typeKey in this.armiesByType) {
                typeCounts[typeKey] = this.armiesByType[typeKey].length;
            }
            return typeCounts;
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

    // AI methods for computer player ???
}


