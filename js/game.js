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
        game.load.spritesheet('shine', 'assets/shine.png', config.planes.spriteSize, config.planes.spriteSize, 11);
        game.load.image('slingshot-handle', 'assets/slingshot-handle.png');
        game.load.image('bonus-plane', 'assets/bonus-plane.png');
        game.load.image('bonus-turn', 'assets/bonus-turn.png');
        game.load.image('bonus-force', 'assets/bonus-force.png');
        game.load.image('bonus-shild', 'assets/bonus-shild.png');
        game.load.image('turn-label', 'assets/turn-label.png');
        game.load.image('tree', 'assets/fields-tree-1.png');
        game.load.image('back', 'assets/fields-background.png');
        game.load.image('cloud-s', 'assets/cloud-small.png');
        game.load.image('cloud-m', 'assets/cloud-middle.png');
        game.load.image('cloud-l', 'assets/cloud-large.png');
    }

    function create() {
        game.stage.backgroundColor = '#ede4d1';
        game.add.tileSprite( 0, 0, game.world.width, game.world.height, 'back' );
        
        gs = require("gs")(game);
        gs.createBackgroundItems();
        gs.createClouds();
        
        var playes = ( window.location.search ) ? window.location.search.match(/p=([0-9])/)[1] : 2;
        gs.createPlanes( playes );

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
            gs.slingshot.activate();
        }
    }

    function onMouseUp( pointer ){
        if( gs.slingshot.active ){
            var slingshotStrength = gs.slingshot.getPulling();
            gs.slingshot.release();
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
        game.debug.geom( gs.slingshot.line, config.slingshot.labelColor, true );     
    }
});