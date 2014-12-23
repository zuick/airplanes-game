define( function(){
    return {
        world: {
            friction: 5   
            ,bonusFrequence: 1
            ,wreckAlpha: 0.5
        }
        ,gameInfo: {
            borderSprite: "game-info-border"
            ,borderWidth: 40            
            ,baseSprite: "game-info-base"
            ,baseWidth: 100
        }
        ,slingshot:{
            power: 5
            ,labelColor: "#e5ffea"
            ,maxLength: 75
        }
        ,bonuses: {
            maxCount: 6
            ,maxCountInTurn: 3
            ,hitDistance: 12
            ,applyTime: 200
            ,bounds: 50
            ,height: 50
            ,settings: [
                {
                    sprite: "bonus-plane"
                    ,name: "plane"
                    ,start: "onTake"
                    ,end: "onTake"
                }
                ,{
                    sprite: "bonus-turn"
                    ,name: "turn"
                    ,start: "onTake"
                    ,end: "onTake"
                }
                ,{
                    sprite: "bonus-force"
                    ,name: "force"
                    ,start: "onStartTurn"
                    ,end: "onFire"
                    ,value: 50
                }
                ,{
                    sprite: "bonus-shild"
                    ,name: "shild"
                    ,start: "onLeaveTurn"
                    ,end: "onStartTurn"
                }
            ]
        }
        ,clouds: {
            maxCount: 30
            ,maxCountInTurn: 10
            ,height: 60
            ,sprites: [ "cloud-s", "cloud-m", "cloud-l" ]
        }
        ,backItems: { maxCount: 0 }
        ,shadows: {
            dx: -1
            ,dy: 1
            ,tint: 0
            ,alpha: 0.3
            ,scale: 0.4
        }
        ,planes:{
            hitDistance: 12
            ,lives: 3
            ,defaultSprite: 'a1'
            ,dieAnimationScaleStep: 0.025
            ,dieAnimationAngleStep: 10
            ,spriteSize: 48
            ,height: 50
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
