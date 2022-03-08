class Monster{
  constructor(tile, sprite, hp, restspeed = 8){
    this.move(tile);
    this.sprite = sprite;
    this.hp = hp;
    this.fullHp = hp;
    this.rp = 0;//rest points
    this.restspeed = restspeed;//rest turns to gain 1 hp
    this.resting = false;
    this.sheet = monstersheet;
    this.teleportCounter = 3;
    this.piptype = pipred;
    this.offsetX = 0;
    this.offsetY = 0;
    this.lastMove = [-1,0];
    this.bonusAttack = 0;
    this.shield = 0;
    this.dir = 0;
    seenMons.add(this.constructor.name)
  }

  heal(damage){
    this.hp = Math.min(maxHp, this.hp+damage);
  }

  update(){
    if(this.shield) this.shield--;
    if(this.resting){
      //Not sure if I really need the rp variable. I suppose I might want situations where rest happens without healing or such(such as SLEEPMORE spell).
      if(this.rp < this.fullHp*this.restspeed || this.hp < 1){
        this.rp++;
        //this.hp = Math.floor(this.rp/this.restspeed);
        if(this.rp % this.restspeed == 0 && this.hp < this.rp/this.restspeed && this.hp < this.fullHp) this.hp += 1;
      }else{
        this.resting = false;
        this.rp = 0;
        this.stunned = false;
        this.restspeed++ //Increase resting time so that repeatedly beating enemies isn't total waste
        console.log(""+this.constructor.name+" got up. hp:"+this.hp);
      }
      console.log(""+this.constructor.name+" rested (rp:"+this.rp+" hp:"+this.hp+")");
      if(this.teleportCounter) this.teleportCounter--;
      return
    }
    if(this.stunned || this.teleportCounter > 0){    
      this.stunned = false;
      this.teleportCounter--;
      console.log(""+this.constructor.name+" is stunned.");
      return;
    }
    if(Math.floor(this.hp) < 1) {
      this.KO();
      console.error(""+this.constructor.name+" wasn't resting for some reason despite having "+ this.hp +" hp.");
    }
    this.doStuff();
  }

  doStuff(){
    //replace with A* from rot.js?
    //make rabbits move away
    //random moves if player isn't visible
    if ("cansee" == "cansee" && !this.smart){
      
      let neighbors = this.tile.getAdjacentPassableNeighbors();

      neighbors = neighbors.filter(t => !t.monster || t.monster.isPlayer || t.monster.resting);

      if(neighbors.length){
        neighbors.sort((a,b) => a.dist(player.tile) - b.dist(player.tile));
        let newTile = neighbors[0];
        this.tryMove(newTile.x - this.tile.x, newTile.y - this.tile.y);
      }
    }else{
      let neighbors = this.tile.getAdjacentPassableNeighbors();
      if(neighbors.length){
        this.tryMove(neighbors[0].x - this.tile.x, neighbors[0].y - this.tile.y);
      }
    }
  }
  getDisplayX(){
    return this.tile.x + this.offsetX;
  }

  getDisplayY(){
    return this.tile.y + this.offsetY;
  }

  draw(){
    if(this.teleportCounter > 1){
      drawSprite(31, this.getDisplayX(),  this.getDisplayY(), this.sheet);
    }else if(this.teleportCounter == 1 || this.stunned){
      //drawSprite(30, this.tile.x, this.tile.y, this.sheet);
      //drawSprite(this.sprite, this.tile.x, this.tile.y, this.sheet);
      drawSprite(this.sprite, this.getDisplayX(),  this.getDisplayY(), this.sheet, this.dir);
      this.drawHp(pipgray);
      if(this.isPlayer){
          //console.log("Player stunned is "+this.stunned+".");
      }
    }else{
      drawSprite(this.sprite, this.getDisplayX(),  this.getDisplayY(), this.sheet, this.dir);
      this.drawHp(this.piptype);
    }
    this.offsetX -= Math.sign(this.offsetX)*(1/4);
    this.offsetY -= Math.sign(this.offsetY)*(1/4);
  }
  
  drawHp(pip){
    //Health pips are size 6, figure out how many we can show per line based on tilesize
    let modul = Math.floor(tileSize / 6);
    //I could do these in one for loop couldn't I? Well hp potentially being higher than fullHp... Would just mean needing Math.max()
    if(!this.resting){
      for(let i=0 ; i < Math.floor(this.hp) ; i++){
        ctx.drawImage(
          pip,
          this.getDisplayX() * tileSize + Math.floor(i/modul)*(6),
          this.getDisplayY() * tileSize + tileSize - 6 - (i%modul)*(6),
          /*
          this.tile.x * tileSize + (i%modul)*(6),
          this.tile.y * tileSize + tileSize - 6 - Math.floor(i/modul)*(6),
          */
        );
      }
      for(let i=0 ; i < this.shield ; i++){
        ctx.drawImage(
          pipshield,
          this.getDisplayX() * tileSize + Math.floor(i/modul)*(6),
          this.getDisplayY() * tileSize + tileSize - 6 - (i%modul)*(6),
        );
      }
    }else{
      for(let i=0; i<this.fullHp; i++){
        if (this.hp >= i+1){
          ctx.drawImage(
            pipyellow,
            this.getDisplayX() * tileSize + Math.floor(i/modul)*(6),
            this.getDisplayY() * tileSize + tileSize - 6 - (i%modul)*(6)
          );
        }else{
          ctx.drawImage(
            pipz1,
            this.getDisplayX() * tileSize + Math.floor(i/modul)*(6),
            this.getDisplayY() * tileSize + tileSize - 6 - (i%modul)*(6)
          );
        }
      }
    }
  }	


  tryMove(dx, dy){
    let newTile = this.tile.getNeighbor(dx,dy);
    if(newTile.passable || this.small && newTile.crawlable || this.flying && newTile.flyable){
      this.lastMove = [dx,dy];
      if(!newTile.monster){
          this.move(newTile);
      }else{
        //This neatly allows player to hit nonplayers and nonplayers to hit player
        if(this.isPlayer != newTile.monster.isPlayer && !newTile.monster.resting && !this.peaceful){
          console.log(""+this.constructor.name+"("+this.hp+") attacks "+newTile.monster.constructor.name+"("+newTile.hp+").");
          this.attackedThisTurn = true;
          newTile.monster.stunned = true;
          newTile.monster.hit(1 + this.bonusAttack, this);
          this.bonusAttack = 0;
          
          shakeAmount = 5;
          
          this.offsetX = (newTile.x - this.tile.x)/2;
          this.offsetY = (newTile.y - this.tile.y)/2;
        }else if (newTile.monster.resting){
          this.swap(newTile, this.tile);
        }else if (this.isPlayer && this.peaceful){
          //returning true after peaceful move attempt is fine for rabbits but player shouldn't do that.
          return false;
        }
      }
      return true;
    }
  }

  castSpell(index){
    let spellName = this.spells[index];
    if(spellName){
      playSound("spell", this.tile);
      spells[spellName].f(this);
      //console.log("Distance after spell "+this.tile.dist(player.tile));
      //I could check both before and after spell and then pick closest to base sound on.
      //Just saying the casting location is where the sound is is fine for now
      //Could also have sounds for both locations which could work nicely with projectiles too.
    }
  }

  hit(damage, dealer){
    if(this.shield>0){
      return;
    }
    this.hp -= damage;
    if(Math.floor(this.hp) <= 0){
      this.KO();
      //Should overkill be allowed? It increases the KO time which seems a bit abuseable so no, hitting recovering enemies with spells already is nice enough(also communicating negative hp seems annoying).
      this.hp = 0;
    }
    
    if(this.resting && this.hp >= 1) {
      this.resting = false;
      this.rp = 0;
    }
    
    if(this.isPlayer){
      //playSound("hit1");
      playSound("hit2"+dealer.constructor.name);
      //console.log("Took damage from "+dealer.constructor.name+".");
    }else{
      playSound("hit1"+this.constructor.name);
    }
  }

  KO(){
    this.resting = true;
    if(this.isPlayer){
      this.sprite = randomRange(7,8);
      this.dead = true;
    }
  }

  //Just in case flesh egg isn't the only thing we want to actually remove.
  die(){
    this.dead = true;
    this.tile.monster = null;
    if(this.isPlayer){
      this.sprite = randomRange(7,8);
    }
  }

  move(tile){
    if(this.tile){
        this.tile.monster = null;
        this.offsetX = this.tile.x - tile.x;
        this.offsetY = this.tile.y - tile.y;
    }
    this.tile = tile;
    tile.monster = this;
    tile.stepOn(this);
  }
  
  swap(newtile, oldtile){
    let swapmon = newtile.monster;
    //TODO make the other monster move smoothly too
    if(this.tile){
        this.tile.monster = null;
        this.offsetX = this.tile.x - newtile.x;
        this.offsetY = this.tile.y - newtile.y;
    }
    this.tile = newtile;
    newtile.monster = this;
    
    oldtile.monster = swapmon;
    oldtile.monster.tile = oldtile;//is this needed?
    
    oldtile.stepOn(oldtile.monster);
    newtile.stepOn(this);
  }

}

class Player extends Monster{
  constructor(tile){
    super(tile, 0, 3);
    this.isPlayer = true;
    this.sheet = playersheet;
    this.teleportCounter = 0;
    this.piptype = pipblue;
    this.belt = false;
    //Grab numSpells amount of random spells from all spells
    //Not how I want stuff to work.
    //this.spells = shuffle(Object.keys(spells)).splice(0,numSpells);
    //this.spells = new Set(Object.keys(spells))//Sets are meh
    this.spells = Object.keys(spells).splice(0,numSpells);
    //this.spells = [];
    this.TUs = 0;//Timeunits(or "Turningunits"), to track "free" actions such as turning(not sure I'll use them for anything).
    this.restspeed = 2;//rest turns to gain 1 hp

  }
  
  update(){
    if (this.shield) this.shield--;
    this.stunned = false;//get player out of stun state(could do earlier if grey pips after damage is issue also might want player able to actually get stunned at some point)
    this.TUs = 0;
    console.log("player hp: "+this.hp+"/"+this.fullHp+"/"+maxHp);
  }
  
  tryMove(dx, dy){
    this.lastMove = [dx,dy];//Set last move even when failing to move so digging and such works.
    this.resting = false;
    this.hpup = false;//ehh, not the best way and place to do this
    if(super.tryMove(dx,dy)){
      playSound("blip");
      tick();
    }else{
      this.TUs++
    }
  }
  
  rest(){
    this.tile.stepOn(this);//To pickup gems
    //Heal in water
    if (this.tile.liquid = "water" && this.tile.depth >= 2 && this.hp < this.fullHp) {
      this.tile.setEffect(13);
      //this.resting = true;//won't work since player has separate drawHp() and update(), all it does is make enemies swap with player instead of attacking
      this.hp += 0.5;
      if (this.hp < this.fullHp) this.hpup = true;
      else this.hpup = false;
      //Not sure if I should require spending two full turns to get any benefit
      //Crouch rest (twice) to trigger resting state?
      //Or base on submergion so crouch rest at depth 2 and just rest at depth 3
      //Nothing changes fullHp from 3, it's fine though makes discovering how to heal harder so could update with level changes, though thinking about it I don't think I actually want exits to give hp.
    }
    playSound("blip");
    tick();
  }
  
  crouch(){
    if (!this.small && this.tile.crawlable) {
      if (!this.tile.crawlable) return;//above pit for some reason probably
      this.small = true;
      this.peaceful = true;
      this.sprite = Math.min(4+this.tile.depth, 6);
    }
    else {
      if (!this.tile.passable) return;//in vent probably
      this.small = false;
      this.peaceful = false;
      this.sprite = Math.min(0+this.tile.depth, 3);
      //End turn
      this.TUs++
      playSound("blip");
      tick();
    }
    this.TUs++
    /*
    //End turn
    What if only on getting up?
    Losing only one turn to misinput instead of two is better
    If I do make use of TUs could just make getting up more expensive
    player.tile.stepOn(this);//To pickup gems
    */
  }
  
  addSpell(newSpell){                                                       
    //let newSpell = shuffle(Object.keys(spells))[0];
    this.spells.push(newSpell);
  }

  castSpell(index){
    let spellName = this.spells[index];
    let cost = spells[spellName].cost;
    console.log("Casting spell "+index+" "+spellName+".");
    if(spellName && cost <= charges){
      //delete this.spells[index];
      console.log("It costs "+cost);
      charges -= cost;
      usedCharges.push([spells[spellName].droptime, spells[spellName].dropdistance, this.tile, 1])
      //useCharge(this.tile, spells[spellName].droptime, spells[spellName].dropdistance);
      spells[spellName].f(this);
      playSound("spell");
      tick();
    }else if(this.hp > cost){
      console.log("Used energy instead, it cost "+cost);
      this.hp -= cost
      spells[spellName].f(this);
      playSound("spell");
      tick();
    }else{
      console.log("Couldn't cast it, it cost "+cost);
      playSound("no");
    }
  }

  draw(){
    if(this.teleportCounter > 1){
      drawSprite(31, this.getDisplayX(),  this.getDisplayY(), this.sheet);
    }else if(this.teleportCounter == 1 || this.stunned){
      //drawSprite(30, this.tile.x, this.tile.y, this.sheet);
      //drawSprite(this.sprite, this.tile.x, this.tile.y, this.sheet);
      drawSprite(this.sprite, this.getDisplayX(),  this.getDisplayY(), this.sheet, this.dir);
      this.drawHp(pipgray);
      if(this.isPlayer){
          //console.log("Player stunned is "+this.stunned+".");
      }
    }else{
      drawSprite(this.sprite, this.getDisplayX(),  this.getDisplayY(), this.sheet, this.dir);
      //if(this.belt)
      //if(charges || runes)
      drawSprite(this.sprite, this.getDisplayX(),  this.getDisplayY(), beltsheet, this.dir);
      drawSprite(this.sprite, this.getDisplayX(),  this.getDisplayY(), belt2sheet, this.dir);
      for(let i=0 ; i < runesprites.length ; i++){
        //let runesheet = eval("runes"+runesprites[i]+"sheet");
        let runesheet = runesprites[i];
        drawSprite(this.sprite, this.getDisplayX(),  this.getDisplayY(), runesheet, this.dir);
      }
      this.drawHp(this.piptype);
    }
    this.offsetX -= Math.sign(this.offsetX)*(1/4);
    this.offsetY -= Math.sign(this.offsetY)*(1/4);
  }

  //Draw player health on the other side to make being inside an egg or such look ok.
  drawHp(pip){
    //Health pips are size 6, figure out how many we can show per line based on tilesize
    let modul = Math.floor(tileSize / 6);
    //
    for(let i=0 ; i < Math.floor(this.hp) ; i++){
      ctx.drawImage(
        pip,
        this.getDisplayX() * tileSize + tileSize - 6 - Math.floor(i/modul)*(6),
        this.getDisplayY() * tileSize + tileSize - 6 - (i%modul)*(6),
        /*
        this.tile.x * tileSize + (i%modul)*(6),
        this.tile.y * tileSize + tileSize - 6 - Math.floor(i/modul)*(6),
        */
      );
    }
    for(let i=0 ; i < this.shield ; i++){
      ctx.drawImage(
        pipshield,
        this.getDisplayX() * tileSize + tileSize - 6 - Math.floor(i/modul)*(6),
        this.getDisplayY() * tileSize + tileSize - 6 - (i%modul)*(6),
      );
    }
    if (this.hpup){
      let i = Math.floor(this.hp);
        ctx.drawImage(
          pipyellow,
          this.getDisplayX() * tileSize + tileSize - 6 - Math.floor(i/modul)*(6),
          this.getDisplayY() * tileSize + tileSize - 6 - (i%modul)*(6),
        );
      
    }
  }
  
  /* set player graphics based on amount of runes and whether you have a belt */
  runed(){
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
}

// All Monsters: Slime, Spider, Wolfpup, Wolf, Crystal, Wasp, Goblin, Hobgoblin, Fleshball, Fleshegg, Rabbit, Bunny, Shade, Snake
// Spawnable Monsters: Slime, Spider, Wolf, Crystal, Wasp, Goblin, Hobgoblin, Fleshegg, Rabbit

/*
Slow, leaves slippery puddles.
*/
class Slime extends Monster{
  constructor(tile){
      super(tile, 0, 2, 4);
      this.small = true;
  }

  update(){
    let startedStunned = this.stunned;
    super.update();
    if(!startedStunned){
      this.stunned = true;
    }
  }
}


/*
Makes webs, poisons?
*/
class Spider extends Monster{
  constructor(tile){
      super(tile, 1, 1, 12);
      this.small = true;
  }
}

class Wolfpup extends Monster{
  constructor(tile){
      super(tile, 2, 2);
      this.small = true;
  }
}


/*
Eats rabbits, goblins

*/
class Wolf extends Monster{
  constructor(tile){
      super(tile, 3, 3);
      this.growled = 0;
  }
  doStuff(){
    if (this.growled >= 3){
      //replace with a two tile pounce (that can push you back?)
      super.doStuff();
      super.doStuff();
      super.doStuff();
      this.growled--;
    }else if(randomRange(0,5) == 1 && !this.growled){
      console.log("Wolf growled");
      playSound("growl", this.tile);
      this.shield = 1;
      this.growled = 3;
    }else{
      super.doStuff();
      if (this.growled) this.growled--;
    }
  }
}


/*
Shoots lasers
Limited shots? Regains them by destroying walls or something? Or gets stunned for each shot?
Charged shots, on seeing you stops and then next turn shoots at you
Shots are health?
Teleports?
flies
slow/immobile?
*/
class Crystal extends Monster{
  constructor(tile){
      super(tile, 4, 2, 20);
      this.spells = ['WOOP', 'BOLT', 'CROSS'];
      this.flying = true;
      this.shield = 0;
  }
  //Eat walls
  doStuff(){
    let neighbors = this.tile.getAdjacentNeighbors().filter(t => !t.passable && inBounds(t.x,t.y));
    if(neighbors.length){
      neighbors[0].replace(Floor);
      //this.heal(0.5);
      this.shield += 2;
    }else{
      if (randomRange(0,3) == 1){
        //console.log("Crystal cast a spell");
        super.castSpell(0)
      }else super.doStuff();
    }
  }

  update(){
    let startedStunned = this.stunned;
    super.update();
    if(!startedStunned){
      this.stunned = true;
    }
  }
}


/*
flies
*/
class Wasp extends Monster{
  constructor(tile){
      super(tile, 5, 1, 10);
      //this.flying = true;
  }
  doStuff(){
    let lastpos = {x:this.tile.x, y:this.tile.y}
    //console.log("Buzz "+ JSON.stringify(lastpos)+" Am I stunned?"+this.stunned);
    
    this.attackedThisTurn = false;
    super.doStuff();

    if(!this.attackedThisTurn){
      super.doStuff();
    }
    //buzzing is a tad annoying when wasp is stuck somewhere, walls blocking sounds and using pathing distance for sound would help. Oh, remember starting position and don't play sound if it's same or just 1 away.
    if (this.tile.dist(lastpos)>1){
      playSound("buzz", this.tile);
    }else{
      playSound("buzz", this.tile, 0.25);
    }
    
  }
}

class Goblin extends Monster{
  constructor(tile){
      super(tile, 6, 2);
  }
}

class Hobgoblin extends Monster{
  constructor(tile){
      super(tile, 7, 4, 12);
  }
}

/*
Pull attack
Attacks indiscriminately but just traps victims in flesh eggs(some able to escape eventually)
Needs to rest for a while, turns into flesh egg while doing so.
Prefer resting on gems?
*/
class Fleshball extends Monster{ // Eater Devourer
  constructor(tile){
      super(tile, 8, 6);
  }
}

/*
disturbed by nearby movement possibly releasing whatever is inside?
  Nah, units escaping on their own and Devourer's resting state are enough.
No health bar or just 1 pip?

increased chance to spawn on gems?
*/
class Fleshegg extends Monster{ // 
  constructor(tile){
      super(tile, 9, 1);
      this.contains = Fleshball//new Fleshball(tile);
  }
  
  doStuff(){
    return;
  }
  
  KO(){
    var freed = this.contains;
    var where = this.tile;
    console.log("freed:"+freed);
    console.log("free");
    this.dead = true;
    this.tile.monster = null;
    //ROT.RNG to be empty?
    spawnMonster(freed, 0, this.tile)
    //this.tile.monster = freed;
    //monsters.push(freed);
  }
}

/*
Breeds after eating and/or finding mate
Flees
*/
class Rabbit extends Monster{ // 
  constructor(tile){
      super(tile, 10, 1, 3);
      this.peaceful = true;
      this.small = true;
  }
  //Move randomly twice
  doStuff(){
    this.attackedThisTurn = false;//Shouldn't be attacking anyway but just in case a way to anger is added.
    let neighbors = this.tile.getAdjacentCrawlable();
    if(neighbors.length){
      this.tryMove(neighbors[0].x - this.tile.x, neighbors[0].y - this.tile.y);
    }

    if(!this.attackedThisTurn){
      let neighbors = this.tile.getAdjacentCrawlable();
      if(neighbors.length){
        this.tryMove(neighbors[0].x - this.tile.x, neighbors[0].y - this.tile.y);
      }
    }
  }
}

class Bunny extends Monster{ // 
  constructor(tile){
      super(tile, 11, 1, 3);
      this.peaceful = true;
      this.small = true;
  }
  //Move randomly
  doStuff(){
    let neighbors = this.tile.getAdjacentCrawlable();
    if(neighbors.length){
      this.tryMove(neighbors[0].x - this.tile.x, neighbors[0].y - this.tile.y);
    }
  }
}


/*
Moves through walls?
*/
class Shade extends Monster{ // 
  constructor(tile){
      super(tile, 12, 1);
  }
}

class Snake extends Monster{ //
  constructor(tile){
      super(tile, 13, 1);
  }
}