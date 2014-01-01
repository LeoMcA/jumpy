Game = {
  start: function(){
    Crafty.init(800, 600);
    Crafty.background('black')

    function genRandomInt(max, min){
      return Math.floor(Math.random() * (max - min + 1) + min)
    }

    Crafty.c('Stage', {
      _nextStageLoaded: false,

      init: function(){
        this.requires('2D, Canvas');

        this.attr({
          x: 0,
          y: 500,
          w: genRandomInt(1000, 500),
          h: 100
        })
        .bind('EnterFrame', function(){
          this.x -= 20;

          if(this.x + this.w <= 800 && !this._nextStageLoaded){
            this._nextStageLoaded = true;
            Crafty.trigger('LoadNewStage');
          }
        });
      }
    });

    Crafty.bind('LoadNewStage', function(){
      Crafty.e('Stage, Color')
      .attr({
        x: 800 + genRandomInt(500, 100)
      })
      .color('red');
    });

    Crafty.e('Stage, Color')
      .attr({
        w: 1000
      })
      .color('red');

    Crafty.c('Jump', {
      _up: false,

      init: function(){
        this.requires('Keyboard');
      },

      jump: function(speed){
        this._jumpSpeed = speed;

        this.bind("EnterFrame", function(){
          if(this.disableControls) return;
          if(this._up){
            this.y -= this._jumpSpeed;
            this._falling = true;
          }
        }).bind("KeyDown", function(){
          this._up = true;
        });

        return this;
      }
    });

    Crafty.e('2D, Canvas, Jump, Gravity, Color')
      .attr({
        x: 50,
        y: 450,
        w: 50,
        h: 50
      })
      .jump(10)
      .gravity(3)
      .gravity('2D')
      .color('blue');
  }
}

window.addEventListener('load', Game.start);
