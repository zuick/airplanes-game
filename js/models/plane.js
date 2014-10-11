define( function( require ){
    var config = require('config');
    var getShadow = require('models/shadow');
    var getShild = require('models/shild');
    
    return function Plane( game, x, y, r, spriteKey, color ){
        this.original = game.add.sprite( x, y, spriteKey );        
        this.original.alive = true;
        game.physics.enable( this.original, Phaser.Physics.ARCADE);
        
        this.shadow = getShadow( game, x, y, config.planes.height, spriteKey );              
        this.color = color;
        this.health = config.planes.lives;
        this.basePosition = { x: x, y: y, r: r };
        
        this.bonuses = [];
        
        this.onAnimationEnd = false;
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
            
            this.shadow.setPosition( x, y )
        }
        
        this.reanimate = function(){
            this.dieAnimation = false;
            this.original.scale.setTo( 1, 1 );
            this.original.alpha = 1;
            this.setPosition( this.basePosition.x - this.original.body.width / 2, this.basePosition.y - this.original.body.height / 2 );                            
            this.rotate( this.basePosition.r )
            
            for( var i in this.bonuses ){
                this.bonuses[i].destroy();
            }
            
            this.bonuses = [];
        }
        
        this.playAnimations = function(){
            if( this.dieAnimation ) {
                if( this.original.scale.x > this.shadow.scale.x ){
                    var scaleSteps = ( 1 - config.shadows.scale ) / config.planes.dieAnimationScaleStep;
                    var dx = config.shadows.dx / scaleSteps;
                    var dy = config.shadows.dy / scaleSteps;
                    this.original.body.x +=dx;
                    this.original.body.y +=dy;
                    this.scale.setTo( this.scale.x - config.planes.dieAnimationScaleStep )
                    this.original.alpha = this.scale.x;
                    this.rotate( this.angle + config.planes.dieAnimationAngleStep );
                }else{
                    var explosion = game.add.sprite( this.original.x, this.original.y, "exp", 0 );
                    explosion.anchor.setTo(0.5, 0.5);
                    explosion.animations.add("bang");
                    explosion.animations.play("bang", 16, false, true);                    
                    
                    if( this.health == 0 ){
                        this.exists = false;
                        this.alive = false;
                    }else{
                        this.reanimate();
                    }
                    
                    if( typeof this.onAnimationEnd === "function" ){
                        this.onAnimationEnd();
                        this.onAnimationEnd = false;
                        
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
        
        this.applyBonus = function( bonus ){
            if( !this.findBonusByName( bonus.name ) ){
                this.bonuses.push( bonus )
                bonus.belogsTo( this );
                if( bonus.start == "onTake" ) this.useBonus( bonus )             
            }
        }
        
        this.findBonusByName = function( name ){
            var bonus = this.bonuses.filter( function( b ){
                return b.name == name;
            })
            
            if( bonus.length ) return bonus[0];
            return false;
        }
        
        this.useBonus = function( key ){
            if( typeof key === "object" ){
                key.activate();
            }else if( typeof key === "string" ) {
                var bonus = this.findBonusByName( key );
                if( bonus ) bonus.activate();
            }
        }
        
        this.removeBonus = function( bonus ){
            for( var i in this.bonuses ){
                if( this.bonuses[i].name == bonus.name ){
                    this.bonuses.splice( i, 1 )
                    bonus.destroy();
                }
            }
        }
        
        this.processBonuses = function( event ){
            for( var i in this.bonuses ){
                if( this.bonuses[i].start == event && !this.bonuses[i].active ){
                    this.bonuses[i].activate();
                }else if( this.bonuses[i].end == event && this.bonuses[i].active){
                    this.removeBonus( this.bonuses[i] );
                }
            } 
        }
        this.leaveTurn = function(){               
            this.processBonuses( "onLeaveTurn" );
        }
        
        this.onStartTurn = function(){
            this.processBonuses( "onStartTurn" );
        }
        
        this.onFire = function(){            
            this.processBonuses( "onFire" );
        }
        
        this.getSlingshotMagnifier = function(){
            var bonus = this.findBonusByName( "force" )
            if( bonus && bonus.active ) return bonus.value;
            return 0;
        }
        
        this.hasShild = function(){
            var bonus = this.findBonusByName( "shild" )
            if( bonus && bonus.active ) return true;
            return false;
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


