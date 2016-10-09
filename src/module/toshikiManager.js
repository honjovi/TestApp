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
