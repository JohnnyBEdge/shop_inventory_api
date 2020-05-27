const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const salt = process.env.SALT;

const {
  getAccounts,
  addAccount
} = require('../../dal/accounts');

// GET inventory
router.get('/', async function(req, res) {
  try{ 
    const data = await getAccounts();
    res.send(data);
  } catch(err){
    console.log(err);
    res.status(500).send("Internal server error; check logs");
  };
});

// POST inventory
router.post('/', function (req, res) {
    try {
        //takes salt, turns into a number and assigns to saltRounds
        const saltRounds = +salt;
        //put body into a separate object
        const body = req.body;
        const myPlaintextPassword = body.password;
        //function to hash pwd from npm bcrypt 
        bcrypt.genSalt(saltRounds, function (err, salt) {
            if(err){
                throw err;
            }
            bcrypt.hash(myPlaintextPassword, salt, async function (err, hash) {
                if (err) {
                    throw err;
                }
                body.password = hash;
                const data = await addAccount(req.body);
                res.send(data);
            });
        });
        
    } catch (err) {
        console.log(err);
        res.status(500).send('Internal Server Issue, Check Server Logs');
    };
});

module.exports = router;