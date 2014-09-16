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
            ,defaultSprite: 'a1'
            ,settings: [
                {
                    color: '#618ac7'
                    ,pos: 'left'
                    ,offset: 130
                }
                ,{
                    color: '#a6ad42'
                    ,pos: 'right'
                    ,offset: 130
                }
                ,{
                    color: '#dbb753'
                    ,pos: 'up'
                    ,offset: 130
                }
                ,{
                    color: '#9e4646'
                    ,pos: 'down'
                    ,offset: 130
                }

            ]
        }
    }
})
