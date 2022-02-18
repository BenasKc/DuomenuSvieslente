const http = require("http");
const fs = require("fs");

http.createServer((req,res)=>{
    res.writeHead(200, { 'Content-Type':'text/html'});
    res.write("Hello world!");
}).listen(8080);
