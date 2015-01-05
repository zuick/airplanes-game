define( function( require ){
    var config = require('config');    
    var utils = require('utils');
    var Slingshot = require('models/slingshot');
    var Plane = require('models/plane');
    var Rocket = require('models/rocket');
    var Bonus = require('models/bonus');
    var Cloud = require('models/cloud');
    var GameInfo = require('models/game-info');
    var getTurnLabel = require('models/turn-label');
    
    return function( game ){        
        return {
            planes: []   
            ,rockets: []
            ,shadowsGroup: game.add.group()
            ,objectsGroup: game.add.group()
            ,gameInfo: new GameInfo( game )
            ,bonuses: []
            ,backItems: []
            ,clouds: []
            ,turns: 0
            ,currentIndex: 0
            ,currentLabel: getTurnLabel( game, 0, 0 )
            ,slingshot: new Slingshot( game )
            ,wind: { vx: 5, vy: 20 }
            ,cursors: null
            ,keys: null
            ,initKeys: function(){
                this.cursors = game.input.keyboard.createCursorKeys();
                this.keys = {
                    a: game.input.keyboard.addKey(Phaser.Keyboard.A)
                    ,d: game.input.keyboard.addKey(Phaser.Keyboard.D)
                    ,space: game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR)
                    ,shift: game.input.keyboard.addKey(Phaser.Keyboard.SHIFT)
                }
                this.keys.space.onDown.add( this.fireRocket.bind( this, this.planes[1] ), this )
                this.keys.shift.onDown.add( this.fireRocket.bind( this, this.planes[0] ), this )
            }
            ,fireRocket: function(plane){
                var rocket = new Rocket( game, plane.x, plane.y, plane.angle, plane.spriteKey );
                this.fire( rocket, rocket.angle, config.rockets.velocity );    
                this.rockets.push( rocket );
            }
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
                    var plane = new Plane( game, x, y, r, settings[i].sprite, settings[i].color, settings[i].pos );
                    
                    this.objectsGroup.add( plane.original )
                    this.shadowsGroup.add( plane.shadow )
                    
                    this.planes.push( plane );    
                    
                }
            }
            ,createBonuses: function(){
                if( this.bonuses.length < config.bonuses.maxCount ){
                    for( var i = 0; i < config.bonuses.maxCountInTurn && this.bonuses.length < config.bonuses.maxCount; i++ ){
                        var settings = config.bonuses.settings[ Math.floor( Math.random() * config.bonuses.settings.length ) ];
                        var x = Math.floor( config.bonuses.bounds + Math.random() * ( game.world.width - 2 * config.bonuses.bounds ) )
                        var y = Math.floor( config.bonuses.bounds + Math.random() * ( game.world.height - 2 * config.bonuses.bounds ) )

                        var bonus = new Bonus( game, x, y, settings );
                        
                        this.objectsGroup.add( bonus.original )
                        this.shadowsGroup.add( bonus.shadow )
                        
                        this.bonuses.push( bonus );
                    }
                }
            }
            ,createClouds: function(){
                return;
                if( this.clouds.length < config.clouds.maxCount ){
                    for( var i = 0; i < config.clouds.maxCountInTurn && this.clouds.length < config.clouds.maxCount; i++ ){
                        this.clouds.push( this.createRandomCloud() );                        
                    }
                }             
            }
            ,createRandomCloud: function(){
                var spriteKey = config.clouds.sprites[ Math.floor( Math.random() * config.clouds.sprites.length ) ]
                var x = Math.random() * game.world.width * ( - this.wind.vx / this.wind.vx );
                var y = Math.random() * game.world.height * ( - this.wind.vy / this.wind.vy );
                var cloud = new Cloud( game, x, y, this.wind.vx, this.wind.vy, spriteKey );
                this.shadowsGroup.add( cloud.shadow );
                return cloud;
            }
            ,createBackgroundItems: function(){
                for( var i = 0; i < config.backItems.maxCount; i++ ){
                    var x = Math.random() * game.world.width;
                    var y = Math.random() * game.world.height;
                    this.backItems.push( game.add.sprite( x, y, 'tree' ) );                
                }
            }
            ,createGameInfo: function(){
                this.gameInfo.init( this.planes );
            }
            ,setDamage: function( plane ){
                if( !plane.dieAnimation ){
                    plane.health--;
                    plane.dieAnimation = true;
                    plane.setVelocity( 0, 0 );                    
                    
                }
                
            }          
            ,waiting: function(){
                return;
                if( this.state === "end" ) return;
                
                this.turns++;
                if( this.turns % config.world.bonusFrequence == 0 ){
                    this.createBonuses()
                    this.createClouds()
                }
                
//                for( var i in this.clouds ){
//                    this.clouds[i].setVelocity( 0, 0 );
//                }
                
                this.state = "waiting";
            }
            ,isWaiting: function(){ return this.state === "waiting"; }
            ,isEndGame: function(){ return this.state === "end"; }
            ,endGame: function( winner ){
                this.state = "end";
                this.destroy();
                game.state.start("battle-options", true);
            }
            ,fire: function( sprite, angle, force ){
                       
                sprite.angle = angle;                
                sprite.force = force;
                this.setVelocityToSprite( sprite, angle, force );
                        
                
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
            ,outBounds: function( sprite, withSize ){ 
                var center = this.getCenter( sprite );
                var borderWidth = config.gameInfo.borderWidth;
                
                var w = 0;
                var h = 0;
                
                if( withSize ){
                    w = sprite.body.width;
                    h = sprite.body.height; 
                }
                if( center.x + w / 2 <= borderWidth ||
                    center.x - w / 2 >= game.world.width - borderWidth || 
                    center.y + h / 2 <= borderWidth ||
                    center.y - h / 2 >= game.world.height - borderWidth ) return true;
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
  
                    if( this.cursors.left.isDown ){
                        this.planes[0].changeAngle( -config.planes.rotateCoeff );                        
                    }
                    if( this.cursors.right.isDown ){
                        this.planes[0].changeAngle( config.planes.rotateCoeff );
                    }
                    if( this.keys.a.isDown ){
                        this.planes[1].changeAngle( -config.planes.rotateCoeff );                        
                    }
                    if( this.keys.d.isDown ){
                        this.planes[1].changeAngle( config.planes.rotateCoeff );                        
                    }
                    
                    for( var i in this.planes ){
                        var plane = this.planes[i];
                        
                        this.decreaseForce( plane );

                        if( this.outBounds( plane ) ) {                            
                            this.setDamage( plane );                            
                        }
                    }
                    
                    for( var i in this.rockets ){
                        var rocket = this.rockets[i];
                        
                        if( this.outBounds( rocket ) ) {                            
                            this.rockets.splice( i, 1 );
                            rocket.destroy();
                        }
                    }
                
            }
            ,planeAnimations: function(){
                this.planes.map( function( plane ){
                    plane.playAnimations();
                }.bind(this))
            }
            ,processCollisions: function(){
                    this.clouds.map( function( cloud, index ){
                        if( this.outBounds( cloud.original, true ) ){
                            if( cloud.wasVisible ){
                                this.clouds.splice( index, 1 );
                                cloud.destroy();
                            }
                        }else{
                            if( !cloud.wasVisible ) cloud.wasVisible = true;
                        }
                    }.bind(this))
                    
                    for( var i in this.planes ){
                        var plane = this.planes[i];
                            
                        this.rockets.map( function( rocket, index ){
                            if( this.getDistance( rocket, plane ) < config.planes.hitDistance && rocket.planeSpriteKey != plane.spriteKey ){ // success attack
                                this.setDamage( plane );     
                                this.rockets.splice( index, 1 );
                                rocket.destroy();
                            }
                        }.bind(this))


                        this.bonuses.map( function( bonus, index ){
                            if( this.getDistance( bonus, plane ) < config.bonuses.hitDistance ){
                                plane.applyBonus( bonus );
                                this.bonuses.splice( index, 1 );
                                this.createBonuses()
                            }
                        }.bind(this))
                    }
                
            }
            ,destroyItems: function( array ){
                while( array.length ){
                    var item = array.pop();
                    item.destroy();
                }
            }
            ,destroy: function(){
                
                this.destroyItems( this.planes );                
                this.destroyItems( this.rockets );                
                this.destroyItems( this.bonuses );
                this.destroyItems( this.clouds );
                this.destroyItems( this.backItems );
                
                this.shadowsGroup.destroy();
                this.objectsGroup.destroy();
                this.slingshot.destroy();
                this.gameInfo.destroy();
            }
        };
    }
});