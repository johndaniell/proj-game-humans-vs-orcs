class War {
    constructor(player1, player2, encounterId,{ onBattleEnd, gameOver }) {
        this.player1 = player1;
        this.player2 = player2;
        this.encounterId = encounterId;
        this.onBattleEnd = onBattleEnd;
        this.gameOver = gameOver;

    }

attack(attackerType, defenderType, attacker, defender, currentGrid) {
    if (!attackerType || !defenderType) {
        console.log("Invalid attacker or defender type");
        return;
    }

    const attackerArmy = attacker.units;
    const defenderArmy = defender.units;

    attackerArmy.forEach(attackingUnit => {
        if (attackingUnit.health > 0) {
            const targetUnit = this.getRandomLivingUnit(defenderArmy);
            if (targetUnit) {
                const totalAttackDamage = attackingUnit.attack(targetUnit);
                addBattleLogMessage(`${attacker.id}${attacker.units.indexOf(attackingUnit)} attacks ${defender.id} with total damage of ${totalAttackDamage}.`);
                targetUnit.receiveDamage(totalAttackDamage, defenderType);

                if (targetUnit.health <= 0) {
                    const index = defenderArmy.indexOf(targetUnit);
                    if (index !== -1) {
                        defenderArmy.splice(index, 1);
                    }
                }
            }
        }
    });

    // Call cleanupDefeatedUnits only for additional cleanup tasks, not for removing units
    this.cleanupDefeatedUnits(defenderType, defender, currentGrid);
    this.determineOutcome();
}
      getRandomLivingUnit(army) {
        const livingUnits = army.filter(unit => unit.health > 0);
        if (livingUnits.length === 0) return null;
        const randomIndex = Math.floor(Math.random() * livingUnits.length);
        return livingUnits[randomIndex];
      }
    

cleanupDefeatedUnits(armyType, player, currentGrid) {
  player.count = player.units.length;
  console.log (`ARMY TYPE`, armyType)
  console.log (`PLAYER DATA`, player)
  console.log (`CURRENT GRID`, currentGrid)
    

    // Find which player owns the armyType
    let currentPlayer = this.player1.armies.some(army => army.id === armyType) ? this.player1 : 
      this.player2.armies.some(army => army.id === armyType) ? this.player2 :  null;
      console.log(`currentPlayer `, currentPlayer)
      console.log(`currentPlayer.armies `, currentPlayer.armies)



      const armyToRemoveIndex = currentPlayer.armies.findIndex(army => army.id === armyType);
      console.log(`CURRENT army`, armyToRemoveIndex)
     

      if (armyToRemoveIndex !== -1 && currentPlayer.armies[armyToRemoveIndex].units.length === 0) {
        // Remove the army from the player's array
        currentPlayer.armies.splice(armyToRemoveIndex, 1);
        delete player.id[armyType];


    // if (player.count === 0) {
        addBattleLogMessage(`${armyType} were banished from the face of the earth!`);
        delete player.id[armyType];

        // If provided, clean the cell in the grid
        if (currentGrid) {
            const [thisBattleGrid, enemyPosition] = currentGrid;
            const [ row, col ] = enemyPosition;
            thisBattleGrid.grid[row][col] = null;
            
            delete thisBattleGrid.armyPositions[armyType]
            console.log(`ARMIES IN THE GRID`,thisBattleGrid.armyPositions)
            console.log(thisBattleGrid.currentWar)

            thisBattleGrid.refreshGrid();
        }
    }
}



determineCurrentPlayer(armyType) {
  // Determine the player based on ownership of the armyType
  let currentPlayer = this.player1.armies.some(army => army.id === armyType) ? this.player1 : 
                      this.player2.armies.some(army => army.id === armyType) ? this.player2 : 
                      null;

  // Log the name for debugging purposes
  console.log(`currentPlayer: `, currentPlayer ? currentPlayer.name : "not found");

  return currentPlayer;
}



    determineOutcome() {
        // Check if one player has no units left across all types
        const player1TotalUnits = this.player1.getTotalArmyCount();
        const player2TotalUnits = this.player2.getTotalArmyCount();
        console.log(`COMPUTER PLAYER TOTAL UNITS: `, player2TotalUnits);
        console.log(`HUMAN PLAYER TOTAL UNITS: `, player1TotalUnits);
    
        if (player1TotalUnits === 0 || player2TotalUnits === 0) {
            const winner = player1TotalUnits > 0 ? this.player1.name : this.player2.name;
            addBattleLogMessage(`The war has ended. Winner: ${winner}`);
            this.finishBattle(winner);
    
            // Implement additional logic for handling the end of the war, such as cleanup or resetting the game state
        }
    }
    finishBattle(winner) {

        
        if (winner) {

          this.onBattleEnd(winner,this.encounterId);
        } else {
          this.gameOver(winner);
        }
      }
    







}
