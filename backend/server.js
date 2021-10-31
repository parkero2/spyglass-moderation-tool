const http = require('http');
const fs = require('fs');

const port = 3000;

const server = http.createServer((req, res) => {
    res.writeHead(200);
    console.log(req.url);
    if (req.url == "/script.js") {
        fs.readFile('frontend/script.js', function(error, data) {
            if (error) {
                res.writeHead(404)
                res.write("Error: File not found")
            }
            else{
                res.write(data)
            }
            res.end()
        })
    }
    else {
        fs.readFile('frontend/index.html', function(error, data) {
            if (error) {
                res.writeHead(404)
                res.write("Error: File not found")
            } else {
                res.write(data)
            }
            res.end()
        })
    }
});

server.listen(port, function(error) {
    if (error) {
        console.log("An error occured: " + error)
    } else {
        console.log("Server is listening on port " + port)
    }
});