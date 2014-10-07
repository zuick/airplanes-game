define( function(){
    return {
        world: {
            friction: 5   
            ,bonusFrequence: 1
        }
        ,slingshot:{
            power: 5
            ,labelColor: "#000"
        }
        ,bonuses: {
            maxCount: 6
            ,maxCountInTurn: 3
            ,hitDistance: 12
            ,settings: [
                {
                    sprite: "bonus-plane"
                    ,name: "plane"                    
                }
                ,{
                    sprite: "bonus-turn"
                    ,name: "turn"                    
                }
                ,{
                    sprite: "bonus-force"
                    ,name: "force"
                    ,value: 50
                }
            ]
        }
        ,backItems: { maxCount: 10 }
        ,planes:{
            hitDistance: 12
            ,lives: 3
            ,defaultSprite: 'a1'
            ,dieAnimationScaleStep: 0.07
            ,spriteSize: 48
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
