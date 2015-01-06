define( function( require ){
    var config = require('config');
    var gettext = require('i18n/gettext');
    var StateBtn = require('buttons/change-state');
    
    return function( game ){
        this.create = function(){
            var winnerText = game.add.text( window.innerWidth / 2, window.innerHeight / 2 - config.planes.spriteSize * 2, gettext('winner'), config.menu.textStyle );
            winnerText.anchor.setTo( 0.5, 0.5 );
            
            new StateBtn( game, 'again', window.innerWidth / 2, window.innerHeight / 2, true, 'game' );
            
            var winner = game.add.sprite( window.innerWidth / 2, window.innerHeight / 2 - config.planes.spriteSize, this.winnerSpriteKey );
            winner.anchor.setTo( 0.5, 0.5 );    
        }    
        
        this.init = function( winnerSpriteKey ){
            this.winnerSpriteKey = winnerSpriteKey;
        }
    }
})


