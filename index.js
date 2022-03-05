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
            var items2 = items[i+1].split(';');
            if(items2[0]==='true' && items2[1] === ' login=true')login=true;
            else login = false;
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
        if(req.url === "/app.js"){
            sendFile('app.js', 'text/javascript', res);
        }
        if(req.url === "/"){
            res.writeHead(302, {
                'Location':'/index'
            });
            res.end();
        }
        if(req.url === '/index'){
            sendFile('index.html', 'text/html', res);
        }
        
        if(req.url === '/profile'){
            sendFile('profile.html', 'text/html', res);
        }
        if(req.url === '/draw.js'){
            sendFile('draw.js', 'text/javascript', res);
        }
    }
    
    
}).listen(8080);
