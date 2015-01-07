define( function(){
    return {
        world: {
            friction: 0             
            ,bonusFrequence: 1
            ,wreckAlpha: 0.5
            ,explosion:{
                spriteSize: 24
                ,spriteKey: 'exp'
                ,frameRate: 12
            }
            ,explosion2:{
                spriteSize: 24
                ,spriteKey: 'exp'
                ,frameRate: 16
            }
        }
        ,buttons: {
            spriteSize: 50
            ,offsetX: 27
            ,offsetY: 100
            ,fireSpriteKey: 'fire-btn'
            ,leftSpriteKey: 'left-btn'
            ,rightSpriteKey: 'right-btn'            
        }
        ,gameInfo: {
            borderSprite: "game-info-border"
            ,borderWidth: 54           
            ,baseSprite: "game-info-border"
            ,baseWidth: 200
            ,stuffScale: 0.5
        }
        ,menu: {
            textStyle: { font: "16pt Verdana", fill: "#FFF", stroke: "#003871", strokeThickness: 4 }
            ,btnStyle: { font: "16pt Verdana", fill: "#FFF", stroke: "#2f7546", strokeThickness: 4 }
            ,btnStyleOver: { font: "16pt Verdana", fill: "#FFF", stroke: "#5f9973", strokeThickness: 4 }            
            ,btnHeight: 48
        }
        ,slingshot:{
            power: 5
            ,labelColor: "#e5ffea"
            ,maxLength: 75
        }
        ,bonuses: {
            maxCount: 10
            ,maxCountInTurn: 10
            ,hitDistance: 24
            ,applyTime: 200
            ,bounds: 50
            ,height: 35
            ,settings: [
                {
                    sprite: "bonus-plane"
                    ,name: "plane"
                    ,frequency: 0.2
                }                
                ,{
                    sprite: "bonus-force"
                    ,name: "force"
                    ,frequency: 0.2
                    ,value: 50
                }
                ,{
                    sprite: "bonus-rocket"
                    ,name: "rocket"
                    ,frequency: 0.6
                    ,value: 5
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
            ,smoke: {
                frequency: 100
                ,spriteKey: 'rocket-smoke'
                ,spriteSize: 16
                ,animationFrameRate: 8
                ,damping: 0.95
            }
        }
        ,planes:{
            hitDistance: 24
            ,lives: 5
            ,ammo: 5
            ,maxAmmo: 10
            ,defaultSprite: 'a0'
            ,dieAnimationScaleStep: 0.016
            ,dieAnimationAngleStep: 8
            ,spriteSize: 48
            ,smoke:{
                frequency: 100
                ,spriteKey: 'smoke'
                ,spriteSize: 16
                ,animationFrameRate: 10
                ,damping: 0.95
            }
            ,height: 35
            ,rotateCoeff: 3
            ,defaultVelocity: 200
            ,settings: [
                {
                    sprite: 'a1'
                    ,color: '#618ac7'
                    ,pos: 'left'
                    ,offset: 48
                }
                ,{
                    sprite: 'a2'
                    ,color: '#a6ad42'
                    ,pos: 'right'
                    ,offset: 48
                }
                ,{
                    sprite: 'a3'
                    ,color: '#dbb753'
                    ,pos: 'up'
                    ,offset: 48
                }
                ,{
                    sprite: 'a4'
                    ,color: '#9e4646'
                    ,pos: 'down'
                    ,offset: 48
                }

            ]
        }
    }
})
