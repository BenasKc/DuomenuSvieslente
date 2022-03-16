const http = require("http");
const fs = require("fs");
const server_link = "auth-svieslente-test.herokuapp.com";
var server_port = 8080

function check_for_login(x, cb){
    const options = {
        hostname: server_link,
        path: '/check_token',
        method: 'POST',
        headers: {
            'Content-Type': 'text/plain'
        }
      }
        callback = function(response) {
        response.on('data', function (d) {
            var item = (d.toString());
            if(x == item)cb(true);
            else cb(false);
            
        });
        
    }
    var logreq = http.request(options, callback);
    logreq.write(x.toString().replace('"', '').replace('"', ''))
    logreq.end();

}
function sendFile(filename, contentType, res, callback){
    fs.readFile(filename, (err,data) => {
        if(err){
            console.log(err);
            res.write(err);
            return;
        }
        else{
            res.writeHead(200, {'Content-Type':contentType});
            res.write(data);      
        }
        res.end();
        if(callback){
            callback(error);
        }
    });
}
function accept(login, req, res){
    if(req.url === "/create"){
        var item ;
        req.on('data', chunk => {
            const options = {
                hostname: server_link,
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
    else if(req.url === "/checklogin"){
        var item ;
        req.on('data', chunk => {
            const options = {
                hostname: server_link
                // ,port: server_port, <- like this if port required
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
    else{
        if(req.url === "/login"){
            res.writeHead(302, {
                'Location':'/index'
            });
            res.end();
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
        else if(req.url === '/profile'){
            sendFile('profile.html', 'text/html', res);
        }
        else if(req.url === '/draw.js'){
            sendFile('draw.js', 'text/javascript', res);
        }
        else {
            sendFile('refer.html', 'text/html', res);
        }
    }
}
const server = http.createServer((req,res)=>{
    var items = req.rawHeaders;
    var login = false;
    var count = 0;
    

    for(i = 0;i < items.length;i++){
        count = i;
        if(items[i]=='Cookie'){
            var stuff = items[i+1].replace(/\s/g, '');
            const values = stuff.split(';');
            for(var i = 0;i < values.length;i++){
                var x = values[i].split('=');
                if(x[0] === 'login'){
                    check_for_login(x[1], (stats)=>{
                        if(stats === true)login = true;
                        else login = false;
                        accept(login, req, res);
                    })
                    break;
                }
            }
            break;
        }
    } 
    if(count == items.length-1)accept(login, req, res);
}).listen(8080);