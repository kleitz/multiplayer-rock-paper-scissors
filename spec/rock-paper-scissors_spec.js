const assert = require('chai').assert;

const Game = require('../src/game.js');

describe('In a game', function(){
    describe('a player', function(){
        it('should have an identifier', function(){
            const game = new Game();

            const playerId = game.registerPlayer();

            assert.exists(playerId);
        });

        it('should have an unique identifier', function(){
            const game = new Game();

            const playerOneId = game.registerPlayer();
            const playerTwoId = game.registerPlayer();

            assert.notEqual(playerOneId, playerTwoId);
        });
    });

    describe('in a round', function(){
        let game, playerOneId, playerTwoId;

        beforeEach(function(){
            game = new Game();
            playerOneId = game.registerPlayer();
            playerTwoId = game.registerPlayer();
        });

        it('rock crushes scissors', function(){
            game.pick(playerOneId, 'rock');
            game.pick(playerTwoId, 'scissors');

            let winners = game.winners();
            let losers = game.losers();

            assert.sameMembers(winners, [playerOneId]);
            assert.sameMembers(losers, [playerTwoId]);
        });

        it('scissors cuts paper', function(){
            game.pick(playerOneId, 'scissors');
            game.pick(playerTwoId, 'paper');

            let winners = game.winners();
            let losers = game.losers();

            assert.sameMembers(winners, [playerOneId]);
            assert.sameMembers(losers, [playerTwoId]);
        });

        it('paper wraps rock', function(){
            game.pick(playerOneId, 'paper');
            game.pick(playerTwoId, 'rock');

            let winners = game.winners();
            let losers = game.losers();

            assert.sameMembers(winners, [playerOneId]);
            assert.sameMembers(losers, [playerTwoId]);
        });

        it('same picks only knows winners', function(){
            game.pick(playerOneId, 'paper');
            game.pick(playerTwoId, 'paper');

            let winners = game.winners();
            let losers = game.losers();

            assert.sameMembers(winners, [playerOneId, playerTwoId]);
            assert.sameMembers(losers, []);
        });
    });

    describe('in a round with more than two players', function(){
        let game, playerOneId, playerTwoId, playerThreeId;

        beforeEach(function(){
            game = new Game();
            playerOneId = game.registerPlayer();
            playerTwoId = game.registerPlayer();
            playerThreeId = game.registerPlayer();
        });

        it('normal rules still apply, even when a minority', function(){
            game.pick(playerOneId, 'rock');
            game.pick(playerTwoId, 'scissors');
            game.pick(playerThreeId, 'scissors');

            let winners = game.winners();
            let losers = game.losers();

            assert.sameMembers(winners, [playerOneId]);
            assert.sameMembers(losers, [playerTwoId, playerThreeId]);
        });

        it('normal rules still apply, even when a majority', function(){
            game.pick(playerOneId, 'rock');
            game.pick(playerTwoId, 'scissors');
            game.pick(playerThreeId, 'rock');

            let winners = game.winners();
            let losers = game.losers();

            assert.sameMembers(winners, [playerOneId, playerThreeId]);
            assert.sameMembers(losers, [playerTwoId]);
        });

        it('ties should only know winners', function(){
            game.pick(playerOneId, 'rock');
            game.pick(playerTwoId, 'paper');
            game.pick(playerThreeId, 'scissors');

            let winners = game.winners();
            let losers = game.losers();

            assert.sameMembers(winners, [playerOneId, playerTwoId, playerThreeId]);
            assert.sameMembers(losers, []);
        });

        it('winner is deduced by most points scored', function(){
            const playerFourId = game.registerPlayer();
            game.pick(playerOneId, 'rock');
            game.pick(playerTwoId, 'paper');
            game.pick(playerThreeId, 'scissors');
            game.pick(playerFourId, 'rock');

            let winners = game.winners();
            let losers = game.losers();

            assert.sameMembers(winners, [playerTwoId]);
            assert.sameMembers(losers, [playerOneId, playerThreeId, playerFourId]);
        });

        it('winner is deduced by most points scored, ties knows only winners', function(){
            const playerFourId = game.registerPlayer();
            const playerFiveId = game.registerPlayer();
            game.pick(playerOneId, 'rock');
            game.pick(playerTwoId, 'paper');
            game.pick(playerThreeId, 'scissors');
            game.pick(playerFourId, 'rock');
            game.pick(playerFiveId, 'paper');

            let winners = game.winners();
            let losers = game.losers();

            assert.sameMembers(winners, [playerTwoId, playerThreeId, playerFiveId]);
            assert.sameMembers(losers, [playerOneId, playerFourId]);
        });
   });
});
