class Tile{
  //constructor(x, y, sprite, passable, crawlable, liquid, depth){
	constructor(x, y, sprite, passable, crawlable=true, flyable=true, liquid=0, depth=0){
    this.x = x;
    this.y = y;
    this.sprite = sprite;
    this.passable = passable;//not wall, vent or pit
    this.crawlable = crawlable;//Can be crawled on so anything but walls and pits
		this.flyable = flyable;//not wall or vent
		//There's probably a better way than to have -able flag for everything possible
		//for vents at first I wanted different opening heights but dunno if I still want that.
    this.liquid = liquid; //"water"
    this.depth = depth; //0-6
	}

  replace(newTileType){
    tiles[this.x][this.y] = new newTileType(this.x, this.y);
    return tiles[this.x][this.y];
		//copy monster over?
  }

	//manhattan distance
	dist(other){
	    return Math.abs(this.x-other.x)+Math.abs(this.y-other.y);
	}

  getNeighbor(dx, dy){
    return getTile(this.x + dx, this.y + dy)
  }

	//get nearby tiles in random order
  getAdjacentNeighbors(){
    return shuffle([
      this.getNeighbor(0, -1),
      this.getNeighbor(0, 1),
      this.getNeighbor(-1, 0),
      this.getNeighbor(1, 0)
    ]);
  }

  checkDoorway(){
			if (
				this.getNeighbor(0, -1).passable &&
				!this.getNeighbor(-1, 0).passable &&
				this.getNeighbor(0, 1).passable &&
				!this.getNeighbor(1, 0).passable ||
				!this.getNeighbor(0, -1).passable &&
				this.getNeighbor(-1, 0).passable &&
				!this.getNeighbor(0, 1).passable &&
				this.getNeighbor(1, 0).passable
			) return 1;
			else return 0;
  }

  getAdjacentPassableNeighbors(){
    return this.getAdjacentNeighbors().filter(t => t.passable);
  }

  getAdjacentCrawlable(){
    return this.getAdjacentNeighbors().filter(t => t.crawlable);
  }

  getAdjacentFlyable(){
    return this.getAdjacentNeighbors().filter(t => t.flyable);
  }

  getAdjacentVent(){
    return this.getAdjacentNeighbors().filter(t => t.constructor.name=="Vent");
  }

  getConnectedTiles(){
		//console.log("get connectedTiles.");
    let connectedTiles = [this];
    let frontier = [this];
    while(frontier.length){
      let neighbors = frontier.pop()
                              .getAdjacentPassableNeighbors()
                              .filter(t => !connectedTiles.includes(t));
      connectedTiles = connectedTiles.concat(neighbors);
      frontier = frontier.concat(neighbors);
    }
		//console.log("got "+connectedTiles.length+" connectedTiles.");
    return connectedTiles;
  }

	draw(){
    drawTile(this.sprite, this.x, this.y);
		if(this.gem){
      drawTile(5, this.x, this.y);
    }
		if(this.effectCounter){                    
      this.effectCounter--;
      ctx.globalAlpha = this.effectCounter/30;
      drawSprite(this.effect, this.x, this.y, effectsheet);
      ctx.globalAlpha = 1;
    }
  }
	
	setEffect(effectSprite){
		//console.log("Effect "+effectSprite+".");
    this.effect = effectSprite;
    this.effectCounter = 30;
  }
	
  stepOn(monster){
    if(monster.isPlayer && this.gem){
      charges++;
			
			//adjust to something better.
			if(charges % 1 == 0 && numSpells < 9){
        numSpells++;
				player.addSpell(Object.keys(spells)[numSpells-1]);
      }
			
			playSound("treasure");
      this.gem = false;
      spawnMonster();
			
			/* set graphics based on amount of runes and whether you have a belt */
			let belt = ""
			if (player.belt) belt = "belt";
			
			if (charges >= 16 && playersheet.src != 'art/player16x16'+belt+'-runed3.png'){
				playersheet.src = 'art/player16x16'+belt+'-runed3.png';
			}else if (charges >= 8 && playersheet.src != 'art/player16x16'+belt+'-runed2.png'){
				playersheet.src = 'art/player16x16'+belt+'-runed2.png';
			}else if (charges >= 4 && playersheet.src != 'art/player16x16'+belt+'-runed1.png'){
				playersheet.src = 'art/player16x16'+belt+'-runed1.png';
				console.log("Runed1.");
			}else if (charges >= 2 && playersheet.src != 'art/player16x16'+belt+'-runed0.png'){
				playersheet.src = 'art/player16x16'+belt+'-runed0.png';
				console.log("Runed0.");
			}else if (playersheet.src != 'art/player16x16'+belt+'.png'){
				playersheet.src = 'art/player16x16'+belt+'.png';
				console.log("no runed.");
			}
    }
		playSound("step", monster.Tile);
  }
}

class Floor extends Tile{
  constructor(x,y){
    super(x, y, 2, true);
    //super(x, y, 2, true, 0, "none", 0);
  };
}

class Exit extends Tile{
  constructor(x, y){
    super(x, y, 0, true);
  }

  stepOn(monster){
    if(monster.isPlayer){
			playSound("newLevel");
      if(level == numLevels){
				console.log("Win.");
				addRecords(charges, true);
        showTitle();
      }else{
        level++;
        startLevel(Math.min(maxHp, player.hp+1));
      }
    }
  }
}

class Wall extends Tile{
  constructor(x, y){
    super(x, y, 3, false, false, false);
    //super(x, y, 3, false, 0, "none", 0);
  }
}

class Vent extends Tile{
  constructor(x, y){
    super(x, y, 4, false, true, false);
    //super(x, y, 4, false, 1, "none", 0);
  }
}

class Pit extends Tile{
  constructor(x,y){
    super(x, y, 6, true);
    //super(x, y, 6, false, false, true);
  };
}

class Puddle extends Tile{
  constructor(x,y){
    super(x, y, 12, true);
    //super(x, y, 7, true, 0, "water", 1);
  };
}

class Pool extends Tile{
  constructor(x,y){
    super(x, y, 13, true);
    //super(x, y, 8, true, 0, "water", 2);
  };
}

class Water extends Tile{
  constructor(x,y){
    super(x, y, 14, true);
    //super(x, y, 8, true, 0, "water", 2);
  };
}

class DeepWater extends Tile{
  constructor(x,y){
    super(x, y, 15, true);
    //super(x, y, 8, true, 0, "water", 2);
  };
}