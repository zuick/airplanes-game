define( function( require ){
    var config = require('config');
    
    return function Plane( game, x, y, r, spriteKey, color ){
        this.shadow = game.add.sprite( x + config.planes.shadow.dx, y + config.planes.shadow.dy, spriteKey );
        this.shadow.anchor.setTo(0.5, 0.5);
        this.shadow.tint = config.planes.shadow.tint;
        this.shadow.alpha = config.planes.shadow.alpha;
        this.shadow.scale.setTo( config.planes.shadow.scale );
        game.physics.enable( this.shadow, Phaser.Physics.ARCADE);
        
        this.original = game.add.sprite( x, y, spriteKey );        
        this.original.alive = true;
        game.physics.enable( this.original, Phaser.Physics.ARCADE);
                
        
        this.color = color;
        this.health = config.planes.lives;
        this.basePosition = { x: x, y: y, r: r };
        this.additionalTurn = false;
        this.slingshotMagnifier = false;
        this.dieAnimation = false;
        this.original.anchor.setTo(0.5, 0.5);                

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
            this.shadow.angle = a;
        }
        
        this.setVelocity = function( x, y ){
            this.original.body.velocity.x = x;
            this.original.body.velocity.y = y;
            
            this.shadow.body.velocity.x = x;
            this.shadow.body.velocity.y = y;
        }
        
        this.setPosition = function( x, y ){
            this.original.body.x = x;
            this.original.body.y = y;
            
            this.shadow.body.x = x + config.planes.shadow.dx;
            this.shadow.body.y = y + config.planes.shadow.dy;
        }
        
        this.reanimate = function(){
            this.dieAnimation = false;
            this.original.scale.setTo( 1, 1 );
            this.original.alpha = 1;
            this.setPosition( this.basePosition.x - this.original.body.width / 2, this.basePosition.y - this.original.body.height / 2 );                            
            this.rotate( this.basePosition.r )
        }
        
        this.playAnimations = function(){
            if( this.dieAnimation ) {
                if( this.original.scale.x > this.shadow.scale.x ){
                    var scaleSteps = ( 1 - config.planes.shadow.scale ) / config.planes.dieAnimationScaleStep;
                    var dx = config.planes.shadow.dx / scaleSteps;
                    var dy = config.planes.shadow.dy / scaleSteps;
                    this.original.body.x +=dx;
                    this.original.body.y +=dy;
                    this.scale.setTo( this.scale.x - config.planes.dieAnimationScaleStep )
                    this.original.alpha = this.scale.x;
                    this.rotate( this.angle + config.planes.dieAnimationAngleStep );
                }else{
                    var explosion = game.add.sprite( this.original.x, this.original.y, "exp", 0 );
                    explosion.anchor.setTo(0.5, 0.5);
                    explosion.animations.add("bang");
                    explosion.animations.play("bang", 16, false);
                    
                    
                    if( this.health == 0 ){
                        this.exists = false;
                        this.alive = false;
                    }else{
                        this.reanimate();
                    }
                    
                }
            }
        }
        
        this.getFromOriginal = function( propertyName ){
            return function(){
                return this.original[ propertyName ];
            }.bind(this)
        }
        
        this.bringToTop = function(){
            this.original.bringToTop();
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


