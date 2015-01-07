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
        this.shadow = getShadow( game, x, y, config.bonuses.height, settings.sprite );
                        
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
        }
                
        this.activate = function(){
            if( this.name == 'plane' ){
                this.owner.health++;
            }else if( this.name == 'turn' ){
                this.owner.additionalTurn = true;          
            }else if( this.name == 'force' ){
                this.owner.force += this.value;          
            }else if( this.name == 'rocket' ){
                this.owner.ammo += this.value;
                if( this.owner.ammo > config.planes.maxAmmo ) this.owner.ammo = config.planes.maxAmmo;          
            }else{
                this.active = true;
            }
            
            var scaleOut = game.add.tween( this.shadow.scale ).to( { x: 0, y: 0 }, config.bonuses.applyTime, Phaser.Easing.Linear.None, true, 0, 0, false );
            game.add.tween( this.original.scale ).to( { x: 0, y: 0 }, config.bonuses.applyTime, Phaser.Easing.Linear.None, true, 0, 0, false ); 
            scaleOut.onComplete.add( function(){
                this.owner.removeBonus( this );
            }.bind(this))
        }
        
        this.destroy = function(){
            this.original.destroy();
            this.shadow.destroy();
        }
        
        this.__defineGetter__("body", this.getFromOriginal('body') )
        this.__defineGetter__("scale", this.getFromOriginal('scale') )
        this.__defineGetter__("angle", this.getFromOriginal('angle') )
        this.__defineGetter__("x", this.getFromOriginal('x') )
        this.__defineGetter__("y", this.getFromOriginal('y') )
    }
})


