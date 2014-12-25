define(function( require ){    
    var config = require('config');
    var BootState = require('states/boot');
    var GameState = require('states/game');
    var BattleOptionsScreen = require('states/battle-options');
    
    var game = new Phaser.Game( window.innerWidth, window.innerHeight, Phaser.AUTO );
    
    game.state.add( 'game', GameState );
    game.state.add( 'battle-options', BattleOptionsScreen );
    game.state.add( 'boot', BootState, true );       
});

