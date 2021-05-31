const router = require('express').Router();
const { exec } = require('child_process');
const auth = require('../middleware/auth');
const db = require("../models");
const conn = require('../middleware/ssh')
const connpub = require('../middleware/sshpub')
const allInfo = require('../middleware/allinfo')
const copy = require('../middleware/copykey')
const copyAll = require('../middleware/copyall')
const copyScript = require('../middleware/copyscript')

router.post('/generateSSH', auth, (req, res, next) => {
    const date_Int = new Date();
    const appUser = req.body.account;
    const username = req.id;
    const date = date_Int.getFullYear().toString() + (date_Int.getMonth()+1) + date_Int.getDate()
    exec(`ls keys/ | grep id_${appUser}SXFR`, (err, stdout, stderr) => {
        if(!stdout){
            exec(`ssh-keygen -t rsa -f keys/id_${appUser}SXFR -C 'id_${appUser}SXFR Created by SFTP Tool ${date} ${username}' -N ''`, (err, stdout, stderr) => {
                
                exec(`cat keys/id_${appUser}SXFR.pub && cat keys/id_${appUser}SXFR`, (err, stdout, stderr) => {
                    const response = {"exist": false, response: stdout}
                    res.send(response)
                })
            })
        }
        else{
            exec(`cat keys/id_${appUser}SXFR.pub && echo ',' && cat keys/id_${appUser}SXFR`, (err, stdout, stderr) => {
                const response = {"exist": true, response: stdout}
                res.send(response)
            })
        }
    })
})

router.post('/testwrite', (req, res, next) => {
    const test = {username : "test", server : "testserver", action : "testaction"}
    db.log.create(test).then(function(dbtest){
        res.json(dbtest)
    })
})

router.post('/checkkey', auth, (req, res, next) => {
    
    console.log('over, ',conn(res))
})

router.post('/checkpubkey', auth, async function(req, res, next){
    
    res.send(await connpub(res))
})

router.post('/copykey', auth, async function(req,  res, next) {
    res.send(await copy(res))
})

router.post('/copyall', auth, async function(req,  res, next) {
    res.send(await copyAll(res))
})

router.post('/getallinfo', auth, async (req, res, next) => {
    res.send(await allInfo(res))
})

router.post('/copyscript', auth, async(req, res, next) => {
    copyScript(res)
})

module.exports = router;