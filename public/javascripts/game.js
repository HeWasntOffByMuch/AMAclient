function Game(playerData, map_size, chunkSize) {
    console.log('new game instance created')
    gameState = {
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

    /* GAME OBJECTS */
    var mobs_data = {};
    this.getMobsData = function() {
        return mobs_data;
    };
    var players_data = {};
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

    var targetedUnit = null;


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
        if (targetedUnit) targetedUnit.isTargeted = false;
        targetedUnit = mobzz.min(function(e) {
            return Math.pow((e.x - player.x), 2) + Math.pow((e.y - player.y), 2);
        });
        targetedUnit && (targetedUnit.isTargeted = true);
    }

    /* CLICK EVENT HANDLER */
    function handleClick(e) {
        if (event.which == 2 || event.which == 3) return; //return on middle and right click
        // mousepos = {
        //     x: (e.clientX - canvas.getBoundingClientRect().left),
        //     y: (e.clientY - canvas.getBoundingClientRect().top)
        // };
        if (mousepos.y > 430) return; // GUI
        var gameX = Math.floor((mousepos.x / gh) + map.x - 16);
        var gameY = Math.floor((mousepos.y / gh) + map.y - 8);
        player.moveQ.findPath(player.tx, player.ty, gameX, gameY);

        for (var i in mobs_data) {
            var enemy = mobs_data[i];
            if (gameX == enemy.tx && gameY == enemy.ty) {
                if (targetedUnit && targetedUnit != enemy) targetedUnit.isTargeted = false;
                (targetedUnit = enemy).isTargeted = !(targetedUnit.isTargeted);
                player.moveQ.currentPath = [];
                return;
            }
        }
        // for (var i in players_data) {
        //     if (players_data[i].id == player.id) continue;
        //     var enemy = players_data[i];
        //     if (gameX == enemy.tx && gameY == enemy.ty) {
        //         if (targetedUnit && targetedUnit != enemy) targetedUnit.isTargeted = false;
        //         (targetedUnit = enemy).isTargeted = !(targetedUnit.isTargeted);
        //         player.moveQ.currentPath = [];
        //         return;
        //     }
        // }
    }
    function drawChunks(ctx){
        var player = GAME.player;
    }
    /* DRAW OBJECTS */
    function draw(ctx) {
        ctx.clearRect(0, 0, GAME.canvas.width, GAME.canvas.height);

        map.draw(ctx);
        player.draw(ctx);
        for(var i in players_data){
            players_data[i].draw(ctx);
        }
        for(var i in mobs_data){
            mobs_data[i].draw(ctx);
        }
        
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
        if(map && player)
            player.update();
        if(map){
            map.update();
        }
        for(var i in players_data){
            players_data[i].update();
        }
        for(var i in mobs_data){
            mobs_data[i].update();
        }
        movementCheck.update();

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
             console.log(mobs_data);
        }
        if (key == "49") {
             GAME.player.attack(targetedUnit);
        }

        lastKeyEvent = null;
    }

    $(function() {
        $(document).keydown(function(e) {
            lastKeyEvent = e;
        });
        $('.game-container-filter').mousemove(function(e){ mousepos = {x: (e.clientX - canvas.getBoundingClientRect().left), y:(e.clientY - canvas.getBoundingClientRect().top)}; });
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
                    player.healthCur = data[p].healthCur;
                    player.healthMax = data[p].healthMax;
                    // continue; // that means dont create nor update otherPlayer for GAME.player
                }
                if(!players_data.hasOwnProperty(id)){
                    players_data[id] = new OtherPlayer(gameState, data[p]);
                    console.log('added player from server');
                } else {
                    if(players_data[id].tx != data[p].tx || players_data[id].ty != data[p].ty)
                        players_data[id].move(data[p].tx, data[p].ty);
                    players_data[id].healthCur = data[p].healthCur;
                }
            } else if(data[p].type === enums.objType.MOB) {
                if(!mobs_data.hasOwnProperty(id)){
                    mobs_data[id] = new Mob(gameState, data[p]);
                    console.log('added mob from server');
                } else {
                    if(mobs_data[id].tx != data[p].tx || mobs_data[id].ty != data[p].ty)
                        mobs_data[id].move(data[p].tx, data[p].ty);
                    mobs_data[id].healthCur = data[p].healthCur;
                }
            }
        }
    });
    socket.on('mob-death', function(data) { //primitive for now.
        mobs_data[data.id].die();
    });
    socket.on('player-disconnected', function(data) {
        
    });
}