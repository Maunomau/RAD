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
		let monmove = this.monster;
    tiles[this.x][this.y] = new newTileType(this.x, this.y);
		//copy monster over(being in vent while it's replaced with floor breaks things otherwise)
		tiles[this.x][this.y].monster = monmove;
    return tiles[this.x][this.y];
  }

	//manhattan distance
	dist(other){
	    return Math.abs(this.x-other.x)+Math.abs(this.y-other.y);
	}

  getNeighbor(dx, dy){
    return getTile(this.x + dx, this.y + dy)
  }

	//get nearby tiles in random order
  getAdjacentNeighbors(rng = gRNG, diagonality){
		if(diagonality=="diagonal"){
			return shuffle([
				this.getNeighbor(0, -1),
				this.getNeighbor(0, 1),
				this.getNeighbor(-1, 0),
				this.getNeighbor(1, 0),
				this.getNeighbor(-1, -1),
				this.getNeighbor(1, 1),
				this.getNeighbor(-1, 1),
				this.getNeighbor(1, -1)
			], rng);
		}else{
			return shuffle([
				this.getNeighbor(0, -1),
				this.getNeighbor(0, 1),
				this.getNeighbor(-1, 0),
				this.getNeighbor(1, 0)
			], rng);
		}
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

  getAdjacentPassableNeighbors(rng = gRNG){
    return this.getAdjacentNeighbors(rng).filter(t => t.passable);
  }

  getAdjacentCrawlable(rng = gRNG){
    return this.getAdjacentNeighbors(rng).filter(t => t.crawlable);
  }

  getAdjacentFlyable(rng = gRNG){
    return this.getAdjacentNeighbors(rng).filter(t => t.flyable);
  }

  getAdjacentVent(rng = gRNG){
    return this.getAdjacentNeighbors(rng).filter(t => t.constructor.name=="Vent");
  }

  getConnectedTiles(){
		//console.log("get connectedTiles.");
    let connectedTiles = [this];
    let frontier = [this];
    while(frontier.length){
      let neighbors = frontier.pop()
                              .getAdjacentCrawlable()
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
		if(this.maincircle >= 0){
			let c = circle[this.maincircle];
			if(c.found || this.maincircle == 4){
				if(true){
					drawTile(this.maincircle, this.x, this.y, maincircleSheet, 3);
				}else if (circlesFound >= 9) {//should main circle count for circlesFound?
					drawTile(this.maincircle, this.x, this.y, maincircleConnectedSheet, 3);
				}
				else if(c.charge > 0){
					drawTile(this.maincircle, this.x, this.y, maincircleChargingSheet, 3);
				}else if (c.charge >= c.maxCharge) {
					drawTile(this.maincircle, this.x, this.y, maincircleChargedSheet, 3);
				}
			}
    }
		if(this.circle >= 0){
			if(this.charge >= this.maxCharge){
				drawTile((this.circle+1)*3-1, this.x, this.y, circlesSheet, 3);
			}else if(this.charge > 0){
				drawTile((this.circle+1)*2-1, this.x, this.y, circlesSheet, 2);
			}else{
				drawTile(this.circle, this.x, this.y, circlesSheet, 1);
			}
    }
		if(this.liquid == "slime" && depth >= 1){
			drawTile(16, this.x, this.y);
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
    if(monster.isPlayer){
			if(this.gem){
				if(pickupRune(this.gem)) this.gem = false;
	      //spawnMonster();
	    }
			//The way I'm doing this assumes a lot about player's spritesheet, mainly that runes and belt are handled some other way.
			if (this.liquid && this.depth){
			 	if(
					player.sprite != Math.min(0+this.depth, 3) || 
					player.sprite != Math.min(4+this.depth, 6)
				){
					//player.sprite = player.sprite+this.depth
					//How do I change from one depth to another nicely?
					//Oh, right, crouching has just 2 depth graphics
					if (player.small) player.sprite = Math.min(4+this.depth, 6);
					else if (!"lying in water? or whatever") player.sprite = Math.min(7+this.depth, 9);
					else player.sprite = Math.min(0+this.depth, 3);
					//
				}
			}else if (player.sprite != 0 && player.sprite != 4 && player.sprite < 7){
				//exit liquid
				if (player.small) player.sprite = 4;
				else player.sprite = 0;
			}
		}
		//
		playSound("step", monster.Tile);
  }
	
  interactWith(monster){
    if(monster.isPlayer){
			if(this.gem){//Most ways to get on tile already stepOn it so this shouldn't be needed much.
				if(pickupRune(this.gem)) this.gem = false;
	      //spawnMonster();
	    }
			if(this.maincircle){
				let i = this.maincircle;
				let count = 0;
				while(circle[i].charge < circle[i].maxCharge && runeinv.length > 0){
					circle[i].charge++
					//circle[i].runesChargedWith.push(runeinv[runeinv.length-1])
					//runeinv.pop()
					circle[i].runesChargedWith.push(runeinv.pop());//pop return the last item too!
					count++// TODO: play sound based on count
				}
			}
		}
	}
}

class Floor extends Tile{
  constructor(x,y){
    super(x, y, 2, true);
    //super(x, y, 2, true, 0, "none", 0);
  };
}

class Exit extends Tile{
  constructor(x, y, wx, wy, entryDir){
    super(x, y, 0, true);
    this.wx = wx;
    this.wy = wy;
    this.entryDir = entryDir;
    this.exit = true;
		//console.info("Exit's entryDir="+entryDir);
  }

  //stepOn(monster){}
  interactWith(monster){
    if(monster.isPlayer){
			playSound("newLevel");
      if(level == numLevels){//TBR
				console.log("Win.");
				//addRecords(runeinv.length, true);
        showTitle();
      }else{
        //level++;
				wpos[0] += this.wx
				wpos[1] += this.wy
        startLevel(this.entryDir, player.hp);
				console.table(wpos);
        //startLevel([this.wx, this.wy, wpos[2], wpos[3]].join(''));
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
    super(x, y, 12, true, true, true, "water", 1);
		
  };
}

class Pool extends Tile{
  constructor(x,y){
    super(x, y, 13, true, true, true, "water", 2);
  };
}

class Water extends Tile{
  constructor(x,y){
    super(x, y, 14, true, true, true, "water", 3);
  };
}

class DeepWater extends Tile{
  constructor(x,y){
    super(x, y, 15, true, true, true, "water", 4);
  };
}

//maybe do as var instead of tile?
class Slimepuddle extends Tile{
  constructor(x,y){
    super(x, y, 16, true, true, true, "slime", 1);
		
  };
}

//maybe do as var instead of tile?
class Circle1 extends Tile{
  constructor(x,y){
    super(x, y, 32, true, true, true, "magic", 0);
		
  };
}