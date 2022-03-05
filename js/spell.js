spells = {
  WOOP: {
    cost: 1,
    dropdistance: 0,
    droptime: 0,
    f: function(caster){
      let wooptile = randomPassableTile();
      caster.move(wooptile);
      console.log("WOOPed to "+wooptile.x+","+wooptile.y);
    }
  },
  BRAVERY: {
    cost: 1,
    dropdistance: 2,
    droptime: 3,
    f: function(){
      player.shield = 3;
      for(let i=0;i<monsters.length;i++){
        monsters[i].stunned = true;
      }
    }
  },
  MAELSTROM: {
    cost: 1,
    dropdistance: 5,
    droptime: 1,
    f: function(caster){
      for(let i=0;i<monsters.length;i++){
        if (monsters[i].tile.dist(caster.tile) < 13){
          monsters[i].move(randomPassableTile());
          monsters[i].teleportCounter = 3;
        }
      }
    }
  },
  DASH: {
    cost: 1,
    dropdistance: 1,
    droptime: 1,
    f: function(caster){
      let newTile = caster.tile;
      while(true){
        let testTile = newTile.getNeighbor(caster.lastMove[0],caster.lastMove[1]);
        if(testTile.passable && !testTile.monster){
          newTile = testTile;
        }else{
          break;
        }
      }
      if(caster.tile != newTile){
        caster.move(newTile);
        newTile.getAdjacentNeighbors().forEach(t => {
          if(t.monster){
            t.setEffect(14);
            t.monster.stunned = true;
            t.monster.hit(1);
          }
        });
      }
    }
  },
  BOLT: {
    cost: 1,
    dropdistance: 5,
    droptime: 2,
    f: function(){
      boltTravel(player.lastMove, 16 - Math.abs(player.lastMove[1]), 4);
    }
  },
  SWAP: {
    cost: 1,
    dropdistance: 1,
    droptime: 0,
    f: function(caster){
      let newTile = caster.tile;
      while(true){
        let testTile = newTile.getNeighbor(caster.lastMove[0],caster.lastMove[1]);
        if(testTile.passable && !testTile.monster){
          newTile = testTile;
        }else{
          newTile = testTile;
          break;
        }
      }
      if(newTile.monster){
        caster.swap(newTile, caster.tile)
      }
    }
  },
  CROSS: {
    cost: 1,
    dropdistance: 5,
    droptime: 2,
    f: function(){
      let directions = [
        [0, -1],
        [0, 1],
        [-1, 0],
        [1, 0]
      ];
      for(let k=0;k<directions.length;k++){
        boltTravel(directions[k], 16 - Math.abs(directions[k][1]), 2);
      }
    }
  },
  EX: {
    cost: 1,
    dropdistance: 5,
    droptime: 2,
    f: function(){
      let directions = [
        [-1, -1],
        [-1, 1],
        [1, -1],
        [1, 1]
      ];
      for(let k=0;k<directions.length;k++){
        boltTravel(directions[k], 14, 3);
      }
    }
  },
  POWER: {
    cost: 1,
    dropdistance: 3,
    droptime: 2,
    f: function(){
      player.bonusAttack=5;
    }
  },
  // Meh, not sure there's anything I'd want to do based on neighbouring walls
  // Pushing stuff towards more open tiles? Not really
  // Breaking walls? Maybe
  // Constraining the range to specific tiles could be good.
  // Quake as a time to get out of here event could work
  QUAKE: {
    cost: 1,
    dropdistance: 16,
    droptime: 1,
    f: function(){
      for(let i=0; i<numTiles; i++){
        for(let j=0; j<numTiles; j++){
          let tile = getTile(i,j);
          if(tile.constructor.name == "Wall"){
            //tile.replace(Floor);
            let numWalls = 4 - tile.getAdjacentPassableNeighbors().length;
            if (numWalls < 3 && Math.random() < 0.5){
              tile.replace(Floor);
            }
          }else if(tile.monster && !tile.monster.flying){
            tile.monster.stunned = true;
          }
        }
      }
      shakeAmount = 20;
    }
  },
  DIG: {
    cost: 1,
    dropdistance: 5,
    droptime: 1,
    f: function(){
      let newTile = player.tile;
      for(let i=0;i<=charges;i++){
        let testTile = newTile.getNeighbor(player.lastMove[0],player.lastMove[1]);
        if(testTile.passable){
          testTile.replace(Pool);
          newTile = testTile;
        }else if(inBounds(testTile.x, testTile.y)){
          testTile.replace(Vent);
          newTile = testTile;
        }
      }
    }
  },
  DRAG: {
    cost: 1,
    dropdistance: 1,
    droptime: 1,
    f: function(caster){
      let dragRange = 3;
      let newTile = caster.tile;
      let testTile;
      for(let i=0;i<=dragRange;i++){
        testTile = newTile.getNeighbor(caster.lastMove[0],caster.lastMove[1]);
        if(testTile.passable && !testTile.monster){
          newTile = testTile;
        }else{
          break;
        }
      }
      if(testTile.monster){
        testTile.monster.move(newTile);
        newTile.monster.stunned = true;
        newTile.monster.hit(1);
      }
    }
  }
};


function boltTravel(direction, effect, damage){
  let newTile = player.tile;
  while(true){
    let testTile = newTile.getNeighbor(direction[0], direction[1]);
    if(testTile.passable){
      newTile = testTile;
      if(newTile.monster){
        newTile.monster.hit(damage);
      }
      newTile.setEffect(effect);
    }else{
      break;
    }
  }
}

/*
Do I want an array that has runes to be respawned in it or what?

Should stacks of charges be a thing or how should I handle spells using more than 1?
*/


function dropCharges(){
  for(let k=usedCharges.length-1;k>=0;k--){
    delay = usedCharges[k][0];
    distance = usedCharges[k][1];
    tile = usedCharges[k][2];
    type = usedCharges[k][3];
    console.log("Respawning a rune gem near "+tile.x+","+tile.y);
    if (delay <= 0){
      // spawn charge within el[1] distance from el[2]
      if (distance == 0){
        //getTile(tile.x, tile.y).gem = 1
        if (!tile.gem){
          tile.gem = type;
          tile.setEffect(13);
        }
      }else{
        //Spawn somewhere
        try{
          rtile = randomTileWithinDistance(tile, distance, "", "gem");
          rtile.gem = type;
          rtile.setEffect(13);
          //randomPassableTile().gem = 1;
        } catch (error){
          console.log(error+" couldn't find gemless tile. Trying again next turn.");
        }
      }
      usedCharges.splice(k,1);
    }else{
      usedCharges[k][0] -= 1;
    }
    
  }
  /*
  usedCharges.forEach(el, index){
    if (el[0] <= 0){
      // spawn charge within el[1] distance from el[2]
      if (el[1] == 0){
        getTile(el[2].x, el[2].y).gem = 1
      }
    }
  }
  */
  
}

function gemCount(){
  let gemCount = 0;
  tiles.forEach(el => {
    el.forEach(tile => {
      if (tile.gem) gemCount++;
    })
  });
  console.log("gemcount:"+gemCount);
  return gemCount;
}