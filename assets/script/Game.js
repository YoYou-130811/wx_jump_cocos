let bannerAd
cc.Class({
    extends: cc.Component,

    properties: {
        user_headImg: cc.Sprite,
        nickName: cc.Label,
        scoreNum: cc.Label
    },

    onLoad () {
        this.initData()
    },

    initData () {
        let self = this
        wx.request({
            url: GET_USER_DATA + USERID,
            method: 'GET',
            success: userData => {
                cc.loader.load(userData.data.headImg, function (err, texture) {
                    if (texture) {
                        self.user_headImg.spriteFrame = new cc.SpriteFrame(texture);
                    }
                });
                self.nickName.string = userData.data.nickName
                self.scoreNum.string = 0
            }
        })
    },

    getRankList () {
        wx.request({
            url: GET_RANK_LIST,
            method: 'GET',
            success: rankList => {

            }
        })
    },

    setTopScore (score) {
        wx.request({
            url: SET_TOP_SCORE,
            data: {
                userId: USERID,
                topScore: score
            },
            method: 'PUT',
            success: v => {

            }
        })
    }

    // showAD () {
    //     bannerAd = wx.createBannerAd({
    //         adUnitId: '',
    //         style: {
    //             left: 0,
    //             top: wx.getSystemInfoSync().windowHeight - 200,
    //             width: wx.getSystemInfoSync().windowWidth,
    //             height: 200
    //         }
    //     })
    //     bannerAd.show()
    // }

});
