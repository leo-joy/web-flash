
/* 企查查投资企业接口 */
var express = require("express");
var router = express.Router();
const multipart = require("connect-multiparty");
var { wrap: async } = require("co");

var md5=require('md5-node');
var http = require("http");  
const multipartMiddleware = multipart();


router.get("/api/investcompanylist", async(function* (req, res, next) {
    try {
        let Userkey='f5f8a3ba545246d7be57b4c072e388aa';
        let TimeSpan=Math.round(new Date /1000);

        let SecretKey='AD723E971B58DC43A1A2E5F34F312025';

        let Token=md5(Userkey+TimeSpan+SecretKey).toUpperCase();

        var querystring = require('querystring');

        var enterpriseName = req.query.enterpriseName
        
        var data = {key:Userkey,searchKey:enterpriseName,pageIndex:1,pageSize:50,dtype:'json'};  
        var content = querystring.stringify(data);
        
        var options = {  
            hostname:'api.qichacha.com',
            method:'GET',  
            path:'/ECIInvestment/GetInvestmentList?'+content,  
            headers:{  
                "Token": Token, 
                "Timespan":TimeSpan
            }  
        }  
        
        var req = http.request(options, function (result) { 
            var chunks = '';
            result.setEncoding('utf8'); 
            result.on('data', function (chunk) { 
                chunks += chunk;
            });

            result.on('end', function() {
                res.send(JSON.parse(chunks))
            });
           
        }); 
        
        req.on('error', function (e) { 
            console.log('problem with request: ' + e.message); 
        }); 
        
        req.end();
    } catch (err) {
        //保存日志信息
        winston.error(err);
        //返回错误信息到客户端
        customLib.errHandle(err, res);
    }
}));

module.exports = router;



