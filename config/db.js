const mongooose = require ('mongoose') 

function connectToDB () {
    mongooose.connect(process.env.MONGO_URI).then(()=>{
        console.log ('Connected to DB') ;
    })
}

module.exports = connectToDB ;