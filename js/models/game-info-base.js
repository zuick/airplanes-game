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
            
            var stuffWidth = config.gameInfo.borderWidth * config.gameInfo.stuffScale;
            var dx = 0;
            var dy = 0;
            
            if( this.background.width > this.background.height ) dx = stuffWidth;
            else dy = stuffWidth;
            
            
            for( var i = 0; i < this.info.health; i++ ){
                var planeSprite = game.add.sprite( this.background.x + stuffWidth / 2 + i * dx, this.background.y + stuffWidth / 2 + i * dy, this.info.sprite );
                
                planeSprite.anchor.setTo(0.5, 0.5);
                planeSprite.angle = this.info.angle;
                planeSprite.scale.setTo( stuffWidth / planeSprite.width );
                //planeSprite.tint = Phaser.Color.hexToRGB( this.info.color );
                this.stuff.add( planeSprite );
            }
                        
            this.stuff.y = this.background.height / 2 - this.stuff.height / 2;
            this.stuff.x = this.background.width / 2 - this.stuff.width / 2;
            
            
        }
        
        this.setInfo = function( info ){
            this.info = info;
        }
    }
    
})




