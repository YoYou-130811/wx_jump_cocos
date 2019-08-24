let isCanTouch = true
let nowCake
let nowCakeAction
let nowProp
let scoreLabel
let scoreNum = 0
let cakeArr = []
let isCanCreateCake = true
let isCatCanMove = true
let isCanCreateProp = true
const createCakeSpaceTime = 1.75
const createPropSpaceTime = 30
const propCreateCakeNum = 10
let SELF
let CREATE_CAKE_SCHEDULE
let Game = cc.Class({
    extends: cc.Component,

    properties: {
        cake: cc.Prefab,
        btn_start: cc.Button,
        clickLayer: cc.Node,
        catPlayer: cc.Node,
        score: cc.Label,
        view: cc.Node,
        prop: cc.Prefab,
    },

    onLoad () {
        this.initData()
        this.initEvent()
    },

    initData () {
        SELF = this
        cc.debug.setDisplayStats(false)
        this.initCollisionMgr()
        this.clickLayer.active = false
        scoreLabel = this.score
    },

    initEvent () {
        SELF.btn_start.node.on(cc.Node.EventType.TOUCH_END, function () {
            SELF.btn_start.node.destroy()
            SELF.clickLayer.active = true
            isCatCanMove = true
            SELF.score.string = scoreNum
            SELF.scheduleCreate()
            SELF.initCreatePropState()
        })
        SELF.clickLayer.on(cc.Node.EventType.TOUCH_START, function () {
            SELF.catMove()
        })
    },

    initCollisionMgr () {
        let manager = cc.director.getCollisionManager()
        manager.enabled = true
        // manager.enabledDebugDraw = true
        // manager.enabledDrawBoundingBox = true
    },

    initCreatePropState () {
        this.schedule(function () {
            if (!isCanCreateProp) {
                SELF.updateCreatePropState(true)
            }
        }, createPropSpaceTime)
    },

    catMove () {
        if (isCatCanMove) {
            let actionUp = cc.moveBy(0.35, cc.v2(0, 125))
            let wait = cc.delayTime(0.15)
            let callFunc = cc.callFunc(SELF.updateCanTouch)
            let actionDown = cc.moveBy(0.2, cc.v2(0, -125))
            if (cakeArr.length != 0) {
                actionDown = cc.moveTo(0.2, cc.v2(SELF.catPlayer.position.x, cakeArr[cakeArr.length - 1].node.position.y + 44))
            }
            if (isCanTouch) {
                SELF.catPlayer.runAction(cc.sequence(callFunc, actionUp, wait, actionDown, callFunc))
            }
        }
    },

    updateCanTouch () {
        isCanTouch = !isCanTouch
    },

    scheduleCreate () {
        CREATE_CAKE_SCHEDULE = function () {
            let random = Math.random()
            /*
             * [0, 0.2) Prop
             * [0.2, 1) Cake
             */
            if (random < 0.2 && scoreNum != 0 && isCanCreateProp) {
                SELF.initProp()
            } else {
                SELF.initCake()
            }
        }
        this.schedule(CREATE_CAKE_SCHEDULE, createCakeSpaceTime)
    },

    updateCreatePropState (result) {
        isCanCreateProp = result
    },

    initProp () {
        nowProp = cc.instantiate(this.prop).getComponent('PropScript')
        this.view.addChild(nowProp.node)
        let x = 300
        let y = this.catPlayer.position.y + 150
        if (cakeArr.length != 0) {
            y = cakeArr[cakeArr.length - 1].node.position.y + 150
        }
        let moveTime = 1.75
        let random = Math.random()
        let propAction
        if (random < 0.5) {
            nowProp.node.setPosition(cc.v2(-x, y))
            propAction = cc.moveTo(moveTime, cc.v2(x, y))
        } else {
            nowProp.node.setPosition(cc.v2(x, y))
            propAction = cc.moveTo(moveTime, cc.v2(-x, y))
        }
        nowProp.node.runAction(propAction)
        this.updateCreatePropState(false)
    },

    initCake () {
        if (isCanCreateCake) {
            nowCake = cc.instantiate(this.cake).getComponent('CakeScript')
            this.view.addChild(nowCake.node)
            let x = 300
            let y = -175 - 18 + 30 * cakeArr.length
            let moveTime = 2.5
            let random = Math.random()
            if (random < 0.5) {
                nowCake.node.setPosition(cc.v2(-x, y))
                nowCakeAction = cc.moveTo(moveTime, cc.v2(x, y))
            } else {
                nowCake.node.setPosition(cc.v2(x, y))
                nowCakeAction = cc.moveTo(moveTime, cc.v2(-x, y))
            }
            nowCake.node.runAction(nowCakeAction)
            cakeArr.push(nowCake)
        }
    },

    gameOver () {
        console.error('Game Over!')
        SELF.unschedule(CREATE_CAKE_SCHEDULE)
        SELF.catPlayer.stopAllActions()
        if (nowCake) {
            nowCake.node.stopAllActions()
        }
        isCanCreateCake = false
        cakeArr = []
        isCatCanMove = false

        let index = 3
        this.schedule(function () {
            console.warn(index-- + '秒后自动跳转到结算场景')
        }, 1, (index - 1), 0)
        setTimeout(function () {
            isCanCreateCake = true
            isCanTouch = true
            scoreNum = 0
            cc.director.loadScene('OverScene')
        }, (index + 1) * 1000)
    },

    viewDown () {
        if (cakeArr.length >= 2) {
            if (Math.abs(cakeArr[cakeArr.length - 2].node.position.x - nowCake.node.position.x) > 102.5) {
                SELF.gameOver()
            }
        }
        scoreLabel.string = ++scoreNum
        nowCake.node.stopAllActions()
        let action = cc.moveBy(0.25, cc.v2(0, -30))
        SELF.view.runAction(action)
    },

    eatProp () {
        SELF.catPlayer.stopAllActions()
        SELF.unschedule(CREATE_CAKE_SCHEDULE)
        nowProp.node.destroy()
        let catUpAction = cc.moveTo(0.1, cc.v2(SELF.catPlayer.position.x, cakeArr[cakeArr.length - 1].node.position.y + 500))
        let catDownAction
        let moveTime = 0.15
        let propAutoCake = function () {
            let cake = cc.instantiate(SELF.cake).getComponent('CakeScript')
            SELF.view.addChild(cake.node)
            let start_x = 300
            let end_x = SELF.catPlayer.position.x
            let y = -175 - 18 + 30 * cakeArr.length
            let random = Math.random()
            if (random < 0.5) {
                cake.node.setPosition(cc.v2(-start_x, y))
            } else {
                cake.node.setPosition(cc.v2(start_x, y))
            }
            let cakeAction = cc.moveTo(moveTime, cc.v2(end_x, y))
            cake.node.runAction(cakeAction)
            cakeArr.push(cake)
            scoreLabel.string = ++scoreNum
            let action = cc.moveBy(moveTime, cc.v2(0, -30))
            SELF.view.runAction(action)
        }
        let auto = function (callBack) {
            SELF.schedule(propAutoCake, moveTime, propCreateCakeNum - 1, 0.2)
            callBack()
        }
        let updateStage = function () {
            setTimeout(function () {
                if (cakeArr.length != 0) {
                    catDownAction = cc.moveTo(0.1, cc.v2(SELF.catPlayer.position.x, cakeArr[cakeArr.length - 1].node.position.y + 44))
                    SELF.catPlayer.runAction(catDownAction)
                    isCanTouch = true
                }
            }, (propCreateCakeNum * moveTime + 0.5 ) * 1000)
        }
        let autoCreateTime = cc.callFunc(auto(updateStage))
        let action = cc.sequence(catUpAction, autoCreateTime)
        SELF.catPlayer.runAction(action)
        setTimeout(function () {
            SELF.scheduleCreate()
        }, (propCreateCakeNum * moveTime + 0.5 ) * 1000)
    },

})
