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

var TitleScene = cc.Scene.extend({
    onEnter: function(){
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

/**
 * Toshiki class.
 * @constructor Toshiki
 * @extends cc.Sprite
 */
var Toshiki = cc.Sprite.extend({
    /** @module Toshiki */

    /** constructor. */
    ctor: function(){

        this._MAX_STROKE_POINT = 50;
        this._STATE = {
            NORMAL: 1,
            HIDING: 2,
            STROKED: 3
        };

        this._super("res/toshiki.png");

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

    /** hide toshiki. */
    hide: function(){
        if(this._locked) return;

        this._strokePoint = 0;
        this._changeState(this._STATE.HIDING);
    },

    /** show toshiki. */
    show: function(){
        if(this._locked) return;

        this._changeState(this._STATE.NORMAL);
    },

    /**
     * register callback function on stroked.
     * @param {function} callback callback function.
     */
    addCallbackOnStroked: function(callback){
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
                this._setAnimation(this._animation.NORMAL, true);
                break;
            case this._STATE.HIDING:
                this._setAnimation(this._animation.HIDING, true);
                break;
            case this._STATE.STROKED:
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

var ToshikiManager = function(){
    this.frequency = ToshikiManager.FREQ.LOW;
    this.updateInterval = 0.1;
    this.updateProbability = 0.2;

    this.toshikis = [];
};

ToshikiManager.prototype.addToshiki = function(toshiki){
    this.toshikis.push(toshiki);
};

ToshikiManager.prototype.startHideAndShow = function(){
    var scheduler = cc.director.getScheduler();
    scheduler.schedule(this._updateToshiki, this, this.updateInterval);
};

ToshikiManager.prototype.stopHideAndShow = function(){
    var scheduler = cc.director.getScheduler();
    scheduler.unscheduleAllForTarget(this);
};

ToshikiManager.prototype.setFrequency = function(frequency){
    //todo: check validation
    this.frequency = frequency;
};

ToshikiManager.prototype._updateToshiki = function(){
    var i, len;

    for(i=0, len=this.toshikis.length; i<len; i++){
        if(Math.random() >= this.updateProbability) continue;

        if(this.toshikis[i].isHiding()){
            if(this._judgeShowing()) this.toshikis[i].show();
            break;
        }else{
            if(this._judgeHiding()) this.toshikis[i].hide();
            break;
        }
    }
};

ToshikiManager.prototype._judgeHiding = function(){
    var random = Math.random();

    if(this.frequency == ToshikiManager.FREQ.HIGH){
        return random < 0.05;
    }else{
        return random < 0.1;
    }
};

ToshikiManager.prototype._judgeShowing = function(){
    var random = Math.random();

    if(this.frequency == ToshikiManager.FREQ.HIGH){
        return random < 0.2;
    }else{
        return random < 0.1;
    }
};

ToshikiManager.FREQ = {
    HIGH: 1,
    LOW: 2,
};
