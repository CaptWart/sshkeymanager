const { exec } = require('child_process');
const Client = require('ssh2').Client;
const conn = new Client();

    const copyScript = function(req, res, next){
        exec(`scp scripts/test.sh sftp-tool@${req.req.body.servers}:~/`, (err, stdout, stderr) => {
            console.log(stdout)
            console.log(err)
            console.log(stderr)
            const connect = new Promise(function(resolve, reject) {
                conn.on('ready', function() {
                  conn.exec(`
                  . test.sh
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
        })
    }

module.exports = copyScript;