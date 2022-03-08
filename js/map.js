function generateWorld(){
  wTiles = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9, 2, 2, 2, 1, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  ]
}

function generateLevel(entryDir=-1, playerHp=3){
  console.groupEnd()
  //currentSeed = mapRNG.setSeed(worldRNG.getUniform());
  //currentSeed = worldRNG.getUniform();
  //console.warn("? "+day+" "+wpos[0]+" "+(wpos[1])+" "+(wpos[2])+" "+worldRNG.getSeed());
  //console.warn("? "+day+" "+parseInt(+wpos[0]+""+(wpos[1])+""+(wpos[2]))+" "+worldRNG.getSeed());
  
  //currentSeed = parseInt(day+""+parseInt(+wpos[0]+""+(wpos[1])+""+(wpos[2]))+""+worldRNG.getSeed());
  //currentSeed = Math.sqrt(Math.sqrt(currentSeed))+worldRNG.getSeed()
  currentSeed = (day+(wpos[0]/100)+(wpos[1]*10)+(wpos[2])+worldRNG.getSeed());
  currentSeed = ([day, wpos[0], wpos[1], wpos[2], wpos[3], worldRNG.getSeed()].join(''));
  if (savedMaps.hasOwnProperty(currentSeed)){
    console.log("map already visited "+currentSeed);
    tiles = savedMaps[currentSeed].map;
    monsters = savedMaps[currentSeed].mons;
    placeExitsAndPlayer(entryDir, playerHp, gRNG);
    return;
  }
  //console.warn("?cs "+currentSeed);
  mapRNG.setSeed(currentSeed);
  //currentSeed = JSON.parse(JSON.stringify(mapRNG.getSeed()));//ensure these are the same.
  
  //let cmsg = '"mapgen(seed:%c"+ currentSeed +"%c)", "color:green", "color:"';
  if (logUncollapseMode == "mapgen")console.group("mapgen(seed:%c"+ currentSeed +"%c)", "color:green", "color:");
  else console.groupCollapsed("mapgen(seed:%c"+ currentSeed +"%c)", "color:green", "color:");
  
  tryTo('generate map', function(){
    //let abletiles = generateTiles(wTiles[wpos[0]][wpos[1]])
    let abletiles = generateTiles(getRoomtype())
    let connectedtiles = randomPassableTile(0, mapRNG).getConnectedTiles().length//This shouldn't change anything so no need for mapRNG.
    if(abletiles != connectedtiles){
      console.warn("not all connected? "+connectedtiles+"/"+abletiles);
    }
    return true;
    //return generateTiles() == randomPassableTile().getConnectedTiles().length;
    //return generateTiles();
  });
  //console.log("mapgen done.");
  console.groupEnd()
  
  if(getRoomtype() == 1){
    monsters = [];
    
  }else{
    console.groupCollapsed("mapgen p5(%cmonsters%c).", "color:brown", "color:");
    generateMonsters();
    console.groupEnd()
    
    console.groupCollapsed("mapgen p6(%cgems%c).", "color:violet", "color:");
    placeGems();
    console.groupEnd()
  }
  
  //Save the resulting map 
  //for leaving and re-entering 
  //and to make it easier to check that the seed always generates the same map.
  //savedMaps.push({seed:structuredClone(mapRNG.getSeed), map:structuredClone(tiles), mons:structuredClone(monsters)})
  //savedMaps.push({seed:currentSeed, map:tiles, mons:monsters})
  //savedMaps.push({[currentSeed]:tiles});
  //savedMaps[currentSeed] = tiles;
  savedMaps[currentSeed] = {map:tiles, mons:monsters};
  if("clone map for some reason" == 1){
    //let test = (JSON.stringify(monsters))
    //let test2 = (JSON.stringify(tiles))
    //let test3 = JSON.parse(test)
    let test = monsters.slice();
    let test2 = Object.assign({}, tiles);
    clonedMaps.push({seed:currentSeed, map:test2, mons:test});
    console.info("cloned map "+ (clonedMaps.length-1) +"");
  }
  
  placeExitsAndPlayer(entryDir, playerHp);
  
  //console.log("map gen all done with seeds: m:"+ mapRNG.getSeed() +" r:"+ ROT.RNG.getSeed() +" w:"+ worldRNG.getSeed() +"");
  //console.log("RNG states are: m:"+ mapRNG.getState() +" r:"+ ROT.RNG.getState() +" w:"+ worldRNG.getState() +"");
  rngLog = mapRNG.getState();
  console.groupEnd();
}

function placeExitsAndPlayer(entryDir=-1, playerHp=3, rng=mapRNG){
  console.groupCollapsed("mapgen p7(%cexits%c and %cplayer%c).", "color:violet", "color:", "color:khaki", "color:");
  //console.group("mapgen p6(%cexits%c and %cplayer%c).", "color:violet", "color:", "color:khaki", "color:");
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
  let wtile1 = wTiles[wpos[0]][wpos[1]];
  console.log("This rooms type is "+wtile1+" and it's position is ["+wpos[0]+"]["+wpos[1]+"]");
  for(let i=0 ; i<dirs.length ; i++) {
    let tile = dirs[i];
    let frontTileType = Floor;
    //let frontTileType = Pit;
    let frontTile = tiles[tile.x-dirmap[i][0]][tile.y-dirmap[i][1]];
    let wtile2 = wTiles[ (wpos[0] + dirmap[i][0]) ][ (wpos[1] + dirmap[i][1]) ];
    if(wTiles[ (wpos[0] + dirmap[i][0]) ][ (wpos[1] + dirmap[i][1]) ]){
      //carve a path to the exit
      //Could probably use getAdjacentPassableNeighbors() to do this better.
      if(!tile.passable){
        while(true){
          if(frontTile.passable) break;
          else{
            tiles[frontTile.x][frontTile.y].replace(frontTileType);
            frontTile = tiles[frontTile.x-dirmap[i][0]][frontTile.y-dirmap[i][1]];//closer to center
          }
        }
      }
      //add the exit
      tiles[tile.x][tile.y] = new Exit(tile.x, tile.y, dirmap[i][0], dirmap[i][1], i);
      console.log("spawned exit in direction "+i+" leading to room type "+wtile2+" (wTiles["+(wpos[0]+dirmap[i][0])+","+(wpos[1]+dirmap[i][1])+"])");
    }else{
      console.log("no world tile in direction "+i+" wTiles["+(wpos[0]+dirmap[i][0])+","+(wpos[1]+dirmap[i][1])+"]");
    }
    
    //entryDir is opposite of i
    if(entryDir >= 0 && entryDir <= 3){
      //console.log("dir"+(dirmap[entryDir][0]+dirmap[entryDir][1])+" and entryDir"+(dirmap[i][1]+dirmap[i][0])+"");
      //Hmm, so you can tell if dir is southeast or northwest by adding and you can tell if it's north-south or east-west by checking a position
      /*console.log("dir "+i+" vs "+entryDir+
        " x="+ (dirmap[entryDir][0] == -dirmap[i][0]) +
        " y="+ (dirmap[entryDir][1] == -dirmap[i][1]) +"");
        */
      if(dirmap[entryDir][0] == -dirmap[i][0] && -dirmap[entryDir][1] == dirmap[i][1]){
        console.log("dir "+i+" is opposite of "+entryDir+". So player should be at tile["+tile.x+","+tile.y+"] near tile["+frontTile.x+","+frontTile.y+"].");
        //player = new Player(tiles[frontTile.x][frontTile.y]);
        player = new Player(tiles[tile.x][tile.y]);
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
  console.groupEnd();
  
}

function generateTiles(roomtype=2){
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


  
  for(let i=0;i<numTiles;i++){
    tiles[i] = [];
    for(let j=0;j<numTiles;j++){
      tiles[i][j] = "_";
    }
  }
  
  let floorTiles=0;
  if(roomtype == 1){
    var mapTiles = new ROT.Map.Arena(numTiles, numTiles);
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
    let circletile = tiles[numTiles/2][numTiles/2];
    console.log("test"+ circletile.getAdjacentNeighbors(mapRNG, "diagonal") +"");
    //let outertiles = getAdjacentNeighbors(mapRNG, "diagonal");//actually no shuffling or anything
    //if I felt like it I could actually make the specific circles positions random as long as corner ones and non-corner ones stay that way but that'd mean figuring out pixel offsets and doing this in a different way instead of this easy method, probably not doing that(oh, it'd also potentially mean somehow matching the circles in other rooms so yeah no).
    tiles[(numTiles/2-1)][(numTiles/2-1)].maincircle = 0;
    tiles[numTiles/2][numTiles/2-1].maincircle = 1;
    tiles[numTiles/2+1][numTiles/2-1].maincircle = 2;
    tiles[numTiles/2-1][numTiles/2].maincircle = 4;
    tiles[numTiles/2][numTiles/2].maincircle = 5;
    tiles[numTiles/2+1][numTiles/2].maincircle = 6;
    tiles[numTiles/2-1][numTiles/2+1].maincircle = 8;
    tiles[numTiles/2][numTiles/2+1].maincircle = 9;
    tiles[numTiles/2+1][numTiles/2+1].maincircle = 10;
    //circletile.getNeighbor(1, 1).maincircle = 9;
    /*
    let outertiles = [
    ];
    for(let i=0;i<outertiles.length;i++){
      
    }
    */
    
    
    
  }else{
    console.log("ROT.Map.Digger");
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
  }
  
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
  if(roomtype != 1){
    
    console.groupEnd()
    console.groupCollapsed("mapgen p2(%cwater%c).", "color:cyan", "color:");
    let count = 0;
    let types = [Pool, Puddle, Water, DeepWater];
    while(count < 4){
      let tile = randomPassableTile(0, mapRNG);
      //tiles[tile.x][tile.y] = new Pool(tile.x,tile.y);
      tiles[tile.x][tile.y].replace(types[count]);
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
  }
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
  if (passableTiles/(numTiles*numTiles) < 0.40) {
    console.warn("made only "+ passableTiles +"/"+ (numTiles*numTiles) +" passable tiles(ratio of "+ (passableTiles/(numTiles*numTiles)) +")");
  }else{
    console.info("made "+ passableTiles +"/"+ (numTiles*numTiles) +" passable tiles(ratio of "+ (passableTiles/(numTiles*numTiles)) +")");
  }
  return passableTiles;
}


function inBounds(x,y){
  return x>0 && y>0 && x<numTiles-1 && y<numTiles-1;
}

function getRoomtype(x, y){
  if (x){
    return wTiles[x][y];
  }else{
    return wTiles[wpos[0]][wpos[1]];
  }
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
    return tile.passable && !tile.monster && !tile[cond];// !tile[cond] is true when cond isn't supplied?
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

//WIP
//remake monsters array based on map.
function getMonsters(){
  monsters = [];
  /*
  tiles.forEach(el => {
    el.forEach(tile => {
      if (tile.monster) monsters.push(tile.monster);
    })
  });
  */
  
  for(let i=0;i<numTiles;i++){
    //tiles[i] = [];
    for(let j=0;j<numTiles;j++){
      if (tiles[i][j].monster) monsters.push(tile.monster);
    }
  }
}


function placeGems(){
  
  for(let i=0;i<8;i++){
    //randomPassableTile(0, mapRNG).gem = 1;
    randomPassableTile(0, mapRNG).gem = getTPW(gemid);
    gemid++;
  }
}