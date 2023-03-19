const deBounce = (func, delay) => {
  let timeOutid;
  return (...args) => {
    if (timeOutid) {
      clearTimeout(timeOutid);
    }
    timeOutid = setTimeout(() => {
      func.apply(null, args);
    }, delay);
  };
};
