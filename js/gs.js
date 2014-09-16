define( function( require ){
    var Slingshot = require('slingshot');
    var config = require('config');    
    var utils = require('utils');
    
    return {
        planes: []         
        ,currentIndex: 0
        ,currentLabel: new Phaser.Circle( 0, 0, 48 )
        ,slingshot: new Slingshot( { power: config.slingshot.power } )
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
                var plane = null;
                // take airplane from sprites or fiil by color
                if( settings[i].sprite ){
                    plane = game.add.sprite( x, y, settings[i].sprite );                    
                }else{
                    var bmd = game.make.bitmapData();
                    var color = utils.hexToRgb( settings[i].color );                    
                    bmd.load( config.planes.defaultSprite );
                    bmd.replaceRGB(0, 255, 0, 255, color.r, color.g, color.b, 255);
                    plane = game.add.sprite( x, y, bmd );
                }
                
                plane.alive = true;
                plane.health = config.planes.lives;
                plane.basePosition = { x: x, y: y, r: r };
                game.physics.enable( plane, Phaser.Physics.ARCADE);    
                plane.angle = r;
                plane.anchor.setTo(0.5, 0.5);

                this.planes.push( plane );            
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
            if( plane.health == 0 ){
                plane.exists = false;
                plane.alive = false;                
            }else{
                plane.body.x = plane.basePosition.x - plane.body.width / 2;
                plane.body.y = plane.basePosition.y - plane.body.height / 2;
                plane.angle = plane.basePosition.r;
            }
        }
        ,processing: function(){ 
            this.currentLabel.setTo( -this.currentLabel.diameter, -this.currentLabel.diameter, this.currentLabel.diameter )
            this.slingshot.line.setTo( -1, -1, -1, -1 );
            this.state = "processing";
        }
        ,waiting: function(){ this.state = "waiting"; }
        ,isProcessing: function(){ return this.state === "processing"; }
        ,isWaiting: function(){ return this.state === "waiting"; }
        ,nextTurn: function(){
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
        }
        ,getVelocity: function( angle, force ){
            var alpha = Math.PI / 180 * angle;
            var vx = force * Math.cos( alpha );
            var vy = force * Math.sin( alpha );
            return { x: vx, y: vy }
        }
        ,setVelocityToSprite: function( sprite, angle, force ){
            var newVelocity = this.getVelocity( angle, force );
            sprite.body.velocity.x = newVelocity.x;
            sprite.body.velocity.y = newVelocity.y;
        }
        ,decreaseForce: function( sprite ){
            if( sprite.force && sprite.force > 0){
                sprite.force -= config.world.friction;
                if( sprite.force < 0 ) sprite.force = 0;
                this.setVelocityToSprite( sprite, sprite.angle, sprite.force );
            }else{
                sprite.body.velocity.x = 0;
                sprite.body.velocity.y = 0; 
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
        ,getCenter: function( obj ){
            return { x: obj.body.x + obj.body.width / 2, y: obj.body.y + obj.body.height / 2 }
        }
        ,getDistance: function( a, b ){
            var a = this.getCenter( a );
            var b = this.getCenter( b );
            return Math.sqrt( ( b.x - a.x ) * ( b.x - a.x ) + ( b.y - a.y ) * ( b.y - a.y ) );
        }
        ,processForces: function(){
            if( this.isProcessing() ){            
                this.decreaseForce( this.current );
                if( this.current.force <= 0 ){
                    this.waiting();
                    this.nextTurn();
                }
            }
        }
        ,processCollisions: function(){
            if( this.isProcessing() ){
                var enemies = this.planes.filter( function( plane, index ){
                    return index !== this.currentIndex;
                }.bind(this))
                
                enemies.map( function( plane ){
                    if( this.getDistance( plane, this.current ) < config.planes.hitDistance ){ // success attack
                        this.setDamage( plane );                        
                    }
                }.bind(this))
            }
        }
    };
});