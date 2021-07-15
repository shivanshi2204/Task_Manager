
// const mongodb= require('mongodb')
// const MongoClient= mongodb.MongoClient; //to connect to the database
// const ObjectID= ongodb.ObjectID;

const {MongoClient , ObjectID, ObjectId} = require('mongodb');
// const id= new ObjectID();

const connectionURL= 'mongodb://127.0.0.1:27017'
const databaseName= 'task-manager'

MongoClient.connect(connectionURL, {useNewUrlParser: true}, (error,client)=>{
    if(error) return console.log('Unable to connect to database!')
    // console.log('Connected correctly!');
    const db= client.db(databaseName)

    ////// CREATE //////
    // db.collection('users').insertOne({
    //     name: 'Anjeev',
    //     age: 18
    // }, (error, result) => {
    //     if(error){
    //         return console.log('Unable to insert user')
    //     }
    //     console.log(result.ops)   //the only method on result that we'll end up using, ops contains all of the documents that were inserted
    // })
    // db.collection('users').insertMany([
    //     {
    //         _id: id, 
    //         name: 'Prerna',
    //         age: 52
    //     }
    // ], (error, result) => {
    //     if(error) return console.log('Unable to insert documents!')
    //     console.log(result.ops)
    // })

    ////// READ //////

    // db.collection('users').findOne({name: 'Rajesh'}, (error, user) => {
    //     //findOne returns a single document, if there are many, it returns  the first one
    //     if(error) return console.log('Unable to fetch user')
    //     console.log(user)
    // })

    // db.collection('users').findOne({_id: new ObjectId("60d89389a7752a24c8c97999")}, (error, user) => {
    //     //ID has to be given through 'new ObjectID' because it is in the form of bits
    //     if(error) return console.log('Unable to fetch user')
    //     console.log(user)
    // })

    // //find (doesn't take back any argument) , returns back cursor
    // //can be used to count by using .count() method which also takes a callback
    // db.collection('users').find({age: 52}).toArray((error, users) => {
    //     console.log(users)
    // })

    /////// UPDATE ///////
    //update returns a promise
    // db.collection('users').updateOne({
    //     _id: new ObjectID("60d89389a7752a24c8c97999")
    // }, {
    //     // $set : {
    //     //     name: 'Prerita'
    //     // }
    //     $inc: {
    //         age: 1  //increments age by 1
    //     }
    // }).then((result) => {
    //     console.log(result)
    // }).catch((error)=>{
    //     console.log(error)
    // })

    // //////// DELETE ///////
    // db.collection('users').deleteMany({
    //     age: 18
    // }).then((result)=>{
    //     console.log(result)
    // }).catch((error)=>{
    //     console.log(error)
    // })
}); 

