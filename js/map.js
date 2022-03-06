function generateLevel(lvlid){
  //currentSeed = mapRNG.setSeed(worldRNG.getUniform());
  currentSeed = worldRNG.getUniform();
  mapRNG.setSeed(currentSeed);
  currentSeed = mapRNG.getSeed();//ensure these are the same.
  console.groupCollapsed("mapgen(seed:%c"+ currentSeed +"%c)", "color:green", "color:")
  tryTo('generate map', function(){
    let abletiles = generateTiles()
    let connectedtiles = randomPassableTile(0, gRNG).getConnectedTiles().length//This shouldn't change anything so no need for mapRNG.
    if(abletiles != connectedtiles){
      console.warn("not all connected? "+connectedtiles+"/"+abletiles);
    }
    return true;
    //return generateTiles() == randomPassableTile().getConnectedTiles().length;
    //return generateTiles();
  });
  //console.log("mapgen done.");
  console.groupEnd()
  console.groupCollapsed("mapgen p5(%cmonsters and gems%c).", "color:violet", "color:");
  

  generateMonsters();
  
  for(let i=0;i<8;i++){
    randomPassableTile(0, mapRNG).gem = 1;
  }
  console.groupEnd()
  
  savedMaps.push({seed:mapRNG.getSeed, map:tiles, id:lvlid})
  console.info("saved map "+ (savedMaps.length-1) +"");
  
}

function generateTiles(){
  tiles = [];
  
  let rngState = ROT.RNG.getState();
  //Presumably no easy way to make ROT not use it's own RNG so setting it's state to mapRNG's
  ROT.RNG.setState(mapRNG.getState());
  //console.log("starting map gen with seed: "+ mapRNG.getSeed() +"");
  /*
  Seeding would reset the state which we don't want... Or wait, what if before each mapgen we set seed using worldRNG?
  That way we can store just the seed for level.
  */
  ROT.RNG.setSeed(currentSeed);
  
  
  console.groupCollapsed("mapgen p1(ROT.Map).");
  console.info("starting seeds: m:"+ mapRNG.getSeed() +" r:"+ ROT.RNG.getSeed() +" w:"+ worldRNG.getSeed() +"");
  console.info("RNG states are: m:"+ mapRNG.getState() +" r:"+ ROT.RNG.getState() +" w:"+ worldRNG.getState() +"");
  console.log("ROT.Map.Digger");


  
  for(let i=0;i<numTiles;i++){
    tiles[i] = [];
    for(let j=0;j<numTiles;j++){
      tiles[i][j] = "_";
    }
  }
  
  let floorTiles=0;
  var mapTiles = new ROT.Map.Digger(numTiles, numTiles, {
    roomWidth:[2,5], 
    roomHeight:[2,5],  
    corridorLength:[1, 4], 
    dugPercentage:0.9
  });
  var userCallback = function(x, y, value) {
    //SHOW(ROT.Util.format("Value %s generated at [%s,%s]", value, x, y));
    //console.log("mapgen stuff:"+value+" "+x+" "+y+" ");
    if (value == 0) {
      tiles[x][y] = new Floor(x,y);
      floorTiles++;
    }
    if (value == 1) tiles[x][y] = new Wall(x,y);
  }
  mapTiles.create(userCallback);
  console.info("Done. RNG states are: m:"+ mapRNG.getState() +" r:"+ ROT.RNG.getState() +" w:"+ worldRNG.getState() +"");
  mapRNG.setState(ROT.RNG.getState());
  //Give ROT.RNG back whatever state it was in before?
  ROT.RNG.setState(rngState);
  console.log("MapRNG set to ROT.RNG and ROT.RNG set to it's previous state.");
  console.log("RNG states are: m:"+ mapRNG.getState() +" r:"+ ROT.RNG.getState() +" w:"+ worldRNG.getState() +"");
  /*
  */
  /*
  //Now that we're using rot.js before this I could redo all of this to work with that.
  //What it's doing is 3 * pick a random tile, pick random neighbour until it's done that 10 times not caring if it again goes over same tile.
  //Dunno if I want to give making what I originally wanted from this a try.
  changedtiles = [];
  //Pick a random tile, make it pool
  //this is so finicky
  pooltiles = [];
  count = 1;
  while(count < 4){
    let rx = randomRange(0,numTiles)
    let ry = randomRange(0,numTiles)
    pooltiles[0] = rx+","+ry;
    //Pick a neighbour, make it pool
    while (pooltiles.length<10*count){
      switch (randomRange(1,4)) {
        case 1:
          if(ry<numTiles-1) ry++;
        case 2:
          if(rx>1) rx--;
        case 3:
          if(ry>1) ry--;
        case 4:
          if(rx<numTiles-1) rx++;
      }
      //tiles[rx][ry] = new Pit(rx,ry);
      if (pooltiles.includes(rx+","+ry)){
        //add pool anyway since things won't work if we don't
        ry++
        pooltiles.push(rx+","+ry);
      }else{
        pooltiles.push(rx+","+ry);
      }
    }
    count++;
  }
  
  */
  console.groupEnd()
  console.groupCollapsed("mapgen p2(%cwater%c).", "color:cyan", "color:");
  let count = 0;
  let types = [Pool, Puddle, Water, DeepWater];
  while(count < 4){
    tile = randomPassableTile(0, mapRNG);
    tiles[tile.x][tile.y] = new Pool(tile.x,tile.y);
    for(let i=0;i<8;i++){
      tile = tile.getAdjacentNeighbors(mapRNG)[0] //Works?
      if(getTile(tile.x,tile.y) != types[count] && inBounds(tile.x,tile.y)){
        if(getTile(tile.x,tile.y).constructor.name == "Wall" && inBounds(tile.x,tile.y)) floorTiles++;
        tiles[tile.x][tile.y].replace(types[count]);
      }
    }
    count++;
  }
  console.log("RNG states are: m:"+ mapRNG.getState() +" r:"+ ROT.RNG.getState() +" w:"+ worldRNG.getState() +"");
  
  console.groupEnd()
  console.groupCollapsed("mapgen p3(%cvents and holes%c).", "color:grey", "color:");
  
  for(let i=0;i<numTiles;i++){
    //tiles[i] = [];
    for(let j=0;j<numTiles;j++){
      //console.log("mapgen pool:"+tiles[i][j]+" "+i+" "+j+" ");
      let adjFloors = tiles[i][j].getAdjacentPassableNeighbors(mapRNG).length;
      if(mapRNG.getUniform() < 0.2 && tiles[i][j].constructor.name == "Wall" && adjFloors && tiles[i][j].getAdjacentVent(mapRNG).length < 1 && inBounds(i,j)){
        //tiles[i][j] = new Wall(i,j);
        if(tiles[i][j].constructor.name == "Wall" && inBounds(i,j)) floorTiles++;
        if (tiles[i][j].checkDoorway()) tiles[i][j].replace(Vent);
        else tiles[i][j].replace(Floor);
        //console.log("mapgen stuff:"+tiles[i][j].getAdjacentVent().length+" "+i+" "+j+" ");
        //console.log("mapgen stuff:"+JSON.stringify(tiles[i][j].getAdjacentPassableNeighbors())+" "+i+" "+j+" ");
      }else{
        //passableTiles++;
        //changedtiles.push(i+","+j)
      }
    }
  }
  console.log("RNG states are: m:"+ mapRNG.getState() +" r:"+ ROT.RNG.getState() +" w:"+ worldRNG.getState() +"");
  /*
  */
  
  console.groupEnd()
  console.groupCollapsed("mapgen p4(%ccheck passability%c).", "color:yellow", "color:");
  
  //Doing this on it's own so there's no need to think about it before.
  //The return values is used to check if the level seems ok.
  let passableTilesWrong=0;
  tiles.forEach(el => {
    el.forEach(tile => {
      if (tile.crawlable) passableTilesWrong++;
    })
  });
  
  let passableTiles=0;
  for(let i=0;i<numTiles;i++){
    //tiles[i] = [];
    for(let j=0;j<numTiles;j++){
      if (tiles[i][j].crawlable && inBounds(i,j)) passableTiles++;
    }
  }
  if (passableTiles != passableTilesWrong || passableTiles != floorTiles) {
    console.error("made a:"+passableTiles+" or b:"+passableTilesWrong+" or c:"+floorTiles+" passable tiles");
  }
  
  //console.log("made "+passableTiles+"/"+((numTiles*numTiles)-(numTiles*4-4))+" passable tiles(excluding edges), that's "+(passableTiles/(numTiles*numTiles-(numTiles*4-4))));
  if (passableTiles/(numTiles*numTiles) < 0.48) {
    console.warn("made only "+ passableTiles +"/"+ (numTiles*numTiles) +" passable tiles(ratio of "+ (passableTiles/(numTiles*numTiles)) +")");
  }else{
    console.info("made "+ passableTiles +"/"+ (numTiles*numTiles) +" passable tiles(ratio of "+ (passableTiles/(numTiles*numTiles)) +")");
  }
  return passableTiles;
}


function inBounds(x,y){
  return x>0 && y>0 && x<numTiles-1 && y<numTiles-1;
}


function getTile(x, y){
  if(inBounds(x,y)){
    return tiles[x][y];
  }else{
    return new Wall(x,y);
  }
}

//Todo: make more flexible(crawlable, don't care about monster)
function randomPassableTile(cond, rng = gRNG){
  let tile;
  tryTo('get random passable tile', function(){
    let x = randomRange(0,numTiles-1, rng);
    let y = randomRange(0,numTiles-1, rng);
    tile = getTile(x, y);
    return tile.passable && !tile.monster && !tile[cond];//!tile[cond] is true when cond isn't supplied?
  });
  return tile;
}

function randomTileWithinDistance(sourceTile, distance, type="", cond, rng = gRNG){
  let tile;
  tryTo('get tile('+type+') within a distance('+distance+')', function(){
    
    let x = sourceTile.x + randomRange(-distance,distance);
    let y = sourceTile.y + randomRange(-distance,distance);
    tile = getTile(x, y);
    if (type){
      console.log("asdWIP");
    }
    
    return tile.passable && !tile.gem;
  });
  return tile;
}

function generateMonsters(){
    monsters = [];
    let numMonsters = level+1;
    monsterType = shuffle([Slime, Spider, Wolf, Crystal, Wasp, Goblin, Hobgoblin, Fleshegg, Rabbit], mapRNG)[0];
    for(let i=0;i<numMonsters;i++){
        spawnMonster(monsterType, 1);
    }
}

function spawnMonster(type = 0, delay = -1, tile = randomPassableTile()){
    let monsterType
    if (type){
      monsterType = type
    }else{
      monsterType = shuffle([Slime, Spider, Wolf, Crystal, Wasp, Goblin, Hobgoblin, Fleshegg, Rabbit])[0];
    }
    let monster = new monsterType(tile);
    if (delay >= 0) monster.teleportCounter = delay;
    monsters.push(monster);
}