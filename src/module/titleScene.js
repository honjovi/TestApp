var TitleScene = cc.Scene.extend({
    onEnter: function(){
        console.log("title scene start.");
        
        this._super();
        var size = cc.director.getWinSize();
        var titleSprite = cc.Sprite.create("res/title.png");
        titleSprite.setPosition(size.width/2, size.height/2);
        this.addChild(titleSprite, 0);

        var startLabel = new cc.LabelTTF("TOUCH TO START!", "Arial", 60);
        startLabel.setFontFillColor(cc.color("#000"));
        startLabel.setPosition(size.width/2, size.height/4);
        this.addChild(startLabel, 1);

        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ALL_AT_ONCE,
            onTouchesBegan: function(touchs, event){
                cc.director.runScene(new BattleScene());
            }
        }, this);
    }
});
