const Client = require('ssh2').Client;
const { exec } = require('child_process');

const allInfo = async function(req, res, next){
// 10/30/2020
// need to send thing to front end for it to put into an array to build table
console.log(req.req.body)
  //create promise object
  const conn = new Client();

  const connect = await new Promise(function(resolve, reject){
    exec(`scp -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null -pr scripts/ sftp-tool@${req.req.body.servers}:~/`, { timeout: 5000 } , (err, stdout, stderr) => {
      if (err) {
        console.log(err)
        console.log('hit error')
        const info = {
          'server' : req.req.body.servers,
          'result' : "Can't connect"
        }
        resolve(info);
        return
      }
      let allData = []
      conn.on('ready', function() {
          conn.exec(`sudo -u ${req.req.body.account} /home/sftp-tool/scripts/sftpinfo.sh ${req.req.body.account}`, { pty: true }, function(err, stream) {
            if (err) throw err;
            stream.on('close', function(code, signal) {
                console.log('hit closed')
                const info = {
                  'account' : req.req.body.account,
                  'server' : req.req.body.servers,
                  'result' : allData.toString('utf8')
                }
                resolve(info)
              conn.end()
            })
            stream.on('data', function(data) {

              async function getKey(resolve, reject){
                return resolve(allData.push(data))
              }

              (new Promise(getKey))
                .then(result => console.log(result))
                .catch(result => console.log(result))
              
            }).stderr.on('data', function(data) {
              console.log('STDERR: ' + data);
            });
  
          });
        },
        conn.on('error', function(err){
          console.log("Can't connect")
          console.log(err)
        })).connect({
          host: req.req.body.servers,
          port: 22,
          username: 'sftp-tool',
          privateKey: require('fs').readFileSync('/home/sftp-tool/.ssh/id_rsa'),
          hostVerifier: false
        });
    
    })
      
  })
    //conn.end()
    return await connect
}

module.exports = allInfo;