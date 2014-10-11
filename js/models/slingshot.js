define( function( require ){
    var utils = require('utils'); 
    var config = require('config');
    
    return function Slingshot( game ){
        
        this.start = { x: 0, y: 0 };
        this.finish = { x: 0, y: 0 }; 
        this.active = false;
        this.line = new Phaser.Line( -1, -1, -1, -1);;
        this.maxLength = config.slingshot.maxLength;
        this.label = game.add.sprite( 0, 0, "slingshot-handle" );
        this.label.anchor.setTo( 0.5, 0.5 );
        this.label.alpha = 0;
        this.power = config.slingshot.power;
        this.setStart = function( x, y, x2, y2 ){
            this.start.x = x;
            this.start.y = y;               
        }
        this.setFinish = function( x, y ){
            this.finish.x = x;
            this.finish.y = y;            
        }
        this.getPulling = function( x, y ){
            var sx = this.start.x;
            var sy = this.start.y;
            var fx = x || this.finish.x;
            var fy = y || this.finish.y;

            var rad = Math.atan( ( fx - sx ) / ( fy - sy ) );
            var slingLength = Math.sqrt( ( fx - sx ) * ( fx - sx ) + ( fy - sy ) * ( fy - sy ) );
            if( fy < sy ) rad = rad + Math.PI
            var angle = - rad / Math.PI * 180 + 270;

            return { angle: angle, length: slingLength };

        }
        this.pulling = function( plane, pointerX, pointerY ){
            if( this.active ){
                var slingshotStrength = this.getPulling( pointerX, pointerY );

                var slingEndX, slingEndY = 0;
                var maxLength = this.maxLength + plane.getSlingshotMagnifier()                           
                var planeDiameter = config.planes.spriteSize / 2 + 1;
                
                if ( slingshotStrength.length > maxLength ){            
                    slingEndX = this.start.x + maxLength * Math.cos( utils.toRad( slingshotStrength.angle ) + Math.PI );
                    slingEndY = this.start.y + maxLength * Math.sin( utils.toRad( slingshotStrength.angle ) + Math.PI );            
                }else{
                    slingEndX = pointerX;
                    slingEndY = pointerY;            
                }
                    
                if( slingshotStrength.length > planeDiameter ){
                    var slingStartX = this.start.x + planeDiameter * Math.cos( utils.toRad( slingshotStrength.angle ) + Math.PI );
                    var slingStartY = this.start.y + planeDiameter * Math.sin( utils.toRad( slingshotStrength.angle ) + Math.PI );  
                    this.line.start.set( slingStartX, slingStartY );
                    this.line.end.set( slingEndX, slingEndY );                    
                }
                this.label.x = slingEndX;
                this.label.y = slingEndY;
                this.setFinish( slingEndX, slingEndY );
                
                plane.rotate( slingshotStrength.angle );
                
            }
        }
        this.activate = function(){
            this.active = true;
            this.label.alpha = 1;            
        }
        this.release = function(){
            this.active = false;
            this.label.alpha = 0;
        }
    }    
})


