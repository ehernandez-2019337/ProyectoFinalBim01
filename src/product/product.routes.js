import express from "express";

import {test, save, get, search, update, inventario, deleteProduct, searchByCategory, orderSold} from './product.controller.js'
import { isAdmin, validateJwt } from '../middlewares/validate-jwt.js';


const api = express.Router();

api.get('/test',test)
api.post('/save',[validateJwt],[ isAdmin], save)
api.get('/get',[validateJwt],get)
api.post('/search',[validateJwt],search)
api.put('/update/:id',[validateJwt],[ isAdmin],update)
api.delete('/delete/:id',deleteProduct)
api.put('/inventario/:id',[validateJwt],[ isAdmin],inventario)
api.post('/getByCategory', [validateJwt],searchByCategory)
api.get('/orderSold', [validateJwt], orderSold)


export default api