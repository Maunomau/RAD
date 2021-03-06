


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
    droptime: timeInDay*0.9,
    f: function(){
      player.shield = 3;
      for(let i=0;i<monsters.length;i++){
        monsters[i].stunned = true;
      }
    }
  },
  HEAL: {
    cost: 1,
    dropdistance: 0,
    droptime: timeInDay*0.9,
    f: function(caster){
      if (caster.tile.liquid = "water" && caster.tile.depth >= 2 && caster.hp+1 < caster.fullHp) {
        caster.hp += 2;
      }
      else if(caster.hp < caster.fullHp){
        caster.hp += 1;
      }
      if(caster.poisoned){
        caster.poisoned = 0;
        caster.poisontimer = 0;
      }
      caster.tile.setEffect(13);
      //if (caster.hp < caster.fullHp) caster.hpup = true;
      //else caster.hpup = false;
    }
  },
  MAELSTROM: {
    cost: 1,
    dropdistance: 10,
    droptime: 100,
    f: function(caster){
      for(let i=0;i<monsters.length;i++){
        if (monsters[i].tile.dist(caster.tile) < 13){
          monsters[i].move(randomPassableTile());
          monsters[i].teleportCounter = 3;
        }
      }
    }
  },
  REVEAL: {
    cost: 1,
    dropdistance: 1,
    droptime: timeInDay*0.9,
    f: function(caster){
      caster.seeAll = true;
    }
  },
  DASH: {
    cost: 1,
    dropdistance: 1,
    droptime: 100,
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
    cost: 2,
    dropdistance: 1,
    droptime: timeInDay*0.9,
    f: function(caster){
      boltTravel(caster.lastMove, 16 - Math.abs(caster.lastMove[1]), 4, caster);
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
    cost: 2,
    dropdistance: 1,
    droptime: timeInDay*0.9,
    f: function(caster){
      let directions = [
        [0, -1],
        [0, 1],
        [-1, 0],
        [1, 0]
      ];
      for(let k=0;k<directions.length;k++){
        boltTravel(directions[k], 16 - Math.abs(directions[k][1]), 2, caster);
      }
    }
  },
  SLEEPMORE: {
    cost: 1,
    dropdistance: 1,
    droptime: timeInDay*0.9,
    f: function(caster){
      for(let i=0;i<monsters.length;i++){
        if (monsters[i].resting && monsters[i] != caster){
          monsters[i].rp = 0;
          monsters[i].fullHp += 2;
        }
      }
    }
  },
  POWER: {
    cost: 1,
    dropdistance: 1,
    droptime: timeInDay*0.9,
    f: function(caster){
      caster.bonusAttack=5;
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
    droptime: timeInDay*0.9,
    f: function(caster){
      for(let i=0; i<numTiles; i++){
        for(let j=0; j<numTiles; j++){
          let tile = getTile(i,j);
          if(tile.constructor.name == "Wall"){
            //tile.replace(Floor);
            let numWalls = 4 - tile.getAdjacentPassableNeighbors().length;
            if (numWalls < 3 && gRNG.getUniform() < 0.5){
              tile.replace(Floor2);
            }
          }else if(tile.monster && !tile.monster.flying && tile.monster != caster){
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
    droptime: timeInDay*0.9,
    f: function(caster){
      let directions = [
        [-1, -1],
        [-1, 1],
        [1, -1],
        [1, 1]
      ];
      for(let k=0;k<directions.length;k++){
        boltTravel(directions[k], 14, 3, caster);
      }
    }
  },
  DIG: {
    cost: 1,
    dropdistance: 0,
    droptime: 10,
    f: function(caster){
      let newTile = caster.tile;
      //for(let i=0;i<=runeinv.length;i++){
      for(let i=0;i<=2;i++){
        let testTile = newTile.getNeighbor(player.lastMove[0],player.lastMove[1]);
        if(testTile.constructor.name != "Exit"){
          if(testTile.passable){
            testTile.replace(Pool);
            newTile = testTile;
          }else if(testTile.crawlable){
            testTile.replace(Floor2);
            newTile = testTile;
          }else if(inBounds(testTile.x, testTile.y)){
            testTile.replace(Vent);
            newTile = testTile;
          }
        }
      }
    }
  },
  DRAG: {
    cost: 1,
    dropdistance: 0,
    droptime: timeInDay*0.9,
    f: function(caster){
      let dragRange = 3;
      let newTile = caster.tile;
      let testTile;
      for(let i=0;i<=dragRange;i++){
        testTile = newTile.getNeighbor(caster.lastMove[0],caster.lastMove[1]);
        if(testTile.crawlable && !testTile.monster){
          newTile = testTile;
        }else{
          break;
        }
      }
      if(testTile.monster){
        //testTile.monster.move(newTile);
        //trip player, stun and do damage to non players
        if(testTile.monster.isPlayer){
          player.small = true;
          player.peaceful = true;
          player.sprite = Math.min(4+newTile.depth, 6);
          //player.hit(1, caster);
        }else{
          testTile.monster.stunned = true;
          testTile.monster.hit(1, caster);
        }
        testTile.monster.tryPush(newTile.x-testTile.x, newTile.y-testTile.y);
      }
    }
  },
  //move to a passable tile 6 or less tiles ahead and stun enemies.
  BLINK: {
    cost: 1,
    dropdistance: 1,
    droptime: 2,
    f: function(caster){
      let newTile = caster.tile;
      let testTile = newTile.getNeighbor(caster.lastMove[0]*6,caster.lastMove[1]*6);
      newTile = testTile;
      for (let i = 0; i < 8; i++) {
        //a bit scuffed way to move back towards player
        if(caster.lastMove[0] == 0 && testTile.y > caster.tile.y){
          testTile = tiles[testTile.x][testTile.y-1];
        }else if(caster.lastMove[0] == 0 && testTile.y < caster.tile.y){
          testTile = tiles[testTile.x][testTile.y+1];
        }else if(testTile.x > caster.tile.x && caster.lastMove[1] == 0){
          testTile = tiles[testTile.x-1][testTile.y];
        }else if(testTile.x < caster.tile.x && caster.lastMove[1] == 0){
          testTile = tiles[testTile.x+1][testTile.y];
        }
        if(!testTile.passable || testTile.monster){
          newTile = testTile;
        }else{
          break;
        }
      }
      if(caster.tile != testTile){
        caster.move(testTile);
        testTile.getAdjacentNeighbors().forEach(t => {
          if(t.monster){
            t.monster.stunned = true;
          }
        });
      }
    }
  },
  //Why does this refuse to move more than 1 monster? I give up
  //tryPush() should make it much easier, getting all the pushed monsters would need more.
  PUSH: {
    cost: 1,
    dropdistance: 1,
    droptime: 5,
    f: function(caster){
      let newTile = caster.tile;
      let testTile = newTile.getNeighbor(caster.lastMove[0],caster.lastMove[1]);
      let pushTiles = [];
      newTile = testTile;
      for (let i = 0; i < 6; i++) {
        testTile = newTile.getNeighbor(caster.lastMove[0],caster.lastMove[1]);
        if(testTile.passable && !testTile.monster){
          newTile = testTile;
        }else if(testTile.monster){
          testTile.monster.stunned = true;
          testTile.monster.tryPush(caster.lastMove[0],caster.lastMove[1], 8);
          testTile.setEffect(11);
          break;
        }
      }
    }
  },
  
  SHOVE: {
    cost: 1,
    dropdistance: 1,
    droptime: 3,
    f: function(caster){
      let newTile = caster.tile;
      let testTile = newTile.getNeighbor(caster.lastMove[0],caster.lastMove[1]);
      if(testTile.monster){
        //testTile.monster.hit(1, player)
        testTile.monster.tryPush(caster.lastMove[0],caster.lastMove[1]);
        //testTile.monster.stunned = true;
        tiles[testTile.x+caster.lastMove[0]][testTile.y+caster.lastMove[1]].monster.stunned = true;
      }
    }
  },
  WALL: {
    cost: 1,
    dropdistance: 8,
    droptime: timeInDay*0.9,
    f: function(caster){
      //Nonplayer casting? Would need monster specific sealedMons easyish way might be to just sealedMons[caster.constructor.name][monster] but not sure I really need that.
      //if(sealedMons == undefined) sealedMons = [];//not good enough apparently,
      //let tile = caster.getFrontTile();
      let tile = caster.tile;
      let testTile = tile.getNeighbor(caster.lastMove[0],caster.lastMove[1]);
      testTile.replace(Wall);
      if(testTile.monster){
        //testTile.monster.die()
        testTile.monster.move(testTile.getAdjacentPassableNeighbors()[0])//Sometimes moves to other side of player
      }
    }
  },
  //More like stop time since I didn't feel like figuring out how to do that every other turn or so.
  HASTE: {
    cost: 1,
    dropdistance: 1,
    droptime: timeInDay*0.9,
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
    cost: 3,
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
    droptime: timeInDay*0.9,
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


function boltTravel(direction, effect, damage, caster){
  let newTile = caster.tile;
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
  let maxRunes = 200// TODO: set max based on spells/circles equipped
  if(runeinv.length < maxRunes){
    runeinv.push(rune);
    let wTRs = wTiles[wpos[0]][wpos[1]].runes
    wTRs.splice(wTRs.indexOf(rune), 1)//remove rune from wTile runes array
    //optional stuff we might use.
    runes[rune].holder = "player";
    runes[rune].wx = false;
    runes[rune].wy = false;
    runes[rune].x = false;
    runes[rune].y = false;
    runes[rune].setday = false;
    runes[rune].hintday = false;
    //spawnMonster();
    
    //wrong place for this now that I'm basing sprite on spell amount, addSpell() should be better
    /*
    let useSingleSpriteForPlayer = false
    if (useSingleSpriteForPlayer) player.runed();
    else {
      if("add more runes to player sprite" && ((player.spells.length-1)/2) >= runesprites.length){
        let runeSpriteOptions = [runes0sheet,runes1sheet,runes2sheet,runes3sheet,runes4sheet];
        if(runesprites.length < runeSpriteOptions.length){
          let i = randomRange(0, runeSpriteOptions.length-1);
          while(runesprites.includes(runeSpriteOptions[i])) i = randomRange(0, runeSpriteOptions.length-1);
          runesprites.push(runeSpriteOptions[i]);
          console.log("more %c runes", "color:cyan");
        }else console.log("already fully%c runed", "color:cyan");
      }
    }
    */
    playSound("treasure");
    return true;//tell the tile that it can remove the rune from itself
  }
}



/*
Do I want an array that has runes to be respawned in it or what?

Should stacks of charges/runes be a thing or how should I handle spells using more than 1?





  for (var rune in object) {
    if (object.hasOwnProperty(rune)) {
      
    }
  }


*/


//
function dropRunes(){
  Object.keys(runes).forEach((rune, i) => {
    //let r = runes[rune.getOwnPropertyNames()[0]]; //a bit ehh but should work(ie. r = runes["ale"])
    let r = runes[rune];
    if(wpos[0] == r.wx && wpos[1] == r.wy && r.setday != levelday){
      let tile = tiles[r.x][r.y];
      if(tile.crawlable && (!tile.circle >= 0) && !tile.exit && !tile.rune) {//if valid location
        console.log("rune("+rune+") at "+r.x+","+r.y);
        
      }else{
        console.log("rune("+rune+") near "+r.x+","+r.y);
        let whileindex = 1;
        //this'll go over all the tiles possible over multiple turns...
        while(!tile.crawlable || tile.circle >= 0 || tile.exit || tile.rune){
          try{ tile = randomTileWithinDistance(tile, whileindex);
          } catch (error){console.log("("+error+") Couldn't find suitable tile within distance "+whileindex+", expanding search area.");}
          whileindex++;
        }
      }
      if (r.timer <= 0){
        tile.setEffect(9);
        tile.rune = r.word;
        if(tile.runehint) tile.runehint = false;
        r.setday = levelday;
      }else if(r.hintday != levelday){
        tile.setEffect(9);
        tile.runehint = r.word;
        r.hintday = levelday;
      }else if(r.timer <= 50){
        tile.setEffect(12);
      }//else tile.setEffect(0);
    }
    if(r.timer) r.timer--;
    
  });
}

function releaseRune(x = player.tile.x, y = player.tile.y, delay = timeInDay*0.9, runeid = 0, wx = wpos[0], wy = wpos[1], holder = false) {
  if(runeinv.length){
    //runes[runeinv[cost-1]].timer = spells[spellName].droptime;// shift()/splice takes care of cost-1
    runes[runeinv[0]].x = x;
    runes[runeinv[0]].y = y;
    runes[runeinv[0]].timer = delay;
    runes[runeinv[0]].wx = wx;
    runes[runeinv[0]].wy = wy;
    runes[runeinv[0]].holder = holder;
    // TODO: check ability to use a specific rune instead of first one in runeinv works fine
    wTiles[wx][wy].runes.push(runeinv.splice(runeid,1));
    //wTiles[wx][wy].runes.push(runeinv.shift());
  }else console.error("Tried to release rune despite not having any.");
}

function gemCount(){
  let gemCount = 0;
  tiles.forEach(el => {
    el.forEach(tile => {
      if (tile.rune) gemCount++;
    })
  });
  if(lastGemCount != gemCount)console.log("gemcount add "+(gemCount-lastGemCount)+" = %c"+gemCount, "color:violet");
  lastGemCount = gemCount;
  return gemCount;
}