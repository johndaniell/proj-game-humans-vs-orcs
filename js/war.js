class War {
    constructor(player1, player2, encounterId,{ onBattleEnd, gameOver }) {
        this.player1 = player1;
        this.player2 = player2;
        this.encounterId = encounterId;
        this.onBattleEnd = onBattleEnd;
        this.gameOver = gameOver;

    }

    attack(attackerType, defenderType) {
        if(!attackerType || !defenderType ){
            // console.log(attackerType,`is attacking - SHOULD BE EMPTY `,defenderType )
            return
        }

        console.log(`ATTACKER AND DEFENDER : `,attackerType, defenderType)

        const attackerArmy = this.player1.armiesByType[attackerType] || [];
        const defenderArmy = this.player2.armiesByType[defenderType] || [];
        const enemy = this.player2;

        const totalAttackDamage = this.calculateTotalDamage(attackerArmy);
       
        this.applyDamage(defenderArmy, totalAttackDamage,defenderType,enemy);

        this.determineOutcome();
    }

    calculateTotalDamage(army) {
        return army.reduce((total, unit) => total + unit.attack(), 0);
    }


    applyDamage(army, damage,armyType,player) {
        let remainingDamage = damage;
        army.forEach(unit => {
            if (remainingDamage <= 0) return;
            const damageApplied = Math.min(unit.health, remainingDamage);
            unit.receiveDamage(damageApplied);
            remainingDamage -= damageApplied;
        });

        this.cleanupDefeatedUnits(army,armyType,player);
    }

    cleanupDefeatedUnits(army, armyType, player) {
        const initialCount = army.length;

        const aliveUnits = army.filter(unit => unit.health > 0);

        if (initialCount !== aliveUnits.length) {
            console.log(`Defender lost ${initialCount - aliveUnits.length} units.`);
            console.log(`WTF IS THISSSSSSSSSSSSS`, player.armiesByType[armyType])
            console.log(player)
            // Update the player's armiesByType directly to reflect the removal of defeated units

            player.armiesByType[armyType] =aliveUnits;

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
            console.log(`The war has ended. Winner: ${winner}`);
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
