'use strict'

import { request } from 'express'
import jwt from 'jsonwebtoken'
import User from '../user/user.model.js'

export const validateJwt =  async(req,res,next)=>{
    try{
        //obtener llave de acceso al token
        let secretKey = process.env.SECRET_KEY
        //obtener el token de los header
        let { token } =req.headers
        //verificar si viene el token
        if(!token) return res.status(401).send({message:'unauthorized'})
        //obtener ek uid del usuario
        let {uid}= jwt.verify(token, secretKey)
        //calidar si aun existe en la DB
        let user = await User.findOne({_id:uid})
        if(!user) return res.status(404).send({message: 'user not found - unauthorized'})
        req.user = user
        next()
    }catch(err){
        console.error(err)
        return res.status(401).send({message:'invalid token'})
    }
}

export const isAdmin = async(req,res,next)=>{
        let { user } = req
        let {id} = req.params
        console.log(id)
        if(!user || user.role !== 'ADMIN'){
            if(user && user.id !== id)  return res.status(403).send({message:`you dont have acess`})

            next()
        } else{
            next()
        }
    }

    