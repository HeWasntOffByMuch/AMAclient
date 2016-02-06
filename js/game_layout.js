function GameLayout() {
	var gh = gameState.tileSize
	this.draw = function(ctx) {
		// DRAW PLAYER COMBAT ICON
		if(GAME.player.inCombat)
			ctx.drawImage(GAME.allImages['combat_icon'], GAME.canvas.width - 2*gh, gh, gh, gh);
		
	};
}

function makeAllOfThemWindowsNow(playerData) {


    // EQUIPMENT AND BACKPACK WINDOWS
	var serverBackpack = playerData.equipment.backpack;
    // console.log(playerData);
	GAME.WIN_BP = new guiWindow({
		width: 140,
        height: 165,
        title: "BACKPACK",
        icon: "bp.gif",
        onclose: function() {
            this.hide();
        },
        position: { y: 20, x: 20 },
        content: ['<div id=' + serverBackpack.name + ' class="slot bp" size_x=' + serverBackpack.w + ' size_y=' + serverBackpack.h + '></div>']
    }).setId('backpack');
    // function itemElement(size_x, size_y, parent, pos_x, pos_y, id, src)
    // var item = new itemElement(1, 1, bp, 0, 0, 1, 'item1.gif');
    var testid = 0;
    var bp = $('#backpack .bp').makeContainer();
    for(var i = 0; i < serverBackpack.w; i++){
    	for(var j = 0; j < serverBackpack.h; j++){
    		if(serverBackpack.contents[i][j]){
    			var item = serverBackpack.contents[i][j];
    			var img = GAME.allImages[item.name] || GAME.allImages['placeholder'];
	    		var itemEl = new itemElement(1, 1, bp, i, j, testid++, img.src, {
	    			name: item.name,
                    desc: item.desc,
                    attackCooldown: item.attackCooldown,
                    damageMin: item.damageMin,
                    damageMax: item.damageMax,
                    range: item.range
	    		});
	    	}
    	}
    }
	WIN_EQ = new guiWindow({
		width: 140,
        height: 165,
        title: "EQ",
        icon: "items/phantom_ganon.gif",
        onclose: function() {
            this.hide();
        },
        position: { y: 20, x: 182 },
        content: [
        			'<div id="head" class="slot head" size_x=1 size_y=1 pos_x="50px" pos_y="5px" ></div>',
        			'<div id="primary" class="slot primary" size_x=1 size_y=1 pos_x="10px" pos_y="45px" ></div>',
        			'<div id="secondary" class="slot secondary" size_x=1 size_y=1 pos_x="90px" pos_y="45px" ></div>',
        			'<div id="body" class="slot body" size_x=1 size_y=1 pos_x="50px" pos_y="45px" ></div>',
        			'<div id="legs" class="slot legs" size_x=1 size_y=1 pos_x="50px" pos_y="85px" ></div>',
        			'<div id="boots" class="slot boots" size_x=1 size_y=1 pos_x="50px" pos_y="125px" ></div>'
        		]
    }).setId('equipment');
	var eq = $('#equipment .slot').makeContainer(1, 1);
	$('#equipment .gui-window-content').children().each(function() {
		var div = $( this );
		var item = playerData.equipment[div.attr('id')];
		if(item){
			var img = GAME.allImages[item.name] || GAME.allImages['placeholder'];
			itemEl = new itemElement(1, 1, div, 0, 0, testid++, img.src, {
				name: item.name,
                desc: item.desc,
                attackCooldown: item.attackCooldown,
                damageMin: item.damageMin,
                damageMax: item.damageMax,
                range: item.range
			});
		}
	});



    // WINDOW THAT APPEARS ON DEATH
    WIN_DEATH = new guiWindow({
		width: 250,
        height: 100,
        title: "YOU ARE DEAD.",
        icon: "tombstone-icon.png"
    });
    WIN_DEATH.appendHTML("<div class='gui-clist-footer'><center><div class='form-field'><button type='button' id='button_respawn' class='anim-alt'>RESPAWN</button><button id='button_logout' type='button'>LOGOUT</button></div></center></div>");
    WIN_DEATH.center();
    WIN_DEATH.hide();
    $('#button_respawn').click(function() {
    	GAME.socket.emit('player-respawn-request', {});
    });
    $('#button_logout').click(function() {
    	GAME.socket.emit('player-logout-request', {});
    });



    //CHARACTED PROGRESSION WINDOW

    WIN_STATS = new guiWindow({
        width: 350,
        height: 512 - 37,
        title: 'YO STATS NIGGA',
        icon: "player_icon.png",
        position: { y: 20, x: 1224 }
    });
    WIN_STATS.setId('stats');


    WIN_STATS.appendHTML("<div style='position: absolute; top: 20px; font-size: 15px; font-weight:bold; border-bottom: 1px solid #676a5a;'><p>  LEVEL</p></div>");


    var ctxMenu = $( document.createElement("ul") ).addClass("ctx_menu").appendTo(document.body).hide();
    $(".ctx_menu").append($( document.createElement("li") ).addClass("ctx_item").attr('id', 'ctx_attack').text('attack'));
    $(".ctx_menu").append($( document.createElement("li") ).addClass("ctx_item").attr('id', 'ctx_open').text('open')).addClass("ctx_item");
    $(".ctx_menu").append($( document.createElement("li") ).addClass("ctx_sep"));
    $(".ctx_menu").append($( document.createElement("li") ).addClass("ctx_item").attr('id', 'ctx_look').text('look')).addClass("ctx_item");
}

function newLootWindow(loot) {
    var size = Object.keys(loot).length || 1;
    console.log('loot size', size);
    var WIN_LOOT = new guiWindow({
        width: 250,
        height: 80,
        title: 'LOOT',
        icon: "player_icon.png",
        position: { y: 400, x: 20 },
        content: ['<div id=' + 0 + ' class="slot bp" size_x=' + 4 + ' size_y=' + Math.ceil(size/4) + '></div>']
    });
    WIN_LOOT.setId('loot');
    var eq = $('#loot .slot').makeContainer();
}