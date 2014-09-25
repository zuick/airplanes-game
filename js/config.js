define( function(){
    return {
        world: {
            friction: 3            
        }
        ,slingshot:{
            power: 4
            ,labelColor: "#BBB"
        }
        ,planes:{
            hitDistance: 7
            ,lives: 3
            ,defaultSprite: 'a1'
            ,dieAnimationScaleStep: 0.07            
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
