cc.Class({
    extends: cc.Component,

    properties: {
        btn_restart: cc.Button
    },

    onLoad () {
        this.initData()
        this.initEvent()
    },

    initData () {        
        cc.debug.setDisplayStats(false)
    },

    initEvent () {
        let self = this
        self.btn_restart.node.on(cc.Node.EventType.TOUCH_END, function () {
            cc.director.loadScene('GameScene')
        })
    }

})
