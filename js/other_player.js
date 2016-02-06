function OtherPlayer(gameState, data) {
    var gh = gameState.tileSize;
    var map = GAME.map;
    this.id = data._id;
    this.name = data.name;
    this.type = enums.objType.PLAYER;
    this.x = data.x;
    this.y = data.y;
    this.tx = data.tx;
    this.ty = data.ty;
    console.log('player', this.name, 'created')
    map.occupySpot(this.tx, this.ty);
    // this.direction = 0;
    // this.moving = false;
    this.speedCur = data.speedCur;
    this.healthCur = data.healthCur;
    this.healthMax = data.healthMax;
    this.isDead = false;
    // this.isDead = false;
    // this.isVisible = true;
    // this.isTargeted = false;
    this.lastTime = gameState.frameTime;
    this.move = function(tx, ty) { //gets new tx/ty position and starts moving in update.
        map.freeSpot(this.tx, this.ty);
        this.tx = tx;
        this.ty = ty;
        map.occupySpot(this.tx, this.ty);
    };
    this.update = function() {
        map.occupySpot(this.tx, this.ty)
        this.x += Math.sign(this.tx - this.x) * Math.min((gameState.frameTime - this.lastTime) / this.speedCur, Math.abs(this.tx - this.x));
        this.y += Math.sign(this.ty - this.y) * Math.min((gameState.frameTime - this.lastTime) / this.speedCur, Math.abs(this.ty - this.y));

        // if(this.healthCur <=0){
        //   this.die();
        // }

        this.lastTime = gameState.frameTime;
    }
    this.draw = function(ctx) {
        // draw target outline
        if (this.isTargeted) {
            ctx.strokeStyle = "rgba(255, 0, 0, 1)";
            ctx.strokeRect((this.x - GAME.player.x - GAME.player.ax + 16) * gh, (this.y - GAME.player.y - GAME.player.ay + 8) * gh, gh, gh);
        }
        ctx.drawImage(GAME.allImages['Rayman_down'], (this.x - GAME.player.x - GAME.player.ax + 16) * gh, (this.y - GAME.player.y - GAME.player.ay + 8) * gh - 16, 32, 48);
        // draw healthbar
        ctx.fillStyle = '#FF371D';
        ctx.fillRect((this.x - GAME.player.x - GAME.player.ax + 16) * gh + 2, (this.y - GAME.player.y - GAME.player.ay + 8) * gh - 18, 24, 3);
        ctx.fillStyle = '#87E82B';
        ctx.fillRect((this.x - GAME.player.x - GAME.player.ax + 16) * gh + 2, (this.y - GAME.player.y - GAME.player.ay + 8) * gh - 18, 24 * (this.healthCur / this.healthMax), 3);
        ctx.strokeStyle = '#000';
        ctx.strokeRect((this.x - GAME.player.x - GAME.player.ax + 16) * gh + 2, (this.y - GAME.player.y - GAME.player.ay + 8) * gh - 18, 24, 3);
        // draw mob name
        ctx.save();
        ctx.font = "12px Tibia Font";
        ctx.fillStyle = 'rgba(29, 110, 22, 1)';
        ctx.fillText(this.name, (this.x-GAME.player.x-GAME.player.ax+16)*gh - ctx.measureText(this.name).width/2 + 16, (this.y-GAME.player.y-GAME.player.ay+8)*gh - 21);
        // ctx.lineWidth = 0.5;
        // ctx.strokeStyle = '#000';
        // ctx.strokeText(this.name, 512 - 9, 240 - 5);
        ctx.restore();
    }
    this.attack = function(target, type, isClear) {
        var type_ammo = 'arrow_new',
            type_hit = 'blood_hit',
            type_miss = 'arrow_hit';
        if(!isClear)
            type_hit = type_miss;
        switch(type){
            case 'melee':
                // melee animation
                console.log('222')
                GAME.anims.push(new AttackAnimation(this, target, type));
                break;
            case 'ranged':
                //something
                GAME.anims.push(new ProjectileAnimation(this.tx, this.ty, target.x, target.y, type_ammo, type_hit));
                break;
        }
    };
    this.takeDamage = function(damage) {
        GAME.popupManager.newHealthPopup(this.tx, this.ty, damage, 1000);
    }
    this.updateHealth = function(healthCurUpdate) {
        if (this.healthCur != healthCurUpdate) {
            if(this.healthCur > healthCurUpdate)
                this.takeDamage(this.healthCur - healthCurUpdate);
            this.healthCur = healthCurUpdate;
        }
    };
    this.die = function() {
        this.isDead = true;
        this.isTargeted = false;
        GAME.targetedUnit = null;
        map.freeSpot(this.tx, this.ty);
        GAME.popupManager.newHealthPopup(this.tx, this.ty, this.healthCur, 1500)
        delete GAME.instance.getPlayersData()[this.id];
    }
}
