define( function(){
    return {
        world: {
            friction: 3            
        }
        ,slinshot:{
            power: 4
        }
        ,planes:{
            hitDistance: 7
            ,settings: [
                {
                    sprite: 'a1'
                    ,pos: 'left'
                    ,offset: 130
                }
                ,{
                    sprite: 'a2'
                    ,pos: 'right'
                    ,offset: 130
                }
                ,{
                    sprite: 'a3'
                    ,pos: 'up'
                    ,offset: 130
                }
                ,{
                    sprite: 'a4'
                    ,pos: 'down'
                    ,offset: 130
                }

            ]
        }
    }
})
