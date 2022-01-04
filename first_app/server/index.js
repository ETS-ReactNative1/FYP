const express = require('express')

const app = express()
const cors = require("cors");
app.use(cors({origin: true, credentials: true}));

app.use(express.json())


const mysql = require('mysql2');
const { default: axios } = require('axios');

const db = mysql.createConnection({
    user: 'root',
    host: 'localhost',
    password: 'Wenger<3',
    database: 'Sportial'
})

// app.get('/insert', (req, res) => {
  
//     db.query('INSERT INTO User (id, username, password) VALUES (6, "areeeebb", "1234567891011")', (err, result) => {
//         if (err) {
//             console.log(err);
//         }

//         res.send(result);
//     })
// })

// app.get('/select', (req, res) => {
  
//     db.query('SELECT * FROM User', (err, result) => {
//         if (err) {
//             console.log(err);
//         }

//         res.send(result);
//     })
// })

app.post("/register", (req, res) => {

    const username = req.body.username
    const password = req.body.password;
    // console.log('username: ', username);

    db.query("SELECT username FROM USER WHERE username = '"+ username +"'", function(err, result, field){
        if(result.length === 0){
                db.query('INSERT INTO User (username, password) VALUES (?,?)',
                [username, password],
                (err, result) => {
                    if (err) {
                    // console.log(err)
                    }
                })

                res.send('signed up')
        // res.send('sign up success')
               //new user logic
       }else{  
           //existing user, redirect to another page 
           
           res.send('user exists')
        }
               
        })
// }
})

app.post("/get-event", (req, res) => {


    db.query("SELECT * FROM Event", function(err, result, field){
        if(result.length === 0){
                
                res.send('no upcoming events')
                // res.send('signed up')
        // res.send('sign up success')
               //new user logic
       }else{  
           //existing user, redirect to another page 
           
           res.send(result)
           }
        
               
        })
// }
})

app.post("/add-event", (req, res) => {

    
    console.log(req.body)

    db.query('INSERT INTO Event (name, sport, location, dateTime, description, hostID, participantIDs, hostContact, capacity) VALUES (?,?,?,?,?,?,?,?,?)',
                [req.body.name, req.body.sport, req.body.location, req.body.dateTime, req.body.description, req.body.hostID, req.body.participantIDs, req.body.contact, req.body.capacity],
                (err, result) => {
                    if (err) {
                    console.log(err)
                    }
                })

    // const username = req.body.username
    // const password = req.body.password;
    // console.log('username: ', username);

    // db.query("SELECT username FROM USER WHERE username = '"+ username +"'", function(err, result, field){
    //     if(result.length === 0){
    //             db.query('INSERT INTO User (username, password) VALUES (?,?)',
    //             [username, password],
    //             (err, result) => {
    //                 if (err) {
    //                 // console.log(err)
    //                 }
    //             })

    //             res.send('signed up')
    //     // res.send('sign up success')
    //            //new user logic
    //    }else{  
    //        //existing user, redirect to another page 
           
    //        res.send('user exists')
    //     }
               
        // })
// }
})

app.post("/add-participants", (req, res) => {

    
    console.log(req.body)

    db.query("UPDATE EVENT E SET E.participantIDs = '"+ req.body.participantID +"' WHERE E.eventID = '"+ req.body.eventID +"' ",
                (err, result) => {
                    if (err) {
                    console.log(err)
                    }
                })

            })

app.post("/login", (req, res) => {

    const username = req.body.username
    const password = req.body.password;
    console.log('HEREE', username)
    // console.log('username: ', username);
    // console.log('heree')

    db.query("SELECT id, username FROM USER WHERE username = '"+ username +"'", function(err, result, field){
        if(result.length === 0){
            

           res.send(result);
           console.log(result)
        
               //new user logic
       }else{  
           //existing user, redirect to another page 
           console.log(result)
           res.send(result)
        }
               
        })

        
// }
})

app.post("/show-hostevents", (req, res) => {

    const userID = req.body.userID
    console.log(userID)

  
    db.query("SELECT E.name, E.sport, E.location, E.dateTime, E.description FROM EVENT E, USER U WHERE E.hostID='"+ userID +"'", function(err, result, field){
        if(result.length === 0){
            

           res.send('no');
        
        
               //new user logic
       }else{  
           //existing user, redirect to another page 
           
           res.send(result)
        }
               
        })

        
// }
})





app.listen(3002, () => {
    console.log('server running');
})

// const PORT = process.env.PORT || 3002;
// app.listen(PORT, () => {
//     console.log(`Our app is running on port ${ PORT }`);
// });