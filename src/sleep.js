module.exports = function(delay = 300) {
  console.log('====================================');
  console.log('sleep', delay);
  console.log('====================================');
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, delay);
  });
}
