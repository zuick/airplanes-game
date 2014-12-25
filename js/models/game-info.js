define( function( require ){
    var config = require("config");
    var Base = require("models/game-info-base");
    
    return function( game ){
        this.borders = game.add.group();
        this.bases = {};
        this.basesInfo = {};
        
        this.getInfo = function( plane ){
            return { 
                health: plane.health
                ,shild: ( plane.findBonusByName("shild") ) ? true : false
                ,turn: ( plane.findBonusByName("turn") ) ? true : false
                ,force: ( plane.findBonusByName("force") ) ? true : false
                ,sprite: plane.spriteKey
                ,angle: plane.basePosition.r
                ,color: plane.color
            }
        }
        
        this.update = function(){
            for( var i in this.planes ){
                if( typeof this.bases[this.planes[i].pos] !== "undefined" ){
                    var base = this.bases[this.planes[i].pos];
                    var newInfo = this.getInfo( this.planes[i] );
                    if( base.isChanged( newInfo ) ){
                        base.setInfo( newInfo );
                        base.draw();
                    }
                }
            }
        }
        
        this.init = function( planes ){
            this.planes = planes;
            
            var borderWidth = config.gameInfo.borderWidth;
            var baseWidth = config.gameInfo.baseWidth;
            var borderSprite = config.gameInfo.borderSprite;            
            
            this.borders.add( game.add.tileSprite( 0, 0, borderWidth, game.height, borderSprite ) )
            this.borders.add( game.add.tileSprite( 0, 0, game.width, borderWidth, borderSprite ) )
            this.borders.add( game.add.tileSprite( game.width - borderWidth, 0, borderWidth, game.height, borderSprite ) )
            this.borders.add( game.add.tileSprite( 0, game.height - borderWidth, game.width, borderWidth, borderSprite ) )
            
            for( var i in this.planes ){
                
                switch( this.planes[i].pos ){
                    case 'left':
                        this.bases[this.planes[i].pos] = new Base( 
                            game
                            ,0
                            ,game.height / 2 - baseWidth / 2
                            ,borderWidth, baseWidth 
                            ,this.getInfo( this.planes[i] )
                            ,this.planes[i].pos );
                        break;
                    case 'right':
                        this.bases[this.planes[i].pos] = new Base( 
                            game
                            ,game.width - borderWidth
                            ,game.height / 2 - baseWidth / 2
                            ,borderWidth, baseWidth
                            ,this.getInfo( this.planes[i] )
                            ,this.planes[i].pos );
                        break;
                    case 'up':
                        this.bases[this.planes[i].pos] = new Base( 
                            game
                            ,game.width / 2 - baseWidth / 2
                            ,0
                            ,baseWidth, borderWidth
                            ,this.getInfo( this.planes[i] )
                            ,this.planes[i].pos );
                        break;
                    case 'down':
                        this.bases[this.planes[i].pos] = new Base( 
                            game
                            ,game.width / 2 - baseWidth / 2
                            ,game.height - borderWidth, baseWidth
                            ,borderWidth, this.getInfo( this.planes[i] )
                            ,this.planes[i].pos );
                        break;
                    default: break;
                }
                
                this.bases[this.planes[i].pos].draw();
            }
        }
        
        this.destroy = function(){
            this.planes = null;
            this.borders.removeAll();
            var keys = Object.keys( this.bases )
            for( var i in keys ){
                this.bases[ keys[i] ].destroy();
            }
        }
    }
})


