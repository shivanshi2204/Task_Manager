const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/auth')
const multer = require('multer')
const sharp = require('sharp')
const router = new express.Router()

//Create user (SIGN UP)
router.post('/users', async (req, res) => {
    const user = new User(req.body)

    try{
        await user.save()
        //sending back jwt token
        const token = await user.generateAuthToken()
        res.status(201).send({user , token})
    } catch(e) {
        res.status(400).send(e)
    }
    
    // user.save().then(() => {
    //     res.status(201).send(user)
    // }).catch((e) => {
    //     res.status(400).send(e)
    // })

})

//Logging in
router.post('/users/login', async(req, res) =>{
    try{
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token =  await user.generateAuthToken()
        res.send({user, token})
    }catch(e){
        res.status(400).send()
    }
})

//Logging out
router.post('/users/logout', auth, async(req, res) => {
    try{
        //remove only current token from the tokens array so that user
        //stays logged in from other devices except this
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()
        res.send()
    } catch(e) {
        res.status(500).send()
    }
})

//LogoutAll users
router.post('/users/logoutAll',auth, async(req, res) => {
    try{
        req.user.tokens = []
        await req.user.save()
        res.send()
    } catch(e){
        res.status(500).send()
    }
})

//Get profile
router.get('/users/me', auth , async  (req, res) => {
    res.send(req.user)
})

//Avatar upload
const upload = multer({
    //dest: 'avatars',
    limits:{
        fileSize: 1000000
    },
    fileFilter(req, file, cb){

        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            return cb(new Error('Please upload an image'))
        }
        cb(undefined, true)

        // cb(new Error('File must be a PDF'))
        // cb(undefined, true)
        // cb(undefined, false)
    }
})

router.post('/users/me/avatar',auth, upload.single('avatar'),async (req, res) => {
    //crop and format image
    
    const buffer= await sharp(req.file.buffer).resize({ width : 250 , height : 250}).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    res.status(200).send()
}, (error, req, res, next) => { 
    res.status(400).send({error: error.message})
})

//Delete avatar
router.delete('/users/me/avatar', auth, async (req, res) => {
    req.user.avatar = undefined
    await req.user.save()
    res.send()
})

//Accessing avatar by ID
router.get('/users/:id/avatar', async(req, res) => {
    try{
        const user = await User.findById(req.params.id)
        if(!user || !user.avatar){
            throw new Error()
        }

        res.set('Content-Type', 'image/png')
        res.send(user.avatar)
    }catch(e){
        res.status(400).send()
    }
})

//Update user
router.patch('/users/me', auth, async (req, res) => {
    //what if you are trying to update a property which is not something you
    //can actually change because mongoose will simply ignore it and won't give error
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if(!isValidOperation) return res.status(400).send({error : 'Invalid operation!'})

    try{
        //findByIdAndUpdate method bypasses mongoose, it performs direct opn on database
        //const user= await User.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true})

        //const user = await User.findById(req.user._id)

        updates.forEach((update) => req.user[update] = req.body[update])
        await req.user.save()
        

        res.status(200).send(req.user)
    } catch(e){
        res.status(400).send(e)
    }
})

//Delete user
router.delete('/users/me', auth , async(req, res) => {
    try{
        // const user= await User.findByIdAndDelete(req.user._id)
        // if(!user) return res.status(404).send()


        await req.user.remove()
        res.send(req.user)
    } catch(e){
        res.status(500).send()
    }
})


module.exports= router