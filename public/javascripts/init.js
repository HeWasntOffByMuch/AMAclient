// PRE-GAME STUFF
var GAME = {}; // all in one
$(function() {
    var t; // tmp for every fucking thing
    var token; //stores token to send back after request ahd been made;

    var SOCKET;

    var gameContainer = GAME.gameContainer = document.createElement("div");
    gameContainer.className = "game-container";
    document.body.appendChild(gameContainer);
    // 1. create game canvas
    var C = GAME.canvas = document.createElement('canvas');
    var ctx = GAME.ctx = C.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    C.className = 'canvas';
    C.width = 1024;
    C.height = 512;
    gameContainer.appendChild(C);

    // var F = GAME.foreground = document.createElement("div");
    // F.className = 'foreground';
    // gameContainer.appendChild(F);

    gameContainer.appendChild((t = document.createElement("img"), t.src = "./images/gradient_border.png", t.className = 'game-container-filter', t));


    // 2. login screen and logic
    $(".modal-cover").fadeIn();
    var WIN_LOGIN = new guiWindow({
        width: 300,
        height: 200,
        title: "LOG IN",
        icon: "login.png"
    });
    WIN_LOGIN.center();

    WIN_LOGIN.appendHTML("<form><div class='form-field'><label for='username'>USERNAME</label><br><input id='username' name='username' placeholder='USERNAME' type='text'></div><div class='form-field'><label for='password'>PASSWORD</label><br><input id='password' name='password' type='password' placeholder='PASSWORD'></div><br><div class='form-field'><label><input id='remember' name='remember' type='checkbox' disabled='true'> Remember me</label></div><br><div class='form-field'><button type='button' id='button_login' class='anim-alt'>LOG IN</button><button id='button_signup' type='button'>SIGN UP</button></div></form>");
    $('#username').focus();
    $("#password").keyup(function(event){
        if (event.keyCode == 13)
            $("#button_login").click();
    });
    $("input:password").chromaHash({
        bars: 4,
        salt: "7be82b35cb0199120eea35a4507c9acf",
        minimum: 6
    });
    $('#button_signup').click(function() {
        WIN_LOGIN.hide();
        var WIN_SIGNUP = new guiWindow({
            width:300,
            height: 200,
            title: 'SIGNUP',
            icon: 'login.gif',
            onclose: function() {
                this.close();
                WIN_LOGIN.show();
            }
        });
        WIN_SIGNUP.center();

        WIN_SIGNUP.appendHTML( "<form>"+
                                    "<div class='form-field'>"+
                                        "<label for='username'>USERNAME</label><br>"+
                                        "<input id='username_signup' name='username' placeholder='USERNAME' type='text'>"+
                                    "</div>"+
                                    "<div class='form-field'>"+
                                        "<label for='password'>PASSWORD</label><br>"+
                                        "<input id='password_signup' name='password' type='password' placeholder='PASSWORD'>"+
                                    "</div>"+
                                    "<div class='form-field'>"+
                                        "<label for='password'>REPEAT PASSWORD</label><br>"+
                                        "<input id='password_repeat' name='password' type='password' placeholder='REPEAT PASSWORD'>"+
                                    "</div><br>"+
                                    "<div class='form-field'>"+
                                    "<button id='button_register' type='button'>"+
                                    "<i class='fa fa-user-plus'></i> REGISTER</button>"+
                                    "</div>"+
                                "</form>");
        $('#username_signup').focus();
        $("#password_repeat").keyup(function(event) {
            if (event.keyCode == 13)
                $("#button_register").click();
        });
        $("input:password").chromaHash({
            bars: 4,
            salt: "7be82b35cb0199120eea35a4507c9acf",
            minimum: 6
        });

        $('#button_register').click(function() {
            var register = this;
            if ( !($("#username_signup").val()) ) { // no input in username field
                $('#username_signup').parent().addClass('taken');
                $(register).parent().addClass('taken');
                register.disabled = true;
                $('#username_signup').focus(function() {
                    $('#username_signup').parent().removeClass('taken');
                    $(register).parent().removeClass('taken');
                    register.disabled = false;
                });
            }
            else if( !($("#password_signup").val() && $("#password_repeat").val()) ){
                $("#password_signup").val() || $("#password_signup").parent().addClass('taken');
                $("#password_repeat").val() || $("#password_repeat").parent().addClass('taken');
                $(register).parent().addClass('taken');
                register.disabled = true;
                $('input:password').focus(function() {
                    $('input:password').parent().removeClass('taken');
                    $(register).parent().removeClass('taken');
                    register.disabled = false;
                });
            }
            else if($("#password_signup").val() != $("#password_repeat").val()){
                $(register).parent().addClass('taken');
                register.disabled = true;
                $('input:password').focus(function() {
                    $(register).parent().removeClass('taken');
                    register.disabled = false;
                });
            }
            else{
                $.ajax({
                    type: "POST",
                    url: "http://94jzlodc.apps.lair.io:8000",
                    data: {
                        action: 'signup',
                        username: $("#username_signup").val(),
                        password: $("#password_signup").val(),
                        password_repeat: $("#password_repeat").val()
                    },
                    statusCode: {
                        201: function() { //success
                            var WIN_YES = new guiWindow({
                                width: 200,
                                height: 75,
                                title: "Account created.",
                                onclose: function() {
                                    this.close();
                                }
                            });
                            WIN_YES.center();

                            WIN_YES.appendHTML("<div class='gui-clist-footer'><center><button type='button' id='ok_button'>OK</button></center></div>");
                            $("#ok_button").click(function() {
                                WIN_YES.close()
                            });
                            WIN_SIGNUP.close();
                            WIN_LOGIN.show();
                        },
                        202: function() { //username taken. make sure the fucker knows
                            console.log('server - name taken');
                            $('#username_signup').parent().addClass('taken');
                            $('#username_signup').val($('#username_signup').val() + ' is taken');
                            $(register).parent().addClass('taken');
                            register.disabled = true;
                            $('#username_signup').focus(function() {
                                $(this).parent().removeClass('taken');
                                $(this).val('');
                                $(register).removeClass('taken');
                                register.disabled = false;
                            });
                        },
                        500: function() { 
                            var WIN_NO = new guiWindow({
                                width: 200,
                                height: 75,
                                title: "SERVER ERROR",
                                onclose: function() {
                                    this.close();
                                }
                            });
                            WIN_NO.center();

                            WIN_NO.appendHTML("<div class='gui-clist-footer'><center><button type='button' id='ok_button'>OK</button></center></div>");
                            $("#ok_button").click(function() {
                                WIN_NO.close()
                            });
                        }
                    },
                    error: function(q, w, e) {
                        console.log(q, w, e)
                    }
                });
            }
        });



    });

    $("#button_login").click(function() {
        // if($("#password").val().length < 6){ //append red message
        //     return;
        // }
        $.ajax({
            type: "POST",
            url: "http://94jzlodc.apps.lair.io:8000",
            data: {
                action: 'login',
                username: $("#username").val(),
                password: $("#password").val()
            },
            statusCode: {
                401: function() {
                        var WIN_NO = new guiWindow({
                            width: 200,
                            height: 75,
                            title: "INVALID CREDENTIALS"
                        });
                        WIN_NO.center();

                        WIN_NO.appendHTML("<div class='gui-clist-footer'><center><button type='button' id='ok_button'>OK</button></center></div>");
                        $("#ok_button").click(function(){
                            WIN_NO.close();
                        });
                }
            },
            success: function(data) {
                token = data;
                SOCKET = GAME.socket = io.connect('http://94jzlodc.apps.lair.io:8000', {
                });
                SOCKET.on('connect', function() {
                    console.log('connected to socket.');
                });
                SOCKET.on('token-request', function(data) {
                    SOCKET.emit('send-token', token);
                });
                SOCKET.on('connect_error', function(err) {
                    SOCKET.disconnect();
                    $(".loading-table").remove();
                });
                SOCKET.on('server-message', function(data) {
                    console.log(data.message);
                });
                SOCKET.on('player-created', function(data) {
                    if(data){//player created successfully
                        $(".gui-clist-container").append("<div class='gui-clist-item' idd='" + data.id + "'><div class='avatar'></div><div style='padding:4px;'>" + data.name + "<div style='font-size:11px;line-height:11px;'>Level " + data.level + " Human<br>total time online: " + Math.floor(data.timePlayed/1000) + "s</div></div></div>");
                        $(".gui-clist-item").click(function() {
                            $(".gui-clist-item").removeClass("pressed");
                            $(this).addClass("pressed");
                        });
                    }
                    else{ //flash the new_char button
                        $('#new_char')[0].disabled = true;
                        setTimeout(function() {
                            $('#new_char')[0].disabled = false;
                        }, 300)
                    }
                });
                

                WIN_LOGIN.appendHTML("<table class='loading-table'><tr><td style='text-align:center'><img src='./images/loading.gif'><br><b>PLEASE WAIT</b></td></tr></table>");

                SOCKET.on('send-players', function(data) {
                    console.log(data)
                    WIN_LOGIN.close();
                    $(".modal-cover").fadeOut().fadeIn(function() {
                        var WIN_PICK = new guiWindow({
                            width: 300,
                            height: 400,
                            title: "SELECT CHARACTER",
                            icon: "wizard_hat.png"
                        });
                        WIN_PICK.center();

                        WIN_PICK.appendHTML("<div class='gui-clist'><div class='gui-clist-container' id='gcc'></div><div class='gui-clist-footer'><div class='form-field'><button type='button' id='new_char' class='anim-alt'>NEW CHAR</button><button id='play' type='button'>PLAY</button></div></div></div>");
                        SOCKET.on('map-update', function(data) {
                            console.log(data)
                            build();
                            function build(){
                                if(!GAME.instance || !GAME.map){
                                    setTimeout(function(){ build(); }, 100)
                                }
                                else{
                                    GAME.map.populateTiles(data.tiles);
                                    GAME.map.populateCollisions(data.tiles);
                                    // GAME.map.appendTiles();
                                }
                            }
                            
                            //window.localStorage format the data and put it there.
                        });
                        for (var i = 0; i < data.length; i++) {
                            $(".gui-clist-container").append("<div class='gui-clist-item' idd='" + data[i].id + "'><div class='avatar'></div><div style='padding:4px;'>" + data[i].name + "<div style='font-size:11px;line-height:11px;'>Level " + data[i].level + " Human<br>total time online: " + Math.floor(data[i].timePlayed/1000) + "s</div></div></div>");
                        }

                        // $(".gui-clist-container").first().addClass("pressed");

                        $(".gui-clist-item").click(function() {
                            $(".gui-clist-item").removeClass("pressed");
                            $(this).addClass("pressed");
                        });

                        $("#play").click(function() {
                            if($(".gui-clist-item.pressed").attr("idd")){
                                SOCKET.emit('start-game', {
                                    id: $(".gui-clist-item.pressed").attr("idd")
                                });
                            }
                            else{
                                $('#play')[0].disabled = true;
                                setTimeout(function() {
                                    $('#play')[0].disabled = false;
                                }, 300)
                            }
                            SOCKET.on('start-game-ok', function(data) {
                                WIN_PICK.close();
                                GAME.instance = new Game(data.playerData, data.mapSize, data.chunkSize);
                                $(".game-container").css('background-color', '#000');
                                $(".modal-cover").fadeOut();
                            });
                        });
                        $('#new_char').click(function() {
                            var name = prompt('gif name');
                            SOCKET.emit('create-player', {name: name})
                        });
                    });

                });
            },
            error : function(q, w, e) {
                console.log(q, w, e)
            }

        });
    });
});