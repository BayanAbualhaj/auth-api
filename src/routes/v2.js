'use strict';
const bearerAuth= require('../auth/middleware/bearer');
const aclPremession= require('../auth/middleware/acl')

const fs = require('fs');
const express = require('express');
const Collection = require('../models/data-collection.js');

const router = express.Router();

const models = new Map();

router.param('model', (req, res, next) => {
  const modelName = req.params.model;
  if (models.has(modelName)) {
    req.model = models.get(modelName);
    next();
  } else {
    const fileName = `${__dirname}/../models/${modelName}/model.js`;
    if (fs.existsSync(fileName)) {
      const model = require(fileName);
      models.set(modelName, new Collection(model));
      req.model = models.get(modelName);
      next();
    }
    else {
      next("Invalid Model");
    }
  }
});

router.get('/:model',bearerAuth, aclPremession('read') ,handleGetAll);
router.get('/:model/:id',bearerAuth,aclPremession('read') ,handleGetOne);
router.post('/:model', bearerAuth, aclPremession('create') ,handleCreate);
router.put('/:model/:id', bearerAuth ,aclPremession('edit'),handleUpdate);
router.patch('/:model/:id', bearerAuth ,aclPremession('edit'),handleUpdate);
router.delete('/:model/:id', bearerAuth , aclPremession('delete') ,handleDelete);

async function handleGetAll(req, res,next) {
    try {
        
        let allRecords = await req.model.get();
        res.status(200).json(allRecords);
    } catch (error) {
        next(error);
    }
}

async function handleGetOne(req, res, next) {
    try {
        const id = req.params.id;
        let theRecord = await req.model.get(id)
        res.status(200).json(theRecord);
        
  } catch (error) {
      next(error);
  }
}

async function handleCreate(req, res) {
    try {
        
        let obj = req.body;
        let newRecord = await req.model.create(obj);
        res.status(201).json(newRecord);
    } catch (error) {
        next(error)
    }
}

async function handleUpdate(req, res,next) {
    try {
      const id = req.params.id;
      const obj = req.body;
      let updatedRecord = await req.model.update(id, obj)
      res.status(200).json(updatedRecord);
      
  } catch (error) {
      next(error);
  }
}

async function handleDelete(req, res) {
    try {
      let id = req.params.id;
      let deletedRecord = await req.model.delete(id);
      res.status(200).json(deletedRecord);
      
  } catch (error) {
      next(error);
  }
}


module.exports = router;