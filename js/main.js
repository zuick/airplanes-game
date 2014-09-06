var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-stage', { preload: preload, create: create, update: update, render: render });
var gs = {
    friction: 3
    ,slingshot: { 
        start: { x: 0, y: 0 }
        ,finish: { x: 0, y: 0 } 
        ,active: false
        ,line: false
        ,maxLength: 100
    }
    ,fire: function( sprite, angle, force ){
        this.current = sprite;        
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
        sprite.body.velocity.x = newVelocity.x;
        sprite.body.velocity.y = newVelocity.y;
    }
    ,decreaseForce: function( sprite ){
        if( sprite.force && sprite.force > 0){
            sprite.force -= this.friction;
            this.setVelocityToSprite( sprite, sprite.angle, sprite.force );
        }else{
            sprite.body.velocity.x = 0;
            sprite.body.velocity.y = 0;
        }
    }
    ,isCurrentHit: function( x, y ){
        if( this.current ){
            return this.current.body.hitTest( x, y );
        }else{
            return false;
        }
    }
    ,setSlingshotStart: function( x, y ){
        this.slingshot.start.x = x;
        this.slingshot.start.y = y;
        this.slingshot.line = new Phaser.Line(x, y, game.input.activePointer.x, game.input.activePointer.y);
        
    }
    ,setSlingshotFinish: function( x, y ){
        this.slingshot.finish.x = x;
        this.slingshot.finish.y = y;
        this.slingshot.line = false;     
    }
};

function preload() {
    game.load.image('a1', 'assets/a1.png');
    game.load.image('a2', 'assets/a2.png');
}

function create() {
    game.stage.backgroundColor = '#b6ebff';
    gs.plane = game.add.sprite(48, 48, 'a2');
    
    game.physics.enable( gs.plane, Phaser.Physics.ARCADE);

    
    //gs.plane.anchor.setTo(0.5, 0.5);

    gs.fire( gs.plane, 0, 100 );
    
    game.input.onDown.add(onMouseDown, this);
    game.input.onUp.add(onMouseUp, this);
        
}

function onMouseDown( pointer ){
    if( gs.isCurrentHit( pointer.x, pointer.y ) ){        
        gs.slingshot.active = true;
        gs.setSlingshotStart( pointer.x, pointer.y );
    }
}

function onMouseUp( pointer ){
    if( gs.slingshot.active ){
        gs.setSlingshotFinish( pointer.x, pointer.y );
        gs.slingshot.active = false;
        
        var sx = gs.slingshot.start.x;
        var sy = gs.slingshot.start.y;
        var fx = gs.slingshot.finish.x;
        var fy = gs.slingshot.finish.y;
        
        var angle = Math.atan( ( fx - sx ) / ( fy - sy ) );
        var slingLength = Math.sqrt( ( fx - sx ) * ( fx - sx ) + ( fy - sy ) * ( fy - sy ) );
        
        if( fy < sy ) angle = angle + Math.PI
        
        gs.fire( gs.current, - angle / Math.PI * 180 + 270, slingLength ) 
        
        console.log( angle, slingLength );
    }
    
}

function update() {    
    if( gs.current ){
        gs.decreaseForce( gs.current )
        
        if( gs.slingshot.line ){
//            var sx = this.slingshot.start.x;
//            var sy = this.slingshot.start.y;
//            var fx = this.slingshot.finish.x;
//            var fy = this.slingshot.finish.y;
//
//            var slingLength = Math.sqrt( ( fx - sx ) * ( fx - sx ) + ( fy - sy ) * ( fy - sy ) );
//            
//            if( slingLength < this.slingshot.maxLength ){
//            }else{
//                //gs.slingshot.line.end.set(game.input.activePointer.x, game.input.activePointer.y);
//                
//            }
              gs.slingshot.line.end.set(game.input.activePointer.x, game.input.activePointer.y);

        }
    }       
}

function render(){
    if( gs.slingshot.line ){
        game.debug.geom( gs.slingshot.line );    
    }
        game.debug.rectangle( gs.plane )
}