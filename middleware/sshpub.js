const Client = require('ssh2').Client;

const connectionPub = async function(req, res, next){
console.log(req.req.body)
  const conn = new Client();

  const connect = await new Promise(function(resolve, reject){
      conn.on('ready', function() {
          conn.exec(`cat ~/.ssh/id_rsa.pub | grep ${req.req.body.account} || echo "Key does not exist"`, function(err, stream) {
            if (err) throw err;
            stream.on('close', function(code, signal) {
              conn.end()
            })
            stream.on('data', function(data) {
              async function getKey(resolve, reject){
                const keyInfo = data.toString('utf8')
                const info = {
                  'server' : req.req.body.servers, 
                  'result' : keyInfo
                }
                return resolve(info)
              }
  
              function closeConn(result) {
                console.log(result)
                return result
              }
              (new Promise(getKey))
                .then(result => resolve(closeConn(result)))
                .catch(result => console.log(result))
  
              
            }).stderr.on('data', function(data) {
              console.log('STDERR: ' + data);
            });
  
          });
        },
        conn.on('error', function(err){
          console.log('cant connect')
          console.log(err)
        })).connect({
          host: req.req.body.servers,
          port: 22,
          username: process.env.username,
          password: process.env.password,
          keepaliveInterval: 5000,
          keepaliveCountMax: 1
          // openssh_noMoreSessions()
        });
  })
    //conn.end()
    return await connect
}

module.exports = connectionPub;