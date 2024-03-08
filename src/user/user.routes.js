import express from 'express'
import { test, register, login, update,deleteUser} from './user.controller.js';
import { isAdmin, validateJwt } from '../middlewares/validate-jwt.js';

const api = express.Router();

api.get('/test', [validateJwt],test)
api.post('/register', register)
api.post('/login', login)
api.put('/update/:id',[validateJwt],[ isAdmin],update)
api.delete('/delete/:id',[validateJwt],[ isAdmin], deleteUser)
export default api