function setupCanvas(){
  canvas = document.querySelector("canvas");
  ctx = canvas.getContext("2d");

  canvas.width = tileSize*(numTiles+uiWidth);
  canvas.height = tileSize*numTiles;
  canvas.style.width = canvas.width + 'px';
  canvas.style.height = canvas.height + 'px';
  ctx.imageSmoothingEnabled = false;
}
function drawTile(tile, x, y, sheet=tileset, sheetwidth=4){
  ctx.drawImage(
    sheet,
    (tile%sheetwidth)*16,
    Math.floor(tile/sheetwidth)*16,
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
    y*tileSize + shakeY-9,
    tileSize,
    tileSize
  );
}

function draw(){
  if(gameState == "running" || gameState == "dead"){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    //{background-color: rgb(255, 0, 0);}
    screenshake();
    
    for(let i=0;i<numTiles;i++){
      for(let j=0;j<numTiles;j++){
        getTile(i,j).draw();
      }
    }
    /*
    */
    if (darkness) {
      ctx.fillStyle = 'rgba(0, 0, 0, '+darkness+')';
      ctx.fillRect(0, 0, numTiles*tileSize, numTiles*tileSize);
    }
    
    
    if (monsters[0]){
      for(let i=0;i<monsters.length;i++){
        monsters[i].draw();
      }
    }
    //drawSprite(0, x, y);
    player.draw();
    
    drawText("Score:"+totalCharge+" "+""+"", tileSize/2, false, 25, "violet");
    drawText("Day:"+day+" t:"+time+"", tileSize/2, false, 45, "violet");
    drawText("Runes:"+runeinv.length+"/"+gemMax, tileSize/2, false, 65, "violet");
    
    let spellColor = "aqua";
    for(let i=0; i<player.spells.length; i++){
      if((shiftMode && i <= 9) || (!shiftMode && i > 9)) spellColor = "grey";
      else spellColor = "aqua";
      let spellText = (i+1) + "." + (player.spells[i] + "("+spells[player.spells[i]].cost+","+spells[player.spells[i]].droptime+")" || "");
      drawText(spellText, tileSize/2, false, 85+i*(tileSize-10), spellColor);
    }
    
    if(gameState == "dead") {
      drawText("You have been defeated.", 30, true, canvas.height/2 - 55, "white");
      drawText("Press C to continue on the next day,", 20, true, canvas.height/2 - 25, "white");
      drawText("Press Z to pass a turn.", 20, true, canvas.height/2, "white");
      drawText("Press anything else to restart the game.", 20, true, canvas.height/2 + 25, "white");
    }
  }
}

function tick(){
  soundsplayed = {} //(soundname: distance)Used to avoid more distant sounds replacing closer ones.
  //iterate over monsters(including player) (importantly in reverse so they can be safely deleted)
  //adjust for knocking out
  if(!haste){
    passTime();
    dropRunes();
  }
  for(let k=monsters.length-1;k>=0;k--){
    if(!monsters[k].dead){
      monsters[k].update();
    }else{
      monsters.splice(k,1);
    }
  }
  
  player.update();
  
  if(player.dead){
    while(runeinv.length){
      runes[runeinv[0]].timer = 0;
      let rtile = randomCrawlableTile(0)
      runes[runeinv[0]].x = rtile.x;
      runes[runeinv[0]].y = rtile.y;
      runes[runeinv[0]].wx = wpos[0];
      runes[runeinv[0]].wy = wpos[1];
      runes[runeinv[0]].holder = false;
      wTiles[wpos[0]][wpos[1]].runes.push(runeinv.shift());
    }
    dropRunes();
    //Unseal sealedMons
    if(sealedMons){
      while(sealedMons.length > 0){
        //let tile = randomPassableTile();
        //sealedMons[sealedMons.length-1].tile = tile;
        //monsters.push(sealedMons.pop());//This just look like it works for the turn
        spawnMonster(eval(sealedMons[0].constructor.name), 1, tile = randomPassableTile("exit", gRNG), gRNG);
        sealedMons.shift()
      }
    }
    if (capturedMons) {
      while(capturedMons.length > 0){
        spawnMonster(eval(capturedMons.shift().constructor.name), 1, tile = randomPassableTile("exit", gRNG), gRNG);
      }
    }
    addRecords(runeinv.length, false);
    gameState = "dead";
  }
  /* spawn monsters, should adjust for knocking out and breeding */
  //spawnCounter--;//disabled at least for now.
  if(spawnCounter <= 0){
      spawnMonster();
      spawnCounter = spawnRate;
      spawnRate--;
  }
  if(haste) haste--
  
  turn++;
  levelturn++;
  gemMax = runeinv.length + usedRunes.length + gemCount();
  
  
  
  //
  if (rngLog[0] != mapRNG.getState()[0]){
    console.warn("MapRNG changed!:"+ mapRNG.getState()[0] +"");
    console.log("MapRNG was:"+ rngLog[0] +"");
    rngLog = mapRNG.getState();
  }
}

function passTime(){
  time++;
  
  if (time > timeInDay) {
    
    //drop runes
    while(runeinv.length){
      runes[runeinv[0]].timer = 2;
      let rtile = randomCrawlableTile(0)
      runes[runeinv[0]].x = rtile.x;
      runes[runeinv[0]].y = rtile.y;
      runes[runeinv[0]].wx = wpos[0];
      runes[runeinv[0]].wy = wpos[1];
      runes[runeinv[0]].holder = false;
      wTiles[wpos[0]][wpos[1]].runes.push(runeinv.shift());
      //console.warn("Dropped a rune!"+"");
    }
    
    wpos[0] = 14;
    wpos[1] = 14;
    savedPlayer = player;
    this.monster = null;
    startLevel(-1, player.hp);
    
    day++;
    time = 0;
    darkness = 0;
  }
  
  //darkness = Math.floor(time/8) / Math.floor(timeInDay/8)
  switch(Math.floor((time/timeInDay)*10)) {
    case 0://
      darkness = 0;
      //spawnMonster(Fleshegg);
      break;
    case 1: darkness = 0.25; break;
    case 2: darkness = 0; break;
    case 3: darkness = 0; break;
    case 4: darkness = 0; break;
    case 5: darkness = 0.25; break;
    case 6: darkness = 0.5; break;
    case 7: darkness = 0.5; break;
    case 8: darkness = 0.65; break;
    case 9: darkness = 1; break;
    case 10: darkness = 1; break;
  }
  if(time >= timeInDay/2 && time % 45 == 0){
    //cast QUAKE, or I could just copy what it does here
    for(let i=0; i<numTiles; i++){
      for(let j=0; j<numTiles; j++){
        let tile = getTile(i,j);
        if(tile.constructor.name == "Wall"){
          //tile.replace(Floor);
          let numWalls = 4 - tile.getAdjacentPassableNeighbors().length;
          if (numWalls < 3 && gRNG.getUniform() < 0.25){
            tile.replace(Floor);
          }
        }else if(tile.monster && !tile.monster.flying){
          if(gRNG.getUniform < 0.5) tile.monster.hit(1) = true;//Chance of breaking flesheggs already around.
          tile.monster.stunned = true;
        }
      }
    }
    shakeAmount = 20;
    //spawnMonster(Fleshegg, 0, tile = randomPassableTile(0, gRNG);
    spawnMonster(Fleshegg, 0, randomWaterTile(gRNG));
  }
  if(time == 2){
    //spellSlots.push("SEAL");
    //spellSlots.push("CAPTURE");
    //spellSlots.push("HASTE");
    //spellSlots.push("RELOCATE");
    //spellSlots.push("BLINK");
    //spellSlots.push("WALL");
    //spellSlots.push("SHOVE");
  }
  //if(time == 21) spawnMonster(Fleshegg, 0, randomWaterTile(gRNG));
  console.log("time phase:"+ Math.floor((time/timeInDay)*10) +", darkness is at "+ darkness);
}


function showTitle(){
  ctx.fillStyle = 'rgba(0,0,0,.50)';
  ctx.fillRect(0,0,canvas.width, canvas.height);

  gameState = "title";
  
  
  //mapRNG.setSeed(12345);
  //worldRNG.setSeed(999);
  
  
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
  wTiles = [];
  generateWorld()
  wpos = [14,11,10,0];//world position, x,y,z,plane
  savedMaps = {};
  circlesFound = 0;
  cwarp = 4;
  //wpos = [14,14,10,0];
  level = 1;//TBR
  charges = 0;//TBR
  runeinv = [];
  totalCharge = 0;
  spellSlots = [];//player.spells are set to this.
  spellsCast = 0;
  turn = 0;
  levelturn = 0;
  numSpells = 0;
  seenMons = new Set();
  usedRunes = []
  day = 1;
  time = 0;
  lastCircle = -1;//Last circle player was on(for warping to in some situations)
  
  lastGemCount = -1;
  gemid = 0;
  
  startLevel(-1, startingHp);
  //gameState = "mapgen";
}

//hmm, not sure about this trying to be stripped down startGame, might be better to just warp player to home and advance time if that's enabled
function resumeGame(){
  //playSound("newLevel");
  sounds["newLevel"].play();
  wpos = [14,14,10,0];//world position, x,y,z,plane
  //wpos = lastCircle ??? //not sure how to do this
  lastCircle = -1;//Last circle player was on(for warping to in some situations)
  runeinv = [];
  if(advanceTimeOnDefeat) turn = 0;
  levelturn = 0;
  if(advanceTimeOnDefeat) day = 1;
  if(advanceTimeOnDefeat) time = 0;
  
  lastGemCount = -1;
  gemid = 0;
  
  startLevel(-1, startingHp);
  //gameState = "mapgen";
}


function startLevel(entryDir, playerHp=3){
  spawnRate = 30;
  spawnCounter = spawnRate;
  
  generateLevel(entryDir, playerHp);
  
  gameState = "running";
  levelturn = 0;
  gemMax = runeinv.length + gemCount();
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

function addRecords(runei, won, defeatedBy = false){
  console.log("%cAdding a record.", "color:yellow");
  let records = getRecords();
  let recordObject = {runes: totalCharge, loop: 1, day: day, turn: turn, casts: spellsCast, totalScore: totalCharge-day, dmg: dmgTaken, active: won, run: records.length+1};
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
  //console.log("hello?"+recordObject);
  //console.table(recordObject);
  records.push(recordObject);

  localStorage["records"] = JSON.stringify(records);
}

function drawScores(){
  let records = getRecords();
  //console.table(records);
  //console.log("hello?"+records);
  if(records.length){
    drawText(
      rightPad(["RUN","LOOP","RUNES","DAY","TOTAL","TURNS","CASTS","DMG"]),
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
      let scoreText = rightPad([records[i].run, records[i].loop, records[i].runes, records[i].day, records[i].totalScore, records[i].turn, records[i].casts, records[i].dmg]);
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
    circleFound: new Audio('sounds/circleFound.wav'),
    circleCharge1: new Audio('sounds/circleCharge1.wav'),
    circleCharge2: new Audio('sounds/circleCharge2.wav'),
    circleCharge3: new Audio('sounds/circleCharge3.wav'),
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