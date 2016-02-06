GAME.urlDict = {
  'placeholder': {src: 'img/placeholder.png', spriteX: 32, spriteY: 32, spriteN: 1},
  'Bat': { src: 'img/mobs/bat_sprite.png', spriteX: 32, spriteY: 32, spriteN: 8 },
  'BatDead': { src: 'img/mobs/bat_sprite_dead.png', spriteX: 32, spriteY: 32, spriteN: 1 },
  'BigBat': { src: 'img/mobs/bat_sprite_big.png', spriteX: 32, spriteY: 21, spriteN: 8 },
  'Dummy': {src: 'img/mobs/target_dummy.png', spriteX: 32, spriteY: 32, spriteN: 1},
  'Fly_right': {src: 'img/mobs/fly_run_right.png', spriteX: 32, spriteY: 32, spriteN: 4},
  'Fly_left': {src: 'img/mobs/fly_run_left.png', spriteX: 32, spriteY: 32, spriteN: 4},
  'PlayerDead': {src: 'img/player/player_rayman_dead.png', spriteX: 32, spriteY: 48, spriteN: 1, offsetY: 16},
  'Grave': {src: 'img/tombstone-icon-big.png', spriteX: 32, spriteY: 32, spriteN: 1},
  'Rayman_right': {src: 'img/player/player_rayman_right.png', spriteX: 32, spriteY: 48, spriteN: 1},
  'Rayman_left': {src: 'img/player/player_rayman_left.png', spriteX: 32, spriteY: 48, spriteN: 1},
  'Rayman_down': {src: 'img/player/player_rayman_down.png', spriteX: 32, spriteY: 48, spriteN: 1},
  'Rayman_up': {src: 'img/player/player_rayman_up.png', spriteX: 32, spriteY: 48, spriteN: 1},
  'Rayman_run_right': {src: 'img/player/player_rayman_run_right.png', spriteX: 32, spriteY: 48, spriteN: 13},
  'Rayman_run_left': {src: 'img/player/player_rayman_run_left.png', spriteX: 32, spriteY: 48, spriteN: 13},
  'Rayman_run_down': {src: 'img/player/player_rayman_run_down.png', spriteX: 32, spriteY: 48, spriteN: 13},
  'Rayman_run_up': {src: 'img/player/player_rayman_run_up.png', spriteX: 32, spriteY: 48, spriteN: 13},

  // 'Heal': { src: 'img/heal_sprite.png'},
  'blood_big' : { src: 'img/blood_spatter_big.png', spriteX: 32, spriteY: 32, spriteN: 24},
  'blood_small': { src: 'img/blood_spatter_small.png', spriteX: 32, spriteY: 32, spriteN: 8},
  'green_player': {src: 'img/knight_green.png'},
  'red_player': {src: 'img/knight.png', spriteX: 16, spriteY: 16, spriteN: 1},
  'melee_slash': {src: 'img/slash_sword.png', spriteX: 25, spriteY: 18, spriteN: 3},
  'big_melee_slash': {src: 'img/slash_big_sword.png', spriteX: 24, spriteY: 72, spriteN: 3},
  'big_melee_bloody_slash': {src: 'img/slash_big_sword_bloody.png', spriteX: 24, spriteY: 72, spriteN: 3},
  'arrow': {src: 'img/items/arrow.png', spriteX: 32, spriteY: 32, spriteN: 1},
  'explosion': {src: 'img/explo.png', spriteX: 84, spriteY: 84, spriteN: 7},
  'arrow_hit': {src: 'img/arrow_hit.png', spriteX: 32, spriteY: 32, spriteN: 7},
  'blood_hit': {src: 'img/blood_hit.png', spriteX: 32, spriteY: 32, spriteN: 7},
  'spawn_puff': {src: 'img/spawn_puff.png', spriteX: 32, spriteY: 32, spriteN: 8},
  'spawn_puff_2': {src: 'img/spawn_puff_2.png', spriteX: 32, spriteY: 32, spriteN: 7},
  'bubba': {src: 'img/mobs/bubba.png', spriteX: 64, spriteY: 64, spriteN: 4},
  'skill_sword': {src: 'img/skills/skill_tiles/skill_sword.png', spriteX: 32, spriteY: 32, spriteN: 1},
  'skill_sword_cd': {src: 'img/skills/skill_tiles/skill_sword_cd.png', spriteX: 32, spriteY: 32, spriteN: 1},
  'arrow_new': {src: 'img/items/arrow_new.png', spriteX: 32, spriteY: 32, spriteN: 1, init_angle: -Math.PI/4},
  'skill_fireball': {src: 'img/skills/Fireball.jpg', spriteX: 32, spriteY: 32, spriteN: 1},
  'skill_fireball_cd': {src: 'img/skills/Fireball_cd.jpg', spriteX: 32, spriteY: 32, spriteN: 1},
  'stomp': {src: 'img/skills/stomp.png', spriteX: 96, spriteY: 96, spriteN: 1, offsetX: 32, offsetY: 32},
  'tp_static': {src: 'img/tp_static.png', spriteX: 32, spriteY: 32, spriteN: 1},
  'action_bar_new': {src: 'img/actionbar/a_bar_new.png', spriteX: 1024, spriteY: 256, spriteN: 1},
  'xp_bar_new': {src: 'img/actionbar/xp_bar_new.png', spriteX: 568, spriteY: 8, spriteN: 1},
  'hp_full': {src: 'img/actionbar/hp_bar_full.png', spriteX: 130, spriteY: 16, spriteN: 1},
  'mana_full': {src: 'img/actionbar/mana_bar_full.png', spriteX: 130, spriteY: 16, spriteN: 1},

  //LAYOUT
  'combat_icon': {src: 'img/combat_icon.png', spriteX: 32, spriteY: 32, spriteN: 1},

  //ITEMS
  'sword' : {src: 'img/items/epee.png', spriteX: 32, spriteY: 32, spriteN: 1},
  'armor' : {src: 'img/items/armor.png', spriteX: 32, spriteY: 32, spriteN: 1},
  'Lightsaber' : {src: 'img/items/green_jedi_sword.png', spriteX: 32, spriteY: 32, spriteN: 1},
  'Potato' : {src: 'img/items/potato.png', spriteX: 32, spriteY: 32, spriteN: 1},
  'Epee' : {src: 'img/items/epee.png', spriteX: 32, spriteY: 32, spriteN: 1},
  'Cleaver' : {src: 'img/items/cleaver.png', spriteX: 32, spriteY: 32, spriteN: 1},
  'Bread Knife' : {src: 'img/items/bread_knife.png', spriteX: 32, spriteY: 32, spriteN: 1},
  'Hunting Knife' : {src: 'img/items/hunting_knife.png', spriteX: 32, spriteY: 32, spriteN: 1},
  'Shortbow' : {src: 'img/items/bow.png', spriteX: 32, spriteY: 32, spriteN: 1},
  'Composite Bow' : {src: 'img/items/bow_composite.png', spriteX: 32, spriteY: 32, spriteN: 1},
  'Pinaka' : {src: 'img/items/bow_crystal.png', spriteX: 32, spriteY: 32, spriteN: 1},
  'Sawed-Off Shotgun' : {src: 'img/items/sawed_off.png', spriteX: 32, spriteY: 32, spriteN: 1},

  //SKILLS
  'skill_sword': {src: 'img/skills/skill_tiles/skill_sword.png', spriteX: 32, spriteY: 32, spriteN: 1},
  'skill_sword_cd': {src: 'img/skills/skill_tiles/skill_sword_cd.png', spriteX: 32, spriteY: 32, spriteN: 1},
  'skill_bow_cd': {src: 'img/skills/skill_tiles/skill_bow_cd.png', spriteX: 32, spriteY: 32, spriteN: 1},
  'skill_bow': {src: 'img/skills/skill_tiles/skill_bow.png', spriteX: 32, spriteY: 32, spriteN: 1},
  'skill_bleeding': {src: 'img/skills/skill_tiles/skill_sword.png', spriteX: 32, spriteY: 32, spriteN: 1},
  'skill_heal': {src: 'img/skills/skill_tiles/skill_sword.png', spriteX: 32, spriteY: 32, spriteN: 1},
  //SPRITES
  'base_tiles': {src: 'img/tiles/base_tiles.png', spriteX: 32, spriteY: 32, tilesW: 16, tilesH: 16}
}
GAME.totalImageCount = 0;
for(var i in GAME.urlDict) GAME.totalImageCount++;
GAME.allImages = {};
GAME.loadedImages = 0;
for(var i in GAME.urlDict){
    GAME.allImages[i] = new Image();
    GAME.allImages[i].onload = function(){ GAME.loadedImages++; }
    GAME.urlDict[i].hasOwnProperty('src') && (GAME.allImages[i].src = GAME.urlDict[i].src);
    GAME.urlDict[i].hasOwnProperty('spriteX') && (GAME.allImages[i].spriteX = GAME.urlDict[i].spriteX);
    GAME.urlDict[i].hasOwnProperty('spriteY') && (GAME.allImages[i].spriteY = GAME.urlDict[i].spriteY);
    GAME.urlDict[i].hasOwnProperty('spriteN') && (GAME.allImages[i].spriteN = GAME.urlDict[i].spriteN);
    GAME.urlDict[i].hasOwnProperty('tilesW') && (GAME.allImages[i].tilesW = GAME.urlDict[i].tilesW);
    GAME.urlDict[i].hasOwnProperty('tilesH') && (GAME.allImages[i].tilesH = GAME.urlDict[i].tilesH);
    GAME.urlDict[i].hasOwnProperty('offsetX') && (GAME.allImages[i].offsetX = GAME.urlDict[i].offsetX);
    GAME.urlDict[i].hasOwnProperty('offsetY') && (GAME.allImages[i].offsetY = GAME.urlDict[i].offsetY);
    GAME.urlDict[i].hasOwnProperty('init_angle') && (GAME.allImages[i].init_angle = GAME.urlDict[i].init_angle);
}