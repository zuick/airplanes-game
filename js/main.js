var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-stage', { preload: preload, create: create, update: update });
var gs = {
    friction: 3
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
};

function preload() {
    game.load.image('a1', 'assets/a1.png');
    game.load.image('a2', 'assets/a2.png');
}

function create() {
    game.stage.backgroundColor = '#b6ebff';
    gs.plane = game.add.sprite(48, 48, 'a2');
    
    game.physics.enable( gs.plane, Phaser.Physics.ARCADE);

    gs.fire( gs.plane, 45, 200 );
        
}

function update() {    
    if( gs.current ){
        gs.decreaseForce( gs.current )
    }
}