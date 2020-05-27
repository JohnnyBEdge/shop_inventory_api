const express = require('express');
const router = express.Router();
const {
  getInventory,
  addInventory,
  editInventory,
  deleteInventory
} = require('../../dal/inventory');

// GET inventory
router.get('/', async function(req, res) {
  try{ 
    const data = await getInventory();
    res.send(data);
  } catch(err){
    console.log(err);
    res.status(500).send("Internal server error; check logs");
  };
});

//POST inventory 
router.post('/', async function(req, res){
  try{
    const data = await addInventory(req.body);
    res.send(data);
  } catch(err){
    console.log(err);
    res.status(500).send("Internal server error; check logs");
  };
});

//DELETE inventory
router.delete('/:id', async function(req, res){
  try{
    const data = await deleteInventory(req.params.id);
    res.send(data);
  } catch(err){
    console.log(err);
    res.status(500).send("Internal server error; check logs");
  };
});

//EDIT inventory
router.put('/:id', async function(req, res){
  try{
    const data = await editInventory(req.params.id, req.body);
    res.send(data);
  } catch(err){
    console.log(err);
    res.status(500).send("Internal server error; check logs");
  }
})


module.exports = router;