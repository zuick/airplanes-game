var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-stage', { preload: preload, create: create, update: update, render: render });
var gs = {
    friction: 2
    ,planes: []
    ,currentIndex: 0
    ,slingshot: { 
        start: { x: 0, y: 0 }
        ,finish: { x: 0, y: 0 } 
        ,active: false
        ,line: false
        ,maxLength: 100
    }
    ,planesSettings: [
        {
            sprite: 'a1'
            ,pos: 'left'
            ,offset: 100
        }
        ,{
            sprite: 'a2'
            ,pos: 'right'
            ,offset: 100
        }
        ,{
            sprite: 'a3'
            ,pos: 'up'
            ,offset: 100
        }
        ,{
            sprite: 'a4'
            ,pos: 'down'
            ,offset: 100
        }
        
    ]
    ,createPlanes: function( count ){
        if( count > this.planesSettings.length ) count = this.planesSettings.length;
        
        for( var i = 0; i < count; i++ ){
            var x, y, r = 0;
            switch( this.planesSettings[i].pos ){
                case 'left':
                    x = this.planesSettings[i].offset;
                    y = game.world.height / 2;
                    r = 0;
                    break;
                case 'right':
                    x = game.world.width - this.planesSettings[i].offset;
                    y = game.world.height / 2;
                    r = 180;
                    break;
                case 'up':
                    x = game.world.width / 2;
                    y = this.planesSettings[i].offset;
                    r = 90;
                    break;
                case 'down':
                    x = game.world.width / 2;
                    y = game.world.height - this.planesSettings[i].offset;
                    r = 270;
                    break;
                default: break;
            }
            var plane = game.add.sprite( x, y, this.planesSettings[i].sprite );
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
    ,nextTurn: function(){
        if( this.currentIndex + 1 >= this.planes.length ){
            this.setCurrent( 0 );
        }else{
            this.setCurrent( this.currentIndex + 1 );            
        }
    }
    ,fire: function( angle, force ){               
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
            sprite.force -= this.friction;
            this.setVelocityToSprite( sprite, sprite.angle, sprite.force );
        }else{
            sprite.body.velocity.x = 0;
            sprite.body.velocity.y = 0;            
        }
    }
    ,getSlingshotStrength: function( x, y ){
        var sx = this.slingshot.start.x;
        var sy = this.slingshot.start.y;
        var fx = x || this.slingshot.finish.x;
        var fy = y || this.slingshot.finish.y;
        
        var rad = Math.atan( ( fx - sx ) / ( fy - sy ) );
        var slingLength = Math.sqrt( ( fx - sx ) * ( fx - sx ) + ( fy - sy ) * ( fy - sy ) );
        if( fy < sy ) rad = rad + Math.PI
        var angle = - rad / Math.PI * 180 + 270;
        
        return { angle: angle, length: slingLength };
        
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
    ,setSlingshotStart: function( x, y ){
        this.slingshot.start.x = x;
        this.slingshot.start.y = y;
        this.slingshot.line = new Phaser.Line(x, y, game.input.activePointer.x, game.input.activePointer.y);
        
    }
    ,setSlingshotFinish: function( x, y ){
        this.slingshot.finish.x = x;
        this.slingshot.finish.y = y;
        this.slingshot.line.setTo( -1, -1, -1, -1 );     
    }
};

function preload() {    
    game.load.image('a1', 'assets/a1.png');
    game.load.image('a2', 'assets/a2.png');
    game.load.image('a3', 'assets/a3.png');
    game.load.image('a4', 'assets/a4.png');
}

function create() {
    game.stage.backgroundColor = '#b6ebff';
    
    gs.createPlanes( 4 );
    
    gs.setCurrent( 0 );
    
    game.input.onDown.add(onMouseDown, this);
    game.input.onUp.add(onMouseUp, this);
        
}

function onMouseDown( pointer ){
    if( gs.isCurrentHit( pointer.x, pointer.y ) ){        
        gs.slingshot.active = true;
        
        gs.setSlingshotStart( gs.getCenter( gs.current ).x, gs.getCenter( gs.current ).y );
    }
}

function onMouseUp( pointer ){
    if( gs.slingshot.active ){
        gs.setSlingshotFinish( pointer.x, pointer.y );
        gs.slingshot.active = false;
        
        var slingshotStrength = gs.getSlingshotStrength();
        
        gs.fire( slingshotStrength.angle, slingshotStrength.length );
        gs.nextTurn();
        
    }
    
}

function update() {    
    
    if( gs.slingshot.active ){
          gs.slingshot.line.end.set(game.input.activePointer.x, game.input.activePointer.y);
          gs.current.angle = gs.getSlingshotStrength( game.input.activePointer.x, game.input.activePointer.y ).angle;
    }
    
    gs.planes.forEach( function( plane ){
        gs.decreaseForce( plane );
    })
}

function render(){
    game.debug.geom( gs.slingshot.line, "#000", true );    
    
}