/*---------------------------------------------*\

  Helpful Functions

\*---------------------------------------------*/

function genRandomInt(max, min){
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function timeElapsed(start){
  if(start) this.time = (Date.now() - start) / 1000;
  return this.time;
}

function calcLevel(time){
  if(!time) return 0;
  return Math.floor(time/10);
}

/*---------------------------------------------*\

  Initalise Game

\*---------------------------------------------*/

window.addEventListener('load', function(){
  Crafty.init(800, 600);
  Crafty.background('black');
  Crafty.e('2D, Canvas, Text, Keyboard')
    .text('Start')
    .textColor('#ffffff')
    .bind('KeyDown', function(){
      Crafty.scene('Game');
    });

  Crafty.stage.elem.addEventListener('mousedown', function(){
    Crafty.trigger('KeyDown');
  });

  window.addEventListener('blur', function(){
    if(timeElapsed()) Crafty.scene('End');
  })
});
/*---------------------------------------------*\

  Scenes

\*---------------------------------------------*/

Crafty.scene('Game', function(){
  startDate = Date.now();
  varTimeElapsed = 0;

  Crafty.e('Stage, Color')
    .attr({
      w: 1000
    })
    .color('red');

  Crafty.e('2D, Canvas, Jump, Gravity, Color')
    .attr({
      x: 50,
      y: 450,
      w: 50,
      h: 50
    })
    .jump(10)
    .gravity(3)
    .gravity('Stage')
    .color('blue')
    .bind('EnterFrame', function(){
      if(this.y > 450) this.disableControls = true;
      if(this.y > 600) Crafty.scene('End');
    });

    var Timer = Crafty.e('2D, Canvas, Text')
      .textColor('#ffffff')
      .bind('EnterFrame', function(){
        this.text(timeElapsed(startDate));
      });
});

Crafty.scene('End', function(){

  if(timeElapsed() > localStorage.getItem('hiscore')){
    localStorage.setItem('hiscore', timeElapsed());
  }

  Crafty.e('2D, Canvas, Text, Keyboard')
    .text(timeElapsed() + ' Hiscore: ' + localStorage.getItem('hiscore'))
    .textColor('#ffffff')
    .bind('KeyDown', function(){
      Crafty.scene('Game')
    });
});

/*---------------------------------------------*\

  Custom Components

\*---------------------------------------------*/

Crafty.c('Stage', {
  _nextStageLoaded: false,

  init: function(){
    this.requires('2D, Canvas, Collision');

    this.attr({
      x: 0,
      y: 500,
      w: genRandomInt(1000, 500),
      h: 100
    })
    .bind('EnterFrame', function(){
      this.x -= 20 + 5 * calcLevel(timeElapsed());

      if(this.x + this.w <= 800 && !this._nextStageLoaded){
        this._nextStageLoaded = true;

        Crafty.e('Stage, Collision, Color')
          .attr({
            x: 800 + genRandomInt(500, 100)
          })
          .color('red');

      }
    })
    .onHit('Jump', function(e){
      e[0].obj.disableControls = false;
      if(e[0].obj.y > 455) Crafty.scene('End');
    });
  }
});

Crafty.c('Jump', {
  _up: false,

  init: function(){
    this.requires('Keyboard');
  },

  jump: function(speed){
    this._jumpSpeed = speed;

    this.bind('EnterFrame', function(){
      if(this.disableControls) return;
      if(this._up){
        this.y -= this._jumpSpeed;
        this._falling = true;
      }
    })
    .bind('KeyDown', function(){
      this._up = true;
    })

    return this;
  }
});
