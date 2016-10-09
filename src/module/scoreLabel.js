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
