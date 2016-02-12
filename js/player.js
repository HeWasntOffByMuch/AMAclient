function Player(parentElement, gameState, playerData){
    console.log(playerData)
	var gh = gameState.tileSize;
    var map = GAME.map;
    var socket = GAME.socket;

 	this.id = playerData._id; // +
 	this.name = playerData.name; // +
 	this.type = enums.objType.PLAYER; // +
	this.x = playerData.x; // +
	this.y = playerData.y; // +
	this.tx = this.x; // +
	this.ty = this.y; // +
	this.ax = 0;
	this.ay = 0;
    this.moveTime = false;
    this.moving = false;
    this.speedCur = playerData.speedCur; // +
  	this.moveQ = new MovementQueue(map.getCollisions());
    this.movingToTarget = false;
  	this.healthCur = playerData.healthCur; // +
  	this.healthMax = playerData.healthMax; // +
  	this.isDead = false;

  	this.lastAttack = gameState.frameTime;
  	this.attackSpeed = playerData.attackSpeed || 1; // +
    this.inCombat = playerData.inCombat || false;

  	this.equipment = playerData.equipment || { // +
        primary: {type: 'sword', range: 1.5},
        secondary: 0,
        body: 0,
        legs: 0,
        boots: 0,
        head: 0,
        backpack: 0
    };
    this.move = function(dx, dy) {
    	if(!this.isDead){
		    if (map.isValid(this.tx + dx, this.ty + dy)) {
		        this.moveQ.queueMove(this.tx + dx, this.ty + dy);
		    }
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
        if(this.movingToTarget && this.moveQ.getLength() == 0){
            this.movingToTarget = false;
            this.openEntity();
        }
        if (!this.moving) {
            var nextMove = this.moveQ.getMove();
            if (nextMove) {
                if (!map.isValid(nextMove[0], nextMove[1]) && this.moveQ.getLength() > 0) {
                    this.moveQ.findPath(this.x, this.y, GAME.destX, GAME.destY);
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
    this.openEntity = function() {
        // console.log('about to open', GAME.targetedEntity);
        if(GAME.targetedEntity)
            socket.emit('player-loot-request', GAME.targetedEntity.id);
        //new window
        //emit content request
        //display content
        //profit
    };
    this.draw = function(ctx) {
        if(!this.isDead){
            //draw player
            ctx.drawImage(GAME.allImages['Rayman_down'], 512, 240, 32, 48);
            // draw healthbar
			ctx.fillStyle = '#FF371D'; // red
			ctx.fillRect(512 + 4, 240 -2, 24, 3);
			ctx.fillStyle = '#87E82B'; // green
			ctx.fillRect(512 + 4, 240 -2, 24 * (this.healthCur/this.healthMax), 3);
			ctx.strokeStyle = '#000';
			ctx.strokeRect(512 + 4, 240 -2, 24, 3);
            // draw name
            ctx.save();
            ctx.font = "12px Tibia Font";
            ctx.fillStyle = 'rgba(29, 110, 22, 1)';
            ctx.fillText(this.name, 512 - ctx.measureText(this.name).width/2 + 16, 240 - 5);
            // ctx.lineWidth = 0.5;
            // ctx.strokeStyle = '#000';
            // ctx.strokeText(this.name, 512 - 9, 240 - 5);
            ctx.restore();
    	}
    };
    this.attack = function(target) {
    	if(!this.isDead || !this.equipment.primary){
            if(gameState.frameTime - this.lastAttack > this.equipment.primary.contents[0][0].attackCooldown/this.attackSpeed && dist(this, target) < this.equipment.primary.contents[0][0].range){
                this.lastAttack = gameState.frameTime;

                if(this.equipment.primary.contents[0][0].type == 'ranged'){
                    var los = calcLineOfSight(this.tx, this.ty, target.tx, target.ty);
                    var target_x = target.tx,
                        target_y = target.ty;
                    var type_hit = 'blood_hit',
                        type_miss = 'arrow_hit',
                        type_ammo = 'arrow_new';
                    if(!los.isClear){
                        target_x = los.obstacle.x;
                        target_y = los.obstacle.y;
                        type_hit = type_miss;
                    }
                    GAME.anims.push(new ProjectileAnimation(this.tx, this.ty, target_x, target_y, type_ammo, type_hit));
                }
                if(this.equipment.primary.contents[0][0].type == 'melee'){
                    GAME.anims.push(new AttackAnimation(this, target, this.equipment.primary.type));
                }
                socket.emit('player-attack', {id: target.id, type: target.type});
                // console.log('player attacking', target.id);
            }
        }
    };
    this.takeDamage = function(damage) {
    	GAME.popupManager.newHealthPopup(this.tx, this.ty, damage, 1000);
    };
    this.moveInventoryItem = function(from, to) { // retarded but works for now.
        GAME.socket.emit('player-moved-item', {from: from, to: to});
        var item = this.equipment[from.id].contents[from.x][from.y];
        this.equipment[from.id].contents[from.x][from.y] = 0;
        
        this.equipment[to.id].contents[to.x][to.y] = item;
    };
    this.lootEntity = function(from, to) {
        GAME.socket.emit('player-loot-entity', {from: from, to: to});
        var item = GAME.entityManager.getEntities()[from.id].contents[from.pos];  // wow
        this.equipment[to.id].contents[to.x][to.y] = item;
        //do checks if objects exist
        delete GAME.entityManager.getEntities()[from.id].contents[from.pos];

    };
    this.updateHealth = function(healthCurUpdate) {
        if (this.healthCur != healthCurUpdate) {
        	if(this.healthCur > healthCurUpdate)
            	this.takeDamage(this.healthCur - healthCurUpdate);
            this.healthCur = healthCurUpdate;
        }
    };
    this.gainExperience = function(exp) {
        GAME.popupManager.newExpPopup(this.tx, this.ty, exp, 1000);
    };
    this.levelUp = function() {

    };
    this.die = function(){
    	this.isDead = true;
        this.inCombat = false;
    	$('.canvas').addClass('grayscale');
    	setTimeout(function() {
    		WIN_DEATH.show();
    	}, 2000);
    };
    this.respawn = function(x, y) {
    	this.isDead = false;
    	setTimeout(function() {
    		$('.canvas').removeClass('grayscale');
    	}, 500);
    	WIN_DEATH.hide();
    	this.x = x;
    	this.y = y;
    	this.tx = x;
    	this.ty = y;
    };
}