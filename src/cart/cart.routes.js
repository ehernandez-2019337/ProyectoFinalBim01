import express from 'express'
import { test, addToCart, removeProduct,getItemsCart } from './cart.controller.js';
import { isAdmin, validateJwt } from '../middlewares/validate-jwt.js';


const api = express.Router();

api.get('/test', test)
api.post('/addToCart',[validateJwt], addToCart)
api.post('/removeProduct', [validateJwt], removeProduct)
api.get('/getItemsCart',[validateJwt],getItemsCart)


export default api