define( function( require ){
    var config = require('config');
    var getShadow = require('models/shadow');
    var getShild = require('models/shild');
    
    return function( game, x, y, settings ){
        this.original = game.add.sprite( x, y, settings.sprite );
        game.physics.enable( this.original, Phaser.Physics.ARCADE);
        
        this.original.body.allowRotation = true;
        this.original.body.angularVelocity = 30;
        this.original.anchor.setTo(0.5, 0.5);
        
        this.shadow = getShadow( game, x, y, settings.sprite );
                        
        this.name = settings.name;
        this.value = settings.value;
        this.start = settings.start;
        this.end = settings.end;
        
        this.used = false;
        this.owner = null;
        
        this.getFromOriginal = function( propertyName ){
            return function(){
                return this.original[ propertyName ];
            }.bind(this)
        }
        
        this.belogsTo = function( obj ){
            this.owner = obj;            
            game.add.tween( this.shadow.scale ).to( { x: 0, y: 0 }, config.bonuses.applyTime, Phaser.Easing.Linear.None, true, 0, 0, false );
            game.add.tween( this.original.scale ).to( { x: 0, y: 0 }, config.bonuses.applyTime, Phaser.Easing.Linear.None, true, 0, 0, false );                        
        }
        
        this.activate = function(){
            if( this.name == 'plane' ){
                this.owner.health++;
                this.owner.removeBonus( this );
            }else if( this.name == 'turn' ){
                this.owner.additionalTurn = true;
                this.owner.removeBonus( this );            
            }else{
                this.active = true;
            }
            
            if( this.name == "shild" ){
                this.owner.shild = getShild( game, this.owner.x, this.owner.y, this.owner.angle );
            }
        }
        
        this.destroy = function(){            
            if( this.name == "shild" ){
                
                if( this.owner.shild ){
                    var scaleOut = game.add.tween( this.owner.shild.scale ).to( { x: 1.5, y: 1.5 }, 300, Phaser.Easing.Linear.None, true, 0, 0, false );
                    var fadeOut = game.add.tween( this.owner.shild ).to( { alpha: 0 }, 200, Phaser.Easing.Quadratic.None, true, 0, 0, false );
                    scaleOut.onComplete.add( function(){
                        this.owner.shild.destroy();
                    }.bind(this))
                }                
                
            }
            
            this.original.destroy();
            this.shadow.destroy();
        }
        
        this.__defineGetter__("body", this.getFromOriginal('body') )
        this.__defineGetter__("scale", this.getFromOriginal('scale') )
        this.__defineGetter__("angle", this.getFromOriginal('angle') )
        this.__defineGetter__("alive", this.getFromOriginal('alive') )
        this.__defineGetter__("exists", this.getFromOriginal('exists') )
        this.__defineGetter__("x", this.getFromOriginal('x') )
        this.__defineGetter__("y", this.getFromOriginal('y') )
    }
})


