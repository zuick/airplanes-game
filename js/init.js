define(function( require ){    
    var config = require('config');
    var BootState = require('states/boot');
    var GameState = require('states/game');
    var ResultsScreen = require('states/results');
    
    var game = new Phaser.Game( window.innerWidth, window.innerHeight, Phaser.CANVAS );
    
    game.state.add( 'game', GameState );
    game.state.add( 'results', ResultsScreen );
    game.state.add( 'boot', BootState, true );       
});

