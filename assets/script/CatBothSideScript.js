const Game = require('GameScript')
cc.Class({
    extends: cc.Component,

    properties: {

    },

    onLoad () {

    },

    onCollisionEnter (other, self) {
        let game = new Game()
        game.gameOver()
    },

})
