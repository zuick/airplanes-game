define( function(){
    return {
        toRad: function( angle ){
            return angle / 180 * Math.PI;
        }
        ,fromRad: function( rad ){
            return rad / Math.PI * 180;
        }
    }
})


