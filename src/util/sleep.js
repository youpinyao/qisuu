module.exports = function(delay = 0) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve()
    }, delay)
  })
}
