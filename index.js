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
    if(req.url === "/app.js"){
        sendFile('app.js', 'text/javascript', res);
    }
    if(req.url === "/"){
        sendFile('index.html', 'text/html', res);
    }
}).listen(8080);
