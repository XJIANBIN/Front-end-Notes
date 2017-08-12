const https = require('https');
const querystring = require('querystring');

// 总结 node  的两种带参数发送请求方法
//1 直接在path 里面 ？参数=''&
//2 var postData = querystring.stringify({
//   'accessToken' : 'at.daj20noj1sjmy3u601184aoq0n7xv74x-3urvwvd71t-0javko1-q70voxngg'
// });
// 然后  headers:{'Content-Type':'application/x-www-form-urlencoded','Content-Length': postData.length}
// 最后 req.write(postData);
// 3  通过 中间件 https://github.com/visionmedia/superagent


var postData = querystring.stringify({
  'accessToken' : 'at.daj20noj1sjmy3u601184aoq0n7xv74x-3urvwvd71t-0javko1-q70voxngg'
});
const options = {
  hostname: 'open.ys7.com',  //切记不能写https://
  method: 'POST',
  path: '/api/lapp/live/video/list',
  headers:{'Content-Type':'application/x-www-form-urlencoded','Content-Length': postData.length}
};

const req = https.request(options, (res) => {
  // console.log('状态码：', res.statusCode);
  // console.log('请求头：', res.headers);

  res.on('data', (d) => {
    process.stdout.write(d);
  });
});

req.on('error', (e) => {
  console.error(e);
});
req.write(postData);
req.end();
