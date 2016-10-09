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
