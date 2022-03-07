function setupCanvas(){
  canvas = document.querySelector("canvas");
  ctx = canvas.getContext("2d");

  canvas.width = tileSize*(numTiles+uiWidth);
  canvas.height = tileSize*numTiles;
  canvas.style.width = canvas.width + 'px';
  canvas.style.height = canvas.height + 'px';
  ctx.imageSmoothingEnabled = false;
}
function drawTile(tile, x, y){
  ctx.drawImage(
    tileset,
    (tile%4)*16,
    Math.floor(tile/4)*16,
    16,
    16,
    x*tileSize + shakeX,
    y*tileSize + shakeY,
    tileSize,
    tileSize
  );
}

function drawSprite(sprite, x, y, sheet, dir = 0){
  ctx.drawImage(
    sheet,
    dir*16,
    sprite*16,
    16,
    16,
    x*tileSize + shakeX,
    y*tileSize + shakeY,
    tileSize,
    tileSize
  );
}

function draw(){
  if(gameState == "running" || gameState == "dead"){  
    ctx.clearRect(0,0,canvas.width,canvas.height);
    screenshake();
    
    for(let i=0;i<numTiles;i++){
      for(let j=0;j<numTiles;j++){
        getTile(i,j).draw();
      }
    }
    /*
    */
    if (monsters[0]){
      for(let i=0;i<monsters.length;i++){
        monsters[i].draw();
      }
    }
    //drawSprite(0, x, y);
    player.draw();
    
    drawText("Level:"+level+" t:"+levelturn+"", 18, false, 40, "violet");
    drawText("Runes:"+charges+"/"+gemMax, 18, false, 70, "violet");
    
    for(let i=0; i<player.spells.length; i++){
      let spellText = (i+1) + ") " + (player.spells[i] || "");
      drawText(spellText, 20, false, 110+i*40, "aqua");
    }
    
  }
}

function tick(){
  soundsplayed = {} //(soundname: distance)Used to avoid more distant sounds replacing closer ones.
  //iterate over monsters(including player) (importantly in reverse so they can be safely deleted)
  //adjust for knocking out
  dropCharges()
  for(let k=monsters.length-1;k>=0;k--){
    if(!monsters[k].dead){
      monsters[k].update();
    }else{
      monsters.splice(k,1);
    }
  }
  
  player.update();
  
  if(player.dead){
    addRecords(charges, false);
    gameState = "dead";
  }
  /* spawn monsters, should adjust for knocking out and breeding */
  spawnCounter--;
  if(spawnCounter <= 0){  
      spawnMonster();
      spawnCounter = spawnRate;
      spawnRate--;
  }
  turn++;
  levelturn++;
  gemMax = charges + usedCharges.length + gemCount();
  
  
  
  //
  if (rngLog[0] != mapRNG.getState()[0]){
    console.warn("MapRNG changed!:"+ mapRNG.getState()[0] +"");
    console.log("MapRNG was:"+ rngLog[0] +"");
    rngLog = mapRNG.getState();
  }
}

function showTitle(){
  ctx.fillStyle = 'rgba(0,0,0,.50)';
  ctx.fillRect(0,0,canvas.width, canvas.height);

  gameState = "title";
  
  
  //mapRNG.setSeed(12345);
  worldRNG.setSeed(999);
  
  
  RWord = ROT.RNG.getItem(["Raging", "Rampant", "Ravenous", "Rough", "Rowdy", "Rugged", "Ruthless"]);
  
  drawText("Running Around Dressless", 48, true, canvas.height/2 - 110, "white");
  //drawText("in a Nascent Territory Full of Rowdy Monsters", 25, true, canvas.height/2 - 50, "white");
  drawText("in a Nascent Territory Full of "+RWord+" Monsters", 20, true, canvas.height/2 - 50, "white");
  //drawText("in a Nest That's Full of Rowdy Monsters", 25, true, canvas.height/2 - 50, "white");
  
  drawScores();
  
  
  if (gameState == "dead"){
    console.log("Beings encountered this run:"+seenMons);
    //track amounts and kills?
    //Add to beastiary
  }
}

function startGame(){
  //playSound("newLevel");
  sounds["newLevel"].play();
  level = 1;
  charges = 0;
  turn = 0;
  levelturn = 0;
  numSpells = 0;
  startLevel(-1);
  seenMons = new Set();
  usedCharges = []
  
  //gameState = "mapgen";
}

//WIP
function startLevel2(){
  
  
  var seed = ROT.RNG.getSeed();

  ROT.RNG.setSeed(12345);

  console.log("RNG test: "+ROT.RNG.getUniform());
  console.log("RNG test: "+ROT.RNG.getUniform());
  console.log("RNG test: "+ROT.RNG.getNormal(0, 10));
  console.log("RNG test: "+ROT.RNG.getNormal(0, 10));
  console.log("RNG test: "+ROT.RNG.getPercentage());
  console.log("RNG test: "+ROT.RNG.getPercentage());
  console.log("RNG test: "+ ROT.RNG.getUniformInt(31, 69) +"");
  console.log("RNG test: "+ ROT.RNG.getUniformInt(31, 69) +"");
  console.log("RNG seed: "+ ROT.RNG.getSeed() +"");
  console.log("RNG state: "+ ROT.RNG.getState() +"");
  errcount = 0;
  
  try{
    //generateLevel();
    //generateTiles();
    gameState = "running";
  }
  catch (error){
    console.error("test: ");
    errcount++;
    if(errcount > 200)debugger;
  }
}

function startLevel(entryDir, playerHp=3){
  console.warn("level entry Dir="+entryDir);
  spawnRate = 30;
  spawnCounter = spawnRate;
  
  generateLevel();
  /*
  startLevelPart2(edir)
}
//split to part 2 just for debugging
function startLevelPart2(edir){
  */
  //console.groupCollapsed("place(%cplayer and exits%c).", "color:khaki", "color:");
  console.group("place(%cplayer and exits%c).", "color:khaki", "color:");
  //Should these use mapRNG or not? Dunno.
  /*
  dirs = [
    tiles[numTiles/2+randomRange(-2,2,mapRNG)][numTiles-2],
    tiles[0+1][numTiles/2+randomRange(-2,2,mapRNG)],
    tiles[numTiles/2+randomRange(-2,2,mapRNG)][0+1],
    tiles[numTiles-2][numTiles/2+randomRange(-2,2,mapRNG)],
  ];
    */
  dirs = [
    tiles[numTiles/2][numTiles-2],
    tiles[0+1][numTiles/2],
    tiles[numTiles/2][0+1],
    tiles[numTiles-2][numTiles/2],
  ];
  for(let i=0 ; i<dirs.length ; i++) {
    let tile = dirs[i];
    //let frontTileType = Floor;
    let frontTileType = Pit;
    let frontTile = tiles[tile.x-dirmap[i][0]][tile.y-dirmap[i][1]];
    //frontTile = tiles[frontTile.x-dirmap[i][0]][frontTile.y-dirmap[i][1]];//closer to center
    tiles[tile.x][tile.y] = new Exit(tile.x, tile.y, dirmap[i][0], dirmap[i][1], i);
    tiles[frontTile.x][frontTile.y].replace(frontTileType);
    //entryDir is opposite of i
    //console.log("dir "+i+" "+(dirmap[i][0]==-dirmap[1][0])+"");
    if (entryDir >= 0 && entryDir <= 3){
      console.log("dir and entryDir");
      console.log("dir"+(dirmap[entryDir][0]+dirmap[entryDir][1])+" and entryDir"+(dirmap[i][1]+dirmap[i][0])+"");
      //Hmm, so you can tell if dir is southeast or northwest by adding and you can tell if it's north-south or east-west by checking a position
      console.log("dir "+i+" vs "+entryDir+
        " x="+ (dirmap[entryDir][0] == -dirmap[i][0]) +
        " y="+ (dirmap[entryDir][1] == -dirmap[i][1]) +"");
      if(dirmap[entryDir][0] == -dirmap[i][0] && -dirmap[entryDir][1] == dirmap[i][1]){
        console.log("dir "+i+" is opposite of "+entryDir+". So that's tile["+frontTile.x+","+frontTile.y+"] near tile["+tile.x+","+tile.y+"].");
        //player = new Player(frontTile.x, frontTile.y);
        player = new Player(tiles[frontTile.x][frontTile.y]);
        player.hp = playerHp;
        //player = new Player(randomPassableTile("gem", mapRNG));
      }
    }
    
  }
  if (entryDir < 0 || entryDir > 3){
    console.log("didn't use edge exit("+entryDir+").");
    player = new Player(randomPassableTile("gem", mapRNG));
    player.hp = playerHp;
  }
  
  /*
  for(let i=0; i<5; i++) {
    let tile = randomPassableTile(0, mapRNG)//replace with edge finder
    let frontTileType = Floor;
    let frontTile = tiles[tile.x][tile.y];
    //let frontTileType = Vent;
    switch (i) {
      case 0:
        tile = tiles[numTiles/2][numTiles-2];
        //tile.replace(Pit);//Works
        //tile = new Pit(tile.x, tile.y);//Doesn't work
        tiles[tile.x][tile.y] = new Exit(tile.x, tile.y, 0, -1, i);
        //tiles[tile.x][tile.y-1].replace(frontTileType);
        frontTile = tiles[tile.x][tile.y-1]
        frontTile.replace(frontTileType);
        if(entryDir == i) player = new Player(frontTile);
        break;
      case 1:
        tile = tiles[0+1][numTiles/2];
        tiles[tile.x][tile.y] = new Exit(tile.x, tile.y, -1, 0, i);
        frontTile = tiles[tile.x+1][tile.y]
        frontTile.replace(frontTileType);
        if(entryDir == i) player = new Player(frontTile);
        break;
      case 2:
        tile = tiles[numTiles/2][0+1];
        tiles[tile.x][tile.y] = new Exit(tile.x, tile.y, 0, 1, i);
        tiles[tile.x][tile.y+1].replace(frontTileType);
        frontTile = tiles[tile.x][tile.y+1]
        frontTile.replace(frontTileType);
        if(entryDir == i) player = new Player(frontTile);
        console.log("case 2");
        break;
      case 3:
        tile = tiles[numTiles-2][numTiles/2];
        tiles[tile.x][tile.y] = new Exit(tile.x, tile.y, 1, 0, i);
        tiles[tile.x-1][tile.y].replace(frontTileType);
        frontTile = tiles[tile.x-1][tile.y]
        frontTile.replace(frontTileType);
        if(entryDir == i) player = new Player(frontTile);
        console.log("Why? a"+ tile.x +" v:"+ tile.y +" c:"+ entryDir +"");
        break;
      case 4:
        tile = randomPassableTile(0, mapRNG)
        tiles[tile.x][tile.y] = new Exit(tile.x, tile.y, mapRNG.getUniformInt(-10,10), mapRNG.getUniformInt(-10,10));
        if(entryDir == i || -1) player = new Player(randomPassableTile("gem", mapRNG));
        console.log("case 4");
        break;
      default:
        tile = randomPassableTile(0, mapRNG)
        player = new Player(randomPassableTile("gem", mapRNG));
        console.log("default");
        break;
    }
    //tile.replace(Exit);
    //tiles[tile.x][tile.y] = new Exit(tile.x, tile.y, 2, 2);
    //tile.exitdir = i;
    //randomPassableTile(0, gRNG).replace(Exit);
    //randomPassableTile(0, mapRNG).replace(Exit);
  }

  //player = new Player(randomPassableTile("gem", mapRNG));
  //player = new Player(randomPassableTile("gem", mapRNG));
  //player.hp = 3;
  
  */
  /*
  let tile = randomPassableTile(0, mapRNG)//replace with edge finder
  let frontTileType = Floor;
  let frontTile = tiles[tile.x][tile.y];
  tile = tiles[numTiles/2][numTiles-2];
  //tile.replace(Pit);//Works
  //tile = new Pit(tile.x, tile.y);//Doesn't work
  tiles[tile.x][tile.y] = new Exit(tile.x, tile.y, 0, -1, 0);
  //tiles[tile.x][tile.y-1].replace(frontTileType);
  frontTile = tiles[tile.x][tile.y-1];
  frontTile.replace(frontTileType);
  if(entryDir == 2) player = new Player(frontTile.x, frontTile.y);
  
  tile = tiles[0+1][numTiles/2];
  tiles[tile.x][tile.y] = new Exit(tile.x, tile.y, -1, 0, 1);
  frontTile = tiles[tile.x+1][tile.y];
  frontTile.replace(frontTileType);
  if(entryDir == 3) player = new Player(frontTile);
  
  tile = tiles[numTiles/2][0+1];
  tiles[tile.x][tile.y] = new Exit(tile.x, tile.y, 0, 1, 2);
  tiles[tile.x][tile.y+1].replace(frontTileType);
  frontTile = tiles[tile.x][tile.y+1];
  frontTile.replace(frontTileType);
  if(entryDir == 0) player = new Player(frontTile);
  
  tile = tiles[numTiles-2][numTiles/2];
  tiles[tile.x][tile.y] = new Exit(tile.x, tile.y, 1, 0, 3);
  tiles[tile.x-1][tile.y].replace(frontTileType);
  frontTile = tiles[tile.x-1][tile.y];
  frontTile.replace(frontTileType);
  if(entryDir == 1) player = new Player(frontTile);
  console.log("Why? a"+ tile.x +" v:"+ tile.y +" c:"+ entryDir +"");
  
  tile = randomPassableTile(0, mapRNG);
  tiles[tile.x][tile.y] = new Exit(tile.x, tile.y, mapRNG.getUniformInt(-10,10), mapRNG.getUniformInt(-10,10), 4);
  if(entryDir == 4 || entryDir == -1) player = new Player(randomPassableTile("gem", mapRNG));
  console.log("case 4");
  */
  //player = new Player(randomPassableTile("gem", mapRNG));
  
  console.log("map gen all done with seeds: m:"+ mapRNG.getSeed() +" r:"+ ROT.RNG.getSeed() +" w:"+ worldRNG.getSeed() +"");
  console.log("RNG states are: m:"+ mapRNG.getState() +" r:"+ ROT.RNG.getState() +" w:"+ worldRNG.getState() +"");
  rngLog = mapRNG.getState();
  console.groupEnd();
  
  //console.log("mapgen done(seed:"+ mapRNG.getSeed() +")");
  console.groupEnd();
  
  gameState = "running";
  levelturn = 0;
  gemMax = charges + gemCount();
}

function drawText(text, size, centered, textY, color){
  ctx.fillStyle = color;
  ctx.font = size + "px monospace";
  let textX;
  if(centered){
    textX = (canvas.width-ctx.measureText(text).width)/2;
  }else{
    textX = canvas.width-uiWidth*tileSize+25;
  }

  ctx.fillText(text, textX, textY);
}

function getRecords(){
  if(localStorage["records"]){
    return JSON.parse(localStorage["records"]);
  }else{
    return [];
  }
}

function addRecords(charges, won){
  let records = getRecords();
  let recordObject = {runes: charges, loop: 1, depth: level, turn: turn, casts: 0, totalScore: charges+level, active: won, run: records.length+1};
  let lastRecord = records.pop();

  if(lastRecord){
    if(lastRecord.active){
      recordObject.loop = lastRecord.loop+1;
      recordObject.totalScore += lastRecord.totalScore;
      //recordObject.depth += lastRecord.depth;
    }else{
      records.push(lastRecord);
    }
  }
  records.push(recordObject);

  localStorage["records"] = JSON.stringify(records);
}

function drawScores(){
  let records = getRecords();
  if(records.length){
    drawText(
      rightPad(["RUN","LOOP","RUNES","LEVEL","TOTAL","TURNS"]),
      18,
      true,
      canvas.height/2,
      "white"
    );

    let newestScore = records.pop();
    records.sort(function(a,b){
        return b.totalScore - a.totalScore;
    });
    records.unshift(newestScore);

    for(let i=0;i<Math.min(10,records.length);i++){
      let scoreText = rightPad([records[i].run, records[i].loop, records[i].runes, records[i].depth, records[i].totalScore, records[i].turn]);
      drawText(
        scoreText,
        18,
        true,
        canvas.height/2 + 24+i*24,
        i == 0 ? "aqua" : "violet"
      );
    }
  }
}

function screenshake(){
  if(shakeAmount){
    shakeAmount--;
  }
  let shakeAngle = Math.random()*Math.PI*2;
  shakeX = Math.round(Math.cos(shakeAngle)*shakeAmount);
  shakeY = Math.round(Math.sin(shakeAngle)*shakeAmount);
}

function initSounds(){
  sounds = {
    hit1: new Audio('sounds/hit1.wav'),
    hit2: new Audio('sounds/hit2.wav'),
    treasure: new Audio('sounds/charge.wav'),
    newLevel: new Audio('sounds/newLevel.wav'),
    spell: new Audio('sounds/spell.wav'),
    step: new Audio('sounds/step6.wav'),
    stepliquid: new Audio('sounds/step3.wav'),
    blip: new Audio('sounds/Blip.wav'),
    buzz: new Audio('sounds/buzz2.wav'),
    growl: new Audio('sounds/grr.wav'),
    no: new Audio('sounds/no.wav'),
  };

  let mons = ["Slime", "Spider", "Wolfpup", "Wolf", "Crystal", "Wasp", "Goblin", "Hobgoblin", "Fleshball", "Fleshegg", "Rabbit", "Bunny", "Shade", "Snake"];
  console.log("Setting up audio for monsters, some file not found errors expected.");
  //file not found errors aren't JS errors so can't handle them afaict.
  for(let i=0;i<mons.length;i++){
    sounds['hit1'+mons[i]] = new Audio('sounds/hit'+mons[i]+'.wav');
    sounds['hit2'+mons[i]] = new Audio('sounds/hit2'+mons[i]+'.wav');
    /*
    try{
    }catch (e){console.log("404 "+'sounds/hit'+mons[i]+'.wav');}
    */
  }
}

/*
Something I remembered but not sure if relevant
https://www.dr-lex.be/info-stuff/volumecontrols.html
https://www.reddit.com/r/programming/comments/9n2y0/comment/c0dhl3x/?utm_source=share&utm_medium=web2x&context=3
since this isn't a volume slider.
*/
//Do I need volume parameter separately from sourceTile? In theory useable but doesn't seem necessary.
//function playSound(soundName, sourceTile = false){
function playSound(soundName, sourceTile = false, voladjust = 0){
  sounds[soundName].currentTime = 0;
  //Reduce sound volume based on distance to player
  //1-(dist/16) so -0.625 per tile.
  /*
  */
  if (sourceTile && player) {
    //check if we've already played this sound closer up.
    //Should look into if there's a way to play same audio multiple times
    let soundDistance = sourceTile.dist(player.tile)
    if (!soundsplayed[soundName+"Distance"]) {
      soundsplayed[soundName+"Distance"] = 999;
      soundsplayed[soundName+"Count"] = 1; //Not used, could do something with this.
    }else soundsplayed[soundName+"Count"]++;
    if (soundsplayed[soundName+"Distance"] > soundDistance){
      soundsplayed[soundName+"Distance"] = soundDistance
      let vol = Math.max(1-(soundDistance/16), 0.01)
      //console.log("Playing positional sfx:"+soundName+", distance between "+player.tile.x+", "+player.tile.y+" and "+sourceTile.x+", "+sourceTile.y+" is "+soundDistance+" so sound volume is set to "+vol);
      if (voladjust) vol = Math.min(vol*voladjust, 1)
      sounds[soundName].volume = vol;
      soundsplayed[soundName+"Vol"] = vol;
    }//else{console.log("Skipped more distant "+soundName+" sound, soundsplayed:"+JSON.stringify(soundsplayed));}
  }else{
    sounds[soundName].volume = 1;
    soundsplayed[soundName+"Distance"] = 0;
    soundsplayed[soundName+"Count"] = 1;
    soundsplayed[soundName+"Vol"] = 1;
  }
  //setTimeout(sounds[soundName].play(), randomRange(20,100));
  sounds[soundName].play();
  
}