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
};
function EntityManager() {
	var gh = gameState.tileSize;
	var allEntities = {};

	this.addEntity = function(id, entity) {
		allEntities[id] = entity;
	};
	this.removeEntity = function(id) {
		delete allEntities[id];
	};
	this.populateEntities = function(map_data) {
		var id, name, x, y;
		for(var k=0; k < map_data.length; k++){
			var map_part = map_data[k];
			var entities = map_data[k].entity_data;
			for(var id in entities){
				allEntities[id] = entities[id];
			}
		}
	};
	this.draw = function(ctx) {
		var img;
        for (var i in allEntities) {
        	img = GAME.allImages[allEntities[i].name] || GAME.allImages['placeholder'];
        	ctx.drawImage(img, (allEntities[i].x-GAME.player.x-GAME.player.ax+16)*gh, (allEntities[i].y-GAME.player.y-GAME.player.ay+8)*gh, img.spriteX, img.spriteY);
        }
	};
	this.getEntities = function() {
		return allEntities;
	};
}

function PopupManager() {
	var offsetX = 11;
	var curId = 0;
	var allPopups = {};
	var defaultDecayTime = 3000;
	var gh = gameState.tileSize;

	this.newHealthPopup = function(x, y, number, decay_time) {
		allPopups[curId++] = {
			x: x,
			y: y,
			type: 'health',
			value: number,
			creationTime: new Date().getTime(),
			decayTime: decay_time || defaultDecayTime
		}
	};
	this.newExpPopup = function(x, y, number, decay_time) {
		allPopups[curId++] = {
			x: x,
			y: y,
			type: 'exp',
			value: number,
			creationTime: new Date().getTime(),
			decayTime: decay_time || defaultDecayTime
		}
	};
	this.update = function() {
		for(var i in allPopups){
			var p = allPopups[i];
            if (gameState.frameTime - p.creationTime > p.decayTime) {
                delete allPopups[i];
            } else {
            	switch(p.type) {
            		case 'health':
	            		p.y -= 0.01;
	            		break;
	        		case 'exp':
	        		p.y -= 0.01;
	        		break;
            	}
            }
		}
	};
	this.draw = function(ctx) {
		for(var i in allPopups){
			var p = allPopups[i];
            switch (p.type) {
                case 'health':
                    ctx.font = "12px Tibia Font";
	                if (p.value >= 100) {
	                    ctx.font = "14px Tibia Font";
	                } else if (p.value >= 10) {
	                    ctx.font = "13px Tibia Font";
	                }
                	ctx.strokeStyle = '#000';
					ctx.lineWidth = 0.5;
                    ctx.fillStyle = 'rgba(210, 0, 0, 1)';
                    ctx.fillText(p.value, (p.x - GAME.player.x - GAME.player.ax+16) * gh - ctx.measureText(p.value).width/2 + 16, (p.y - GAME.player.y - GAME.player.ay+8) *gh - 12);
                    ctx.strokeText(p.value, (p.x - GAME.player.x - GAME.player.ax+16) * gh - ctx.measureText(p.value).width/2 + 16, (p.y - GAME.player.y - GAME.player.ay+8) *gh - 12);
                    ctx.lineWidth = 1;
                    break;
                case 'heal':
                    ctx.fillStyle = 'rgba(0, 210, 0, ' + (this.messageTime - frameTime) / duration + ')';
                    ctx.fillText(this.content, (this.x) * gh + 14, this.susp)
                    break;
                case 'exp':
                	ctx.font = "12px Tibia Font";
                    ctx.strokeStyle = '#000';
					ctx.lineWidth = 0.5;
                    ctx.fillStyle = '#fff';
                    ctx.fillText(p.value, (p.x - GAME.player.x - GAME.player.ax+16) * gh - ctx.measureText(p.value).width/2 + 16, (p.y - GAME.player.y - GAME.player.ay+8) *gh - 24);
                    ctx.strokeText(p.value, (p.x - GAME.player.x - GAME.player.ax+16) * gh - ctx.measureText(p.value).width/2 + 16, (p.y - GAME.player.y - GAME.player.ay+8) *gh - 24);
                    ctx.lineWidth = 1;
                    break;
            }
		}
	};

}
// function repositionTile() { // deprecated
//     if(!this) return;
//     this.style.left = this.x + 'px';
//     this.style.top = this.y + 'px';
// }
// function changeTileFrame(num) { // deprecated
//     if (!this) return;
//     this.style.backgroundPosition =
//         (-1 * (num % tilesSprite.tilesW) * tilesSprite.spriteX + 'px ') +
//         (-1 * (Math.floor(num / tilesSprite.tilesW) % tilesSprite.tilesH)) * tilesSprite.spriteY + 'px ';
// }
// function destroyTile() { // deprecated
//     if (!this) return;
//     this.parent.removeChild(this.element);
// }
// function Tile(parentElement, x, y, sprite) { // deprecated
//     // function references
//     this.reposition = repositionTile;
//     this.frame = changeTileFrame;
//     this.destroy = destroyTile;
//     // (default: foreground)
//     this.parent = parentElement ? parentElement : GAME.foreground;
//     // create a DOM sprite
//     this.element = document.createElement("div");
//     this.element.className = 'tile';
//     // optimized pointer to style object
//     this.style = this.element.style;
//     // starting position
//     this.x = x * 32;
//     this.y = y * 32;
//     this.reposition();

//     // random spritesheet frame
//     this.frame(sprite);
//     // put it into the game window
//     this.parent.appendChild(this.element);
// }
