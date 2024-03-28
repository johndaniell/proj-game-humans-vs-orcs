encounters = [
    {
      id: 1,
      name: "Grunt Ambush",
      info: "Goblin",
      imagePath: `./images/Units/Stronghold/goblin.gif`,
      width: "40px",
      height: "80px",
      isEnemy: true,
      enemyArmy: {
        name: "Goblin",
        units: [
        { type: "Goblin", count: 30 },
        { type: "Hobgoblin", count: 20 },
        { type: "Wolf Rider", count: 10 },
      ],
      },
    },
    {
      id: 2,
      name: "Orc Warband",
      info: "Orcs",
      imagePath: `./images/Units/Stronghold/wolfraider.gif`,
      width: "70px",
      height: "80px",
      isEnemy: true,
      enemyArmy: {
        name: "OrcWarriors",
        units: [
        { type: "Goblin", count: 25 },
        { type: "Wolf Raider", count: 15 },
        { type: "Orc", count: 10 },
        { type: "Ogre Magi", count: 5 },
        
      
      
      
      ],
      },
    },
    {
      id: 3,
      name: "Grunt Merry Band",
      info: "Grunts",
      imagePath: `./images/Units/Stronghold/ogremagi.gif`,
      width: "40px",
      height: "80px",
      isEnemy: true,
      enemyArmy: {
        name: "Grunt",
        units: [
          { type: "Orc Chieftain", count: 120 },
      ],
      },
    },
    {
      id: 4,
      name: "Deadly Orcs",
      info: "Many Orcs",
      imagePath: `./images/Units/Stronghold/ancientbehemoth.gif`,
      width: "80px",
      height: "80px",
      isEnemy: true,
      enemyArmy: {
        name: "OrcWarrior",
        units: [
        { type: "Goblin", count: 30 },
        { type: "Hobgoblin", count: 25 },
        { type: "Orc", count: 20 },
        { type: "Ogre Magi", count: 15 },
        { type: "Thunderbird", count: 10 },
        { type: "Cyclops King", count: 5 },
        { type: "Ancient Behemoth", count: 1 },
      
      ],
      },
    },
  ];






  const unitData = [
    { type: "Pikeman", health: 10, strength: 2, movementRange: [3, 3],attackRange : [1,1],imagePath: `./images/Units/Castle/pikeman.gif`  },
    { type: "Halberdier", health: 10, strength: 2.5, movementRange: [5, 5], attackRange: [1, 1], imagePath: `./images/Units/Castle/halberdier.gif` },
    { type: "Archer", health: 10, strength: 2.5, movementRange: [4, 4], attackRange: [12, 12], imagePath: `./images/Units/Castle/archer.gif` },
    { type: "Marksman", health: 10, strength: 2.5, movementRange: [6, 6], attackRange: [24, 24], imagePath: `./images/Units/Castle/marksman.gif` },
    { type: "Griffin", health: 25, strength: 4.5, movementRange: [6, 6], attackRange: [1, 1], imagePath: `./images/Units/Castle/griffin.gif` },
    { type: "Royal Griffin", health: 25, strength: 4.5, movementRange: [9, 9], attackRange: [1, 1], imagePath: `./images/Units/Castle/royal_griffin.gif` },
    { type: "Swordsman", health: 35, strength: 7.5, movementRange: [5, 5], attackRange: [1, 1], imagePath: `./images/Units/Castle/swordsman.gif` },
    { type: "Crusader", health: 35, strength: 8.5, movementRange: [6, 6], attackRange: [1, 1], imagePath: `./images/Units/Castle/crusader.gif` },
    { type: "Monk", health: 30, strength: 11, movementRange: [5, 5], attackRange: [12, 12], imagePath: `./images/Units/Castle/monk.gif` },
    { type: "Zealot", health: 30, strength: 11, movementRange: [7, 7], attackRange: [24, 24], imagePath: `./images/Units/Castle/zealot.gif` },
    { type: "Cavalier", health: 100, strength: 20, movementRange: [7, 7], attackRange: [1, 1], imagePath: `./images/Units/Castle/cavalier.gif` },
    { type: "Champion", health: 100, strength: 22.5, movementRange: [9, 9], attackRange: [1, 1], imagePath: `./images/Units/Castle/champion.gif` },
    { type: "Angel", health: 200, strength: 50, movementRange: [12, 12], attackRange: [1, 1], imagePath: `./images/Units/Castle/angel.gif` },
    { type: "Archangel", health: 250, strength: 50, movementRange: [18, 18], attackRange: [1, 1], imagePath: `./images/Units/Castle/archangel.gif` },




    { type: "Goblin", health: 5, strength: 1.5, movementRange: [5, 5], attackRange: [1, 1], imagePath: `./images/Units/Stronghold/goblin.gif` },
    { type: "Hobgoblin", health: 5, strength: 1.5, movementRange: [7, 7], attackRange: [1, 1], imagePath: `./images/Units/Stronghold/hobgoblin.gif` },
    { type: "Wolf Rider", health: 10, strength: 3, movementRange: [6, 6], attackRange: [1, 1], imagePath: `./images/Units/Stronghold/wolfrider.gif` },
    { type: "Wolf Raider", health: 10, strength: 3.5, movementRange: [8, 8], attackRange: [1, 1], imagePath: `./images/Units/Stronghold/wolfraider.gif` },
    { type: "Orc", health: 15, strength: 3.5, movementRange: [4, 4], attackRange: [12, 12], imagePath: `./images/Units/Stronghold/orc.gif` },
    { type: "Orc Chieftain", health: 20, strength: 3.5, movementRange: [5, 5], attackRange: [24, 24], imagePath: `./images/Units/Stronghold/orcchieftain.gif` },
    { type: "Ogre", health: 40, strength: 9, movementRange: [4, 4], attackRange: [1, 1], imagePath: `./images/Units/Stronghold/ogre.gif` },
    { type: "Ogre Magi", health: 60, strength: 9, movementRange: [5, 5], attackRange: [1, 1], imagePath: `./images/Units/Stronghold/ogremagi.gif` },
    { type: "Roc", health: 60, strength: 13, movementRange: [7, 7], attackRange: [1, 1], imagePath: `./images/Units/Stronghold/roc.gif` },
    { type: "Thunderbird", health: 60, strength: 13, movementRange: [11, 11], attackRange: [1, 1], imagePath: `./images/Units/Stronghold/thunderbird.gif` },
    { type: "Cyclops", health: 70, strength: 18, movementRange: [6, 6], attackRange: [16, 16], imagePath: `./images/Units/Stronghold/cyclops.gif` },
    { type: "Cyclops King", health: 70, strength: 18, movementRange: [8, 8], attackRange: [24, 24], imagePath: `./images/Units/Stronghold/cyclopsking.gif` },
    { type: "Behemoth", health: 160, strength: 40, movementRange: [6, 6], attackRange: [1, 1], imagePath: `./images/Units/Stronghold/behemoth.gif` },
    { type: "Ancient Behemoth", health: 300, strength: 40, movementRange: [9, 9], attackRange: [1, 1], imagePath: `./images/Units/Stronghold/ancientbehemoth.gif` },
    // Add more unit types as needed
  
    
  ];



  const decorativeItemsData = [
    { type: 'Abandoned Mine', imagePath: './images/Buildings/Abandoned_Mine_4.gif', width: 230, height: 190 },
    { type: 'Den of Thieves', imagePath: './images/Buildings/Den_of_Thieves.gif', width: 150, height: 150 },
    { type: 'Arena', imagePath: './images/Buildings/Arena.gif', width: 130, height: 130 },
    { type: 'Dragon Utopia', imagePath: './images/Buildings/Dragon_Utopia.gif', width: 260, height: 190 },
    { type: 'Lighthouse', imagePath: './images/Buildings/Lighthouse.gif', width: 100, height: 200 },
    { type: 'Market of Time', imagePath: './images/Buildings/Market_of_Time.gif', width: 80, height: 80 },
    { type: 'Marletto Tower', imagePath: './images/Buildings/Marletto_Tower.gif', width: 100, height: 200 },
    { type: 'lover Field', imagePath: './images/Clover_Field.gif', width: 200, height: 160 },
    { type: 'Magic Plains', imagePath: './images/Magic_Plains.gif', width: 300, height: 180 },
    { type: 'Castle', imagePath: './images/Buildings/castle.png', width: 400, height: 280 },
    { type: 'Dungeon', imagePath: './images/Buildings/dungeon.png', width: 250, height: 400 },
    // Add more items as needed
];
