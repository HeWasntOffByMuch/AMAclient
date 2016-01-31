function Game(playerData, map_size, chunkSize) {
    console.log('new game instance created')
    gameState = {
        chunkSize: {x: 32, y: 16},
        frameTime: new Date().getTime(),
        tileSize: 32,
        mapSize: map_size
    }
    var canvas = GAME.canvas;
    var gh = 32;
    var ctx = GAME.ctx;
    var socket = GAME.socket;
    var map = GAME.map = new Map(playerData.x, playerData.y, gameState);
    var player = GAME.player = new Player(null, gameState, playerData);
    var movementCheck = new MovementCheck(player);
    var entityManager = GAME.entityManager = new EntityManager();
    var popupManager = GAME.popupManager = new PopupManager();
    var anims = GAME.anims = new AnimationManager();

    /* GAME OBJECTS */
    var mobs_data = {};
    var players_data = {};
    this.getMobsData = function() {
        return mobs_data;
    };
    this.getPlayersData = function() {
        return players_data;
    };
    // var entities = new EntityManager();

    var popups = [];
    // var missiles = new Missiles();

    /* GUI */
    // var actionBar = new ActionBar();
    // var experienceBar = new ExperienceBar();  
    // var audio = new AudioManager();
    // var statusMessage = new StatusMessage(canvas);

    // socket.emit('request-map-world', {});  

    /* FRAME HANDLING */
    var lastKeyEvent;
    

    var mousepos = {
        x: 0,
        y: 0
    };

    GAME.targetedUnit = null;


    if (!window.requestAnimationFrame) {
        window.requestAnimationFrame = (function() {
            return window.webkitRequestAnimationFrame ||
                window.mozRequestAnimationFrame ||
                window.oRequestAnimationFrame ||
                window.msRequestAnimationFrame ||
                function(callback, element) {
                    window.setTimeout(callback, 1000 / 60);
                };
        })();
    }
    requestAnimationFrame(update);

    function autoTarget() {
        if (GAME.targetedUnit) GAME.targetedUnit.isTargeted = false;
        GAME.targetedUnit = mobzz.min(function(e) {
            return Math.pow((e.x - player.x), 2) + Math.pow((e.y - player.y), 2);
        });
        GAME.targetedUnit && (GAME.targetedUnit.isTargeted = true);
    }

    /* CLICK EVENT HANDLER */
    function handleClick(e) {
        if (event.which == 2 || event.which == 3) return; //return on middle and right click
        // mousepos = {
        //     x: (e.clientX - canvas.getBoundingClientRect().left),
        //     y: (e.clientY - canvas.getBoundingClientRect().top)
        // };
        if (mousepos.y > 430) return; // GUI
        var destX = GAME.destX = Math.floor((mousepos.x / gh) + map.x - 16);
        var destY = GAME.destY = Math.floor((mousepos.y / gh) + map.y - 8);
        player.moveQ.findPath(player.tx, player.ty, destX, destY);

        for (var i in mobs_data) {
            var enemy = mobs_data[i];
            if (destX == enemy.tx && destY == enemy.ty) {
                if (GAME.targetedUnit && GAME.targetedUnit != enemy) GAME.targetedUnit.isTargeted = false;
                (GAME.targetedUnit = enemy).isTargeted = !(GAME.targetedUnit.isTargeted);
                player.moveQ.currentPath = [];
                return;
            }
        }
        for (var i in players_data) {
            if (players_data[i].id == player.id) continue;
            var enemy = players_data[i];
            if (destX == enemy.tx && destY == enemy.ty) {
                if (GAME.targetedUnit && GAME.targetedUnit != enemy) GAME.targetedUnit.isTargeted = false;
                (GAME.targetedUnit = enemy).isTargeted = !(GAME.targetedUnit.isTargeted);
                player.moveQ.currentPath = [];
                return;
            }
        }
    }
    function drawChunks(ctx){
        var player = GAME.player;
    }
    /* DRAW OBJECTS */
    function draw(ctx) {
        ctx.clearRect(0, 0, GAME.canvas.width, GAME.canvas.height);

        map.draw(ctx);
        entityManager.draw(ctx);
        for(var i in mobs_data){
            mobs_data[i].draw(ctx);
        }
        for(var i in players_data){
            players_data[i].draw(ctx);
        }
        player.draw(ctx);
        
        popupManager.draw(ctx);
        anims.draw(ctx);

        ctx.fillStyle = "rgba(0,0,0,0.1)";
        ctx.fillRect(Math.floor(mousepos.x / gh) * gh, Math.floor(mousepos.y / gh) * gh, gh, gh);
        
        //DEBUG
        drawChunks(ctx);

    }


    /* GAME LOOP */
    function update() {
        gameState.frameTime = new Date().getTime();
        // audio.update();
        checkInput();
        player.update();
        map.update();
        for(var i in players_data){
            players_data[i].update();
        }
        for(var i in mobs_data){
            mobs_data[i].update();
        }
        movementCheck.update();
        popupManager.update();
        anims.update();
        // map.update(player);
        // entities.update();
        // actionBar.update();
        // experienceBar.update();

        // player.update();

        // for(var i in players_data) players_data[i].update();
        // for(var i in mobs_data) mobs_data[i].update();

        // missiles.update();

        // statusMessage.update();
        // for(var i = 0; i<popups.length;i++) popups[i].update();
        draw(ctx);
        requestAnimationFrame(update);
    }

    function checkInput() {
        if (!lastKeyEvent) return;

        var e = lastKeyEvent;
        var key = e.which;
        if (key == "87") {
            GAME.player.move(0, -1);
        }
        if (key == "83") {
             GAME.player.move(0, 1);
        }
        if (key == "68") {
             GAME.player.move(1, 0);
        }
        if (key == "65") {
             GAME.player.move(-1, 0);
        }
        if (key == "117") {
            var a = prompt();
             socket.emit('ping', a);
        }
        if (key == "49") {
            if(GAME.targetedUnit)
                GAME.player.attack(GAME.targetedUnit);
        }

        lastKeyEvent = null;
    }

    $(function() {
        $(document).keydown(function(e) {
            lastKeyEvent = e;
        });
        $('.game-container-filter').mousemove(function(e){
            var canvasX = canvas.width/$('.canvas').width();
            var canvasY = canvas.height/$('.canvas').height();
            mousepos = {x: (e.clientX - canvas.getBoundingClientRect().left)*canvasX, y:(e.clientY - canvas.getBoundingClientRect().top)*canvasY};
        });
        $('.game-container-filter').on('dragstart', function(event) { event.preventDefault(); });
        $('.game-container-filter').mousedown(handleClick)
    });
    socket.on('player-data-update', function(data) {
        for(var p in data){
            var id = data[p]._id;
            if(data[p].type === enums.objType.PLAYER){
                if(id == player.id){
                    // movementCheck.addClientMove(player.tx, player.ty);
                    // movementCheck.addServerMove(data[p].tx, data[p].ty);
                    // movementCheck.check(data[p].tx, data[p].ty)
                    player.updateHealth(data[p].healthCur);
                    player.healthMax = data[p].healthMax;
                    continue; // that means dont create nor update otherPlayer for GAME.player
                }
                if(!players_data.hasOwnProperty(id)){
                    players_data[id] = new OtherPlayer(gameState, data[p]);
                    // console.log('added player from server');
                } else {
                    if(players_data[id].tx != data[p].tx || players_data[id].ty != data[p].ty)
                        players_data[id].move(data[p].tx, data[p].ty);
                    players_data[id].updateHealth(data[p].healthCur);
                }
            } else if(data[p].type === enums.objType.MOB) {
                if(!mobs_data.hasOwnProperty(id)){
                    mobs_data[id] = new Mob(gameState, data[p]);
                    // console.log('added mob from server');
                } else {
                    if(mobs_data[id].tx != data[p].tx || mobs_data[id].ty != data[p].ty)
                        mobs_data[id].move(data[p].tx, data[p].ty);
                    mobs_data[id].updateHealth(data[p].healthCur);
                }
            }
        }
    });
    socket.on('mob-death', function(data) { //primitive for now.
        if(mobs_data.hasOwnProperty(data.id))
            mobs_data[data.id].die();
    });
    socket.on('player-disconnected', function(data) {
        
    });
    socket.on('move-invalid', function(data) {
        console.log('snapback from server')
        player.x = data.x;
        player.y = data.y;
        player.tx = data.x;
        player.ty = data.y
    });
    socket.on('you-have-died', function() {
        console.log('player died')
        player.die();
        //add come cover
        //add button to respawn
    });
    socket.on('player-logout-response', function() {
        $(location)[0].reload();
    });
    socket.on('player-respawn-response', function(data) {
        player.respawn(data.x, data.y);
    });
    socket.on('map-entity-added', function(data) {
        entityManager.addEntity(data.id, data.entity);
    });
    socket.on('map-entity-removed', function(data) {
        entityManager.removeEntity(data.id);
    });
    socket.on('other-player-died', function(data) {
        if(data.id != player.id)
            players_data[data.id].die();
    });
}