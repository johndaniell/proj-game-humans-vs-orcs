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

    // console.log(`ATTACKER: ${attackerType}, DEFENDER: ${defenderType}`);

    const attackerArmy = attacker.armiesByType[attackerType] || [];
    const defenderArmy = defender.armiesByType[defenderType] || [];

    const totalAttackDamage = this.calculateTotalDamage(attackerArmy);
    addBattleLogMessage(`${attackerType} attacks ${defenderType} with total damage of ${totalAttackDamage}.`);

    this.applyDamage(defenderArmy, totalAttackDamage, defenderType, defender,currentGrid);

    this.determineOutcome();
}

    calculateTotalDamage(army) {
        return army.reduce((total, unit) => total + unit.attack(), 0);
    }


    applyDamage(army, damage,armyType,player,currentGrid) {
        let remainingDamage = damage;
        army.forEach(unit => {
            if (remainingDamage <= 0) return;
            const damageApplied = Math.min(unit.health, remainingDamage);
            unit.receiveDamage(damageApplied);
            remainingDamage -= damageApplied;
        });

        this.cleanupDefeatedUnits(army,armyType,player,currentGrid);
    }

    cleanupDefeatedUnits(army, armyType, player,currentGrid) {
        const initialCount = army.length;

        const aliveUnits = army.filter(unit => unit.health > 0);

        if (initialCount !== aliveUnits.length) {
            addBattleLogMessage(`${player.name} lost ${initialCount - aliveUnits.length} ${armyType}.`);
            // console.log(`WTF IS THISSSSSSSSSSSSS`, player.armiesByType[armyType])
            // console.log(player)
            // Update the player's armiesByType directly to reflect the removal of defeated units
            
            if (aliveUnits.length === 0) {
                addBattleLogMessage(`${armyType} were banished from the face of earth !`);
                //removing the type
                delete player.armiesByType[armyType];

                // // cleaning the cell
                // HACKY WAY TO DO IT !
                if (currentGrid){
                const  [thisBattleGrid, enemyPosition] = currentGrid
                console.log(`TRYING TO REMOVE THE CELL from this GRID`,thisBattleGrid)
                console.log(`TRYING TO REMOVE THE CELL`,enemyPosition)
                const [targetRow,targetCol ] = enemyPosition;
                thisBattleGrid.grid[targetRow][targetCol] = null;
                thisBattleGrid.refreshGrid
                }


              } else {
                player.armiesByType[armyType] = aliveUnits;
              }
            // console.log(`Computer(defender) ARMIES :`,player.armiesByType[armyType]);
        }
    }

    determineOutcome() {
        // Check if one player has no units left across all types
        const player1TotalUnits = Object.values(this.player1.getTotalArmyCount()).reduce((acc, count) => acc + count, 0);
        const player2TotalUnits = Object.values(this.player2.getTotalArmyCount()).reduce((acc, count) => acc + count, 0);
        // console.log(`COMPUTER PLAYER why the hell is this increasing ? `,player2TotalUnits)

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
