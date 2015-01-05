define( function(){
    return {
        world: {
            friction: 0  
            ,bonusFrequence: 1
            ,wreckAlpha: 0.5
        }
        ,gameInfo: {
            borderSprite: "game-info-border"
            ,borderWidth: 32           
            ,baseSprite: "game-info-base"
            ,baseWidth: 200
            ,stuffScale: 1
        }
        ,menu: {
            textStyle: { font: "14pt Verdana", fill: "#FFF" },
            textStyleOver: { font: "14pt Verdana", fill: "#FFF" }
        }
        ,slingshot:{
            power: 5
            ,labelColor: "#e5ffea"
            ,maxLength: 75
        }
        ,bonuses: {
            maxCount: 6
            ,maxCountInTurn: 6
            ,hitDistance: 24
            ,applyTime: 200
            ,bounds: 50
            ,height: 35
            ,settings: [
                {
                    sprite: "bonus-plane"
                    ,name: "plane"
                    ,start: "onTake"
                    ,end: "onTake"
                }                
                ,{
                    sprite: "bonus-force"
                    ,name: "force"
                    ,start: "onTake"
                    ,end: "onFire"
                    ,value: 50
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
        ,rockets: {
            spriteKey: 'rocket'
            ,velocity: 600
        }
        ,planes:{
            hitDistance: 12
            ,lives: 5
            ,defaultSprite: 'a0'
            ,dieAnimationScaleStep: 0.025
            ,dieAnimationAngleStep: 10
            ,spriteSize: 48
            ,height: 35
            ,rotateCoeff: 2
            ,defaultVelocity: 200
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
