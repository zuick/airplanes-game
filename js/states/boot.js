define( function( require ){
    var config = require('config');
    var gettext = require('i18n/gettext');
    
    return function( game ){
        this.preload = function(){            
            var winnerText = game.add.text( window.innerWidth / 2, window.innerHeight / 2, gettext('loading') + "...", config.menu.textStyle );
            winnerText.anchor.setTo( 0.5, 0.5 );
            
            game.load.spritesheet('a1', 'assets/a1.png', config.planes.spriteSize, config.planes.spriteSize, 4 );
            game.load.spritesheet('a2', 'assets/a2.png', config.planes.spriteSize, config.planes.spriteSize, 4 );
            game.load.spritesheet('a3', 'assets/a3.png', config.planes.spriteSize, config.planes.spriteSize, 4 );
            game.load.spritesheet('a4', 'assets/a4.png', config.planes.spriteSize, config.planes.spriteSize, 4 );
            game.load.spritesheet('smoke', 'assets/smoke.png', config.planes.smoke.spriteSize, config.planes.smoke.spriteSize, 7);
            game.load.spritesheet('rocket-smoke', 'assets/rocket-smoke.png', config.rockets.smoke.spriteSize, config.rockets.smoke.spriteSize, 7);            
            game.load.spritesheet('exp', 'assets/explosion.png', config.world.explosion.spriteSize, config.world.explosion.spriteSize, 6 );
            game.load.spritesheet('exp2', 'assets/explosion2.png', config.world.explosion2.spriteSize, config.world.explosion2.spriteSize, 5 );
            game.load.spritesheet('shine', 'assets/shine.png', config.planes.spriteSize, config.planes.spriteSize, 11);
            game.load.spritesheet('fire-btn', 'assets/fire-btn.png', config.buttons.spriteSize, config.buttons.spriteSize, 3);
            game.load.spritesheet('left-btn', 'assets/left-btn.png', config.buttons.spriteSize, config.buttons.spriteSize, 3);
            game.load.spritesheet('right-btn', 'assets/right-btn.png', config.buttons.spriteSize, config.buttons.spriteSize, 3);
            game.load.image('a0', 'assets/a1-template.png' );
            game.load.image('game-info-border', 'assets/game-info-border.png');
            game.load.image('game-info-base', 'assets/game-info-base.png');
            game.load.image('slingshot-handle', 'assets/slingshot-handle.png');
            game.load.image('bonus-plane', 'assets/bonus-plane.png');
            game.load.image('bonus-turn', 'assets/bonus-turn.png');
            game.load.image('bonus-force', 'assets/bonus-force.png');
            game.load.image('bonus-shild', 'assets/bonus-shild.png');
            game.load.image('bonus-rocket', 'assets/bonus-rocket.png');
            game.load.image('turn-label', 'assets/turn-label.png');
            game.load.image('tree', 'assets/fields-tree-1.png');
            game.load.image('back', 'assets/fields-background.png');
            game.load.image('cloud-s', 'assets/cloud-small.png');
            game.load.image('cloud-m', 'assets/cloud-middle.png');
            game.load.image('cloud-l', 'assets/cloud-large.png');
            game.load.image('rocket', 'assets/rocket.png');
            
        } 
        this.create = function(){
            game.state.start( 'main-menu' );            
        }
    }
})


