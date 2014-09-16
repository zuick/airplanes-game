define(function( require ){    
    var size = screen.height - 200;
    var game = new Phaser.Game( size, size, Phaser.AUTO, 'phaser-stage', { preload: preload, create: create, update: update, render: render });
    var gs = require("gs");
    var config = require('config'); 
    
    function preload() {    
        game.load.image('a1', 'assets/a1.png');
    }

    function create() {
        game.stage.backgroundColor = '#FFF';

        gs.createPlanes( 2, game );

        gs.setCurrent( 0 );

        gs.waiting();
        
        game.input.onDown.add(onMouseDown, this);
        game.input.onUp.add(onMouseUp, this);

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

        gs.processForces();
        
        gs.processCollisions();
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