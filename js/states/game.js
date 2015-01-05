define(function( require ){    
    return function( game ){
        var gs;
        var config = require('config');
        
        this.create = function(){
            game.stage.backgroundColor = '#000';
            game.add.tileSprite( 0, 0, game.world.width, game.world.height, 'back' );

            gs = require("gs")(game);
            gs.createBackgroundItems();
            gs.createClouds();

            var playes = ( window.location.search ) ? window.location.search.match(/p=([0-9])/)[1] : 2;
            gs.createPlanes( playes );

            gs.waiting();

            game.input.onDown.add(this.onMouseDown, this);
            game.input.onUp.add(this.onMouseUp, this);

            gs.createGameInfo();

        }

        this.onMouseDown = function( pointer ){
            if( !gs.isEndGame() && gs.isWaiting() && gs.isCurrentHit( pointer.x, pointer.y ) ){        
                gs.slingshot.setStart( gs.getCenter( gs.current ).x, gs.getCenter( gs.current ).y, game.input.activePointer.x, game.input.activePointer.y );
                gs.slingshot.activate();
            }
        }

        this.onMouseUp = function( pointer ){
            var slingshotStrength = gs.slingshot.getPulling();
            if( !gs.isEndGame() && gs.slingshot.active && slingshotStrength.length > config.planes.spriteSize / 2 ){             
                gs.fire( slingshotStrength.angle, slingshotStrength.length );
                gs.processing();
            }
            gs.slingshot.release();

        }

        this.update = function(){        
            gs.slingshot.pulling( gs.current, game.input.activePointer.x, game.input.activePointer.y );       
            gs.processForces( game );        
            gs.processCollisions();                
            gs.planeAnimations();        
            gs.gameInfo.update();        
        }

        this.render = function(){
            game.debug.geom( gs.slingshot.line, config.slingshot.labelColor, true );     
        }
        
    }
});