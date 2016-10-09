var BattleScene = cc.Scene.extend({
    onEnterTransitionDidFinish: function(){
        var size,
            backgroundLayer,
            i, j,
            x, y,

            toshiki,
            toshikiManager,
            scoreLabel,
            timeLabel,
            scheduler,

            addScore;

        this._super();
        this.score = 0;
        this.time = 30;

        cc.spriteFrameCache.addSpriteFrames("res/toshiki.plist", "res/toshiki.png");

        //initialize background
        size = cc.director.getWinSize();
        backgroundLayer = new cc.LayerColor(cc.color("#bce8ae"), size.width, size.height);
        this.addChild(backgroundLayer,1);

        //initialize toshikis
        toshikiManager = new ToshikiManager();
        addScore = function(){
            this.score += 100;
            scoreLabel.updateScore(this.score);
        };
        for(i=0; i<3; i++){
            for(j=0; j<3; j++){
                toshiki = new Toshiki();
                x = size.width/2 + ((i - 1) * toshiki.width);
                y = size.height/2 + ((j - 1) * toshiki.height);
                toshiki.setPosition(cc.p(x, y));
                toshiki.addCallbackOnStroked(addScore.bind(this));
                this.addChild(toshiki, 2);
                toshikiManager.addToshiki(toshiki);
            }
        }
        toshikiManager.setFrequency(ToshikiManager.FREQ.LOW);
        toshikiManager.startHideAndShow();


        //initialize scorelabel
        scoreLabel = new ScoreLabel(0, size.height, this.score);
        scoreLabel.setAnchorPoint(cc.p(0, 1));
        this.addChild(scoreLabel, 3);

        //initialize timelabel
        timeLabel = new TimeLabel(size.width, size.height, this.time);
        timeLabel.setAnchorPoint(cc.p(1, 1));
        this.addChild(timeLabel, 3);

        //set time sucheduler
        scheduler = cc.director.getScheduler();
        scheduler.schedule(function(){
            this.time--;
            timeLabel.updateTime(this.time);

            if(this.time <= 0){
                cc.director.getScheduler().unscheduleAllForTarget(this);
                toshikiManager.stopHideAndShow();
                cc.director.runScene(new EndingScene(this.score));
                return;
            }

            if(this.time <= 10){
                timeLabel.setColorRed();
                toshikiManager.setFrequency(ToshikiManager.FREQ.HIGH);
            }
        }.bind(this), this, 1);
    },

    onExit: function(){
        cc.spriteFrameCache.removeSpriteFramesFromFile("res/toshiki.plist");
    }
});
