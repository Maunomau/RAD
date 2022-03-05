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
    for(let i=0;i<monsters.length;i++){
      monsters[i].draw();
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
  console.log("Turn:"+turn);
}

function showTitle(){
  ctx.fillStyle = 'rgba(0,0,0,.50)';
  ctx.fillRect(0,0,canvas.width, canvas.height);

  gameState = "title";
  
  RWord = ROT.RNG.getItem(["Raging", "Rampant", "Ravenous", "Restless", "Ridiculous", "Rough", "Rowdy", "Rugged", "Ruthless"]);
  
  drawText("Running Around Dressless", 48, true, canvas.height/2 - 110, "white");
  //drawText("in a Nascent Territory Full of Rowdy Monsters", 25, true, canvas.height/2 - 50, "white");
  drawText("in a Nascent Territory Full of "+RWord+" Monsters", 25, true, canvas.height/2 - 50, "white");
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
  startLevel(startingHp);
  seenMons = new Set();
  usedCharges = []

  //gameState = "mapgen";
}

//WIP
function startLevel2(playerHp){
  
  
  var seed = ROT.RNG.getSeed();

  ROT.RNG.setSeed(12345);

  console.log("RNG test: "+ROT.RNG.getUniform());
  console.log("RNG test: "+ROT.RNG.getUniform());
  console.log("RNG test: "+ROT.RNG.getNormal(0, 10));
  console.log("RNG test: "+ROT.RNG.getNormal(0, 10));
  console.log("RNG test: "+ROT.RNG.getPercentage());
  console.log("RNG test: "+ROT.RNG.getPercentage());
  errcount = 0;
  generateTiles();
  gameState = "running";
  
  try{
    //generateLevel();
    generateTiles();
    gameState = "running";
  }
  catch (error){
    console.error("test: ");
    errcount++;
    if(errcount > 200)debugger;
  }
}

function startLevel(playerHp){
  spawnRate = 15;
  spawnCounter = spawnRate;
  
  generateLevel();

  player = new Player(randomPassableTile("gem"));
  player.hp = playerHp;
  
  randomPassableTile().replace(Exit);
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