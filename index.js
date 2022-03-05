const http = require("http");
const fs = require("fs");

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
const server = http.createServer((req,res)=>{
    var items = req.rawHeaders;
    var login = false;
    for(i = 0;i < items.length;i++){
        if(items[i]=='Cookie'){
            var stuff = items[i+1].replace(/\s/g, '');
            const values = stuff.split(';');
            for(var i = 0;i < values.length;i++){
                var x = values[i].split('=');
                if(x[0] === 'login'){
                    if(x[1] === 'true')login = true;
                    break;
                }
            }
            break;
        }
    }
    if(login === false){
        if(req.url === "/login.js"){
            sendFile('login.js', 'text/javascript', res);
        }
        else{
            sendFile('login.html', 'text/html', res);
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
    }
    
    
}).listen(8080);
