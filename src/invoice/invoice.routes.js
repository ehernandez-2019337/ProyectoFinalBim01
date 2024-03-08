import express from 'express'
import { test, createInvoice, getInvoices} from './invoice.controller.js';
import { isAdmin, validateJwt } from '../middlewares/validate-jwt.js';


const api = express.Router();

api.get('/test', test)
api.post('/createInvoice/:cartId',[validateJwt], createInvoice)
api.get('/getIvoices', [validateJwt], getInvoices)



export default api