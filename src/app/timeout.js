export default (d, callback) => {
  const delay = typeof d === 'number' ? d : convertToMilliseconds(d);
  const startTime = new Date().getTime();
  let canceled = false;
  const check = () => {
    const time = new Date().getTime();
    if (!canceled && time - startTime >= delay) {
      callback();
    } else if (!canceled) {
      requestAnimationFrame(check);
    }
  };
  requestAnimationFrame(check);
  return () => {
    canceled = true;
  }
};

const convertToMilliseconds = (t) => {
  const time = t.toLowerCase();
  if (time.match(/ms/)) {
    return time.replace('ms', '') * 1;
  } else if (time.match(/s/)) {
    return time.replace('s', '') * 0.001;
  }
  return time * 1;
};
