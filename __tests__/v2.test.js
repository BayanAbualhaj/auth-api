'use strict';
require('dotenv').config();
const {server} = require('../src/server'); 
const supergoose = require('@code-fellows/supergoose');
const request = supergoose(server);
let id;
let token;
let reqObj={
    username:'bayan',
    password:'1234',
    role:'admin'
}
describe('api server', () => {
    
    it('can create one', async () => {
    
        const response = await request.post('/signup').send(reqObj);
        const userObject = response.body;
        token=userObject.token;
        expect(response.status).toBe(201);
        expect(userObject.token).toBeDefined();
        expect(userObject.user._id).toBeDefined();
        expect(userObject.user.username).toEqual(reqObj.username)
    
    });

    it('invalid routes handler', async () => {
        const response = await request.get('/foo');
        expect(response.status).toEqual(404);
    });

    it('invalid method handler', async () => {
        const response = await request.post('/error');
        expect(response.status).toEqual(404);
    });

    it('should be able to get a clothes on get /clothes', async () => {
        const response = await request.get('/api/v1/clothes').set('Authorization', `Bearer ${token}`);
        expect(response.status).toEqual(200);
    });

    it('should be able to create a clothes on POST /clothes', async () => {
      const obj = {
        name: 'Dress',
        color:'red',
        size: 'large'
      };
      const response = await request.post('/api/v1/clothes').send(obj).set('Authorization', `Bearer ${token}`);
      // console.log("*****************",response.body);
      expect(response.status).toEqual(201);
      expect(response.body.name).toEqual('Dress');
      id = response.body._id;
    });

    it('should be able to update a clothes on PUT /clothes', async () => {
      // console.log('put id????',id);
      const response = await request.put(`/api/v1/clothes/${id}`).send({
        name: 'hat',
        color:'white',
        size: 'large'
      }).set('Authorization', `Bearer ${token}`);
      expect(response.status).toEqual(200);
      expect(response.body.name).toEqual('hat');
    });

    it('should be able to get a clothes on Get /clothes/:id', async () => {
      const response = await request.get(`/api/v1/clothes/${id}`).set('Authorization', `Bearer ${token}`);
      expect(response.status).toEqual(200);
      expect(response.body.name).toEqual('hat');
    });

    it(`should delete a clothes on DELETE / clothes` , async ()=>{
      const response = await request.delete(`/api/v1/clothes/${id}`).set('Authorization', `Bearer ${token}`);
      expect(response.status).toEqual(200);
    });



    //==========Food tests==================


    it('should be able to get a food on get /food', async () => {
      const response = await request.get('/api/v1/food').set('Authorization', `Bearer ${token}`);
      expect(response.status).toEqual(200);
    });

    it('should be able to create a food on POST /food', async () => {
      const obj = {
        name: 'kabseh',
        calories:'88',
        type: 'fruit',
      };
      const response = await request.post('/api/v1/food').send(obj).set('Authorization', `Bearer ${token}`);
      expect(response.status).toEqual(201);
      expect(response.body.name).toEqual('kabseh');
      id = response.body._id;
    });

    it('should be able to update a food on PUT /food', async () => {
      const response = await request.put(`/api/v1/food/${id}`).send({
        name: 'ice-cream',
        calories:'250',
        type: 'fruit',
      }).set('Authorization', `Bearer ${token}`);
      expect(response.status).toEqual(200);
      // console.log('*****************',response.request._data.name);
      expect(response.request._data.name).toEqual('ice-cream');
    });

    it('should be able to get a food on Get /food/:id', async () => {
      const response = await request.get(`/api/v1/food/${id}`).set('Authorization', `Bearer ${token}`);
      expect(response.status).toEqual(200);
      expect(response.body.name).toEqual('ice-cream');
    });

    it(`should delete a food on DELETE / food` , async ()=>{
      const response = await request.delete(`/api/v1/food/${id}`).set('Authorization', `Bearer ${token}`);
      expect(response.status).toEqual(200);
    });
});