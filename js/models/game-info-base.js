define( function( require ){
    var config = require("config");
    
    return function( game, x, y, w, h, info, pos ){
        this.background = game.add.tileSprite( x, y, w, h, config.gameInfo.baseSprite );
        this.info = info;
        this.pos = pos;
        this.stuff = game.add.group();
        
        this.isChanged = function( newInfo ){
            var poses = Object.keys( newInfo );
            
            for( var k in Object.keys( newInfo ) ){
                if( newInfo[poses[k]] !== this.info[poses[k]] ) return true;
            }
            return false;
        }
        
        this.draw = function(){
            this.stuff.removeAll();
            
            for( var i = 0; i < this.info.health; i++ ){
                var planeSprite = game.add.sprite( this.background.x + i * 20, this.background.y, this.info.sprite );
                planeSprite.angle = this.info.angle;
                this.stuff.add( planeSprite )
            }
            
        }
        
        this.setInfo = function( info ){
            this.info = info;
        }
    }
    
})




