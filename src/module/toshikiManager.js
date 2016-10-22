/* global cc */

var ToshikiManager = cc.Node.extend({
	FREQ: {
		HIGH: 1,
		LOW: 2
	},
	
	ctor: function(){
		cc.log("ToshikiManager: create.");
		this._super();
		
		this._frequency = this.FREQ.LOW;
		this._updateInterval = 0.1;
		this._updateProbability = 0.2;

		this._toshikis = [];
	},
	
	addToshiki: function(toshiki){
		cc.log("ToshikiManager: addToshiki.");
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