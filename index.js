const http = require("http");
const fs = require("fs");
const server_link = 'localhost' //"auth-svieslente-test.herokuapp.com";
var server_port = 8000

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
            var item = (d.toString());
            if(x === item && item != '"-1"')cb(true);
            else cb(false);
            
        });
        
    }
    var logreq = http.request(options, callback);
    logreq.write(x.toString().slice(1, -1))
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
                var itm = (chunk).toString();
                logreq.write(itm)
                logreq.end();
            })
        }
        else if(req.url === "/fetch_profile"){
            var item ;
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
                        item = JSON.parse(item);
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