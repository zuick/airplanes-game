define( function( require ){
    var config = require('config');
    
    var StateBtn = require('buttons/change-state');
    
    return function( game ){
        this.create = function(){
            var btnOuterHeight = config.menu.btnHeight;
            
            var buttons = [
                {
                    caption: "play",
                    goto: "game"
                },
                {
                    caption: "settings",
                    goto: "game"
                }
            ]
            
            buttons.map( function( btn, index ){
                new StateBtn( game, btn.caption, window.innerWidth / 2, window.innerHeight / 2 - buttons.length * btnOuterHeight / 2 + btnOuterHeight * index, true, btn.goto );                
            })
            
        }
    }
})


