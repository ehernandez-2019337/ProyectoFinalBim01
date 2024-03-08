//Ejecutar servicios
import { initServer } from "./configs/app.js"
import { connect } from "./configs/mongo.js"
import {admin} from './src/user/user.controller.js'
import {addDefaultCategory} from './src/category/category.controller.js'

initServer()
connect()
admin()
addDefaultCategory()