import http from 'node:http';

function keepAlive() {
  http.createServer(function (req, res) {
    res.write("toy joya");
    res.end();
  }).listen(30000, () => {
    console.log('Server is running on port 30000');
  });
}

export default keepAlive;
