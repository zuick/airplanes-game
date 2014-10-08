define(function( require ){    
    var game = new Phaser.Game( window.innerWidth, window.innerHeight, Phaser.AUTO, 'phaser-stage', { preload: preload, create: create, update: update, render: render });
    var gs = null;
    var config = require('config'); 
    var stats;
    
    function preload() {    
        game.load.spritesheet('a1', 'assets/a1.png', config.planes.spriteSize, config.planes.spriteSize, 4 );
        game.load.spritesheet('a2', 'assets/a2.png', config.planes.spriteSize, config.planes.spriteSize, 4 );
        game.load.spritesheet('a3', 'assets/a3.png', config.planes.spriteSize, config.planes.spriteSize, 4 );
        game.load.spritesheet('a4', 'assets/a4.png', config.planes.spriteSize, config.planes.spriteSize, 4 );
        game.load.spritesheet('exp', 'assets/explosion.png', 24, 24, 6 );
        game.load.image('bonus-plane', 'assets/bonus-plane.png');
        game.load.image('bonus-turn', 'assets/bonus-turn.png');
        game.load.image('bonus-force', 'assets/bonus-force.png');
        game.load.image('bonus-shild', 'assets/bonus-shild.png');
        game.load.image('tree', 'assets/fields-tree-1.png');
        game.load.image('back', 'assets/fields-background.png');
    }

    function create() {
        game.stage.backgroundColor = '#ede4d1';
        game.add.tileSprite( 0, 0, game.world.width, game.world.height, 'back' );
        
        gs = require("gs")(game);
        gs.createBackgroundItems();
        
        var playes = ( window.location.search ) ? window.location.search.match(/p=([0-9])/)[1] : 2;
        gs.createPlanes( playes );

        gs.setCurrent( 0 );

        gs.waiting();
        
        game.input.onDown.add(onMouseDown, this);
        game.input.onUp.add(onMouseUp, this);
        
        stats = gs.planes.map( function( plane, index ){ 
            var text = game.add.text( 20 , 15 + index * 25, gs.getPlaneStateString( index ), {
                font: "25px Arial",
                fill: gs.planes[index].color,
                align: "left"
            } )
            text.setShadow(-1, 1, 'rgba(0,0,0,0.5)', 1);
            return text;
        })

    }

    function onMouseDown( pointer ){
        if( gs.isWaiting() && gs.isCurrentHit( pointer.x, pointer.y ) ){        
            gs.slingshot.setStart( gs.getCenter( gs.current ).x, gs.getCenter( gs.current ).y, game.input.activePointer.x, game.input.activePointer.y );
            gs.slingshot.active = true;
        }
    }

    function onMouseUp( pointer ){
        if( gs.slingshot.active ){
            var slingshotStrength = gs.slingshot.getPulling( gs.slingshot.line.end.x, gs.slingshot.line.end.y );
            gs.slingshot.active = false;
            gs.fire( slingshotStrength.angle, slingshotStrength.length );
            gs.processing();
        }

    }

    function update() {    
        
        gs.slingshot.pulling( gs.current, game.input.activePointer.x, game.input.activePointer.y );       

        gs.processForces( game );
        
        gs.processCollisions();
        
        gs.planeAnimations();
        
        stats.map( function( stat, index ){
            stat.setText( gs.getPlaneStateString( index ) );
        })
    }

    function render(){

        if( gs.isWaiting() ){
            if( gs.slingshot.active ){
                game.debug.geom( gs.slingshot.line, config.slingshot.labelColor, true );
                game.debug.geom( gs.slingshot.label, config.slingshot.labelColor, true );
            } 
            gs.currentLabel.x = gs.current.x;
            gs.currentLabel.y = gs.current.y;
        }
        
        game.debug.geom( gs.currentLabel, config.slingshot.labelColor, false );        
    }
});