/* global cc, res, Toshiki, ToshikiManager, ScoreLabel, TimeLabel, EndingScene */

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

        cc.spriteFrameCache.addSpriteFrames(res.toshiki_plist, res.toshiki_png);

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
		
		//play bgm
		cc.audioEngine.playMusic(res.bgm_mp3, true);
		
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
		
		cc.audioEngine.playEffect(res.pointUp_mp3, false);
    },

    onExit: function(){
		this._super();
		
        cc.spriteFrameCache.removeSpriteFramesFromFile(res.toshiki_plist);
		cc.audioEngine.stopMusic();
    }
});

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

/* global cc */

var ScoreLabel = cc.LabelTTF.extend({
    ctor: function(x, y, score){
        this._super("" + score + "てん", "Meiryo", 80);
        this.setPosition(cc.p(x, y));
        this.setFontFillColor(cc.color("#000000"));
    },

    updateScore: function(score){
        this.setString("" + score + "てん");
    }
});

/* global cc */

var TimeLabel = cc.LabelTTF.extend({
    ctor: function(x, y, time){
        this._super("のこりじかん" + time, "Meiryo", 80);
        this.setPosition(cc.p(x, y));
        this.setFontFillColor(cc.color("#000000"));
    },

    updateTime: function(time){
        this.setString("のこりじかん" + time);
    },

    setColorRed: function(){
        this.setFontFillColor(cc.color("#ff0000"));
    }
});

/* global cc, res, BattleScene */

var TitleScene = cc.Scene.extend({
    onEnter: function(){
    	cc.log("TitleScene: start.");
        
        this._super();
        var size = cc.director.getWinSize();
        var titleSprite = cc.Sprite.create(res.title_png);
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
		
		cc.audioEngine.setMusicVolume(0.2);
		cc.audioEngine.playMusic(res.title_mp3, true);
    },
	
	onExit: function(){
		this._super();
		
		cc.audioEngine.stopMusic();
	}
});

/* global cc, res */

/**
 * Toshiki class.
 * @constructor Toshiki
 * @extends cc.Sprite
 */
var Toshiki = cc.Sprite.extend({
    /** @module Toshiki */

    /** constructor. */
    ctor: function(){
		cc.log("Toshiki: create.");

        this._MAX_STROKE_POINT = 50;
        this._STATE = {
            NORMAL: 1,
            HIDING: 2,
            STROKED: 3
        };

        this._super(res.toshiki_png);

        /**
         * point added so that is stroked.
         * @type {number}
         */
        this._strokePoint = 0;

        /**
         * point added so that is stroked.
         * @type {function}
         */
        this._onStroked = null;

        this._locked = false;

        this._normalFrames =[];
        this._normalFrames.push(cc.spriteFrameCache.getSpriteFrame("toshiki1.png"));
        this._normalFrames.push(cc.spriteFrameCache.getSpriteFrame("toshiki2.png"));

        this._strokedFrames = [];
        this._strokedFrames.push(cc.spriteFrameCache.getSpriteFrame("toshiki3.png"));

        this._hidingFrames = [];
        this._hidingFrames.push(cc.spriteFrameCache.getSpriteFrame("toshiki4.png"));

        this._gradFrames = [];
        this._gradFrames.push(cc.spriteFrameCache.getSpriteFrame("toshiki5.png"));
        this._gradFrames.push(cc.spriteFrameCache.getSpriteFrame("toshiki6.png"));

        this._animation = {
            NORMAL: new cc.Animation(this._normalFrames, 0.4),
            STROKED: new cc.Animation(this._strokedFrames, 0.6),
            HIDING: new cc.Animation(this._hidingFrames, 0.6),
            GRAD: new cc.Animation(this._gradFrames, 0.1)
        };
		
		//GC回避
		this._animation.NORMAL.retain();
		this._animation.STROKED.retain();
		this._animation.HIDING.retain();
		this._animation.GRAD.retain();


        this._changeState(this._STATE.HIDING);

        //サイズを取れるようにするため
        this.setTextureRect(cc.rect(0, 0, 300, 350));

        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ALL_AT_ONCE,
            swallowTouches: true,
            onTouchesMoved: this._onTouchesMoved.bind(this),
            onTouchesEnded: this._onTouchesEnded.bind(this)
        }, this);
    },
	
	onExit: function(){
		cc.log("Toshiki: exit.");
		
		this._super();
		
		//GC回避
		this._animation.NORMAL.release();
		this._animation.STROKED.release();
		this._animation.HIDING.release();
		this._animation.GRAD.release();
	},

    /** hide toshiki. */
    hide: function(){
        cc.log("Toshiki: hide.");
        if(this._locked) return;

        this._strokePoint = 0;
        this._changeState(this._STATE.HIDING);
    },

    /** show toshiki. */
    show: function(){
        cc.log("Toshiki: show.");
        if(this._locked) return;

        this._changeState(this._STATE.NORMAL);
    },

    /**
     * register callback function on stroked.
     * @param {function} callback callback function.
     */
    addCallbackOnStroked: function(callback){
		cc.log("Toshiki: addCallbackOnStroked.");
        this._onStroked = callback;
    },

    isHiding: function(){
        return this._state == this._STATE.HIDING;
    },

    /**
     * change state.
     * @param {Object} state state of Toshiki.
     */
    _changeState: function(state){
        if(this._state == state) return;

        this._locked = false;

        switch(state){
            case this._STATE.NORMAL:
                cc.log("Toshiki: change state normal.");
                this._setAnimation(this._animation.NORMAL, true);
                break;
            case this._STATE.HIDING:
                cc.log("Toshiki: change state hiding.");
                this._setAnimation(this._animation.HIDING, true);
                break;
            case this._STATE.STROKED:
                cc.log("Toshiki: change state stroked.");
                this._setAnimation(this._animation.STROKED, true);
                break;
        }

        this._state = state;
    },

    _setAnimation: function(nextAnimation, isForever, nextState){
        var animate,
            action,
            callFunc;

        this.stopAllActions();

        animate = new cc.Animate(nextAnimation);

        if(isForever){
            action = animate.repeatForever();
        }else{
            callFunc = new cc.CallFunc(function(target, state){
                target._changeState(state);
            }, this, nextState);
            action = new cc.Sequence(animate.repeat(1), callFunc);
        }

        this.runAction(action);
    },

    _onTouchesMoved: function(touches, event){
        var point, rect;

        if(this._locked) return;

        if(this._state == this._STATE.HIDING) return;

        point = touches[0].getLocation();
        rect = this.getBoundingBoxToWorld();

        if(cc.rectContainsPoint(rect, point)){
            this._strokePoint += 1;
            if(this._strokePoint >= this._MAX_STROKE_POINT){
                this._strokePoint = 0;
                this._onStroked();
                this._locked = true;
                this._setAnimation(this._animation.GRAD, false, this._STATE.HIDING);
                return;
            }

            this._changeState(this._STATE.STROKED);
        }else{
            this._changeState(this._STATE.NORMAL);
        }
    },

    _onTouchesEnded: function(touches, event){
        if(this._locked) return;

        if(this._state == this._STATE.STROKED){
            this._changeState(this._STATE.NORMAL);
        }
    }
});

/* global cc */

var ToshikiManager = cc.Node.extend({
	FREQ: {
		HIGH: 1,
		LOW: 2
	},
	
	ctor: function(){
		this._super();
		
		this._frequency = this.FREQ.LOW;
		this._updateInterval = 0.1;
		this._updateProbability = 0.2;

		this._toshikis = [];
	},
	
	addToshiki: function(toshiki){
		cc.log("ToshikiManager: add toshiki.");
		this._toshikis.push(toshiki);
	},
	
	startHideAndShow: function(){
		cc.log("ToshikiManager: startHideAndShow.");
		this.schedule(this._updateToshiki, this._updateInterval);
	},

	stopHideAndShow: function(){
		cc.log("ToshikiManager: stopHideAndShow.");
		this.unscheduleAllCallbacks();
	},

	setFrequency: function(frequency){
		//todo: check validation
		cc.log("ToshikiManager: setFrequency " + frequency + ".");
		this._frequency = frequency;
	},

	_updateToshiki: function(){
		cc.log("ToshikiManager: updateToshiki.");
		var i, len;

		for(i=0, len=this._toshikis.length; i<len; i++){
			if(Math.random() >= this._updateProbability) continue;

			if(this._toshikis[i].isHiding()){
				if(this._judgeShowing()) this._toshikis[i].show();
				break;
			}else{
				if(this._judgeHiding()) this._toshikis[i].hide();
				break;
			}
		}
	},

	_judgeHiding: function(){
		var random = Math.random();

		if(this._frequency == this.FREQ.HIGH){
			return random < 0.05;
		}else{
			return random < 0.1;
		}
	},

	_judgeShowing: function(){
		var random = Math.random();

		if(this._frequency == this.FREQ.HIGH){
			return random < 0.2;
		}else{
			return random < 0.1;
		}
	}
});