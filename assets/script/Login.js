let wx_button
cc.Class({
    extends: cc.Component,

    properties: {
        btn_login: cc.Button
    },

    onLoad () {
        this.initData()
    },

    initData () {
        if (cc.sys.platform === cc.sys.WECHAT_GAME) {
            this.initEvent()
        } else {
            cc.game.end()
        }
    },

    initEvent () {
        let self = this
        self.btn_login.node.on(cc.Node.EventType.TOUCH_END, function (event) {
            wx.login ({
                success: getCode => {
                    wx.request({
                        url: GET_OPENID_$_KEY,
                        data: {
                            code: getCode.code
                        },
                        method: 'POST',
                        success: res => {
                            USERID = res.data.userId
                            wx.getUserInfo ({
                                success: userInfo => {
                                    console.log(userInfo)
                                    wx.request({
                                        url: SET_USER_INFO,
                                        data: {
                                            nickName: userInfo.userInfo.nickName,
                                            headImg: userInfo.userInfo.avatarUrl,
                                            gender: userInfo.userInfo.gender,
                                            rawData: userInfo.rawData,
                                            signature: userInfo.signature,
                                            userId: USERID
                                        },
                                        method: 'POST',
                                        success: result => {
                                            if (result.data.errcode == 10000) {
                                                cc.director.loadScene('Game')
                                            }
                                        }
                                    })
                                }
                            })
                        }
                    })
                }
            })
        })
    }
});
