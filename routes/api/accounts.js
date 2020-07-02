const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const salt = process.env.SALT;
const jwt = require('jsonwebtoken');
const privateKey = process.env.PRIVATE_KEY;

const {
    getAccounts,
  getAccountByEmail,
  addAccount,
  addToCart
} = require('../../dal/accounts');

//get accounts
router.get('/', async function(req, res){
    try{
        const data = await getAccounts();
        res.send(data);
    } catch(err){
        console.log(err);
        res.status(500).send("Internal server error; check logs");
    };
});

// login account
router.post('/login', async function (req, res) {
    try {
        const body = req.body;
        const dbUser = await getAccountByEmail('email', body.email);
        if(dbUser.length === 0){
            res.status(401).send('Login Failed');
            console.log(`${body.email} doesn't exist`);
        } else if (dbUser.length > 1) {
            res.status(500).send('Login Failed');
            console.log(`${body.email} already exists`);
        } else {
            // console.log('body', body);
            bcrypt.compare(body.password, dbUser[0].password, function (err, result) {
                if(err) throw err;
                if(!result){
                    res.status(401).send('Login Failed');
                    console.log(`Password for ${body.email} doesn't match `);
                } else {
                    let expire = new Date(Date.now());
                    expire.setDate(expire.getDate() + 3);
                    jwt.sign({
                        expires: expire,
                        _id: dbUser[0]._id }, 
                        privateKey, 
                        { algorithm: 'HS512' }, 
                        function (err, token) {
                            if(err) throw err;
                            console.log(body.email, token);
                            //puts token in header instead of body
                            res.set('authentication', token);
                            //removes sensitive user data before sending to the body
                            // delete dbUser[0]._id;
                            delete dbUser[0].password
                            res.set('Access-Control-Expose-Headers', 'authentication');
                            res.send(dbUser[0]);
                        }
                    ); 
                }
            });
        }
    } catch (err) {
        console.log(err);
        res.status(500).send('Internal Server Issue, Check Server Logs');
    };
})

// add account
router.post('/register', function (req, res) {
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

router.patch('/:id', async function(req, res){
    try{
        const data = await addToCart(req.params.id, req.body)
        req.send(data);
    } catch(err){
        console.log(err);
        res.status(500).send("Internal server error; check logs");
    }
})

module.exports = router;