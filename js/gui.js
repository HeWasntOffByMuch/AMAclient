(function($) {
  var _globalWindowDragged = null;
  var _globalWindowsCodragged = null;
  var _globalResizedWindow = null;
  var _globalDragAnchor = null;
  var _globalResizeDir = null;
  var _globalDraggedItem = null;
  var _globalZIndex = 999;
  var _globalFakeItem = $(document.createElement("div")).addClass("globalFakeItem");
  var _globalItemAnchor = null;
  var _globalTooltip = $(document.createElement("div")).addClass("globalTooltip").appendTo(document.body).hide();
  var _globalTooltipTO;
  var _globalWindows = [];

  var windowDefaults = {
    width: 200,
    height: 300,
    closeable: true,
    resizable: true,
    onclose: null,
    position: {x:100, y:100},
    title: "New window",
    icon: null,
    onclose: function() {
      this.close();
    }
  };
  
  
  function guiWindow(options) {
    var options = $.extend({}, windowDefaults, options);
    var div = $( document.createElement("div") ).addClass("gui-window").appendTo(document.body);
    div.css({
      height: options.height + 37,
      width: options.width + 12,
      top: options.position.y,
      left: options.position.x
    });
    _globalWindows.push(div);
    
    var header = $(document.createElement("div")).addClass("gui-window-header").appendTo(div);
    var icon = $(document.createElement("div")).addClass("gui-window-header-icon").appendTo(header);
    if (options.icon) icon.css("background-image","url(./img/"+options.icon+")");
    var title = $(document.createElement("div")).addClass("gui-window-header-text").appendTo(header);
    title.html(options.title);
    var buttons = $(document.createElement("div")).addClass("gui-window-header-buttons").appendTo(header);
    buttons.append('<div title="Close" class="button_close">×</div>');
    var border = $(document.createElement("div")).addClass("gui-window-border").appendTo(div);
    var content = $(document.createElement("div")).addClass("gui-window-content").appendTo(div);
    
    options.content && content.append(options.content);

    header.mousedown(function(e){
      _globalWindowDragged = div;
      _globalWindowsCodragged = [];
      findGluedWindows(div);
      div.css("z-index",++_globalZIndex);
      _globalDragAnchor = [e.clientX-div.position().left, e.clientY-div.position().top];
      e.preventDefault();
      return false;
    });
    div.mousedown(function(e) {
      div.css("z-index",++_globalZIndex);
    })
      
    div.find(".button_close").click(options.onclose.bind(this));
      
    if(options.resizable) {
      border.mousemove(function(e){
        var left = e.clientX - div.position().left + document.body.scrollLeft;
        var right = div.position().left + div.outerWidth() - e.clientX - document.body.scrollLeft;
        var bottom = div.position().top + div.outerHeight() - e.clientY - document.body.scrollTop;        
        if (left < 10) {
          if(bottom < 10) {
            $(this).css("cursor","sw-resize");
          } else {
            $(this).css("cursor","w-resize");
          }
        } else if (right < 10) {
          if(bottom < 10) {
            $(this).css("cursor","se-resize");
          } else {
            $(this).css("cursor","e-resize");
          }
        } else {
          $(this).css("cursor","s-resize");
        }
      });
      
      border.mousedown(function(e){
        var left = e.clientX - div.position().left + document.body.scrollLeft;
        var right = div.position().left + div.outerWidth() - e.clientX - document.body.scrollLeft;
        var bottom = div.position().top + div.outerHeight() - e.clientY - document.body.scrollTop;        
        if (left < 10) {
          if(bottom < 10) {
            _globalResizeDir = "sw";
          } else {
            _globalResizeDir = "w";
          }
        } else if (right < 10) {
          if(bottom < 10) {
            _globalResizeDir = "se";
          } else {
            _globalResizeDir = "e";
          }
        } else {
          _globalResizeDir = "s";
        }
        _globalResizedWindow = div;
        e.preventDefault();
        return 0;
      });
    }

    this.center = function(){
      div.css({
        top: Math.max(0, (($(window).height() - div.outerHeight()) / 2) + $(window).scrollTop()),
        left: Math.max(0, (($(window).width() - div.outerWidth()) / 2) + $(window).scrollLeft())
      });
    };

    this.close = function(){
      div.remove();
    };

    this.show = function(){
      div.show();
      div.css("z-index",++_globalZIndex);
    };

    this.hide = function(){
      div.hide();
    };

    this.appendHTML = function(){
      content.append($(arguments[0]));
    };

    this.changeTitle = function(t) {
      title.html(t);
    };

    this.setId = function(id) {
      div.attr('id', id);
    };

    return this;
  };
  
  window.guiWindow = guiWindow;
  
  function findGluedWindows(div){
    for(var i = 0; i < _globalWindows.length; i++) {
      if(_globalWindows[i].is(':hidden')) continue;
      var epos = _globalWindows[i].position();
      var goodrect = div.position();
      goodrect.top += div.outerHeight();
      goodrect.width = div.outerWidth();
      if(epos.left < goodrect.left + goodrect.width && epos.left + _globalWindows[i].outerWidth() > goodrect.left && epos.top >= goodrect.top-20 && epos.top <= goodrect.top+20) {
        _globalWindowsCodragged.push({el:_globalWindows[i], dx:_globalWindows[i].position().left-_globalWindowDragged.position().left, dy:_globalWindows[i].position().top-_globalWindowDragged.position().top});
        findGluedWindows(_globalWindows[i]);
      }
    }
  }
  
   $.fn.makeContainer = function(size_x, size_y, pos_x, pos_y) {
    this.each(function() {
      var div = $( this );
      var size_x = div.attr("size_x") || size_x;
      var size_y = div.attr("size_y") || size_y;
      var pos_x = div.attr("pos_x") || pos_x;
      var pos_y = div.attr("pos_y") || pos_y;
      div[0].data = [];
      for(var i = 0; i < size_x; i++) {
        div[0].data[i] = []; 
        for(var j = 0; j < size_y; j++) 
          div[0].data[i][j] = 0;
      }
      div.css({
        width: size_x*32,
        height: size_y*32
      });
      div.css({
        top: pos_y,
        left: pos_x
      });
      div.mousemove(function(e){
        if(_globalDraggedItem) {
          var w = _globalDraggedItem.attr("w");
          var h = _globalDraggedItem.attr("h");
          
        }
      });
      div[0].ondrop = function(ev){
        var offset = $(this).offset();
        var position = {};
        position.left = ev.clientX - offset.left + document.body.scrollLeft;
        position.top = ev.clientY - offset.top + document.body.scrollTop;
        var pos = {left: Math.floor((position.left-_globalItemAnchor.left) / 32), top: Math.floor((position.top-_globalItemAnchor.top) / 32)};
        var valid = 1;

        var data = ev.dataTransfer.getData("text"); //item id apparently
        var parentId = ev.dataTransfer.getData("parent_id"); // items previous parent element id

        // adding and removing slot image
        $('#' + parentId).addClass(parentId);
        $(this).removeClass(div[0].id);

        var size = {x: $("#"+data).attr("size_x"), y: $("#"+data).attr("size_y")};
        var pos_old = $("#"+data).position();

        if(GAME.player.isDead) valid = 0; //cant move items when you're dead

        // dont allow putting things into entities - makes sense? prebably not
        if ($('#' + div[0].id).hasClass('entity')) valid = 0;
        if (pos.left < 0 || pos.top < 0){
          valid = 0;
        }
        else{
          for(var i = 0; i < size.x; i ++){
            for(var j = 0; j < size.y; j ++) {
              if (pos.left+i >= size_x || pos.top+j >= size_y || div[0].data[pos.left+i][pos.top+j])
                valid = 0;
            }
          }
        }
        if (valid) {
          
          $("#"+data).appendTo(div).css({
            left: pos.left*32,
            top: pos.top*32
          });
          // console.log($("#"+data).parent().attr('id'));

          if($('#' + parentId).hasClass('entity')){
            //items inside entityies are indexed from 0. no [][].
            var x = pos_old.left / 32;
            var y = pos_old.top / 32;
            var obj_pos = (y*4) + x;
            var from = {id: parentId, pos: obj_pos};
            // this is player inventory - atandard array
            var to = {id: div[0].id, x: pos.left, y: pos.top};
            
            GAME.player.lootEntity(from, to);
          }
          else{
            var from = {id: parentId, x: pos_old.left / 32, y: pos_old.top / 32};
            var to = {id: div[0].id, x: pos.left, y: pos.top};
            GAME.player.moveInventoryItem(from, to);
          }


          for(var i = 0; i < size.x; i ++) for(var j = 0; j < size.y; j ++) {
            div[0].data[pos.left+i][pos.top+j] = 1;
          }     
        }
        ev.preventDefault();
      };
      div[0].ondragover = function(ev){
        var position = {};
        var offset = $(this).offset();
        position.left = ev.clientX - offset.left + document.body.scrollLeft;
        position.top = ev.clientY - offset.top + document.body.scrollTop;
        
        var data = ev.dataTransfer.getData("text");
        var size = {x: $("#"+data).attr("size_x"), y: $("#"+data).attr("size_y")};
        
        var pos = {left: Math.floor((position.left-_globalItemAnchor.left) / 32), top: Math.floor((position.top-_globalItemAnchor.top) / 32)};
        var valid = 1;
        if (pos.left < 0 || pos.top < 0) valid = 0;
        else for(var i = 0; i < size.x; i ++) for(var j = 0; j < size.y; j ++) {
          if (pos.left+i >= size_x || pos.top+j >= size_y || div[0].data[pos.left+i][pos.top+j]) valid = 0;
        }
        _globalFakeItem.appendTo(div).show().css({
          backgroundColor: valid?'green':'red',
          left: pos.left*32,
          top: pos.top*32,
          width: size.x * 32,
          height: size.y * 32
        });
        if(valid) ev.preventDefault();
      };
    });
    return this;
  };
  var itemDefaults = {
    name: 'Default Name',
    rarity: 'common',
    desc: 'default description descriptively describing undescribable item',
    damage: '4-7',
    defense: '5',
    attackCooldown: 400
  };
  function itemElement(size_x, size_y, parent, pos_x, pos_y, id, src, options) {
    var options = $.extend({}, itemDefaults, options);
      var div = $( document.createElement("div") ).addClass("item").appendTo(parent).css({
        left: (pos_x||0)*32,
        top: (pos_y||0)*32
      });;
      div.prop("draggable", true);
      div.attr("size_x", size_x);
      div.attr("size_y", size_y);
      div.css({
        width: size_x*32,
        height: size_y*32
      });
      div.css("background-image", 'url(' + src + ')');
      div.attr("id", id);
      div.addClass("item");
      div.appendTo(parent).css({
        left: (pos_x||0)*32,
        top: (pos_y||0)*32
      });
      $("#" + parent.attr('id')).removeClass(parent.attr('id')) //get rid of item-type ghost image
      div[0].ondragstart = function(ev) {
        ev.dataTransfer.setData("text", ev.target.id);
        ev.dataTransfer.setData("parent_id", div.parent()[0].id);
        for(var i = 0; i < size_x; i ++) for(var j = 0; j < size_y; j ++) {
          var pos_old = div.position();
          div.parent()[0].data[pos_old.left/32+i][pos_old.top/32+j] = 0;
        }
        _globalItemAnchor = {left: Math.floor((ev.clientX - div.offset().left + document.body.scrollLeft)/32)*32, top: Math.floor((ev.clientY - div.offset().top + document.body.scrollTop)/32)*32};

        ev.dataTransfer.setDragImage(div[0], ev.offsetX, ev.offsetY);
        ev.dataTransfer.effectAllowed = "move";
        clearTimeout(_globalTooltipTO);
        _globalTooltip.hide();
      }
      div[0].ondragend = function(ev) {
        _globalFakeItem.hide();
        for(var i = 0; i < size_x; i ++) for(var j = 0; j < size_y; j ++) {
          var pos_old = div.position();
          div.parent()[0].data[pos_old.left/32+i][pos_old.top/32+j] = 1;
        }
      }
      div.mouseover(function(ev){
        clearTimeout(_globalTooltipTO);
        _globalTooltip.hide();     
      });
      div.mousemove(function(ev){
        clearTimeout(_globalTooltipTO);
        _globalTooltip.hide();
         _globalTooltipTO = setTimeout(function(){
          _globalTooltip.css({
            width: 200,
            height: 100,
            left: ev.clientX + 10,
            top: ev.clientY + 10
          }).show();
          _globalTooltip.html("<div style='color:gold; border-bottom: 1px solid #676a5a;font-weight:bold;'>"+ options.name +"<span style='float:right'>"+ options.rarity +"</span></div><div style='color:#676a5a; border-bottom: 1px solid #676a5a;font-style:italic;font-size:9px;'>"+ options.desc +"</div><table><tr><td align=left width=130>Damage</td><td align=right style='color:#00ff00;font-weight:bold;'>" + options.damageMin + "-" + options.damageMax + "</td></tr><tr><td align=left width=130>atk speed</td><td align=right style='color:#ff0000;font-weight:bold;'>"+ (1000/options.attackCooldown).toFixed(3) +"/s</td></tr><tr><td align=left width=130>range</td><td align=right style='color:#ff0000;font-weight:bold;'>"+ Math.floor(options.range) +"</td></tr></table>");
        },500);
      });
      div.mouseout(function(){
          clearTimeout(_globalTooltipTO);
        _globalTooltip.hide();
      });
      for(var i = 0; i < size_x; i ++) for(var j = 0; j < size_y; j ++) {
        parent[0].data[(pos_x||0)+i][(pos_y||0)+j] = 1;
      }
    return this;
  };

  window.itemElement = itemElement;  // ?? really?

  $(document).ready(function(){
    $(document.body).mousemove(function(e) {
      if(_globalWindowDragged){
        var epos = {left:e.clientX - _globalDragAnchor[0], top: e.clientY - _globalDragAnchor[1]};
        var toppopr = 0;
        for(var i = 0; i < _globalWindows.length; i++) {
          var goodrect = _globalWindows[i].position();
          goodrect.top += _globalWindows[i].outerHeight();
          goodrect.width = _globalWindows[i].outerWidth();
          if(epos.left < goodrect.left + goodrect.width && epos.left + _globalWindowDragged.outerWidth() > goodrect.left && epos.top >= goodrect.top-20 && epos.top <= goodrect.top+20) {
            toppopr= goodrect.top+2;
            break;
          }
        }
        _globalWindowDragged.css({
          left: e.clientX - _globalDragAnchor[0],
          top: toppopr || (e.clientY - _globalDragAnchor[1])
        });
        for(var i = 0; i < _globalWindowsCodragged.length; i++) {
          _globalWindowsCodragged[i].el.css({
            left: e.clientX - _globalDragAnchor[0] + _globalWindowsCodragged[i].dx,
            top: (toppopr || (e.clientY - _globalDragAnchor[1])) +_globalWindowsCodragged[i].dy
          });
        }
        _globalWindowDragged.find(".header").css("cursor","move");
      }
      if(_globalResizedWindow){
        if (_globalResizeDir.indexOf("s") != -1)
          _globalResizedWindow.css({height: Math.max(e.clientY - _globalResizedWindow.position().top + document.body.scrollTop + 3, 80)});
        if (_globalResizeDir.indexOf("e") != -1)
          _globalResizedWindow.css({width: Math.max(e.clientX - _globalResizedWindow.position().left + document.body.scrollLeft + 3, 100)});
        if (_globalResizeDir.indexOf("w") != -1) {
          _globalResizedWindow.css({width: Math.max(_globalResizedWindow.outerWidth() + _globalResizedWindow.position().left - e.clientX -document.body.scrollLeft + 3, 100), left: Math.min(e.clientX + document.body.scrollLeft -3, _globalResizedWindow.outerWidth() + _globalResizedWindow.position().left +  -102)});
        }
      }
    });
    $(document.body).mouseup(function(e) {
      if(_globalWindowDragged){
        _globalWindowDragged.find(".header").css("cursor","default");
        _globalWindowDragged = null;
      }
      if(_globalResizedWindow){
        _globalResizedWindow = null;
      }
    });
    _globalTooltip.mousemove(function(ev){
      clearTimeout(_globalTooltipTO);       
    });
    _globalTooltip.mouseout(function(){
      _globalTooltipTO = setTimeout(function(){
        _globalTooltip.hide();
      },200);
    });
    
    /*
    $("#c1 img")[0].ondragstart = function(ev) {
      ev.dataTransfer.setData("text", "item1");
      _globalItemAnchor = {left: 0, top: 0};

      ev.dataTransfer.setDragImage($("#item1")[0], 16, 16);
      ev.dataTransfer.effectAllowed = "move";
      clearTimeout(_globalTooltipTO);
      _globalTooltip.hide();
    }
    $("#c1 img")[0].ondragend = function(ev) {
      _globalFakeItem.hide();    
    }
    */
  });
}( jQuery ));