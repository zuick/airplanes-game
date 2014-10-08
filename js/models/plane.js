define( function( require ){
    var config = require('config');
    
    return function Plane( game, x, y, r, spriteKey, color ){
        this.original = game.add.sprite( x, y, spriteKey );
        game.physics.enable( this.original, Phaser.Physics.ARCADE);
                
        this.color = color;
        this.original.alive = true;
        this.health = config.planes.lives;
        this.basePosition = { x: x, y: y, r: r };
        this.original.anchor.setTo(0.5, 0.5);
        
        // bonus init
        this.additionalTurn = false;
        this.slingshotMagnifier = false;
        this.dieAnimation = false;

        this.rotate = function( a ){
            if( a >= 0 && a < 45 || a > 315 && a <= 360 ){
                this.original.frame = 0;
            }else if( a >= 45 && a < 135 ){
                this.original.frame = 1;
            }else if( a >= 135 && a < 225 ){
                this.original.frame = 2;
            }else if( a >= 225 && a < 315 ){
                this.original.frame = 3;
            }

            this.original.angle = a;
        }
        
        this.getFromOriginal = function( propertyName ){
            return function(){
                return this.original[ propertyName ];
            }.bind(this)
        }
        
        
        this.__defineGetter__("body", this.getFromOriginal('body') )
        this.__defineGetter__("scale", this.getFromOriginal('scale') )
        this.__defineGetter__("angle", this.getFromOriginal('angle') )
        this.__defineGetter__("alive", this.getFromOriginal('alive') )
        this.__defineGetter__("exists", this.getFromOriginal('exists') )
        this.__defineGetter__("x", this.getFromOriginal('x') )
        this.__defineGetter__("y", this.getFromOriginal('y') )
        
        this.rotate( r );
    }
} )


