define( function( require ){
    var Slingshot = require('slingshot');
    var config = require('config');    
    var utils = require('utils');
    var Plane = require('models/plane');
    

    
    return {
        planes: []    
        ,bonuses: []
        ,backItems: []
        ,turns: 0
        ,currentIndex: 0
        ,currentLabel: new Phaser.Circle( 0, 0, 48 )
        ,slingshot: new Slingshot( { power: config.slingshot.power } )
        ,game: false
        ,setGameObj: function( game ){ this.game = game }
        ,createPlanes: function( count, game ){
            var settings = config.planes.settings;
            if( count > settings.length ) count = settings.length;           
    
            for( var i = 0; i < count; i++ ){
                var x, y, r = 0;
                switch( settings[i].pos ){
                    case 'left':
                        x = settings[i].offset;
                        y = game.world.height / 2;
                        r = 0;
                        break;
                    case 'right':
                        x = game.world.width - settings[i].offset;
                        y = game.world.height / 2;
                        r = 180;
                        break;
                    case 'up':
                        x = game.world.width / 2;
                        y = settings[i].offset;
                        r = 90;
                        break;
                    case 'down':
                        x = game.world.width / 2;
                        y = game.world.height - settings[i].offset;
                        r = 270;
                        break;
                    default: break;
                }
                var plane = new Plane( game, x, y, r, settings[i].sprite, settings[i].color );
                                
                this.planes.push( plane );            
            }
        }
        ,createBonuses: function(){
            if( this.bonuses.length < config.bonuses.maxCount ){
                for( var i = 0; i < config.bonuses.maxCountInTurn && i < config.bonuses.maxCount; i++ ){
                    var bonusSettings = config.bonuses.settings[ Math.floor( Math.random() * config.bonuses.settings.length ) ];
                    var x = Math.floor( Math.random() * this.game.world.width )
                    var y = Math.floor( Math.random() * this.game.world.height )

                    var bonus = this.game.add.sprite( x, y, bonusSettings.sprite );
                    this.game.physics.enable( bonus, Phaser.Physics.ARCADE);   
                    bonus.body.allowRotation = true;
                    bonus.body.angularVelocity = 30;
                    bonus.anchor.setTo(0.5, 0.5);
                    bonus.name = bonusSettings.name;
                    if( bonusSettings.value ) bonus.value = bonusSettings.value;
                    this.bonuses.push( bonus );                    
                }
            }
        }
        ,createBackgroundItems: function(){
            for( var i = 0; i < config.backItems.maxCount; i++ ){
                var x = Math.random() * this.game.world.width;
                var y = Math.random() * this.game.world.height;
                this.backItems.push( this.game.add.sprite( x, y, 'tree' ) );                
            }
        }
        ,setCurrent: function( index ){
            if( this.planes[index] ){
                this.current = this.planes[index];
                this.currentIndex = index;
            }        
        }
        ,setDamage: function( plane ){
            plane.health--;
            plane.dieAnimation = true;
            plane.setVelocity( 0, 0 );
        }
        ,processing: function(){ 
            this.currentLabel.setTo( -this.currentLabel.diameter, -this.currentLabel.diameter, this.currentLabel.diameter )
            this.slingshot.line.setTo( -1, -1, -1, -1 );
            this.state = "processing";
        }
        ,waiting: function(){ 
            this.turns++;
            if( this.turns % config.world.bonusFrequence == 0 ){
                this.createBonuses()
            }
            this.state = "waiting";
        }
        ,isProcessing: function(){ return this.state === "processing"; }
        ,isWaiting: function(){ return this.state === "waiting"; }
        ,nextTurn: function(){
            if( this.current.slingshotMagnifier && this.current.slingshotMagnifier.used ) this.current.slingshotMagnifier = false;
            
            if( this.currentIndex + 1 >= this.planes.length ){
                this.setCurrent( 0 );
            }else{
                this.setCurrent( this.currentIndex + 1 );            
            }
            
            if( !this.current.alive ) this.nextTurn();
        }
        ,fire: function( angle, force ){
            force *= this.slingshot.power;            
            this.current.angle = angle;                
            this.current.force = force;
            this.setVelocityToSprite( this.current, angle, force );
            
            if( this.current.slingshotMagnifier && !this.current.slingshotMagnifier.used ) this.current.slingshotMagnifier.used = true;
        }
        ,getVelocity: function( angle, force ){
            var alpha = Math.PI / 180 * angle;
            var vx = force * Math.cos( alpha );
            var vy = force * Math.sin( alpha );
            return { x: vx, y: vy }
        }
        ,setVelocityToSprite: function( sprite, angle, force ){
            var newVelocity = this.getVelocity( angle, force );
            sprite.setVelocity( newVelocity.x, newVelocity.y );            
        }
        ,outBounds: function( sprite, game ){       
            var center = this.getCenter( sprite );
            
            if( center.x <= 0 ||
                center.x >= game.world.width || 
                center.y <= 0 ||
                center.y >= game.world.height ) return true;
            return false;
        }
        ,decreaseForce: function( sprite, game ){
            if( sprite.force && sprite.force > 0){                
                sprite.force -= config.world.friction;
                if( sprite.force < 0 ) sprite.force = 0;  
                this.setVelocityToSprite( sprite, sprite.angle, sprite.force );
            }else{
                sprite.setVelocity( 0, 0 ); 
                sprite.force = 0;
            }
        }
        ,isCurrentHit: function( x, y ){
            if( this.current ){
                return this.current.body.hitTest( x, y );
            }else{
                return false;
            }
        }
        ,getPlaneStateString: function( index ){
            var state = this.planes[index].health;            
            return state;
        }
        ,getCenter: function( obj ){
            return { x: obj.body.x + obj.body.width / 2, y: obj.body.y + obj.body.height / 2 }
        }
        ,getDistance: function( a, b ){
            var a = this.getCenter( a );
            var b = this.getCenter( b );
            return Math.sqrt( ( b.x - a.x ) * ( b.x - a.x ) + ( b.y - a.y ) * ( b.y - a.y ) );
        }
        ,processForces: function( game ){
            if( this.isProcessing() ){            
                this.decreaseForce( this.current, game );
                
                
                if( this.current.force <= 0 ){
                    this.waiting();
                    if( !this.current.additionalTurn ) this.nextTurn();
                    else this.current.additionalTurn = false;
                }
                
                if( this.outBounds( this.current, game ) ) {
                    var plane = this.current;
                    this.waiting();
                    this.nextTurn();
                    this.setDamage( plane );
                }
            }
        }
        ,planeAnimations: function(){
            this.planes.map( function( plane ){
                plane.playAnimations();
            })
        }
        ,processCollisions: function(){
            if( this.isProcessing() ){
                var enemies = this.planes.filter( function( plane, index ){
                    return index !== this.currentIndex;
                }.bind(this))
                
                enemies.map( function( plane ){
                    if( this.getDistance( plane, this.current ) < config.planes.hitDistance ){ // success attack
                        if( !plane.dieAnimation ) this.setDamage( plane );                        
                    }
                }.bind(this))
                
                this.bonuses.map( function( bonus, index ){
                    if( this.getDistance( bonus, this.current ) < config.bonuses.hitDistance ){
                        if( bonus.name == "turn" ) this.current.additionalTurn = true;
                        else if( bonus.name == "plane" )  this.current.health++;
                        else if( bonus.name == "force" )  this.current.slingshotMagnifier = { value: bonus.value, used: false };
                        
                        this.bonuses.splice( index, 1 );
                        bonus.destroy()
                    }
                }.bind(this))
            }
        }
    };
});