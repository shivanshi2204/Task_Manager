const express = require('express')
require('./db/mongoose')
const User = require('./models/user')
const Task = require('./models/task')


//https://www.npmjs.com/package/bcryptjs


const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

const app = express();
const port = process.env.PORT || 3000;

const multer = require('multer')
const upload = multer({
    dest: 'images',
    limits:{
        fileSize: 10000000
    },
    fileFilter(req, file, cb){
        // if(!file.originalname.endsWith('.pdf')){
        //     return cb(new Error('Please upload a PDF'))
        // }

        if(!file.originalname.match(/\.(doc|docx)$/)){
            return cb(new Error('Please upload a Word document'))
        }
        cb(undefined, true)

        // cb(new Error('File must be a PDF'))
        // cb(undefined, true)
        // cb(undefined, false)
    }
})

app.post('/upload', upload.single('upload') , (req, res) => {
    res.send()
}, (error, req, res, next) => {
    res.status(400).send({error: error.message})
})




app.use(express.json())
app.use(userRouter)
app.use(taskRouter)


// Without middleware: new request -> run route handler
// With middleware:    new request -> do something -> run route handler
//                           (check if user is authenticated)


app.listen(port, () => {
    console.log('Server is running on port ' + port);
})


// const main = async () => {
//     // const task = await Task.findById('60ee9e1c9e9fdf4f04d55cf6')

//     // await task.populate('owner').execPopulate()
//     // console.log(task.owner)

//     const user = await User.findById('60ee9cca7f0ee01870c2051d')
//     await user.populate('tasks').execPopulate()
//     console.log(user.tasks)

// }

// main()