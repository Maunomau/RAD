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

//Draw rune without scaling it based on tilesize
function drawRune(x, y, runeimg=art.runes[Object.keys(art.runes)[0]], elementorsth=0){
  ctx.drawImage(
    runeimg,
    x*tileSize + shakeX + tileSize/2-8,//centers rune assuming runeimgs are 16x16
    y*tileSize + shakeY + tileSize/2-8,
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
      //ctx.fillStyle = 'rgba(0, 0, 0, '+darkness+')';
      //ctx.fillRect(0, 0, numTiles*tileSize, numTiles*tileSize);
    }
    
    
    if (monsters[0]){
      for(let i=0;i<monsters.length;i++){
        monsters[i].draw();
      }
    }
    //drawSprite(0, x, y);
    player.draw();
    
    drawText("Score:"+totalCharge+"/"+runeTypesTotal+"", tileSize/2, false, 25, "violet");
    drawText("Day:"+day+" t:"+time+"", tileSize/2, false, 45, "violet");
    if(player.tile.maincircle >= 0 && circle[player.tile.maincircle].found){
      drawText(""+runeinv.length+"/"+gemMax+" "+circle[player.tile.maincircle].runesChargedWith.length+"/"+circle[player.tile.maincircle].maxCharge, tileSize/2, false, 65, "violet");
    }else if (player.tile.exit) {
      drawText(""+runeinv.length+"/"+gemMax+" ("+player.tile.exitRuneCount+")", tileSize/2, false, 65, "violet");
    }else drawText(""+runeinv.length+"/"+gemMax, tileSize/2, false, 65, "violet");
    
    let lasti = 0;
    let spellColor = "aqua";
    let spellList = structuredClone(player.spells);//clone to prevent actually gaining the free spell
    if(player.freeSpell && !spellList.includes(player.freeSpell)) spellList.push(player.freeSpell);
    for(let i=0; i<spellList.length; i++){
      let spellText = (i+1) + "." + (spellList[i] + "("+spells[spellList[i]].cost+","+spells[spellList[i]].droptime+")" || "");
      if(spellList[i] == player.freeSpell) {
        spellColor = "khaki";
        spellText = (i+1) + "." + (spellList[i] || "");
      }
      else if((shiftMode && i <= 9) || (!shiftMode && i > 9)) spellColor = "grey";
      else spellColor = "aqua";
      drawText(spellText, tileSize/2, false, 85+i*(tileSize-10), spellColor);
      lasti = i+1;
    }
    if (turn > leapturn+leapcd) spellColor = "khaki";
    else spellColor = "grey";
    drawText("F.LEAP", tileSize/2, false, 85+lasti*(tileSize-10), spellColor);
    
    if(gameState == "dead") {
      drawText("You have been defeated.", 30, true, canvas.height/2 - 55, "white");
      drawText("Press C to continue on the next day,", 20, true, canvas.height/2 - 25, "white");
      drawText("Press Z to pass a turn.", 20, true, canvas.height/2, "white");
      drawText("Press anything else to restart the game.", 20, true, canvas.height/2 + 25, "white");
    }
    if(waitForInputToTick || (gameState == "running" && turnMsg)){
      drawText(turnMsg, 30, true, canvas.height/2 - 155, "white");
    }
  }
}

function tick(needConfirm = false, msg = "You are incapacitated."){
  if(needConfirm == true){
    turnMsg = msg;
    waitForInputToTick = true;
    console.log("%cPassed turn.("+turnMsg+")", "color:grey");
  }else{
    //reset seeCount, unused atm.
    tiles.forEach(el => {
      el.forEach(tile => {
        tile.seeCount = 0;
      })
    });
    
    //console.log("%cTick, confirm needed?"+needConfirm+".", "color:grey");
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
    
    player.update();//removes turnMsg without waitForInputToTick
    player.vision();
    
    if(player.dead){
      while(runeinv.length){
        runes[runeinv[0]].timer = 0;
        let rtile = randomCrawlableTile(0)
        releaseRune(rtile.x, rtile.y, 0);
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
      //addRecords(runeinv.length, false);
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
    gemMax = runeinv.length + gemCount();
    
    
    //
    if (rngLog[0] != mapRNG.getState()[0]){
      console.warn("MapRNG changed!:"+ mapRNG.getState()[0] +"");
      console.log("MapRNG was:"+ rngLog[0] +"");
      rngLog = mapRNG.getState();
    }
  }
  
  fov = new ROT.FOV.RecursiveShadowcasting(lightPasses);
  
  
}

function passTime(){
  time++;
  
  if (time > timeInDay) {
    
    if("porthome on dayend" == "yes"){
      //drop runes
      while(runeinv.length){
        let rtile = randomCrawlableTile(0)
        let delay = 2;
        releaseRune(rtile.x, rtile.y, delay);
        //console.warn("Dropped a rune!"+"");
      }
      wpos[0] = 14;
      wpos[1] = 14;
      savedPlayer = player;
      this.monster = null;
      startLevel(-1, player.hp);
    }
    hunterTimer = -1;
    leapcd -= timeInDay;
    day++;
    time = 0;
    //darkness = 0;
  }
  
  //darkness = Math.floor(time/8) / Math.floor(timeInDay/8)
  if(day == levelday){//maintains full darkness until player leaves a level
    switch(Math.floor((time/timeInDay)*10)) {
      case 0://
        darkness = 0.25;
        //spawnMonster(Fleshegg);
        break;
      case 1: darkness = 0; break;
      case 2: darkness = 0; break;
      case 3: darkness = 0; break;
      case 4: darkness = 0; break;
      case 5: darkness = 0.25; break;
      case 6: darkness = 0.5; break;
      case 7: darkness = 0.5; break;
      case 8: darkness = 0.65; break;
      case 9: darkness = 0.65; break;
      case 10: 
        darkness = 1; 
        shakeAmount = 30;
        break;
    }
  }
  darknessVision = Math.floor(10-darkness*10);
  if(player.sightRange != darknessVision){
    player.sightRange = darknessVision;
  }
  
  //night time events
  //spawn hunter at exit if timer is out
  if(hunterTimer > 0) hunterTimer--;
  if(time >= timeInDay/2 && hunterTimer == 0 && hunterPresent == false){
    console.log("hunter follows");
    
    dirs = [
      tiles[Math.floor(numTiles/2)][numTiles-2],
      tiles[0+1][Math.floor(numTiles/2)],
      tiles[Math.floor(numTiles/2)][0+1],
      tiles[numTiles-2][Math.floor(numTiles/2)],
    ]; //Oh, this is global and doesn't seem to vary. But just in case setting it again
    if(hunterDir==0){
      spawnMonster(Fleshball, 2, dirs[2]);//exit dir is opposite of entry one
    }else if(hunterDir==1){
      spawnMonster(Fleshball, 2, dirs[3]);
    }else if(hunterDir==2){
      spawnMonster(Fleshball, 2, dirs[0]);
    }else if(hunterDir==3){
      spawnMonster(Fleshball, 2, dirs[1]);
    }else{
      spawnMonster(Fleshball, 2, randomWaterTile(gRNG));
    }
    hunterTimer = -1;
  }
  //after half way through day, every 45 turns
  if(time >= timeInDay/2 && time % 45 == 0 && wpos != [14, 14, 10, 0] && (wpos[0] != 14 || wpos[1] != 14 ) ){
    //cast QUAKE, or I could just copy what it does here
    console.log("world shakes");
    for(let i=0; i<numTiles; i++){
      for(let j=0; j<numTiles; j++){
        let tile = getTile(i,j);
        if(tile.constructor.name == "Wall"){
          //tile.replace(Floor);
          let numWalls = 4 - tile.getAdjacentPassableNeighbors().length;
          if (numWalls < 3 && gRNG.getUniform() < 0.25){
            tile.replace(Floor);
          }
        }else if(tile.constructor.name == "Floor" && gRNG.getUniform() < 0.05){
          tile.replace(Pool);
        }else if(tile.monster && !tile.monster.flying){
          if(gRNG.getUniform < 0.5) tile.monster.hit(1) = true;//Chance of breaking flesheggs already around.
          tile.monster.stunned = true;
        }
      }
    }
    shakeAmount = 20;
    if(hunterPresent == false){
      //spawnMonster(Fleshegg, 0, tile = randomPassableTile(0, gRNG);
      let waterTile = randomWaterTile(gRNG);
      //spawnMonster(Fleshegg, 0, waterTile);
      let monster = new Fleshegg(waterTile, Fleshball, 45);
      monster.teleportCounter = 0;
      monsters.push(monster);
    }
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
  //if(time <= 5 || time == 60 || time == 40 || time == 20) spawnMonster(Fleshegg, 0, randomWaterTile(gRNG));
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
  //sounds["newLevel"].play();
  if(urlInfo.search == "?v7DRL"){
    gamesettings.noFreeAttacks = false;
    gamesettings.freeHeals = true;
    gamesettings.disableFoV = true;//make enemies also not care about it?
    gamesettings.oldDarkness = true;
    gamesettings.senseMelee = false;
    gamesettings.runeSight = false;
    gamesettings.smallMap = false;
    runeTypesTotal = 128;
    wpos = [14,11,10,0];//world position, x,y,z,plane
    gamesettings.bedrest = false;
    gamesettings.optionTBD2 = false;
    gamesettings.optionTBD3 = false;
    gamesettings.optionTBD4 = false;
    gamesettings.optionTBD5 = false;
    gamesettings.optionTBD6 = false;
  }else if(urlInfo.search.includes("?gs=" && urlInfo.search.length > 9)){
    let urlsettings = urlInfo.search;
    gamesettings.noFreeAttacks = parseInt(urlsettings[4]);
    gamesettings.freeHeals = parseInt(urlsettings[5]);
    gamesettings.disableFoV = parseInt(urlsettings[6]);
    gamesettings.oldDarkness = parseInt(urlsettings[7]);
    gamesettings.senseMelee = parseInt(urlsettings[8]);
    gamesettings.runeSight = parseInt(urlsettings[9]);
    gamesettings.smallMap = parseInt(urlsettings[10]);
    if(gamesettings.smallMap) {
      runeTypesTotal = 64;
      wpos = [14,12,10,0];
    }else {
      runeTypesTotal = 128;
      wpos = [14,11,10,0];
    }
    gamesettings.bedrest = parseInt(urlsettings[11]);
    gamesettings.optionTBD2 = parseInt(urlsettings[12]);
    gamesettings.optionTBD3 = parseInt(urlsettings[13]);
    gamesettings.optionTBD4 = parseInt(urlsettings[14]);
    gamesettings.optionTBD5 = parseInt(urlsettings[15]);
    gamesettings.optionTBD6 = parseInt(urlsettings[16]);
  }else{
    gamesettings.noFreeAttacks = true;
    gamesettings.freeHeals = false;
    gamesettings.disableFoV = false;
    gamesettings.oldDarkness = false;
    gamesettings.senseMelee = true;//while not knowing for sure if enemy is right behind you or not can be nice it's easily confusing and being able to hear creatures at so close makes sense. // TODO: don't reveal what creature unless you look.
    gamesettings.runeSight = true;
    gamesettings.smallMap = true;
    runeTypesTotal = 64;
    wpos = [14,12,10,0];//world position, x,y,z,plane
    gamesettings.bedrest = true;
    gamesettings.optionTBD2 = true;
    gamesettings.optionTBD3 = true;
    gamesettings.optionTBD4 = true;
    gamesettings.optionTBD5 = true;
    gamesettings.optionTBD6 = true;
  }
  totalCharge = 0;
  spellSlots = [];//player.spells are set to this.
  spellsCast = 0;
  worldSeed = ROT.RNG.getUniformInt(1,100000);
  worldRNG.setSeed(worldSeed)
  wTiles = [];
  generateWorld()
  //wpos = [14,11,10,0];//world position, x,y,z,plane
  savedMaps = {};
  circlesFound = 0;
  cwarp = 4;
  //wpos = [14,14,10,0];
  runeinv = [];
  turn = 0;
  levelturn = 0;
  numSpells = 0;
  seenMons = new Set();
  usedRunes = [];
  leapturn = -100;
  hunterTimer = -1;
  hunterDir = false;
  
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
  //sounds["newLevel"].play();
  wpos = [14,14,10,0];//world position, x,y,z,plane
  //wpos = lastCircle ??? //not sure how to do this
  lastCircle = -1;//Last circle player was on(for warping to in some situations)
  runeinv = [];
  if(advanceTimeOnDefeat) turn = 0;
  levelturn = 0;
  if(advanceTimeOnDefeat) day++;
  if(advanceTimeOnDefeat) time = 0;
  
  lastGemCount = -1;
  gemid = 0;
  leapturn = -100;
  hunterTimer = -1;
  hunterDir = false;
  
  startLevel(-1, startingHp);
  //gameState = "mapgen";
}


function startLevel(entryDir, playerHp=3){
  spawnRate = 30;
  spawnCounter = spawnRate;
  
  generateLevel(entryDir, playerHp);
  
  gameState = "running";
  levelturn = 0;
  levelday = day;
  hunterPresent = false;
  gemMax = runeinv.length + gemCount();
  
  fov = new ROT.FOV.RecursiveShadowcasting(lightPasses);//how often should this run? Every tick would be safest but only when map changes in some way could work. Though I'm not seeing any issues with just this, should investigate.
  //seems like at least hunter following causes issues with just this, added this to tick() to hopefully fix that
  player.vision();
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
      let scoreText = rightPad([records[i].run, records[i].loop-1, records[i].runes, records[i].day, records[i].totalScore, records[i].turn, records[i].casts, records[i].dmg]);
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
    weak: new Audio('sounds/weak.wav'),
    circleFound: new Audio('sounds/circleFound.wav'),
    circleCharge1: new Audio('sounds/circleCharge1.wav'),
    circleCharge2: new Audio('sounds/circleCharge2.wav'),
    circleCharge3: new Audio('sounds/circleCharge3.wav'),
    leap: new Audio('sounds/leap.wav'),
    slip: new Audio('sounds/slip3.wav'),
    weave: new Audio('sounds/weave.wav'),
    webstuck: new Audio('sounds/weave.wav'),//todo
    slorch: new Audio('sounds/slorch.wav'),
    hatch: new Audio('sounds/unpa1.wav'),
    splash: new Audio('sounds/splash2.wav'),
  };

  //let mons = ["Slime", "Spider", "Wolfpup", "Wolf", "Crystal", "Wasp", "Goblin", "Hobgoblin", "Fleshball", "Fleshegg", "Rabbit", "Bunny", "Shade", "Snake"];
  let mons = ["Slime", "Spider", "Wolfpup", "Wolf", "Crystal", "Wasp", "Goblin", "Hobgoblin", "Fleshball", "Fleshegg", "Rabbit", "Bunny", "Shade"];
  //console.log("Setting up audio for monsters, some file not found errors expected.");
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
      vol = vol*gameVolume;
      sounds[soundName].volume = vol;
      soundsplayed[soundName+"Vol"] = vol;
    }//else{console.log("Skipped more distant "+soundName+" sound, soundsplayed:"+JSON.stringify(soundsplayed));}
  }else{
    sounds[soundName].volume = 1*gameVolume;
    soundsplayed[soundName+"Distance"] = 0;
    soundsplayed[soundName+"Count"] = 1;
    soundsplayed[soundName+"Vol"] = 1;
  }
  //setTimeout(sounds[soundName].play(), randomRange(20,100));
  sounds[soundName].play();
  
}