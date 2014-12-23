define( function( require ){
    var config = require("config");
    
    return function( game ){
        this.borders = game.add.group();
        this.bases = game.add.group();
        
        this.drawBackground = function(){
            
        }      
        
        this.init = function( planes ){
            this.planes = planes;
            
            var borderWidth = config.gameInfo.borderWidth;
            var baseWidth = config.gameInfo.baseWidth;
            var borderSprite = config.gameInfo.borderSprite;
            var baseSprite = config.gameInfo.baseSprite;
            
            this.borders.add( game.add.tileSprite( 0, 0, borderWidth, game.height, borderSprite ) )
            this.borders.add( game.add.tileSprite( 0, 0, game.width, borderWidth, borderSprite ) )
            this.borders.add( game.add.tileSprite( game.width - borderWidth, 0, borderWidth, game.height, borderSprite ) )
            this.borders.add( game.add.tileSprite( 0, game.height - borderWidth, game.width, borderWidth, borderSprite ) )
            
            for( var i in this.planes ){
                
                switch( this.planes[i].pos ){
                    case 'left':
                        this.bases.add( game.add.tileSprite( 0, game.height / 2 - baseWidth / 2, borderWidth, baseWidth, baseSprite ) )
                        break;
                    case 'right':
                        this.bases.add( game.add.tileSprite( game.width - borderWidth, game.height / 2 - baseWidth / 2, borderWidth, baseWidth, baseSprite ) )
                        break;
                    case 'up':
                        this.bases.add( game.add.tileSprite( game.width / 2 - baseWidth / 2, 0, baseWidth, borderWidth, baseSprite ) )
                        break;
                    case 'down':
                        this.bases.add( game.add.tileSprite( game.width / 2 - baseWidth / 2, game.height - borderWidth, baseWidth, borderWidth, baseSprite ) )
                        break;
                    default: break;
                }
            }
        }
    }
})


