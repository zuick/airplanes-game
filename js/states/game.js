define(function( require ){    
    return function( game ){
        var gs;
        var config = require('config');
        
        this.create = function(){
            game.stage.backgroundColor = '#000';
            game.add.tileSprite( 0, 0, game.world.width, game.world.height, 'back' );

            game.input.addPointer();
            game.input.addPointer();
            game.input.addPointer();
            game.input.addPointer();
    
            gs = require("gs")(game);
            gs.createBackgroundItems();
            gs.createClouds();
            gs.createBonuses()
            
            
            var playes = ( window.location.search ) ? window.location.search.match(/p=([0-9])/)[1] : 2;
            gs.createPlanes( playes );            
            gs.initKeys();

            gs.createGameInfo();
            
            gs.fire( gs.planes[0], gs.planes[0].angle, config.planes.defaultVelocity )
            gs.fire( gs.planes[1], gs.planes[1].angle, config.planes.defaultVelocity )
        }
        

        this.update = function(){        
            gs.updateAngle( game );        
            gs.processCollisions();                
            gs.processDamping();
            gs.planeAnimations();      
            gs.gameInfo.update();        
        }

        this.render = function(){     
        }
        
    }
});