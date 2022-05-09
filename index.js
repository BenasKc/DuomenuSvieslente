const http = require("http");
var https = require('follow-redirects').https;const fs = require("fs");
const server_link = 'localhost' //"auth-svieslente-test.herokuapp.com";
var server_port = 8009


function make_into_chart(obj, session){
    var json_ob = {};
    for(var i = 0;i < obj.length;i++){
        if(json_ob[obj[i].Namespace] !== undefined){
            json_ob[obj[i].Namespace].push(JSON.stringify({title:obj[i].KPITitle, value:obj[i].Value}));
        }
        else{
            json_ob[obj[i].Namespace] = [JSON.stringify({title:obj[i].KPITitle, value:obj[i].Value})];
        }
    }
    if(Object.keys(json_ob).length == 1){ //linear
        var arrayseries = [];
        for(var l = 0; l < json_ob[Object.keys(json_ob)[0]].length; l++){
            var tm = (JSON.parse(json_ob[Object.keys(json_ob)[0]][l]));
            var tm2 = {name:tm.title, y:tm.value};
            //tm2[tm.title] = tm.value;
            arrayseries.push(tm2);
        }
        var newobj = {
            "title": Object.keys(json_ob)[0] + ' ' +obj[0].DateRange,
            "categories_x":' ',
            "categories_y":" ",
            "series":[
                {
                    "name":`${Object.keys(json_ob)[0]} data, ${obj[0].DateRange}`,
                    "data": (arrayseries)
                }]
            }
            
    }
    const options = {
        hostname: server_link,
        port: server_port,
        path: '/send_chart',
        method: 'POST',
        headers: {
            'Content-Type': 'text/plain'
        }
      }
    callback = function(response) {
        response.on('data', function (d) {
           // console.log(d.toString())
        });
        
    }
    var logreq = http.request(options, callback);
    logreq.write(JSON.stringify({data:newobj, ses:session}))
    logreq.end();
    /// SEND CHART AND LINK TO ACCOUNT WITH SQL
}
function fetch_Data_API(options, chnk, cb){
    var req = https.request(options, function (res) {
      var chunks = [];

      res.on("data", function (chunk) {
        chunks.push(chunk);
      });

      res.on("end", function (chunk) {
        var body = Buffer.concat(chunks);
        cb(body.toString());
      });

      res.on("error", function (error) {
        //console.error(error);
      });
    });
    req.write(`{
       "operation": "execute",
       "resourceName": "astp_CostMgmt_Pivot_DevelopmentStatistics",
       "timeout": 5000,
       "excludeFieldNames": false,
        "ProductNamespaces": "${JSON.parse(chnk).namespace}",
        "DateFrom": "${JSON.parse(chnk).date_from}",
        "DateTo": "${JSON.parse(chnk).date_to}"
    }`);

    req.end();
}
function fetch_from_API(cb){
    var options = {
      'method': 'POST',
      'hostname': 'test.pimsdevhosting.com',
      'path': '/login',
      'headers': {
        'Authorization': 'YmVuYXNrdWNpbnNrYXM6VTVGbyo0K3sxJWIxMiRDfVEyJmI=',
        'Accept': 'application/json'
        },
      'maxRedirects': 20
    };
    var req = https.request(options, function (res) {
      var chunks = [];
      
      res.on("data", function (chunk) {
        chunks.push(chunk);
      });

      res.on("end", function (chunk) {
        var ret = [];
        var body = JSON.parse(Buffer.concat(chunks));
        if(body.success === true){
            var obj = res.headers['set-cookie'].toString().split(';');
            for(var i = 0;i < obj.length;i++){
                var tmp = obj[i].split(',');
                if(tmp.length >= 2){
                    var itm = tmp[1].split('=');
                    if(itm[0]==='__Secure-AppframeWebAuth' || itm[0] === '__Secure-AppframeWebSession'){
                        ret.push(tmp[1]);
                        if(ret.length >= 2)cb(ret);
                    }
                }
                else {
                    var a = tmp[0].split('=');
                    if(a[0]==='__Secure-AppframeWebAuth' || a[0] === '__Secure-AppframeWebSession'){
                        ret.push(tmp[0]);
                        if(ret.length >= 2)cb(ret);
                    }
                }
            }
        }
        
      });

      res.on("error", function (error) {
        console.error(error);
      });
    });

    var postData = "------WebKitFormBoundary7MA4YWxkTrZu0gW\r\nContent-Disposition: form-data; name=\"username\"\r\n\r\nbenaskucinskas\r\n------WebKitFormBoundary7MA4YWxkTrZu0gW\r\nContent-Disposition: form-data; name=\"password\"\r\n\r\nU5Fo*4+{1%b12$C}Q2&b\r\n------WebKitFormBoundary7MA4YWxkTrZu0gW\r\nContent-Disposition: form-data; name=\"remember\"\r\n\r\nfalse\r\n------WebKitFormBoundary7MA4YWxkTrZu0gW--";

    req.setHeader('content-type', 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW');

    req.write(postData);

    req.end();
}
function check_for_login(x, cb){
    if(x.toString().slice(1, -1).length < 1)cb(false)
    const options = {
        hostname: server_link,
        port: server_port, 
        path: '/check_token',
        method: 'POST',
        headers: {
            'Content-Type': 'text/plain'
        }
      }
        callback = function(response) {
        response.on('data', function (d) {
            if(d.toString()==='true')cb(true);
            else cb(false);
        });
    }
    var logreq = http.request(options, callback);
    logreq.write(JSON.stringify(x))
    logreq.end();

}
function sendFile(filename, contentType, res, callback){
    fs.readFile(filename, (err,data) => {
        if(err){
            console.log(err);
            res.write(err);
            res.end();
            return;
        }
        else{
            res.writeHead(200, {'Content-Type':contentType});
            res.write(data);      
            res.end();
        }
        
        if(callback){
            callback(error);
        }
    });
}
function accept(req, res){
    
    get_cookies(req, res, (login)=>{
        if(req.url == '/vue.js'){
            sendFile('vue.js', 'text/javascript', res);
        }
        else if(req.url == '/bootstrap.min.js'){
            sendFile('bootstrap.min.js', 'text/javascript', res);
        }
        else if(req.url == '/bootstrap.min.css'){
            sendFile('bootstrap.min.css', 'text/css', res);
        }
        else if(req.url === "/highcharts.js"){
            sendFile('highcharts.js', 'text/html', res);
        }
        else if(req.url === "/create"){
            var item ;
            req.on('data', chunk => {
                const options = {
                    hostname: server_link,
                    port: server_port,
                    path: '/create',
                    method: 'POST',
                    headers: {
                        'Content-Type': 'text/plain'
                    }
                  }
                callback = function(response) {
                    response.on('data', function (d) {
                        item = (d.toString());
                        res.writeHead(200, {'Content-Type':'text/plain'});
                        res.write(item);
                        res.end();
                    });
                    
                }
                var logreq = http.request(options, callback);
                logreq.write(chunk)
                logreq.end();
            })
        }
        else if(req.url === "/fetch_profile"){
            req.on('data', chunk => {
                const options = {
                    hostname: server_link,
                    port: server_port,
                    path: '/fetchprofile',
                    method: 'POST',
                    headers: {
                        'Content-Type': 'text/plain'
                    }
                  }
                callback = function(response) {
                    response.on('data', function (d) {
                        item = (d.toString());
                        res.writeHead(200, {'Content-Type':'text/plain'});
                        res.write(item);
                        res.end();
                    });
                    
                }
                var logreq = http.request(options, callback);
                var itm = (chunk).toString();
                logreq.write(itm)
                logreq.end();
            })
        }
        else if(req.url === "/checklogin"){
            var item ;
            req.on('data', chunk => {
                const options = {
                    hostname: server_link,
                     port: server_port, //<- like this if port required
                    path: '/checklogin',
                    method: 'POST',
                    headers: {
                        'Content-Type': 'text/plain'
                    }
                  }
                callback = function(response) {
                    response.on('data', function (d) {
                        item = (d.toString());
                        res.writeHead(200, {'Content-Type':'text/plain'});
                        res.write(item);
                        res.end();
                    });
                    
                }
                 var logreq = http.request(options, callback);
                 var itm = (chunk).toString();
                 logreq.write(itm)
                 logreq.end();
            })
        }
        else if(login === false){
            if(req.url === "/login.js"){
                sendFile('login.js', 'text/javascript', res);
            }
            else if(req.url === "/register"){
                sendFile('register.html', 'text/html', res);
            }
            else if(req.url === "/register.js"){
                sendFile('register.js', 'text/javascript', res);
            }
            else if(req.url === "/login"){
                sendFile('login.html', 'text/html', res);
            }
            else{
                res.writeHead(302, {
                    'Location':'/login'
                });
                res.end();
            }
        }
        else if(login === true){
            if(req.url === "/login"){
                res.writeHead(302, {
                    'Location':'/index'
                });
                res.end();
            }
            else if(req.url === "/create_new_chart"){
                var item ;
                
                req.on('data', chunk => {
                    const options = {
                        hostname: server_link,
                        port: server_port,
                        path: '/create_chart',
                        method: 'POST',
                        headers: {
                            'Content-Type': 'text/plain'
                        }
                      }
                    callback = function(response) {
                        response.on('data', function (d) {
                            item = (d.toString());
                            res.writeHead(200, {'Content-Type':'text/plain'});
                            res.write(item);
                            res.end();
                        });
                        
                    }
                    var logreq = http.request(options, callback);
                    var itm = (chunk).toString();
                    logreq.write(itm)
                    logreq.end();
                })
            }
            else if(req.url === "/fetch_charts"){
                var item ;
                
                req.on('data', chunk => {
                    const options = {
                        hostname: server_link,
                        port: server_port,
                        path: '/fetch_charts',
                        method: 'POST',
                        headers: {
                            'Content-Type': 'text/plain'
                        }
                      }
                    callback = function(response) {
                        response.on('data', function (d) {
                            item = (d.toString());
                            res.writeHead(200, {'Content-Type':'text/plain'});
                            res.write(item);
                            res.end();
                        });
                        
                    }
                    var logreq = http.request(options, callback);
                    var itm = (chunk).toString();
                    logreq.write(itm)
                    logreq.end();
                })
            }
            else if(req.url === "/save_pref"){
                var item ;
                
                req.on('data', chunk => {
                    const options = {
                        hostname: server_link,
                        port: server_port,
                        path: '/save_pref',
                        method: 'POST',
                        headers: {
                            'Content-Type': 'text/plain'
                        }
                      }
                    callback = function(response) {
                        response.on('data', function (d) {
                            item = (d.toString());
                            res.writeHead(200, {'Content-Type':'text/plain'});
                            res.write(item);
                            res.end();
                        });
                        
                    }
                    var logreq = http.request(options, callback);
                    var itm = (chunk).toString();
                    logreq.write(itm)
                    logreq.end();
                })
            }
            else if(req.url === "/app.js"){
                sendFile('app.js', 'text/javascript', res);
            }
            else if(req.url === "/"){
                res.writeHead(302, {
                    'Location':'/index'
                });
                res.end();
            }
            else if(req.url === '/index'){
                sendFile('index.html', 'text/html', res);
            }
            else if(req.url === '/chart_new'){
                sendFile('chart_new.html', 'text/html', res);
            }
            else if(req.url === '/draw.js'){
                sendFile('draw.js', 'text/javascript', res);
            }
            else if(req.url === '/chart_creation.js'){
                sendFile('chart_creation.js', 'text/javascript', res);
            }
            else if(req.url === '/import_charts'){
                req.on('data', chunk => {
                    fetch_from_API(callback=>{
                        var options = {
                          'method': 'POST',
                          'hostname': 'test.pimsdevhosting.com',
                          'path': '/api/data',
                          'headers': {
                            'Accept':'application/json',
                            'Cookie': callback.join(';')
                          }
                        };
                        fetch_Data_API(options, chunk.toString(), (cb2)=>{
                            var itms = JSON.parse(cb2).success;
                            if(itms !== undefined){
                                make_into_chart(itms.Table, JSON.parse(chunk.toString()).session)
                            }
                        })
                    });
                })
                
            }
            else {
                sendFile('refer.html', 'text/html', res);
            }
        }
    })
    
}
function check_cookie(item, cb){
    var x = item.split('=');
    if(x[0] === 'login'){
        check_for_login(x[1], (stats)=>{
            if(stats === true){
                cb(true);
            } 
            else{
                cb(false);
            }  
        })
    }else cb(false);
}
async function get_cookies(req, res, cb){
    var items = req.rawHeaders;
    var index = items.indexOf("Cookie");
    if(index != -1){
        var cookie_container = items[index+1].split(' ').join('').split(';');
        var count = 0;
        cookie_container.forEach(element => {
            check_cookie(element, (result)=>{
                if(result === true)cb(true);
                else count++;
                if(cookie_container.length == count){
                    cb(false)
                }
                
            })
            
            
        })
        
    }
    else cb(false);
}
const server = http.createServer((req,res)=>{
    accept(req, res);
}).listen(8080);