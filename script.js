/*---------------------------------------------*\

  Helpful Functions

\*---------------------------------------------*/

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
  Crafty.init();
  Crafty.background('black');
  Crafty.timer.FPS('60');
  Crafty.e('2D, Canvas, Text, Keyboard')
    .text('Start')
    .textColor('#ffffff')
    .bind('KeyDown', function(){
      if(this.isDown('F')) Crafty.trigger('goFullscreen');
      else Crafty.scene('Game');
    });

  Crafty.stage.elem.addEventListener('mousedown', function(){
    Crafty.trigger('KeyDown');
  });

  window.addEventListener('blur', function(){
    if(timeElapsed()) Crafty.scene('End');
  });
});

/*---------------------------------------------*\

  Binds

\*---------------------------------------------*/

Crafty.bind('goFullscreen', function(){
  if (Crafty.stage.elem.requestFullscreen) {
    Crafty.stage.elem.requestFullscreen();
  } else if (Crafty.stage.elem.msRequestFullscreen) {
    Crafty.stage.elem.msRequestFullscreen();
  } else if (Crafty.stage.elem.mozRequestFullScreen) {
    Crafty.stage.elem.mozRequestFullScreen();
  } else if (Crafty.stage.elem.webkitRequestFullscreen) {
    Crafty.stage.elem.webkitRequestFullscreen();
  }
});

/*---------------------------------------------*\

  Scenes

\*---------------------------------------------*/

Crafty.scene('Game', function(){
  startDate = Date.now();
  varTimeElapsed = 0;

  Crafty.e('Stage, Color')
    .attr({
      w: Crafty.stage.elem.clientWidth
    })
    .color('red');

  Crafty.e('2D, Canvas, Jump, Gravity, Color')
    .attr({
      x: 50,
      y: Crafty.stage.elem.clientHeight - 150,
      w: 50,
      h: 50
    })
    .jump(10)
    .gravity(3)
    .gravity('Stage')
    .color('blue')
    .bind('EnterFrame', function(){
      if(this.y > Crafty.stage.elem.clientHeight - 150) this.disableControls = true;
      if(this.y > Crafty.stage.elem.clientHeight) Crafty.scene('End');
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
    this.requires('2D, Canvas');

    this.attr({
      x: 0,
      y: Crafty.stage.elem.clientHeight - 100,
      w: Crafty.math.randomInt(1000, 500),
      h: 100
    })
    .bind('EnterFrame', function(){
      this.x -= 20 + 5 * calcLevel(timeElapsed());

      if(this.x + this.w <= Crafty.stage.elem.clientWidth && !this._nextStageLoaded){
        this._nextStageLoaded = true;

        Crafty.e('Stage, Collision, Color')
          .attr({
            x: Crafty.stage.elem.clientWidth  + Crafty.math.randomInt(500, 100)
          })
          .color('red');

      }
    });
  }
});

Crafty.c('Jump', {
  _up: false,

  init: function(){
    this.requires('Keyboard, Collision');
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
    }).onHit('Stage', function(){
      this.disableControls = false;
      // '~~' converts from floating point to integer, to fix issue #11
      // https://github.com/LeoMcA/jumpy/issues/11
      if(~~this.y > Crafty.stage.elem.clientHeight - 145){
        Crafty.scene('End');
      }
    })

    return this;
  }
});
