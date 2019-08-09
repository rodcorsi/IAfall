const fps = 120;
const fpsInterval = 1000 / fps;

function Looping(canvas) {
  let _update, _render, _keypressHandler, lastUpdate;
  let terminated = false;
  const animFrame =
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    null;
  const ctx = canvas.getContext("2d");

  const handleInputBinds = () => {
    document.body.onkeypress = e => {
      const key = e.keyCode || e.which;
      if (_keypressHandler) {
        _keypressHandler(key);
      }
    };
  };

  const loop = () => {
    const delta = new Date().getTime() - lastUpdate;
    if (delta > fpsInterval) {
      _update(delta);
      _render(ctx);
      lastUpdate = new Date().getTime();
    }
    if (!terminated) {
      animFrame(loop);
    }
  };

  this.onupdate = update => {
    _update = update;
    return this;
  };

  this.onrender = render => {
    _render = render;
    return this;
  };

  this.keypress = handler => {
    _keypressHandler = handler;
    return this;
  };

  this.start = () => {
    handleInputBinds();
    lastUpdate = new Date().getTime();
    animFrame(loop);
    return this;
  };

  this.terminate = () => {
    terminated = true;
  };
}
