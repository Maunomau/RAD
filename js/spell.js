timeInDay = 500;//Uhh... I guess this runs before index.html is fully done or something
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
  //limit to being cast from water tiles somehow(by caster)
  WATERWOOP: {
    cost: 1,
    dropdistance: 0,
    droptime: 0,
    f: function(caster){
      let wooptile = randomWaterTile();
      caster.move(wooptile);
      console.log("WATERWOOPed to "+wooptile.x+","+wooptile.y);
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
    dropdistance: 10,
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
    dropdistance: 3,
    droptime: 3,
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
  SLEEPMORE: {
    cost: 1,
    dropdistance: 10,
    droptime: 2,
    f: function(){
      for(let i=0;i<monsters.length;i++){
        if (monsters[i].resting){
          monsters[i].rp = 0;
          monsters[i].fullHp += 2;
        }
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
            if (numWalls < 3 && gRNG.getUniform() < 0.5){
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
  DIG: {
    cost: 1,
    dropdistance: 5,
    droptime: 1,
    f: function(){
      let newTile = player.tile;
      for(let i=0;i<=runeinv.length;i++){
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
  },
  //More like stop time since I didn't feel like figuring out how to do that every other turn or so.
  HASTE: {
    cost: 1,
    dropdistance: 1,
    droptime: 5,
    f: function(caster){
      for(let i=0;i<monsters.length;i++){
        if(monsters[i] != caster) monsters[i].stunned = true;
      }
      haste = 3;
      caster.hasted = 3;
      caster.posthaste = 2;
    }
  },
  //Seal/Vanish/Banish
  //just increased cost and drop time to balance
  SEAL: {
    cost: 5,
    dropdistance: 8,
    droptime: timeInDay,
    f: function(caster){
      //Nonplayer casting? Would need monster specific sealedMons easyish way might be to just sealedMons[caster.constructor.name][monster] but not sure I really need that.
      //if(sealedMons == undefined) sealedMons = [];//not good enough apparently,
      //let tile = caster.getFrontTile();
      let tile = caster.tile;
      let testTile = tile.getNeighbor(caster.lastMove[0],caster.lastMove[1]);
      if(testTile.monster){
        console.log("sealing monster "+ testTile.monster.constructor.name +".");
        sealedMons.push(testTile.monster);
        testTile.monster.die()
      }
    }
  },
  //less OP SEAL that refuses to work
  //Why does releasing them on death seem to work so easily? Because it doesn't... It just shows them for 1 turn before they disappear.
  //I guess I could settle for just spawning new monsters, presumably they've got time to rest while sealed and if they need to carry over some stats those can be handled case by case
  CAPTURE: {
    cost: 1,
    dropdistance: 2,
    droptime: 3,
    worksnot: true,
    f: function(caster){
      let tile = caster.tile;
      let testTile = tile.getNeighbor(caster.lastMove[0],caster.lastMove[1]);
      if(capturedMons.length >= 1){
        if(!testTile.monster){
          console.log("releasing monster "+ capturedMons[0].constructor.name +".");
          spawnMonster(eval(capturedMons.shift().constructor.name), 0, testTile, gRNG);
        }else{
          console.warn("releasing "+ capturedMons[0].constructor.name +" and capturing "+testTile.monster.constructor.name +".");
          capturedMons.push(testTile.monster);
          testTile.monster.die()
          spawnMonster(eval(capturedMons.shift().constructor.name), 0, testTile, gRNG);
        }
      }else{
        if(testTile.monster){
          console.log("sealing monster "+ testTile.monster.constructor.name +".");
          capturedMons.push(testTile.monster);
          testTile.monster.die()
        }
        
      }
    }
  }
  //Can't get SEAL to work like I want it to but managed to get it to do this though even this doesn't really work nicely
  //Idea was to "mark" monster and then on casting again monster is relocated but issue is the original isn't removed if doing it in another room.
  /*
  RELOCATE: {
    cost: 1,
    dropdistance: 2,
    droptime: 3,
    worksnot: true,
    f: function(caster){
      let tile = caster.tile;
      let testTile = tile.getNeighbor(caster.lastMove[0],caster.lastMove[1]);
      if(rehomeMons.length >= 1){
        if(!testTile.monster){
          console.log("rehoming/relocating monster("+ rehomeMons[0].constructor.name +").");
          //while(sealedMons.length > 0){
          //let testTile = randomPassableTile();
          //sealedMons[sealedMons.length-1].tile = testTile;
          //monsters.push(sealedMons.pop());
          rehomeMons[0].tile = testTile;
          tiles[testTile.x][testTile.y].monster = rehomeMons[0];
          monsters.push(rehomeMons.shift());
          //tiles[testTile.x][testTile.y].monster = monsters[monsters.length-1];
          console.warn("latest monster in area "+ monsters[monsters.length-1].constructor.name +" "+".");
          console.warn("monster in tile "+testTile.x+","+testTile.y+" is "+ testTile.monster +" "+".");
        }else if(1<1){
          console.warn("rehoming "+ rehomeMons[rehomeMons.length-1].constructor.name +" and setting "+ testTile.monster.constructor.name +".");
          rehomeMons.push(testTile.monster);
          //testTile.monster.die();
          rehomeMons[0].tile = testTile;
          monsters.push(rehomeMons.shift());
          tiles[testTile.x][testTile.y].monster = monsters[monsters.length-1];
          
        }
      }else{
        if(testTile.monster){
          console.log("setting monster("+ testTile.monster.constructor.name +") for rehoming/relocating.");
          rehomeMons.push(testTile.monster);
          //testTile.monster.die()
        }
        
      }
    }
  }
  */
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


function pickupRune(rune){
  let maxRunes = 10// TODO: set max based on spells/circles equipped
  if(runeinv.length < maxRunes){
    runeinv.push(rune);
    //are elemntal charges separate pickup or do runes double as them? Add charge here if latter.
    
    if(runeinv.length % 1 == 0 && numSpells < 9){
      //numSpells++;
      //player.addSpell(Object.keys(spells)[numSpells-1]);
    }
    
    //spawnMonster();
    let useSingleSpriteForPlayer = false
    if (useSingleSpriteForPlayer) player.runed();
    else {
      if("add more runes to player sprite" && (runeinv.length/4) >= runesprites.length){
        let runeSpriteOptions = [runes0sheet,runes1sheet,runes2sheet,runes3sheet,runes4sheet];
        if(runesprites.length < runeSpriteOptions.length){
          let i = randomRange(0, runeSpriteOptions.length-1);
          while(runesprites.includes(runeSpriteOptions[i])) i = randomRange(0, runeSpriteOptions.length-1);
          runesprites.push(runeSpriteOptions[i]);
          console.log("more %c runes", "color:cyan");
        }else console.log("already fully%c runed", "color:cyan");
      }
    }
    playSound("treasure");
    return true;//tell the tile that it can remove the rune from itself
  }
}



/*
Do I want an array that has runes to be respawned in it or what?

Should stacks of charges/runes be a thing or how should I handle spells using more than 1?
*/


function dropRunes(){
  for(let k=usedRunes.length-1;k>=0;k--){
    let delay = usedRunes[k][0];
    let distance = usedRunes[k][1];
    let tile = usedRunes[k][2];
    let type = usedRunes[k][3];
    let wx = usedRunes[k][4];
    let wy = usedRunes[k][5];
    if(wpos[0] == wx && wpos[1] == wy){
      console.log("Respawning a rune gem near "+tile.x+","+tile.y);
      if (delay <= 0){
        // spawn charge within el[1] distance from el[2]
        if (distance == 0){
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
            console.log(error+" couldn't find gemless tile? Trying again next turn.");
          }
        }
        usedRunes.splice(k,1);
      }else{
        usedRunes[k][0] -= 1;
      }
    }
    
  }
  /*
  usedRunes.forEach(el, index){
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
  if(lastGemCount != gemCount)console.log("gemcount add "+(gemCount-lastGemCount)+" = %c"+gemCount, "color:violet");
  lastGemCount = gemCount;
  return gemCount;
}