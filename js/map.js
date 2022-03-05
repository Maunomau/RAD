function generateLevel(){
  tryTo('generate map', function(){
    //return generateTiles() == randomPassableTile().getConnectedTiles().length;
    return generateTiles();
  });
  console.log("mapgen done.");
  

  generateMonsters();
  
  for(let i=0;i<8;i++){
    randomPassableTile().gem = 1;
  }
}

function generateTiles(){
  tiles = [];
  
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
  /*
  */
  
  changedtiles = [];
  //Pick a random tile, make it pool
  //this is so finicky
  pooltiles = [];
  /*
  */
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
  
  
  for(let i=0;i<numTiles;i++){
    //tiles[i] = [];
    for(let j=0;j<numTiles;j++){
      //console.log("mapgen pool:"+tiles[i][j]+" "+i+" "+j+" ");
      let adjFloors = tiles[i][j].getAdjacentPassableNeighbors().length;
      if (pooltiles.includes(i+","+j)){
        tiles[i][j] = new Pool(i,j);
        //console.log("mapgen pool:"+""+" "+i+" "+j+" ");
        //passableTiles++;
      }else if(Math.random() < 0.2 && tiles[i][j].constructor.name == "Wall" && adjFloors && tiles[i][j].getAdjacentVent().length < 1){
        //tiles[i][j] = new Wall(i,j);
        if (tiles[i][j].checkDoorway()) tiles[i][j] = new Vent(i,j);
        else tiles[i][j] = new Floor(i,j);
        //console.log("mapgen stuff:"+tiles[i][j].getAdjacentVent().length+" "+i+" "+j+" ");
        //console.log("mapgen stuff:"+JSON.stringify(tiles[i][j].getAdjacentPassableNeighbors())+" "+i+" "+j+" ");
      }else{
        //passableTiles++;
        //changedtiles.push(i+","+j)
      }
    }
  }
  
  /*
  */
  
  
  //Doing this on it's own so there's no need to think about it before.
  //The return values is used to check if the level seems ok.
  let passableTiles=0;
  tiles.forEach(el => {
    el.forEach(tile => {
      if (tile.passable) passableTiles++;
    })
  });
  console.log("made "+passableTiles+"/"+((numTiles*numTiles)-(numTiles*4-4))+" passable tiles(excluding edges), that's "+(passableTiles/(numTiles*numTiles-(numTiles*4-4))));
  //if (passableTiles/(numTiles*numTiles) < 0.5) {}
  console.log("made "+passableTiles+"/"+(numTiles*numTiles)+" passable tiles, that's "+passableTiles/(numTiles*numTiles));
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

function randomPassableTile(cond){
  let tile;
  tryTo('get random passable tile', function(){
    let x = randomRange(0,numTiles-1);
    let y = randomRange(0,numTiles-1);
    tile = getTile(x, y);
    return tile.passable && !tile.monster && !tile[cond];
  });
  return tile;
}

function randomTileWithinDistance(sourceTile, distance, type="", cond){
  let tile;
  tryTo('get tile('+type+') within a distance('+distance+')', function(){
    
    let x = sourceTile.x + randomRange(-distance,distance);
    let y = sourceTile.y + randomRange(-distance,distance);
    tile = getTile(x, y);
    if (type){
      console.log("asd");
    }
    
    return tile.passable && !tile.gem;
  });
  return tile;
}

function generateMonsters(){
    monsters = [];
    let numMonsters = level+1;
    monsterType = shuffle([Slime, Spider, Wolf, Crystal, Wasp, Goblin, Hobgoblin, Fleshegg, Rabbit])[0];
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