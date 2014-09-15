define( function(){
    return function Slingshot( options ){
        this.start = { x: 0, y: 0 };
        this.finish = { x: 0, y: 0 }; 
        this.active = false;
        this.line = false;
        this.maxLength = options.maxLength || 75;
        this.label = new Phaser.Circle( 0, 0, options.labelSize || 15 );
        this.power = options.power || 1;
        this.setStart = function( x, y, x2, y2 ){
            this.start.x = x;
            this.start.y = y;
            this.line = new Phaser.Line(x, y, x2, y2);                
        }
        this.setFinish = function( x, y ){
            this.finish.x = x;
            this.finish.y = y;
            this.line.end.set( x, y );
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
    }    
})


