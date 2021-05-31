const Client = require('ssh2').Client;
 
const conn = new Client();

const connection = function(req, res, next){
// 10/30/2020
// need to send thing to front end for it to put into an array to build table
console.log(req.req.body)
  //create promise object
    const connect = new Promise(function(resolve, reject) {
      conn.on('ready', function() {
        conn.exec(`
        if [[ ! -f ~/.ssh/id_rsa ]]; then
        PRIVATEKEY="Does not exist"
        else
          PRIVATEKEY=$(cat ~/.ssh/id_rsa)
        fi
        
        
        if [[ ! -f ~/.ssh/id_rsa.pub ]]; then
          PUBLICKEY="Does not exist"
        else
          PUBLICKEY=$(cat ~/.ssh/id_rsa)
        fi
        
        
        PERMISSIONS=$(ls -l ~/.ssh/)
        
        echo -e "$PRIVATEKEY\n$PERMISSIONS\n$PUBLICKEY"
        `, function(err, stream) {
          if (err) throw err;
          stream.on('close', function(code, signal) {
            conn.end();
          }).on('data', function(data) {
              resolve(data.toString('utf8'))              
          }).stderr.on('data', function(data) {
            console.log('STDERR: ' + data);
          });

        });
      },
      conn.on('error', function(err){
        req.send(err)
      })).connect({
        host: 'test server',
        port: 22,
        username: process.env.username,
        password: process.env.password
      });
      
    });
    
    connect.then(function(result){
      req.send(result);
    })
}

module.exports = connection;