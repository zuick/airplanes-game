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
        
        this.getBonusSprite = function( name ){
            var bonuses = config.bonuses.settings.filter( function( setting ){ return setting.name === name } );
            if( bonuses.length ) return bonuses[0].sprite;
            else return "";
        }
        
        this.draw = function(){
            this.stuff.removeAll();
            
            var stuffWidth = config.gameInfo.borderWidth * config.gameInfo.stuffScale;
            var dx = 0;
            var dy = 0;
            
            if( this.background.width > this.background.height ) dx = stuffWidth;
            else dy = stuffWidth;
            
            var stuff = [];
            for( var i = 0; i < this.info.health - 1; i++ ){
                stuff.push( { 
                    sprite: config.planes.defaultSprite
                    ,tint: Phaser.Color.hexToRGB( this.info.color )
                    ,angle: this.info.angle
                    ,scale: true
                })
            }
            
            if( this.info.shild ) stuff.push( { sprite: this.getBonusSprite("shild") } )
            if( this.info.turn ) stuff.push( { sprite: this.getBonusSprite("turn") } )
            if( this.info.force ) stuff.push( { sprite: this.getBonusSprite("force") } )
            
            for( var i = 0; i < stuff.length; i++ ){
                var x = this.background.x + stuffWidth / 2 + i * dx;
                var y = this.background.y + stuffWidth / 2 + i * dy;
                
                var sprite = game.add.sprite( x, y, stuff[i].sprite );
                
                sprite.anchor.setTo(0.5, 0.5);
                
                if( stuff[i].scale ) sprite.scale.setTo( stuffWidth / sprite.width );
                if( stuff[i].angle ) sprite.angle = stuff[i].angle;
                if( stuff[i].tint ) sprite.tint = stuff[i].tint;
                
                this.stuff.add( sprite );
            }
                        
            if( this.stuff.height > this.background.height ){
                this.background.height = this.stuff.height + stuffWidth;                
            }
            
            if( this.stuff.width > this.background.width ){
                this.background.width = this.stuff.width + stuffWidth;                
            }
            
                   
            this.stuff.y = this.background.height / 2 - this.stuff.height / 2;
            this.stuff.x = this.background.width / 2 - this.stuff.width / 2;
            
        }
        
        this.setInfo = function( info ){
            this.info = info;
        }
        
        this.destroy = function(){
            this.stuff.removeAll();
            this.background.destroy();
        }
    }
    
})




