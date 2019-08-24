const Game = require('GameScript')
cc.Class({
    extends: cc.Component,

    properties: {

    },

    onLoad () {

    },

    onCollisionEnter(other, self) {
        if (other.world.aabb.y == 300) {
            let game = new Game()
            game.viewDown()
        }
    },

})
