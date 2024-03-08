'use strict' //Modo estricto


import User from './user.model.js'
import { encrypt, checkPassword, checkUpdate} from '../utils/validator.js'
import { generateJwt } from '../utils/jwt.js'


export const test = (req, res)=>{
    console.log('test is running')
    return res.send({message: 'Test is running'})
}

let defaultAdmn = {
    name: 'Emerson',
    surname: 'Henrandes',
    username: 'eher2019',
    password: '1234',
    email: 'eher2019@gmail.com',
    phone: '12345678',
    role:'ADMIN'
}

export const admin = async(req,res)=>{
    try{
        let admin = await User.findOne({username: defaultAdmn.username})
        if(admin){
            console.log('admin already axists')
            }
        else{
            console.log(defaultAdmn.password)
            defaultAdmn.password = await encrypt(defaultAdmn.password)
            let createAdmin = await User.create(defaultAdmn)
            console.log('default admin created succesfully')
        }
    }catch(err){
        console.error(err)
    }
}

export const register = async(req, res)=>{
    try{
        //Capturar el formulario (body)
        let data = req.body
        console.log(data)
        //Encriptar la contraseña
        data.password = await encrypt(data.password)
        //Guardar la información en la BD
        let user = new User(data) // guardar base de datos
        await user.save()
        //Responder al usuario
        return res.send({message: `Registered successfully, can be logged with user use ${user.username}`})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error registering user', err: err})
    }
}


export const login = async(req, res)=>{
    try{
        //Capturar los datos (body)
        let data = req.body
        //Validar que el usuario exista
        let user = await User.findOne({$or: [{email: data.user},{username: data.user}]}) //buscar un solo registro
        //Verifico que la contraseña coincida
        if(user && await checkPassword(data.password, user.password)){
            let loggedUser = {
                uid: user._id,
                username: user.username,
                name: user.name,
                role: user.role
            }
            //Generar el Token
            let token = await generateJwt(loggedUser)
            //Respondo al usuario
            return res.send(
                {
                    message: `Welcome ${loggedUser.name}`, 
                    loggedUser,
                    token
                }
            )
        }
        return res.status(404).send({message: 'Invalid credentials'})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error to login'})
    }
}

export const update = async(req, res)=>{
    try{
        //obtener id usuario a actualizar
        let {id} = req.params
        //obtener datos a actualizar 
        let data = req.body
        //validar si tene datos
        let update = checkUpdate(data, id)
        if(!update) return res.status(400).send({message:'Have submited some data that cannot be update or missing data'})
        //validar si tiene permisos(tokenizacion) 
        //Actualizar DB
        let updateUser = await User.findOneAndUpdate(
            {_id: id}, //Object id (hexadecimales=> Hora sys, Version Mongo)
            data,
            {new:true} //Datos que se mandan a actualizar 
        )
        //validar la actualizacion
        if(!updateUser) return res.status(404).send({message:'user not found and not update'})
        //responder al usuario
            return res.send({message:'update user ', updateUser})
    }catch(err){
        console.error(err)
        if(err.keyValue.username) return res.status(400).send({message:`Username ${err.keyValue.username} is already taken`})
        return res.status(500).send({message:'Error updating account'})
    }
}

export const deleteUser = async (req,res)=>{
    try{
        //obtener id
        let { id} = req.params
        //validar si esta logueado y es el mismo
        //eliminar (delete one: solo lo elimina) o (FindOneAndDelete: elimina y devuelde el objeto)
        let deleteUser = await User.findOneAndDelete({_id: id})
        //verificar que se elimino
        if(!deleteUser) return res.status(404).send({message:'Account not found and not deleted'})
        //responder
        res.send({message: `account with username ${deleteUser.username} delated succesfully`})
    }catch(err){
        console.error(err)
        return res.status(500).send({message:'error deleting account'})
    }
}

