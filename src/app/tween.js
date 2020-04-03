import timeout from './timeout';

export default class {
  constructor(obj, props, endValues, duration, onUpdate, onEnd, frameRate) {
    this.obj = obj;
    this.startValues = {};
    this.endValues = {};
    this.props = props;
    if (!this.props.length) {
      this.props = [this.props];
    }
    let endValuesArr = endValues;
    if (!endValuesArr.length) {
      endValuesArr = [endValuesArr];
    }
    this.props.forEach((prop, i) => {
      this.startValues[prop] = obj[prop];
      this.endValues[prop] = endValuesArr[i];
    });
    this.duration = duration;
    this.frameRate = frameRate ? 1000 / frameRate : 1000 / 60;
    this.timeElapsed = 0;
    this.onUpdate = onUpdate;
    this.ease = 'linear';
    this.tweening = false;
    this.onEnd = onEnd;
  }
  update() {
    if (!this.tweening) {
      return;
    }
    this.timeElapsed += this.frameRate;
    if (this.timeElapsed < this.duration) {
      this.props.forEach((prop) => {
        this.obj[prop] = ease[this.ease](
          this.timeElapsed,
          this.startValues[prop],
          this.endValues[prop] - this.startValues[prop],
          this.duration,
        );
      });
      timeout(this.frameRate, () => {
        this.update();
      });
    } else {
      this.props.forEach((prop) => {
        this.obj[prop] = this.endValues[prop];
      });
    }
    if (this.onUpdate) {
      this.onUpdate(this.obj);  
    }
  }
  start() {
    this.timeElapsed = 0;
    this.tweening = true;
    timeout(this.frameRate, () => {
      this.update();
    });
  }
  play() {
    this.tweening = true;
    timeout(this.frameRate, () => {
      this.update();
    });
  }
  pause() {
    this.tweening = false;
  }
  stop() {
    this.timeElapsed = 0;
    this.tweening = false;
    this.props.forEach((prop) => {
      this.obj[prop] = this.startValues[prop];
    });
  }
  end() {
    this.timeElapsed = this.duration;
    this.tweening = false;
    this.props.forEach((prop) => {
      this.obj[prop] = this.endValues[prop];
    });
    if (this.onEnd) {
      this.onEnd();
    }
  }
  linear() {
    this.ease = 'linear';
    this.start();
  }
  easeInQuad() {
    this.ease = 'easeInQuad';
    this.start();
  }
  easeOutQuad() {
    this.ease = 'easeOutQuad';
    this.start();
  }
  easeInOutQuad() {
    this.ease = 'easeInOutQuad';
    this.start();
  }
  easeInCubic() {
    this.ease = 'easeInCubic';
    this.start();
  }
  easeOutCubic() {
    this.ease = 'easeOutCubic';
    this.start();
  }
  easeInOutCubic() {
    this.ease = 'easeInOutCubic';
    this.start();
  }
  easeInQuart() {
    this.ease = 'easeInQuart';
    this.start();
  }
  easeOutQuart() {
    this.ease = 'easeOutQuart';
    this.start();
  }
  easeInOutQuart() {
    this.ease = 'easeInOutQuart';
    this.start();
  }
  easeInQuint() {
    this.ease = 'easeInQuint';
    this.start();
  }
  easeOutQuint() {
    this.ease = 'easeOutQuint';
    this.start();
  }
  easeInOutQuint() {
    this.ease = 'easeInOutQuint';
    this.start();
  }
  easeInSine() {
    this.ease = 'easeInSine';
    this.start();
  }
  easeOutSine() {
    this.ease = 'easeOutSine';
    this.start();
  }
  easeInOutSine() {
    this.ease = 'easeInOutSine';
    this.start();
  }
  easeInExpo() {
    this.ease = 'easeInExpo';
    this.start();
  }
  easeOutExpo() {
    this.ease = 'easeOutExpo';
    this.start();
  }
  easeInOutExpo() {
    this.ease = 'easeInOutExpo';
    this.start();
  }
  easeInCirc() {
    this.ease = 'easeInCirc';
    this.start();
  }
  easeOutCirc() {
    this.ease = 'easeOutCirc';
    this.start();
  }
  easeInOutCirc() {
    this.ease = 'easeInOutCirc';
    this.start();
  }
  easeInElastic() {
    this.ease = 'easeInElastic';
    this.start();
  }
  easeOutElastic() {
    this.ease = 'easeOutElastic';
    this.start();
  }
  easeInOutElastic() {
    this.ease = 'easeInOutElastic';
    this.start();
  }
  easeInBack() {
    this.ease = 'easeInBack';
    this.start();
  }
  easeOutBack() {
    this.ease = 'easeOutBack';
    this.start();
  }
  easeInOutBack() {
    this.ease = 'easeInOutBack';
    this.start();
  }
  easeInBounce() {
    this.ease = 'easeInBounce';
    this.start();
  }
  easeOutBounce() {
    this.ease = 'easeOutBounce';
    this.start();
  }
  easeInOutBounce() {
    console.log(this);
    this.ease = 'easeInOutBounce';
    this.start();
  }
}

const ease = {
  linear(t, b, c, d) {
    return c * t / d + b;
  },
  easeInQuad(t, b, c, d) {
    return c * (t /= d) * t + b;
  },
  easeOutQuad(t, b, c, d) {
    return -c * (t /= d) * (t - 2) + b;
  },
  easeInOutQuad(t, b, c, d) {
    if ((t /= d / 2) < 1) return c / 2 * t * t + b;
    return -c / 2 * ((--t) * (t - 2) - 1) + b;
  },
  easeInCubic(t, b, c, d) {
    return c * (t /= d) * t * t + b;
  },
  easeOutCubic(t, b, c, d) {
    return c * ((t = t / d - 1) * t * t + 1) + b;
  },
  easeInOutCubic(t, b, c, d) {
    if ((t /= d / 2) < 1) return c / 2 * t * t * t + b;
    return c / 2 * ((t -= 2) * t * t + 2) + b;
  },
  easeInQuart(t, b, c, d) {
    return c * (t /= d) * t * t * t + b;
  },
  easeOutQuart(t, b, c, d) {
    return -c * ((t = t / d - 1) * t * t * t - 1) + b;
  },
  easeInOutQuart(t, b, c, d) {
    if ((t /= d / 2) < 1) return c / 2 * t * t * t * t + b;
    return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
  },
  easeInQuint(t, b, c, d) {
    return c * (t /= d) * t * t * t * t + b;
  },
  easeOutQuint(t, b, c, d) {
    return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
  },
  easeInOutQuint(t, b, c, d) {
    if ((t /= d / 2) < 1) return c / 2 * t * t * t * t * t + b;
    return c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
  },
  easeInSine(t, b, c, d) {
    return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
  },
  easeOutSine(t, b, c, d) {
    return c * Math.sin(t / d * (Math.PI / 2)) + b;
  },
  easeInOutSine(t, b, c, d) {
    return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
  },
  easeInExpo(t, b, c, d) {
    return (t === 0) ? b : c * (2 ** (10 * (t / d - 1))) + b;
  },
  easeOutExpo(t, b, c, d) {
    return (t === d) ? b + c : c * (-(2 ** (-10 * t / d)) + 1) + b;
  },
  easeInOutExpo(t, b, c, d) {
    if (t === 0) return b;
    if (t === d) return b + c;
    if ((t /= d / 2) < 1) return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
    return c / 2 * (-(2 ** (-10 * --t)) + 2) + b;
  },
  easeInCirc(t, b, c, d) {
    return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b;
  },
  easeOutCirc(t, b, c, d) {
    return c * Math.sqrt(1 - (t = t / d - 1) * t) + b;
  },
  easeInOutCirc(t, b, c, d) {
    if ((t /= d / 2) < 1) return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
    return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b;
  },
  easeInElastic(t, b, c, d) {
    var s = 1.70158; let p = 0; let a = c;
    if (t === 0) return b; if ((t /= d) == 1) return b + c; if (!p) p = d * 0.3;
    if (a < Math.abs(c)) { a = c; var s = p / 4; }		else var s = p / (2 * Math.PI) * Math.asin(c / a);
    return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
  },
  easeOutElastic(t, b, c, d) {
    var s = 1.70158; let p = 0; let a = c;
    if (t === 0) return b; if ((t /= d) == 1) return b + c; if (!p) p = d * 0.3;
    if (a < Math.abs(c)) { a = c; var s = p / 4; }		else var s = p / (2 * Math.PI) * Math.asin(c / a);
    return a * (2 ** (-10 * t)) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b;
  },
  easeInOutElastic(t, b, c, d) {
    var s = 1.70158; let p = 0; let a = c;
    if (t == 0) return b; if ((t /= d / 2) == 2) return b + c; if (!p) p = d * (0.3 * 1.5);
    if (a < Math.abs(c)) { a = c; var s = p / 4; }		else var s = p / (2 * Math.PI) * Math.asin(c / a);
    if (t < 1) return -0.5 * (a * (2 ** (10 * (t -= 1))) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
    return a * (2 ** (-10 * (t -= 1))) * Math.sin((t * d - s) * (2 * Math.PI) / p) * 0.5 + c + b;
  },
  easeInBack(t, b, c, d, s) {
    if (s == undefined) s = 1.70158;
    return c * (t /= d) * t * ((s + 1) * t - s) + b;
  },
  easeOutBack(t, b, c, d, s) {
    if (s == undefined) s = 1.70158;
    return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
  },
  easeInOutBack(t, b, c, d, s) {
    if (s == undefined) s = 1.70158;
    if ((t /= d / 2) < 1) return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b;
    return c / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b;
  },
  easeInBounce(t, b, c, d) {
    return c - ease.easeOutBounce(d - t, 0, c, d) + b;
  },
  easeOutBounce(t, b, c, d) {
    if ((t /= d) < (1 / 2.75)) {
      return c * (7.5625 * t * t) + b;
    } else if (t < (2 / 2.75)) {
      return c * (7.5625 * (t -= (1.5 / 2.75)) * t + 0.75) + b;
    } else if (t < (2.5 / 2.75)) {
      return c * (7.5625 * (t -= (2.25 / 2.75)) * t + 0.9375) + b;
    }
    return c * (7.5625 * (t -= (2.625 / 2.75)) * t + 0.984375) + b;
  },
  easeInOutBounce(t, b, c, d) {
    if (t < d / 2) return ease.easeInBounce(t * 2, 0, c, d) * 0.5 + b;
    return ease.easeOutBounce(t * 2 - d, 0, c, d) * 0.5 + c * 0.5 + b;
  },
};
