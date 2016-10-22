/* global cc , TitleScene */

var EndingScene = cc.Scene.extend({

    ctor: function(score){
        this._super();
        this.score = score;
    },

    onEnter: function(){
        var backgroundLayer,
            scoreLabel,
            endLabel,
            size;

        this._super();
        size = cc.director.getWinSize();

        //initialize background
        backgroundLayer = new cc.LayerColor(cc.color("#bce8ae"), size.width, size.height);
        this.addChild(backgroundLayer);

        //initialize endLabel
        endLabel = new cc.LabelTTF("おわり", "Mieryo", 150);
        endLabel.setFontFillColor(cc.color("#000000"));
        endLabel.setPosition(size.width/2, size.height/2);
        this.addChild(endLabel, 1);

        //initialize scorelabel
        scoreLabel = new cc.LabelTTF("とくてん　" + this.score + "てん", "Meiryo", 80);
        scoreLabel.setFontFillColor(cc.color("#000000"));
        scoreLabel.setPosition(size.width/2, size.height/4);
        this.addChild(scoreLabel, 1);


        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ALL_AT_ONCE,
            onTouchesBegan: function(touchs, event){
                cc.director.runScene(new TitleScene());
            }
        }, this);

    }
});
