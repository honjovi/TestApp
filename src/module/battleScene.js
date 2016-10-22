/* global cc, Toshiki, ToshikiManager, ScoreLabel, TimeLabel, EndingScene */

var BattleScene = cc.Scene.extend({
    onEnterTransitionDidFinish: function(){
        var windowSize,
            i, j,
            x, y,
			toshiki;
        
        cc.log("battle scene start!");

        this._super();
        this._score = 0;
        this._time = 30;

        cc.spriteFrameCache.addSpriteFrames("res/toshiki.plist", "res/toshiki.png");

        //initialize background
        windowSize = cc.director.getWinSize();
        this._backgroundLayer = new cc.LayerColor(cc.color("#bce8ae"), windowSize.width, windowSize.height);
        this.addChild(this._backgroundLayer,1);

        //initialize toshikis
        this._toshikiManager = new ToshikiManager();
		this.addChild(this._toshikiManager);
		this._toshiki = [];
        for(i=0; i<3; i++){
            for(j=0; j<3; j++){
                toshiki = new Toshiki();
				this.addChild(toshiki, 2);
				
                x = windowSize.width/2 + ((i - 1) * toshiki.width);
                y = windowSize.height/2 + ((j - 1) * toshiki.height);
                toshiki.setPosition(cc.p(x, y));
                toshiki.addCallbackOnStroked(this._addScore.bind(this));
				
                this._toshikiManager.addToshiki(toshiki);
            }
        }
        this._toshikiManager.setFrequency(this._toshikiManager.FREQ.LOW);
        this._toshikiManager.startHideAndShow();


        //initialize scorelabel
        this._scoreLabel = new ScoreLabel(0, windowSize.height, this._score);
        this._scoreLabel.setAnchorPoint(cc.p(0, 1));
        this.addChild(this._scoreLabel, 3);

        //initialize timelabel
        this._timeLabel = new TimeLabel(windowSize.width, windowSize.height, this._time);
        this._timeLabel.setAnchorPoint(cc.p(1, 1));
        this.addChild(this._timeLabel, 3);

        //set time sucheduler
        this.schedule(this._updateTimer, 1.0);
    },
	
	_updateTimer: function(){
		cc.log("BattleScene: time is " + this._time + ".");
            
		this._time--;

		this._timeLabel.updateTime(this._time);

		if(this._time <= 0){
			this.unscheduleAllCallbacks();
			this._toshikiManager.stopHideAndShow();
			cc.director.runScene(new EndingScene(this._score));
			return;
		}

		if(this._time <= 10){
			this._timeLabel.setColorRed();
			this._toshikiManager.setFrequency(this._toshikiManager.FREQ.HIGH);
		}
	},
	
	_addScore: function(){
        this._score += 100;
        this._scoreLabel.updateScore(this._score);
    },

    onExit: function(){
        cc.spriteFrameCache.removeSpriteFramesFromFile("res/toshiki.plist");
    }
});
