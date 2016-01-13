var tilesSprite = GAME.allImages['base_tiles'];

function Map(x, y, gameState){
	var gh = gameState.tileSize;
	var mapForeground = []; // inverted coordinates y is x, x is y.
	for(var i=0; i<gameState.mapSize.x; i++){ //get map size from server later
		mapForeground[i] = [];
	}
	var mapCollisions = [];
	for(var i=0; i<gameState.mapSize.x; i++){ //get map size from server later
		mapCollisions[i] = [];
	}
	f = $('.foreground')[0];
	var chunkSize = gameState.chunkSize || {x: 32, y: 16};
	this.x = x;
	this.y = y;
	this.appendTiles = function() { //can't call this without a player. deprecated.
		var x = this.x;
		var y = this.y;
		console.log(x, y)
		for(var i = -2; i < 34; i++){
			for(var j = -2; j < 18; j++){
				var sprite = mapForeground[y - 8 + j][x-16+i];
				if(sprite === 0) continue;
				new Tile(null, i, j, sprite -1);
			}
		}
	};
	this.update = function(player) {
		this.x = GAME.player.x + GAME.player.ax;
		this.y = GAME.player.y + GAME.player.ay;
	};
	this.draw = function(ctx) {
		if(mapForeground[0].length === 0) return;
		for(var i = -1; i < 33; i++){
			for(var j = -1; j < 17; j++){
				var sprite = mapForeground[GAME.player.y - 8 + j][GAME.player.x - 16 + i];
				// if(sprite == 0) continue; //if not many empty spaces on the map are used this is practically useless;
				if(sprite !=0) sprite--; //adjust sprite position
				var x_pos = (sprite % tilesSprite.tilesW);
				var y_pos = (Math.floor(sprite / tilesSprite.tilesW) % tilesSprite.tilesH);
				var ax = GAME.player.ax;
				var ay = GAME.player.ay;
				ctx.drawImage(tilesSprite, x_pos*32, y_pos*32, 32, 32, Math.floor((i-ax)*32), Math.floor((j-ay)*32), 32, 32);
			}
		}
	};
	this.populateTiles = function(map_data) {
		for(var k=0; k < map_data.length; k++){
			var map_part = map_data[k];
			var x = map_part.pos.x;
			var y = map_part.pos.y;
			var w = chunkSize.x;
			var h = chunkSize.y;
			// console.log('populating tiles for chunk', x, y, w, h);
			for(var i = 0; i < map_part.tile_data.length; i++){
				for(var j = 0; j < map_part.tile_data[i].length; j++){
					mapForeground[x*w + i][y*h + j] = map_part.tile_data[i][j];
				}
			}
			// console.log('loaded chunk ', x, y);
		}
	};
	this.populateCollisions = function(map) {
		for(var k=0; k<map.length; k++){
			var map_part = map[k];
			var x = map_part.pos.x;
			var y = map_part.pos.y;
			var w = chunkSize.x;
			var h = chunkSize.y;
			for(var i=0; i<map_part.col_data.length; i++){//initialise map_partForeground somehow
				for(var j=0; j<map_part.col_data[i].length; j++){
					mapCollisions[x*w + i][y*h + j] = map_part.col_data[i][j];
				}
			}
		}
	};
	this.getForeground = function() {
		return mapForeground;
	};
	this.getCollisions = function() {
		return mapCollisions;
	};
	this.isValid = function(x, y) {
		return !mapCollisions[x][y];
	};
	this.occupySpot = function(x, y) {
		mapCollisions[x][y] = 1;
	};
	this.freeSpot = function(x, y) {
		mapCollisions[x][y] = 0;
	};
}
function repositionTile() { // deprecated
	if(!this) return;
	this.style.left = this.x + 'px';
	this.style.top = this.y + 'px';
}
function changeTileFrame(num) { // deprecated
    if (!this) return;
    this.style.backgroundPosition =
        (-1 * (num % tilesSprite.tilesW) * tilesSprite.spriteX + 'px ') +
        (-1 * (Math.floor(num / tilesSprite.tilesW) % tilesSprite.tilesH)) * tilesSprite.spriteY + 'px ';
}
function destroyTile() { // deprecated
    if (!this) return;
    this.parent.removeChild(this.element);
}
function Tile(parentElement, x, y, sprite) { // deprecated
    // function references
    this.reposition = repositionTile;
    this.frame = changeTileFrame;
    this.destroy = destroyTile;
    // (default: foreground)
    this.parent = parentElement ? parentElement : GAME.foreground;
    // create a DOM sprite
    this.element = document.createElement("div");
    this.element.className = 'tile';
    // optimized pointer to style object
    this.style = this.element.style;
    // starting position
    this.x = x * 32;
    this.y = y * 32;
    this.reposition();

    // random spritesheet frame
    this.frame(sprite);
    // put it into the game window
    this.parent.appendChild(this.element);
}
function Player(parentElement, gameState, playerData){
	var socket = GAME.socket;
	var map = GAME.map;
	var gh = gameState.tileSize;
	// this.reposition = repositionTile;
 //    this.frame = changeTileFrame;
 //    this.destroy = destroyTile;
 //    this.parent = parentElement ? parentElement : GAME.gameContainer;
	// this.element = document.createElement("div");
	// this.element.className = 'player';
	// this.style = this.element.style;
	// //starting pos from server
	// this.frame(0);
 //    this.parent.appendChild(this.element);
 	this.id = playerData._id;
 	this.type = enums.objType.PLAYER;
	this.x = playerData.x;
	this.y = playerData.y;
	this.tx = this.x;
	this.ty = this.y;
	this.ax = 0;
	this.ay = 0;
    this.moveTime = false;
    this.moving = false;
    this.speedCur = playerData.speedCur;
  	this.moveQ = new MovementQueue(map.getCollisions());

  	this.healthCur = playerData.healthCur;
  	this.healthMax = playerData.healthMax;
  	this.isDead = false;

  	this.lastAttack = gameState.frameTime;
  	this.attackCooldown = 2000;
  	this.attackSpeed = 1;


  	this.equipment = {
        primary: {type: 'sword', range: 1.5},
        secondary: 0,
        body: 0,
        legs: 0,
        boots: 0,
        head: 0,
        backpack: 0
    };
    this.move = function(dx, dy) {
        if (map.isValid(this.tx + dx, this.ty + dy)) {
            this.moveQ.queueMove(this.tx + dx, this.ty + dy);
        }
    };
    this.update = function() {
    	this.ax = (this.tx - this.x) * (gameState.frameTime - this.moveTime) / this.speedCur;
    	this.ay = (this.ty - this.y) * (gameState.frameTime - this.moveTime) / this.speedCur;

    	if(this.moveTime){
    		if(gameState.frameTime - this.moveTime > this.speedCur){
    			//time to stop moving
    			this.x = this.tx;
    			this.y = this.ty;
    			this.ax = 0;
    			this.ay = 0;
    			this.moving = false;
    			this.moveTime = false;
    		}
    	}

        if (!this.moving) {
            var nextMove = this.moveQ.getMove();
            if (nextMove) {
                if (!map.isValid(nextMove[0], nextMove[1]) && this.moveQ.getLength() > 0) {
                    this.moveQ.findPath(this.x, this.y, clientX, clientY);
                    nextMove = this.moveQ.getMove();
                }
                if (nextMove && map.isValid(nextMove[0], nextMove[1])) {
                    socket.emit('player-input-move', {
                        dx: nextMove[0] - this.tx,
                        dy: nextMove[1] - this.ty
                    });
                    this.moveTime = gameState.frameTime;
                    // this.animationFrame = 0;
                    this.moving = true;
                    this.tx = nextMove[0];
                    this.ty = nextMove[1];
                }
            }
        }
    };
    this.draw = function(ctx) {
    	ctx.drawImage(GAME.allImages['Rayman_down'], 512, 240, 32, 48);
    	if(!this.isDead){ //draw healthbar
			ctx.fillStyle = '#FF371D';
			ctx.fillRect(512 + 2, 240 -2, 24, 3);
			ctx.fillStyle = '#87E82B';
			ctx.fillRect(512 + 2, 240 -2, 24 * (this.healthCur/this.healthMax), 3);
			ctx.strokeStyle = '#000';
			ctx.strokeRect(512 + 2, 240 -2, 24, 3);
    	}
    };
    this.attack = function(target) {
    	if(!this.isDead){
            if(gameState.frameTime - this.lastAttack > this.attackCooldown/this.attackSpeed && dist(this, target) < this.equipment.primary.range){
                this.lastAttack = gameState.frameTime;

                if(this.equipment.primary.type == 'bow'){
                    // do bow stuff and possibly return here.
                }
                socket.emit('player-attack', {id: target.id, type: target.type});
                console.log('player attacking', target.id)
            }
        }
    };
}
function OtherPlayer(gameState, data){
	console.log(data)
	var gh = gameState.tileSize;
	var map = GAME.map;
	this.id = data.id;
 	this.type = enums.objType.PLAYER;
	// this.name = name;
	// this.level = level;
	this.x = data.x;
	this.y = data.y;
	this.tx = data.tx;
	this.ty = data.ty;
	if(this.id != GAME.player.id)
		map.occupySpot(this.tx, this.ty);
	// this.direction = 0;
	// this.moving = false;
	this.speedCur = data.speedCur;
	this.healthCur = data.healthCur;
	this.healthMax = data.healthMax;
	this.isDead = false;
	// this.healthMax = healthMax;
	// this.healthCur = healthCur;
	// this.isDead = false;
	// this.isVisible = true;
	// this.isTargeted = false;
	this.lastTime = gameState.frameTime;
	this.move = function(tx, ty) { //gets new tx/ty position and starts moving in update.
		if(this.id != GAME.player.id)
			map.freeSpot(this.tx, this.ty);
		this.tx = tx;
		this.ty = ty;
		if(this.id != GAME.player.id)
			map.occupySpot(this.tx, this.ty);
	};
	this.update = function(){
		this.x += Math.sign(this.tx-this.x) * Math.min((gameState.frameTime - this.lastTime)/this.speedCur, Math.abs(this.tx-this.x));
    	this.y += Math.sign(this.ty-this.y) * Math.min((gameState.frameTime - this.lastTime)/this.speedCur, Math.abs(this.ty-this.y));

    // if(this.healthCur <=0){
    //   this.die();
    // }

    this.lastTime = gameState.frameTime;
	}
	this.draw = function(ctx){
	    ctx.drawImage(GAME.allImages['Rayman_down'], (this.x-GAME.player.x-GAME.player.ax+16)*gh, (this.y-GAME.player.y-GAME.player.ay+8)*gh-16, 32, 48);
	    if(!this.isDead){ //draw healthbar
			ctx.fillStyle = '#FF371D';
			ctx.fillRect(512 + 2, 240 -2, 24, 3);
			ctx.fillStyle = '#87E82B';
			ctx.fillRect(512 + 2, 240 -2, 24 * (this.healthCur/this.healthMax), 3);
			ctx.strokeStyle = '#000';
			ctx.strokeRect(512 + 2, 240 -2, 24, 3);
    	}
	    // if(this.isTargeted){
	    //   ctx.strokeStyle = "rgba(255, 0, 0, 1)";
	    //   ctx.strokeRect((this.x)*gh, (this.y)*gh, gh, gh);
	    // }
	}
  this.takeDamage = function(attackerId, damage) {
    // if(damage>0)
    //   entities.newEntity('blood_big', this.tx, this.ty, 15, 2.5);
    // popups.push(new numberPopup(this.tx, this.ty, damage, 'damage', 1200));
  }
  this.die = function(){
	if(this.id != GAME.player.id)
		map.freeSpot(this.tx, this.ty)
    delete GAME.instance.player_data[this.id];
  }
}
function Mob(gameState, data){
	var gh = gameState.tileSize;
	var map = GAME.map;
	this.id = data._id;
	this.type = enums.objType.MOB;
	this.x = data.x;
	this.y = data.y;
	this.tx = data.tx;
	this.ty = data.ty;
	map.occupySpot(this.tx, this.ty); //occupy on creation.
	// this.direction = 0;
	this.speedCur = data.speedCur;
	this.healthCur = data.healthCur;
	this.healthMax = data.healthMax;
	this.isDead = false;
	this.lastTime = gameState.frameTime;

	this.isTargeted = false;
	this.update = function() {
		this.x += Math.sign(this.tx-this.x) * Math.min((gameState.frameTime - this.lastTime)/this.speedCur, Math.abs(this.tx-this.x));
    	this.y += Math.sign(this.ty-this.y) * Math.min((gameState.frameTime - this.lastTime)/this.speedCur, Math.abs(this.ty-this.y));

    	this.lastTime = gameState.frameTime;
    	// if(this.healthCur <= 0)
    	// 	this.die();
	};
	this.move = function(tx, ty) { //gets new tx/ty position and starts moving in update.
		map.freeSpot(this.tx, this.ty);
		this.tx = tx;
		this.ty = ty;
		map.occupySpot(this.tx, this.ty);
	};
	this.draw = function(ctx) {
		ctx.drawImage(GAME.allImages['Bat'], 0, 0, 32, 32, (this.x-GAME.player.x-GAME.player.ax+16)*gh, (this.y-GAME.player.y-GAME.player.ay+8)*gh, 32, 32);
		if(!this.isDead){ //draw healthbar
			ctx.fillStyle = '#FF371D';
			ctx.fillRect((this.x-GAME.player.x-GAME.player.ax+16)*gh + 4, (this.y-GAME.player.y-GAME.player.ay+8)*gh - 4, 24, 3);
			ctx.fillStyle = '#87E82B';
			ctx.fillRect((this.x-GAME.player.x-GAME.player.ax+16)*gh + 4, (this.y-GAME.player.y-GAME.player.ay+8)*gh - 4, 24 * (this.healthCur/this.healthMax), 3);
			ctx.strokeStyle = '#000';
			ctx.strokeRect((this.x-GAME.player.x-GAME.player.ax+16)*gh + 4, (this.y-GAME.player.y-GAME.player.ay+8)*gh - 4, 24, 3);
    	}
    	if(this.isTargeted){
	      ctx.strokeStyle = "rgba(255, 0, 0, 1)";
	      ctx.strokeRect((this.x-GAME.player.x-GAME.player.ax+16)*gh, (this.y-GAME.player.y-GAME.player.ay+8)*gh, gh, gh);
	    }
	};
	this.die = function() { //doesnt go off. dead mob is never sent from server. need dying emit?
		this.isDead = true;
		this.isTargeted = false;
		map.freeSpot(this.tx, this.ty)
		delete GAME.instance.getMobsData()[data._id];
	};
}
function MovementCheck(player){
	var serverMoves = [];
	var clientMoves = [];
	this.log = function() {
		console.log(serverMoves)
		console.log(clientMoves)
	};
	this.addServerMove = function(_x, _y) {
		if(serverMoves.length === 0){
			serverMoves.unshift({x: _x, y: _y});
		}
		if(serverMoves[0].x != _x || serverMoves[0].y != _y) {
			serverMoves.unshift({x: _x, y: _y});
		}
	};
	this.addClientMove = function(_x, _y) {
		if(clientMoves.length === 0){
			clientMoves.unshift({x: _x, y: _y});
		}
		if(clientMoves[0].x != _x || clientMoves[0].y != _y) {
			clientMoves.unshift({x: _x, y: _y});
		}
	};
	this.snapPlayerBack = function(_tx, _ty) {
		player.x = _tx;
		player.y = _ty;
		player.tx = _tx;
		player.ty = _ty;
		serverMoves = [];
		clientMoves = [];
	};
	this.check = function(_tx, _ty) {
		if(serverMoves.length > 4 && clientMoves.length > 4)
		for(var i = 4; i > 1; i--){
			if(serverMoves[i].x != clientMoves[i].x || serverMoves[i].y != clientMoves[i].y){
				this.snapPlayerBack(_tx, _ty);
				break;
			}
		}
	};
	this.update = function() {
		if(serverMoves.length > 20)
			serverMoves.pop();
		if(clientMoves.length > 20)
			clientMoves.pop();
	};
}