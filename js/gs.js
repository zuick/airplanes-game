define( function( require ){
    var Slingshot = require('slingshot');
    var config = require('config');    
    var utils = require('utils');
    var Plane = require('models/plane');
    var Bonus = require('models/bonus');
    
    return function( game ){        
        return {
            planes: []   
            ,shadowsGroup: game.add.group()
            ,objectsGroup: game.add.group()
            ,bonuses: []
            ,backItems: []
            ,turns: 0
            ,currentIndex: 0
            ,currentLabel: new Phaser.Circle( 0, 0, 48 )
            ,slingshot: new Slingshot( { power: config.slingshot.power } )
            ,createPlanes: function( count ){
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
                    
                    this.objectsGroup.add( plane.original )
                    this.shadowsGroup.add( plane.shadow )
                    
                    this.planes.push( plane );    
                    
                }
                if( count > 0 ) this.setCurrent( 0 );
            }
            ,createBonuses: function(){
                if( this.bonuses.length < config.bonuses.maxCount ){
                    for( var i = 0; i < config.bonuses.maxCountInTurn && this.bonuses.length < config.bonuses.maxCount; i++ ){
                        var settings = config.bonuses.settings[ Math.floor( Math.random() * config.bonuses.settings.length ) ];
                        var x = Math.floor( Math.random() * game.world.width )
                        var y = Math.floor( Math.random() * game.world.height )

                        var bonus = new Bonus( game, x, y, settings );
                        
                        this.objectsGroup.add( bonus.original )
                        this.shadowsGroup.add( bonus.shadow )
                        
                        this.bonuses.push( bonus );
                    }
                }
            }
            ,createBackgroundItems: function(){
                for( var i = 0; i < config.backItems.maxCount; i++ ){
                    var x = Math.random() * game.world.width;
                    var y = Math.random() * game.world.height;
                    this.backItems.push( game.add.sprite( x, y, 'tree' ) );                
                }
            }
            ,setCurrent: function( index ){
                if( this.planes[index] ){
                    if( this.current ) this.current.leaveTurn();
                    this.planes[index].onStartTurn();
                    this.current = this.planes[index];
                    this.currentIndex = index;
                    this.current.bringToTop();
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
                if( this.current.additionalTurn ) {
                    this.current.additionalTurn = false;
                    return;
                }
                
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

                this.current.onFire();
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
            ,outBounds: function( sprite ){       
                var center = this.getCenter( sprite );

                if( center.x <= 0 ||
                    center.x >= game.world.width || 
                    center.y <= 0 ||
                    center.y >= game.world.height ) return true;
                return false;
            }
            ,decreaseForce: function( sprite ){
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
            ,processForces: function(){
                if( this.isProcessing() ){            
                    this.decreaseForce( this.current );


                    if( this.current.force <= 0 ){
                        this.waiting();
                        if( !this.current.bonuses.turn ) this.nextTurn();
                        else this.current.bonuses.turn = false;
                    }

                    if( this.outBounds( this.current ) ) {
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
                            if( !plane.dieAnimation && !plane.hasShild() ) this.setDamage( plane );                        
                        }
                    }.bind(this))

                    this.bonuses.map( function( bonus, index ){
                        if( this.getDistance( bonus, this.current ) < config.bonuses.hitDistance ){
                            this.current.applyBonus( bonus );
                            this.bonuses.splice( index, 1 );
                        }
                    }.bind(this))
                }
            }
        };
    }
});