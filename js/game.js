define(function( require ){    
    var size = screen.height - 200;
    var game = new Phaser.Game( size, size, Phaser.AUTO, 'phaser-stage', { preload: preload, create: create, update: update, render: render });
    var gs = require("gs");
    var utils = require('utils');   

    function preload() {    
        game.load.image('a1', 'assets/a1.png');
        game.load.image('a2', 'assets/a2.png');
        game.load.image('a3', 'assets/a3.png');
        game.load.image('a4', 'assets/a4.png');
    }

    function create() {
        game.stage.backgroundColor = '#FFF';

        gs.createPlanes( 4, game );

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

        if( gs.slingshot.active ){
            var slingshotStrength = gs.slingshot.getPulling( game.input.activePointer.x, game.input.activePointer.y );

            var slingshotEndX, slingshotEndY = 0;

            if ( slingshotStrength.length > gs.slingshot.maxLength ){            
                slingshotEndX = gs.slingshot.start.x + gs.slingshot.maxLength * Math.cos( utils.toRad( slingshotStrength.angle ) + Math.PI );
                slingshotEndY = gs.slingshot.start.y + gs.slingshot.maxLength * Math.sin( utils.toRad( slingshotStrength.angle ) + Math.PI );            
            }else{
                slingshotEndX = game.input.activePointer.x;
                slingshotEndY = game.input.activePointer.y;            
            }

            gs.slingshot.line.end.set( slingshotEndX, slingshotEndY );
            gs.slingshot.label.x = slingshotEndX;
            gs.slingshot.label.y = slingshotEndY;
            gs.current.angle = slingshotStrength.angle;
            gs.slingshot.setFinish( slingshotEndX, slingshotEndY );
        }

        if( gs.isProcessing() ){            
            gs.decreaseForce( gs.current );
            if( gs.current.force <= 0 ){
                gs.waiting();
                gs.nextTurn();
            }
        }
    }

    function render(){

        if( gs.isWaiting() ){
            if( gs.slingshot.active ){
                game.debug.geom( gs.slingshot.line, "#BBB", true );
                game.debug.geom( gs.slingshot.label, "#BBB", true );
            } 
            gs.currentLabel.x = gs.current.x;
            gs.currentLabel.y = gs.current.y;
        }
        
        game.debug.geom( gs.currentLabel, "#BBB", false );        
    }
});