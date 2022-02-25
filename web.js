//
const dayjs = require('dayjs');
const { createCipheriv, createHash } = require("crypto");
const express = require('express');
// 
// const { web_url } = require("./config");
const _urls = {
    'k.swweb.top':'w.swweb.top',
    'sdwkey.ncshouda.com':'sdwsocket.ncshouda.com',
};
// 
const app = express();
app.disable('x-powered-by');
// 
const _bkey = 'D2ApxLk9G3PAsJrM';
const _ckey = 'F3JL7ED6jqWjcrY9';
// 
const _key = Buffer.from(_bkey, 'utf8');
const _iv = Buffer.from(_ckey, 'utf8');
// 
const sk = async(k) => { 
    const src = k;
    let sign = '';
    const cipher = createCipheriv('aes-128-cbc', _key, _iv);
    sign += cipher.update(src, 'utf8', 'hex');
    sign += cipher.final('hex');
    return sign;
}
// 
const md5 = async(s) =>
{
    return createHash('md5').update(String(s)).digest('hex');
}
// -
const ipcheck = async(h) => 
{
    if(h['cf-connecting-ip']) return h['cf-connecting-ip'];
    return h['x-real-ip'];
}
// 
app.get('/sd28', async(req, res) => 
{
    const _host = req.headers['host'];
    // console.log(req.headers);
    if(!_urls[_host])
    {
        res.end('none');
        return;
    }
    const agent = req.headers['user-agent'];
    const ip = (await ipcheck(req.headers)).replace(/\./g,''); // -
    const time = dayjs().valueOf();
    const sj = [1,2,3,4,5,6,7,8,9].sort(()=>{return Math.random() > .5 ? -1 : 1}).slice(0,6).join('');
    // 
    const code = (await md5(ip+''+agent+''+dayjs().format('YYMMDDHHmm')))+(await sk(time+'|'+sj));
    // 
    res.end(
        // web_url+'-'+
        _urls[_host]+'-'+
        code+'-'+
        ip+''+time+''+sj
    );
});
// 
app.listen(9101);