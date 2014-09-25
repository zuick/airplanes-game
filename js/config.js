define( function(){
    return {
        world: {
            friction: 3       
            ,bonusFrequence: 2
        }
        ,slingshot:{
            power: 4
            ,labelColor: "#BBB"
        }
        ,bonuses: [ "bonus-plane", "bonus-turn" ]
        ,planes:{
            hitDistance: 7
            ,lives: 3
            ,defaultSprite: 'a1'
            ,dieAnimationScaleStep: 0.07            
            ,settings: [
                {
                    sprite: 'a1'
                    ,color: '#618ac7'
                    ,pos: 'left'
                    ,offset: 130
                }
                ,{
                    sprite: 'a2'
                    ,color: '#a6ad42'
                    ,pos: 'right'
                    ,offset: 130
                }
                ,{
                    sprite: 'a3'
                    ,color: '#dbb753'
                    ,pos: 'up'
                    ,offset: 130
                }
                ,{
                    sprite: 'a4'
                    ,color: '#9e4646'
                    ,pos: 'down'
                    ,offset: 130
                }

            ]
        }
    }
})
