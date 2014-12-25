define( function( require ){
    var config = require('config');    
    var utils = require('utils');
    var Slingshot = require('models/slingshot');
    var Plane = require('models/plane');
    var Bonus = require('models/bonus');
    var Cloud = require('models/cloud');
    var GameInfo = require('models/game-info');
    var getTurnLabel = require('models/turn-label');
    
    return function( game ){        
        return {
            planes: []   
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
                if( count > 0 ) this.setCurrent( 0 );
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
            ,setCurrent: function( index ){
                if( this.planes[index] ){
                    if( this.current ) this.current.leaveTurn();
                    this.planes[index].onStartTurn();
                    this.current = this.planes[index];
                    this.currentIndex = index;
                    this.current.bringToTop();
                    this.currentLabel.fadeIn( this.current.x, this.current.y )
                }        
            }
            ,setDamage: function( plane ){
                
                plane.health--;
                plane.dieAnimation = true;
                plane.setVelocity( 0, 0 );                    
                
            }
            ,processing: function(){ 
                if( this.state === "end" ) return;
                
                this.currentLabel.fadeOut();
                this.slingshot.line.setTo( -1, -1, -1, -1 );
                this.state = "processing";
                
                for( var i in this.clouds ){
                    this.clouds[i].setVelocity( this.wind.vx, this.wind.vy );
                }
            }
            ,waiting: function(){
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
            ,isProcessing: function(){ return this.state === "processing"; }
            ,isWaiting: function(){ return this.state === "waiting"; }
            ,isEndGame: function(){ return this.state === "end"; }
            ,endGame: function( winner ){
                this.state = "end";
                this.destroy();
                game.state.start("battle-options", true);
            }
            ,nextTurn: function(){
                var alivePlanes = this.planes.filter( function( plane ){ return plane.health > 0 } );
                if( alivePlanes.length === 1 ){
                    this.endGame( alivePlanes[0] );
                    return;
                }else if( alivePlanes.length === 0 ){
                    this.endGame();
                    return;
                }
                
                if( this.current.additionalTurn ) {
                    this.current.additionalTurn = false;
                    this.currentLabel.fadeIn( this.current.x, this.current.y )
                    return;
                }
                
                if( this.currentIndex + 1 >= this.planes.length ){
                    this.setCurrent( 0 );
                }else{
                    this.setCurrent( this.currentIndex + 1 );
                }

                if( this.current.health <= 0 ) {
                    this.nextTurn();
                }
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
                        if( !this.current.bonuses.turn ) this.nextTurn();
                        else this.current.bonuses.turn = false;
                        this.waiting();
                    }

                    if( this.outBounds( this.current ) ) {
                        this.current.onAnimationEnd = this.nextTurn.bind(this);
                        this.setDamage( this.current );
                        this.waiting();
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
            ,destroyItems: function( array ){
                while( array.length ){
                    var item = array.pop();
                    item.destroy();
                }
            }
            ,destroy: function(){
                
                this.destroyItems( this.planes );                
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