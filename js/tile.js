class Tile{
  //constructor(x, y, sprite, passable, crawlable, liquid, depth){
	constructor(x, y, sprite, passable, crawlable=true, flyable=true, liquid="none", depth=0){
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
    this.visibility = 1;
    this.seenByPlayer = 0;
	}

  replace(newTileType){
		let monmove = this.monster;
		let runemove = this.rune;
    tiles[this.x][this.y] = new newTileType(this.x, this.y);
		//copy monster over(being in vent while it's replaced with floor breaks things otherwise)
		tiles[this.x][this.y].monster = monmove;
		tiles[this.x][this.y].rune = runemove;
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
		let playerDistance = this.dist(player.tile);
    ctx.fillStyle = 'rgba(0, 0, 0, '+darkness+')';
    ctx.fillRect(this.x*tileSize+shakeX, this.y*tileSize+shakeY, tileSize, tileSize);
		if (darkness>0.25 && playerDistance > 10-(darkness*10)) {
      ctx.fillStyle = 'rgba(0, 0, 0, '+1+')';
      ctx.fillRect(this.x*tileSize+shakeX, this.y*tileSize+shakeY, tileSize, tileSize);
    }
		if (player.tile.constructor.name == "Vent" && playerDistance > 2) {
      ctx.fillStyle = 'rgba(0, 0, 0, '+0.25+')';
      ctx.fillRect(this.x*tileSize+shakeX, this.y*tileSize+shakeY, tileSize, tileSize);
    }
		if(this.maincircle >= 0){
			let c = circle[this.maincircle];
			let charge = c.runesChargedWith.length;
			if(c.found || this.maincircle == 4){
				//should main circle count for circlesFound? nah
				if(charge <= 0 && totalCharge < runeTypesTotal && circlesFound < 8){//total and found checks prevent middle from always being this
					drawTile(this.maincircle, this.x, this.y, maincircleSheet, 3);
				}else if (circlesFound < 8 && charge >= c.maxCharge) {
					drawTile(this.maincircle, this.x, this.y, maincircleUnConChargedSheet, 3);
				}else if (circlesFound < 8 && charge > 0) {
					drawTile(this.maincircle, this.x, this.y, maincircleUnConChargingSheet, 3);
				}else if (charge <= 0 && circlesFound >= 8 && totalCharge < runeTypesTotal) {
					drawTile(this.maincircle, this.x, this.y, maincircleConnectedSheet, 3);
				}else if(charge > 0 && charge < c.maxCharge && totalCharge < runeTypesTotal){
					drawTile(this.maincircle, this.x, this.y, maincircleChargingSheet, 3);
				}else if (charge >= c.maxCharge || totalCharge >= runeTypesTotal) {
					drawTile(this.maincircle, this.x, this.y, maincircleChargedSheet, 3);
				}
			}
    }
		if(this.circle >= 0){
			let c = circle[this.circle];
			if(this.charge >= this.maxCharge){
				drawTile((this.circle+1)*3-1, this.x, this.y, circlesSheet, 3);
			}else if(this.charge > 0){
				drawTile((this.circle+1)*2-1, this.x, this.y, circlesSheet, 2);
			}else if(c.found){
				drawTile(this.circle, this.x, this.y, circlesSheet, 1);
			}else{
				drawTile((this.circle+1)*4-1, this.x, this.y, circlesSheet, 4);
			}
    }
		if(this.liquid == "slime" && this.depth >= 1){
			drawTile(16, this.x, this.y);
    }
		if(this.shroom){
      drawTile(22, this.x, this.y);
    }
		if(this.line){
      drawTile(24+6, this.x, this.y);
    }
		if(this.web){
      drawTile(21, this.x, this.y);
    }
		if(this.gem){
      drawTile(47, this.x, this.y);
    }
		if(this.rune){
			//ctx.globalAlpha = 0.9;
			drawTile(5, this.x, this.y);
      //drawTile(0, this.x, this.y, art.runes[this.rune]);
      //drawRune(this.x, this.y, art.runes[this.rune]);
			ctx.globalAlpha = 1;
    }
		if(this.runehint){
      drawTile(46, this.x, this.y);
    }
		//look at neighbouring rooms runes
		if(this.exit && this.entryDir){
			let testX = parseInt(wpos[0]+parseInt(dirmap[this.entryDir]));
			let testY = parseInt(wpos[1]+parseInt(dirmap[this.entryDir]));
			let test;
			if(wTiles[testX][testY].runes) {
				test = wTiles[testX][testY].runes.length;
			}
	 		if(test){
			//console.log("%cThere are runes in direction "+this.entryDir+"("+testX+","+testY+")?", "color:violet");
	    //drawTile(45, this.x, this.y);
	    }
		}
		if(this.effectCounter){
      this.effectCounter--;
      ctx.globalAlpha = this.effectCounter/30;
      drawSprite(this.effect, this.x, this.y, effectsheet);
      ctx.globalAlpha = 1;
    }
		if(this.runeEffectCounter){
      this.runeEffectCounter--;
      ctx.globalAlpha = this.runeEffectCounter/30;
      //drawSprite(this.runeEffect, this.x, this.y, effectsheet);
			//drawRune(this.x, this.y, art.runes[this.rune]);
			//drawTile(0, this.x, this.y, art.runes[this.rune]);
			drawRune(this.x, this.y, this.runeEffect);
      ctx.globalAlpha = 1;
    }
		
		//Indicate FoV
		if (this.seenByPlayer == 1) {
    }else if (this.seenByPlayer == 2 || darkness < 0.3) {
      ctx.fillStyle = 'rgba(0, 0, 0, '+0.25+')';
      ctx.fillRect(this.x*tileSize+shakeX, this.y*tileSize+shakeY, tileSize, tileSize);
    }else if (this.seenByPlayer == 3) {
      ctx.fillStyle = 'rgba(0, 0, 0, '+0.25+')';
      ctx.fillRect(this.x*tileSize+shakeX, this.y*tileSize+shakeY, tileSize, tileSize);
    }else{
			ctx.fillStyle = 'rgba(0, 0, 0, '+1+')';
			ctx.fillRect(this.x*tileSize+shakeX, this.y*tileSize+shakeY, tileSize, tileSize);
		}
  }
	
	setEffect(effectSprite){
		//console.log("Effect "+effectSprite+".");
    this.effect = effectSprite;
    this.effectCounter = 30;
  }
	
	//kind of bad and inflexible way to do runes as effects
	setRuneEffect(effectSprite){
		//console.log("Effect "+effectSprite+".");
    this.runeEffect = effectSprite;
    this.runeEffectCounter = 60;
  }
	
  stepOn(monster){
    if(monster.isPlayer){
			monster.freeSpell = "";//assuming no other way to get freeSpell outside of one's after this
			if(this.gem){
				if(pickupRune(this.gem)) this.gem = false;
	      //spawnMonster();
	    }
			if(this.rune){
				this.setRuneEffect(art.runes[this.rune]);
				if(pickupRune(this.rune)) this.rune = false;
	      //spawnMonster();
	    }
			
			if(this.maincircle == 4 && totalCharge >= runeTypesTotal){
				console.log("%cWin.", "color:yellow");
				//Not actually visibly standing on the circle bothers me.
				//tick();
				addRecords(runeinv.length, true);
        showTitle();
			}else if(this.maincircle == 4 && !circle[4].found && !gamesettings.freeHeals){
				circle[4].found = true;
				playSound("circleFound", monster.Tile);
				numSpells++;
				player.addSpell("HEAL");
			}else if (this.maincircle >= 0 && this.maincircle != 4  && circle[this.maincircle].found ) {
				monster.freeSpell = circle[this.maincircle].spell2;
			}
			
			//mark circle as found
			if(this.circle >= 0){
				let c = circle[this.circle];
				if(!c.found){
					playSound("circleFound", monster.Tile);
					c.found = true;
					circlesFound++;
					
			    if("spell slots not full or something"){
			      numSpells++;
			      player.addSpell(c.spell);
			    }
				}
				monster.freeSpell = c.spell;
	    }
			//The way I'm doing this assumes a lot about player's spritesheet, mainly that runes and belt are handled some other way.
			if (this.liquid != "none" && this.depth){
				if(this.depth >= 4) {
					player.sprite = 6;
					player.peaceful = true;
				}else if(player.sprite != Math.min(0+this.depth, 3) || player.sprite != Math.min(4+this.depth, 6) ){
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
				console.log("left liquid! liquid:"+this.liquid+" depth:"+this.depth);
				if (player.small) player.sprite = 4;
				else player.sprite = 0;
			}
			if(!player.small && this.depth < 4) player.peaceful = false;
		}//end of isPlayer
		
		if(this.web && !monster.webwalker){
			if(!monster.resting) this.web = false;
			monster.webbed = true;
			if(monster.isPlayer)tick(true, "Stuck in a web!");
			else{
				monster.stunned = true;
				monster.heardByPlayer = true;
			}
			playSound("webstuck", monster.Tile);
		}
		
		//slippery slime
		//are there any small monsters that should slip? Rabbits maybe but maybe not. Small check is mainly for the player.
		if(this.liquid == "slime" && !monster.slimewalker && !monster.flying && !monster.small){
			let neighbors = this.getAdjacentPassableNeighbors();
			let newTile = tiles[this.x+monster.lastMove[0]][this.y+monster.lastMove[1]];
			neighbors = neighbors.filter(t => !t.monster || t.monster.resting);
			if(newTile.passable && (!newTile.monster || newTile.monster.resting) && randomRange(0,4)){
				monster.heardByPlayer = true;
				monster.move(newTile);
				if(monster.isPlayer) playSound("slip", monster.Tile);
			}else if(neighbors.length && randomRange(0,2) == 1) {
				newTile = neighbors[0];
				//monster.tryMove(newTile.x - this.x, newTile.y - this.y);
				monster.move(newTile);
				if(monster.isPlayer && !monster.small){
					monster.heardByPlayer = true;
					playSound("slip", monster.Tile);
					monster.small = true;
					monster.peaceful = true;
					monster.sprite = Math.min(4+this.depth, 6);
				}else{
					monster.stunned = true;
					if(monster.isPlayer) playSound("slorch", monster.Tile);
				}
			}else if(randomRange(0,20) == 1 && this.depth == 1){//small chance to remove slime when stepping on it. Only when not slipping or sliding though since it'd look weird to slip on nothing.
				this.liquid = "none";
				this.depth = 0;
			}
		}
		
		if(this.liquid == "slime" && monster.isPlayer){
			playSound("slorch", monster.Tile);
		}else if(this.liquid == "water" && monster.isPlayer){
			playSound("splash", monster.Tile);
		}else playSound("step", monster.Tile);
		//
		//playSound("step", monster.Tile);
  }
	
  interactWith(monster){
    if(monster.isPlayer){
			if(this.gem){//Most ways to get on tile already stepOn it so this shouldn't be needed much.
				if(pickupRune(this.gem)) this.gem = false;
	      //spawnMonster();
	    }
			if(this.rune){
				if(pickupRune(this.rune)) this.rune = false;
	      //spawnMonster();
	    }
			if(this.maincircle >= 0 && this.maincircle != 4 && circle[this.maincircle].found){
				let c = circle[this.maincircle];//should replace circle[i] with c
				let i = this.maincircle;
				let charge = c.runesChargedWith.length;
				
				//these just make warping in go to correct tile
				c.maincircleTileX = this.x;
				c.maincircleTileY = this.y;
				
				console.log("warp? "+c.maxCharge+"=="+charge);
				if((c.maxCharge <= charge || (charge > 0 && runeinv.length <= 0))) {//before charging to avoid accidents
					console.log("warp! "+c.maxCharge+"=="+charge);
					//warp to outside circle
					//or something, warping probably should be much easier.
					wpos[0] = circle[i].wTile[0];
					wpos[1] = circle[i].wTile[1];
					cwarp = this.maincircle;
					savedPlayer = player;
					this.monster = null;
	        startLevel(4, player.hp);
					console.table(wpos);
	        //startLevel([this.wx, this.wy, wpos[2], wpos[3]].join(''));
				}
				let count = 0;
				while(charge < circle[i].maxCharge && runeinv.length > 0){
					circle[i].charge++//TBR
					totalCharge++;
					runes[runeinv[runeinv.length-1]].holder = "circle "+i;
					circle[i].runesChargedWith.push(runeinv.pop());//pop return the last item too!
					charge = c.runesChargedWith.length;
					count++
					if(circle[i].charge == circle[i].maxCharge && !player.spells.includes(circle[i].spell2)){
			      numSpells++;//TBR?
			      player.addSpell(circle[i].spell2);
					}
				}
				if(count >= 8) playSound("circleCharge3", monster.Tile);
				else if(count >= 4) playSound("circleCharge2", monster.Tile);
				else if(count >= 1) playSound("circleCharge1", monster.Tile);
				else if(charge <= 0) playSound("no", monster.Tile);
			}
			if(this.circle >= 0){
				let c = circle[this.circle];
				console.log("warp? "+c.maxCharge+"=="+c.runesChargedWith.length);
				if(c.maxCharge <= c.runesChargedWith.length || c.runesChargedWith.length > 0 || monster.small && runeinv.length <= 0) {
					console.log("warp! "+c.maxCharge+"=="+c.runesChargedWith.length);
					//warp to main circle
					//or something, warping probably should be much easier.
					//circle[4] should give the main circle even if it's moved away from 14,14
					wpos[0] = circle[4].wTile[0];
					wpos[1] = circle[4].wTile[1];
					let entryD = 5;//not sure why exactly this being 5 doesn't work when warping without charged circle but it's not important I suppose.
					if(monster.small && runeinv.length <= 0) entryD = -1;
					cwarp = this.circle;
					savedPlayer = player;
					this.monster = null;
	        startLevel(entryD, player.hp);
				}else{
					
					playSound("no", monster.Tile);
				}
			}
		}
	}
}

class Floor extends Tile{
  constructor(x,y){
    super(x, y, 2, true, true, true, "none", 0);
    //super(x, y, 2, true, 0, "none", 0);
  };
}

class Floor2 extends Tile{
  constructor(x,y){
    super(x, y, 1, true, true, true, "none", 0);
    //super(x, y, 2, true, 0, "none", 0);
  };
}

class Exit extends Tile{
  constructor(x, y, wx, wy, entryDir){
    super(x, y, 0, true, true, true, "none", 0);
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
      if(levelday != day){
				savedPlayer = player;
				wpos[0] = 14;
				wpos[1] = 14;
				startLevel(this.entryDir, player.hp);
				console.table(wpos);
				
      }else{
        if(hunterPresent == true){
					//Would like to look at distance between fleshball and player but not sure how to get fleshballs tile so this'll do for now.
					hunterTimer = Math.floor(numTiles-randomRange(0,5));
					hunterDir = this.entryDir;
				}
				savedPlayer = player;
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
    super(x, y, 3, false, false, false, "none", 0);
    //super(x, y, 3, false, 0, "none", 0);
		this.visibility = 0;
  }
}

class Wall2 extends Tile{
  constructor(x, y){
    super(x, y, 7, false, false, false, "none", 0);
    //super(x, y, 3, false, 0, "none", 0);
		this.visibility = 0;
  }
}

class Vent extends Tile{
  constructor(x, y){
    super(x, y, 4, false, true, false, "none", 0);
    //super(x, y, 4, false, 1, "none", 0);
  }
}

class Pit extends Tile{
  constructor(x,y){
    super(x, y, 6, true, true, true, "none", 0);
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

class FloorNub extends Tile{
  constructor(x,y){
    super(x, y, 31, true, true, true, "none", 0);
    //super(x, y, 2, true, 0, "none", 0);
  };
}

class WallNub extends Tile{
  constructor(x, y){
    super(x, y, 32, false, false, false, "none", 0);
    //super(x, y, 3, false, 0, "none", 0);
		this.visibility = 0;
  }
}

//maybe do as var instead of tile?
class Circle1 extends Tile{
  constructor(x,y){
    super(x, y, 32, true, true, true, "magic", 0);
		
  };
}