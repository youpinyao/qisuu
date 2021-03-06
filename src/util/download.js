const fs = require('fs')
const request = require('request')
const chalk = require('chalk')
const ProgressBar = require('progress')
const progress = require('request-progress')

const file = require('../util/file');

const {
  downloadPath,
  downloadingPath,
  failPath,
} = require('../config');

module.exports = function (content, downloadToPath) {
  if (!content.download_url) {
    return new Promise((resolve) => {
      setTimeout(() => resolve())
    })
  }

  let bar = null
  let transferred = 0
  let url = content.download_url.split('/')
  const saveTo = `${downloadToPath || downloadPath}/${content.date}-${content.filename}`
  const downloadingTo = `${downloadingPath}/${content.date}-${content.filename}`

  url[url.length - 1] = encodeURIComponent(url[url.length - 1])

  url = url.join('/')

  return new Promise(async (resolve) => {
    // 如果存在就不下载
    if (fs.existsSync(saveTo) && !fs.existsSync(downloadingTo)) {
      console.log('====================================')
      console.log(chalk.yellow(`${saveTo} 已存在`))
      console.log('====================================')
      setTimeout(() => resolve())
      return
    }

    // 标记下载中
    if (!fs.existsSync(downloadingTo)) {
      file.write(downloadingTo)
    } else {
      console.log('====================================')
      console.log(chalk.yellow(`删除未下载完成 重新下载 ${saveTo}`))
      console.log('====================================')
      try {
        fs.unlinkSync(saveTo)
      } catch (error) {
        console.log('====================================')
        console.error(error)
        console.log('====================================')
      }
    }

    // The options argument is optional so you can omit it
    progress(request(url), {
      // throttle: 2000,                    // Throttle the progress event to 2000ms, defaults to 1000ms
      // delay: 1000,                       // Only start to emit after 1000ms delay, defaults to 0ms
      // lengthHeader: 'x-transfer-length'  // Length header to use, defaults to content-length
    })
      .on('progress', function (state) {
        if (!bar) {
          bar = new ProgressBar(chalk.yellow(`下载中 [:bar] :rate/bps :percent :etas ${content.download_url}`), {
            complete: '=',
            incomplete: ' ',
            width: 20,
            total: state.size.total,
          })
          transferred = state.size.transferred
        } else {
          bar.tick(state.size.transferred - transferred)
          transferred = state.size.transferred
        }

        // The state is an object that looks like this:
        // {
        //     percent: 0.5,               // Overall percent (between 0 to 1)
        //     speed: 554732,              // The download speed in bytes/sec
        //     size: {
        //         total: 90044871,        // The total payload size in bytes
        //         transferred: 27610959   // The transferred payload size in bytes
        //     },
        //     time: {
        //         elapsed: 36.235,        // The total elapsed seconds since the start (3 decimals)
        //         remaining: 81.403       // The remaining seconds to finish (3 decimals)
        //     }
        // }
        // console.log('progress', state);
      })
      .on('error', function (err) {
        // Do something with err
        console.log()
        console.log('====================================')
        console.log('download error', err)
        console.log('====================================')
        file.write(`${failPath}/${content.download_url.replace(/\//g, '$')}`, content.download_url)
        try {
          fs.unlinkSync(saveTo)
        } catch (error) {
        // error
        }
        resolve()
      })
      .on('end', function () {
        // Do something after request finishes
        console.log()
        console.log('====================================')
        console.log('download completed', content.download_url, saveTo)
        console.log('====================================')
        console.log('')

        // 删除下载中标记
        fs.unlinkSync(downloadingTo)

        resolve()
      })
      .pipe(fs.createWriteStream(saveTo))
  })
}
