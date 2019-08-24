const Game = require('GameScript')
cc.Class({
    extends: cc.Component,

    properties: {

    },

    onLoad () {

    },

    onCollisionExit (other, self) {
        let game = new Game()
        game.eatProp()
    },

})
