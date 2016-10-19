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
        cc.log("hide.");
        if(this._locked) return;

        this._strokePoint = 0;
        this._changeState(this._STATE.HIDING);
    },

    /** show toshiki. */
    show: function(){
        cc.log("show.");
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
                cc.log("change state normal.");
                this._setAnimation(this._animation.NORMAL, true);
                break;
            case this._STATE.HIDING:
                cc.log("change state hiding.");
                this._setAnimation(this._animation.HIDING, true);
                break;
            case this._STATE.STROKED:
                cc.log("change state stroked.");
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
