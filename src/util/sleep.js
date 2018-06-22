module.exports = function(delay = 0) {
  // console.log('====================================');
  // console.log('sleep', delay);
  // console.log('====================================');
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve()
    }, delay)
  })
}