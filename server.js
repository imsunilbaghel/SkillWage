require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const multer = require('multer');
const bodyParser = require('body-parser');
const session = require('express-session');
const fs = require('fs');
const crypto = require('crypto');
const moment = require('moment');
const cron = require('node-cron');
const sharp = require('sharp');
const app = express();
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use(session({
    secret: process.env.SESSION_SECRET,  
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 15 * 60 * 1000,secure: false,httpOnly: true}

}));

app.use(express.static(path.join(__dirname,'public')));
const server = http.createServer(app);
const io = new Server(server);

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', 
    password: 'Absus@987',
    database: 'dailyrozgaar'
});

db.connect(err => {
    if (err) throw err;
    console.log('Connected to the database!');
});



let onlineWorkers = {}; 

io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('workerStatus', (workerid, isOnline) => {
        if (isOnline) {
            onlineWorkers[workerid] = socket.id; 
        } else {
            delete onlineWorkers[workerid];
        }

        io.emit('statusUpdate', workerid, isOnline);
    });

    socket.on('requestStatusUpdate', () => {
        socket.emit('bulkStatusUpdate', Object.keys(onlineWorkers));
    });


    socket.emit('bulkStatusUpdate', Object.keys(onlineWorkers));

    
    socket.on('disconnect', () => {
        
        for (let [workerid, sockId] of Object.entries(onlineWorkers)) {
            if (sockId === socket.id) {
                delete onlineWorkers[workerid];
                io.emit('statusUpdate', workerid, false); 
                break;
            }
        }
    });
});

server.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});

app.get('/getWorkerId', (req, res) => {
    if (req.session.user && req.session.role === 'worker') {
        const workerid = req.session.user.workerid;
        console.log("Worker id : ",workerid); 
        res.json({ workerid: workerid });
    } else {
        res.status(401).json({ error: 'Not authorized' });
    }
});

const upload = multer({
    dest: 'public/image/temporary', 
    limits: { fileSize: 500 * 1024 }, 
}).fields([
    { name: 'uploadImage', maxCount: 1 },
    { name: 'uploadAadharCard', maxCount: 1 }
]);
const postingUpload = multer({
    dest: 'public/image/temporary', 
    limits: { fileSize: 5000 * 1024 }
}).fields([
    {
        name:'uploadpostingimage',maxCount:1
    }
]);

//generate password
function generatePassword(aadhaar, dob, phone) {
    const yearOfBirth = new Date(dob).getFullYear();
    return aadhaar.substring(0, 4) + yearOfBirth + phone.substring(0, 4);
}

// Check if phone exists in database
function checkPhoneExists(phone, table, callback) {
    db.query(`SELECT * FROM ${table} WHERE phoneNumber = ?`, [phone], (err, results) => {
        if (err) throw err;
        callback(results.length > 0);
    });
}
// Function to check if the email exists
function checkEmailExists(email, table, callback) {
    db.query(`SELECT * FROM ${table} WHERE email = ?`, [email], (err, results) => {
        if (err) throw err;
        callback(results.length > 0);
    });
}
// Check User Exist or not For login
function checkUserExist(phone, table, callback) {
    db.query(`SELECT * FROM ${table} WHERE phoneNumber = ?`, [phone], (err, results) => {
        if (err) throw err;
        callback(results.length > 0 ? results[0] : null);  // Return user if found, or null
    });
}
//Worker Registration
app.post('/register', upload, (req, res) => {
    console.log("Form Data Received: ", req.body); 
    console.log("Occupation: ", req.body.occupation);
    const { fullName, phoneNumber, dob, aadhaarNumber, occupation, address1, zip, state, city, subdivision, gender, ServiceCharge } = req.body;
    const phone = phoneNumber.trim();
    const aadhaar = aadhaarNumber.replace(/\D/g, '');  
    checkPhoneExists(phone, 'workers', (exists) => {
        if (exists) {
            return res.json({ message:true});
        }

        const password = generatePassword(aadhaar, dob, phone);

        const getFileExtension = (filename) => path.extname(filename);
        const imageFilePath = `image/profile_images/${phone}${getFileExtension(req.files.uploadImage[0].originalname)}`;
        const aadhaarFilePath = `image/aadhaar_cards/${phone}${getFileExtension(req.files.uploadAadharCard[0].originalname)}`;

        if (req.files.uploadImage && req.files.uploadAadharCard) {
            fs.renameSync(req.files.uploadImage[0].path, `public/${imageFilePath}`);
            fs.renameSync(req.files.uploadAadharCard[0].path, `public/${aadhaarFilePath}`);

        }
        const query = `
            INSERT INTO workers 
            (fullName, phoneNumber, dob, gender, aadhaarNumber, occupation, servicecharge, address1, zip, state, city, subdivision, image, aadhaarImage, password)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        db.query(query, [
            fullName, phone, dob, gender, aadhaar, occupation, ServiceCharge, address1, zip, state, city, subdivision,
            imageFilePath, aadhaarFilePath, password
        ], (err, result) => {
            if (err) throw err;
            console.log('User added to database');
            res.json({ password});
        });
    });
});


//Customer Registration
app.post('/register-customer', upload, (req, res) => {
    console.log("Customer Form Data Received: ", req.body);
    const { fullName, phoneNumber, email, password, zip, state, city, subdivision, address1 } = req.body;
    const phone = phoneNumber.trim();

    checkPhoneExists(phone, 'customers', (exists) => {
        console.log("Phone exists:", exists); 
        if (exists) {
            
            return res.json({ status: 'existing' }); 

        }
        const getFileExtension = (filename) => path.extname(filename);
        const imageFilePath = `image/profile_images/${phone}${getFileExtension(req.files.uploadImage[0].originalname)}`;

        if (req.files.uploadImage) {
            fs.renameSync(req.files.uploadImage[0].path, `public/${imageFilePath}`);
        }
        const query = `
            INSERT INTO customers 
            (fullName, phoneNumber, email, password, profileImage, zip, state, city, subdivision, address1)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        db.query(query, [
            fullName, phone, email, password, imageFilePath, zip, state, city, subdivision, address1
        ], (err, result) => {
            if (err) throw err;
            console.log('Customer added to database');
            return res.json({status: 'success' });
        });
    });
});

//Customer Forget Password
app.post("/forgetpassword", (req, res) => {
    const { PhoneNumbercustomer, email, customernewpassword } = req.body;
    console.log("Form Data:", req.body);
    console.log("Received:", PhoneNumbercustomer, email, customernewpassword);
    // Check if phone number exists
    checkPhoneExists(PhoneNumbercustomer, "customers", (phoneExists) => {
        if (!phoneExists) {
            return res.json({ success: false, message: "Invalid phone number or email" });
        }

        // Check if email exists
        checkEmailExists(email, "customers", (emailExists) => {
            if (!emailExists) {
                return res.json({ success: false, message: "Invalid phone number or email" });
            }

            // If both exist, update the password
            db.query(
                "UPDATE customers SET password = ? WHERE phoneNumber = ? AND email = ?",
                [customernewpassword, PhoneNumbercustomer, email],
                (err, result) => {
                    if (err) {
                        console.error(err);
                        return res.status(500).json({ success: false, message: "Database error" });
                    }

                    if (result.affectedRows > 0) {
                        res.json({ success: true });
                    } else {
                        res.json({ success: false, message: "No matching user found" });
                    }
                }
            );
        });
    });
});


//Customer Detail Update
app.post('/updateDetails', upload, (req, res) => {
    const { fullName, phoneNumber, email, zip, state, city, subdivision, address1 } = req.body;
    const phone = phoneNumber.trim();
    const customerid=req.session.user.customerid;
    console.log(req.body);

    checkPhoneExists(phone, 'customers', (exists) => {
        if (exists && phone !== req.session.user.phoneNumber) {
            console.log("Phone already exists in the database.");
            return res.json({ status: 'existingPhone' });
        }

        checkEmailExists(email, 'customers', (exists) => {
            if (exists && email !== req.session.user.email) {
                return res.json({ status: 'existingEmail' });
            }

            let updateQuery = `
                UPDATE customers 
                SET fullName = ?, phoneNumber = ?, email = ?, zip = ?, state = ?, city = ?, subdivision = ?, address1 = ? 
                WHERE customerid = ?
            `;
            const params = [fullName, phone, email, zip, state, city, subdivision, address1, customerid];
            console.log("Update Query:", updateQuery);
            console.log("Parameters:", params);
            db.query(updateQuery, params, (err, result) => {
                if (err) throw err;

                // Handle profile image update if available
                if (req.files && req.files.uploadImage) {
                    const imageFilePath = `image/profile_images/${phone}${path.extname(req.files.uploadImage[0].originalname)}`;
                    fs.renameSync(req.files.uploadImage[0].path, `public/${imageFilePath}`);

                    db.query('UPDATE customers SET profileImage = ? WHERE phoneNumber = ?', [imageFilePath, phone], (err, result) => {
                        if (err) throw err;
                        res.json({ status: 'success' });
                    });
                } else {
                    res.json({ status: 'success' });
                }
            });
        });
    });
});

//Worker Detail Update
app.post('/updateWorkerDetails', upload, (req, res) => {
    const { fullName, phoneNumber, dob, zip, state, city, subdivision, address1,ServiceCharge } = req.body;
    const phone = phoneNumber.trim();
    const workerid=req.session.user.workerid;
    console.log(req.body);
    checkPhoneExists(phone, 'workers', (exists) => {
        if (exists && phone !== req.session.user.phoneNumber) {
            return res.json({ status: 'existingPhone' });
        }

            let updateQuery = `
                UPDATE workers 
                SET fullName = ?, phoneNumber = ?, dob = ?, zip = ?, state = ?, city = ?, subdivision = ?, address1 = ?, servicecharge = ? 
                WHERE workerid = ?
            `;
            db.query(updateQuery, [fullName, phone, dob, zip, state, city, subdivision, address1,ServiceCharge, workerid], (err, result) => {
                if (err) throw err;

                if (req.files && req.files.uploadImage) {
                    const imageFilePath = `image/profile_images/${phone}${path.extname(req.files.uploadImage[0].originalname)}`;
                    fs.renameSync(req.files.uploadImage[0].path, `public/${imageFilePath}`);

                    db.query('UPDATE workers SET image = ? WHERE phoneNumber = ?', [imageFilePath, phone], (err, result) => {
                        if (err) throw err;
                        res.json({ status: 'success' });
                    });
                } else {
                    res.json({ status: 'success' });
                }
           
        });
    });
});

//Customer Login
app.post('/customerloginaction', (req, res) => {
    const { customerPhoneNumber, customerpassword } = req.body;  
    const phone = customerPhoneNumber.trim();
    const password = customerpassword.trim();

    checkUserExist(phone, 'customers', (user) => {
        if (user && user.password === password) {
            
            req.session.user = user;
            req.session.role = 'customer';
            console.log("Session Set:", req.session);
            return res.json({ success: true, redirectUrl: '/customerhomepage' });
        } else {
            return res.json({ success: false, message: 'Invalid phone number or password' });
        }
    });
});


//Worker Login
app.post('/workerloginaction', (req, res) => { 
    const { workerPhoneNumber, workerpassword, dob } = req.body; 

    const phone = workerPhoneNumber.trim();
    const password = workerpassword.trim();

    checkUserExist(phone, 'workers', (user) => {
        if (user) {
            const userDob = moment(user.dob).format('YYYY-MM-DD');  
            const inputDob = moment(dob).format('YYYY-MM-DD');  

            console.log("Normalized Database Date:", userDob);
            console.log("Normalized Input Date:", inputDob);
            
            if (user.password === password && userDob === inputDob) {
                
                req.session.user = user;
                req.session.role = 'worker';
                return res.json({ success: true, redirectUrl: '/workerhomepage' });
            } else {
                return res.json({ success: false, message: 'Invalid phone number or password' });
            }
        } else {
            return res.json({ success: false, message: 'User not found' });
        }
    });
});

//Customer Detail fetch on Profile Page
app.get('/customerprofile', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login.html');
    }
    const userPhone = req.session.user.phoneNumber;
    db.query('SELECT * FROM customers WHERE phoneNumber = ?', [userPhone], (err, results) => {
        if (err) throw err;
        const customer = results[0];
        res.json({
            fullName: customer.fullName,
            phoneNumber: customer.phoneNumber,
            email: customer.email,
            zip: customer.zip,
            state: customer.state,
            city: customer.city,
            subdivision: customer.subdivision, 
            address1: customer.address1,
            profileImage: customer.profileImage });
    });
});

//Worker Detail fetch on Profile Page
app.get('/workerprofile', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login.html');  
    }
    const userPhone = req.session.user.phoneNumber;
    db.query('SELECT * FROM workers WHERE phoneNumber = ?', [userPhone], (err, results) => {
        if (err) throw err;
        const worker = results[0];
        console.log('Worker Profile Data:', worker);
        res.json({
            fullName: worker.fullName,
            phoneNumber: worker.phoneNumber,
            dob: worker.dob,
            zip: worker.zip,
            state: worker.state,
            city: worker.city,
            subdivision: worker.subdivision,
            address1: worker.address1,
            image: worker.image,servicecharge:worker.servicecharge }); 
    });
});
//Ordering Worker Profile
app.get('/profiles', (req, res) => {
    const occupation = req.query.category;
    const zip = req.session.user.zip;
    const customerId = req.session.user.customerid; 
    const sort = req.query.sort;

    let orderBy = "";

    switch (sort) {
    case "lowtohighcharge":
        orderBy = "ORDER BY w.servicecharge ASC";
        break;
    case "hightolowcharge":
        orderBy = "ORDER BY w.servicecharge DESC";
        break;
    case "lowtohighrating":
        orderBy = "ORDER BY average_rating ASC";
        break;
    case "hightolowrating":
        orderBy = "ORDER BY average_rating DESC";
        break;
    default:
        orderBy = ""; // No sorting
    }
    console.log("Sort Option:", sort);
    const query = `
    SELECT 
        w.*, 
        r.status AS status, 
        r.requestDate,
        IFNULL(avg_ratings.avg_rating, 0.0) AS average_rating
    FROM workers w
    LEFT JOIN (
        SELECT sr.*
        FROM servicerequests sr
        INNER JOIN (
            SELECT workerid, MAX(requestDate) AS latestRequestDate
            FROM servicerequests
            WHERE customerid = ?
            GROUP BY workerid
        ) latest ON sr.workerid = latest.workerid AND sr.requestDate = latest.latestRequestDate
        WHERE sr.customerid = ?
    ) r ON w.workerid = r.workerid
    LEFT JOIN (
        SELECT workerid, ROUND(AVG(rating), 1) AS avg_rating
        FROM rate
        GROUP BY workerid
    ) avg_ratings ON w.workerid = avg_ratings.workerid
    WHERE w.occupation = ? AND w.zip = ?
    ${orderBy}
`;

    db.query(query, [customerId,customerId, occupation, zip], (err, results) => {
        if (err) throw err;
        console.log("Database query results:", results);
        res.json(results);
    });
});
//View All Requests
app.get('/loadrequests', (req, res) => {
    const zip = req.session.user.zip;
    const customerId = req.session.user.customerid;
    const query = `
        SELECT 
            w.*, 
            r.status AS status,
  r.requestDate,
  r.id AS requestid,
  (
    SELECT COUNT(*) FROM Rate 
    WHERE Rate.id = r.id AND Rate.customerid = ?
  ) AS alreadyRated
        FROM workers w
        LEFT JOIN servicerequests r 
        ON w.workerid = r.workerid AND r.customerid = ?
        WHERE w.zip = ? AND (r.status = "accepted" OR r.status = "pending" OR r.status="completed")
	order by r.requestDate desc;`;

    db.query(query, [customerId,customerId, zip], (err, results) => {
        if (err) throw err;
        console.log("Database query results:", results);
        res.json(results);
    });
});
//Rating
  app.post('/submitrating', (req, res) => {
    const customerId = req.session.user.customerid;
    const { workerid, requestid, rating } = req.body;
  
    const checkQuery = "SELECT * FROM Rate WHERE id = ?";
    db.query(checkQuery, [requestid], (err, result) => {
      if (err) return res.status(500).json({ message: "Database error" });
  
      if (result.length > 0) {
        return res.status(400).json({ message: "Already rated" });
      }
  
      const insertQuery = `
        INSERT INTO Rate (customerid, workerid, id, rating)
        VALUES (?, ?, ?, ?)
      `;
      db.query(insertQuery, [customerId, workerid, requestid, rating], (err2, result2) => {
        if (err2) return res.status(500).json({ message: "Insert error" });
        return res.status(200).json({ message: "Rating saved successfully" });
      });
    });
  });
  
  

//Show worker Details on Modal
app.get('/worker/:id', (req, res) => {
    const workerId = req.params.id;
    db.query('SELECT * FROM workers WHERE workerid = ?', [workerId], (err, results) => {
        if (err) throw err;
        const worker = results[0];
        res.json({
            fullName: worker.fullName,
            phoneNumber: worker.phoneNumber,
            image: worker.image,
            workerid: worker.workerid,
            address: `${worker.address1}, ${worker.subdivision}, ${worker.city}, ${worker.state}, ${worker.zip}`
        });
    });
});

//Send Request to worker
app.post('/sendRequests/:workerId', (req, res) => {
    const workerId = req.params.workerId;
    const customerId = req.session.user.customerid;
  
    const checkQuery = 'SELECT * FROM servicerequests WHERE customerid = ? AND workerid = ? AND status = "pending"';
    db.query(checkQuery, [customerId, workerId], (err, result) => {
      if (result.length > 0) {
        return res.status(400).json({ success: false, message: 'Request already sent' });
      }
  
      const query = 'INSERT INTO serviceRequests (customerid, workerid, status) VALUES (?, ?, "pending")';
      db.query(query, [customerId, workerId], (err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ success: false, message: 'Error sending request' });
        }
        res.status(200).json({ success: true, message: 'Request sent successfully' });
      });
    });
  });

//cancel request
app.post('/cancelRequests/:workerId', (req, res) => {
    const workerId = req.params.workerId;
    const customerId = req.session.user.customerid;
  
    const query = 'UPDATE serviceRequests SET status = "cancelled" WHERE customerid = ? AND workerid = ? AND status = "pending"';
    db.query(query, [customerId, workerId], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: 'Error cancelling request' });
      }
      res.status(200).json({ success: true, message: 'Request cancelled successfully' });
    });
  });

//Fetch Status of request show on customer homepage
app.get('/checkRequestStatus/:workerId', (req, res) => {
    const workerId = req.params.workerId;
    const customerId = req.session.user.customerid;
    const query = `
        SELECT status FROM serviceRequests 
        WHERE customerid = ? AND workerid = ? 
        AND (status = 'pending' OR status = 'accepted')
    `;
    
    db.query(query, [customerId, workerId], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ success: false, message: 'Error fetching request status' });
        }
        
        if (result.length > 0) {
            const requestStatus = result[0].status;
            return res.status(200).json({ success: true, requestStatus });
        }

        res.status(200).json({ success: true, requestStatus: 'none' });
    });
});

//Fetch request and show on worker homepage
app.get("/workerrequests", (req, res) => {
    const workerId = req.session.user.workerid;
    console.log(workerId);
    const query = `
        SELECT sr.id, sr.status, sr.requestDate, 
            c.customerid, c.fullName, c.phoneNumber, c.profileImage 
        FROM serviceRequests sr
        JOIN customers c ON sr.customerId = c.customerid
        WHERE sr.workerId = ? AND sr.isHidden = FALSE
        order by sr.requestDate desc;
    `;
  
    db.query(query, [workerId], (err, results) => {
      if (err) return handleError(res, err);
      const requests = results.map(request => ({
        id: request.id,
            status: request.status,
            requestDate: request.requestDate,
            fullName: request.fullName,
            phoneNumber: request.phoneNumber,
            profileImage: request.profileImage,
        showContactButton: request.status === 'accepted',
        showDeleteButton: request.status === 'completed'
      }));
  
      res.json({ success: true, requests });
    });
  });

  //Accept Request
  app.post("/worker/request/accept", (req, res) => {
    const { requestId } = req.body;
  
    const query = "UPDATE serviceRequests SET status = 'accepted' WHERE id = ?";
    db.query(query, [requestId], (err) => {
      if (err) return handleError(res, err);
      res.json({ success: true, message: "Request accepted successfully" });
    });
  });

  //Reject Request
  app.post("/worker/request/reject", (req, res) => {
    const { requestId } = req.body;
  
    const query = "UPDATE serviceRequests SET status = 'cancelled' WHERE id = ?";
    db.query(query, [requestId], (err) => {
      if (err) return handleError(res, err);
      res.json({ success: true, message: "Request rejected successfully" });
    });
  });

  //Delete Request
  app.post("/worker/request/delete", (req, res) => {
    const { requestId } = req.body;
  
    const query = "UPDATE serviceRequests SET isHidden = TRUE WHERE id = ?";
    db.query(query, [requestId], (err) => {
      if (err) return handleError(res, err);
      res.json({ success: true, message: "Request deleted successfully" });
    });
  });

//Posting
  app.post('/posting', postingUpload, async (req, res) => {
    try {
      const { posting_description, occupation } = req.body;
      console.log('File:', req.file);   // Should log the file info
    console.log('Body:', req.body);  
      const customerid = req.session.user.customerid;
      const today = new Date().toISOString().slice(0, 10);
      let imageFileName = null;
  
      const fileArray = req.files['uploadpostingimage'];
    if (fileArray && fileArray.length > 0) {
      const file = fileArray[0];
      const uniqueName = `post_${Date.now()}_${Math.round(Math.random() * 1E9)}.jpg`;
      const outputPath = path.join(__dirname, 'public/image/post_images', uniqueName);

      await sharp(file.path)
        .resize({ width: 800 }) 
        .jpeg({ quality: 50 })
        .toFile(outputPath);

      imageFileName = uniqueName;
      fs.unlinkSync(file.path);
    }

  
      db.query(
        `INSERT INTO Post_requirement (customerid, category, postimage, description, date) VALUES (?, ?, ?, ?, ?)`,
        [customerid, occupation, imageFileName, posting_description, today],
        (err, result) => {
          if (err) return res.status(500).send("DB error");
          res.json({ success: true });
        }
      );
    } catch (err) {
      res.status(500).send('Upload Error');
    }
  });
// Delete Post
app.post('/deletepost', (req, res) => {
    const { post_id, postimage } = req.body;
  
    db.query(`DELETE FROM Post_requirement WHERE post_id = ?`, [post_id], (err) => {
      if (err) return res.status(500).send("DB error");
  
      if (postimage) {
        const imagePath = path.join(__dirname, 'public/image/post_images', postimage);
        if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
      }
  
      res.json({ success: true });
    });
  });
  
  // Get Posts
  app.get('/getmyposts', (req, res) => {
    const customerid = req.session.user.customerid;
  
    db.query(`
      SELECT P.*, C.fullName, C.profileImage 
      FROM Post_requirement P
      JOIN customers C ON P.customerid = C.customerid 
      WHERE P.customerid = ?
      ORDER BY P.post_id DESC
    `, [customerid], (err, results) => {
      if (err) return res.status(500).send("DB error");
      res.json(results);
    });
  });
  // Get Posts Relevant to Worker
app.get('/getpostsforworker', (req, res) => {
    const workerId = req.session.user.workerid;
  
    db.query(`
      SELECT W.zip AS workerZip, W.occupation, C.fullName, C.phoneNumber, C.profileImage, 
             P.description, P.postimage, P.date, P.category, P.post_id
      FROM workers W
      JOIN customers C ON W.zip = C.zip
      JOIN Post_requirement P ON C.customerid = P.customerid
      WHERE W.workerid = ? AND W.occupation = P.category
      ORDER BY P.post_id DESC
    `, [workerId], (err, results) => {
      if (err) return res.status(500).send("DB error");
      res.json(results);
    });
  });
  
//load page by default on index.html
app.get('/', (req, res) => {
    if (req.session.user) {
        res.sendFile(path.join(__dirname,'index.html'));
    } else {
        res.sendFile(path.join(__dirname,'index.html'));
    }
});

//redirect to homepage according to user if user try to go on login page
app.get('/login.html', (req, res) => {
    if (req.session.user) {
        
        if (req.session.role === 'customer') {
            console.log("Redirecting Customer");
            return res.redirect('/customerhomepage');
        } else if (req.session.role === 'worker') {
            console.log("Redirecting Worker");
            return res.redirect('/workerhomepage');
            
        }
    }

    res.sendFile(path.join(__dirname, 'login.html'));
});


//redirect customer to login page if user not login
app.get('/customerhomepage', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login.html');  
    }
    res.sendFile(path.join(__dirname, 'customerhomepage.html'));
});
//redirect Worker to login page if user not login
app.get('/workerhomepage', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login.html'); 
    }
    res.sendFile(path.join(__dirname, 'workerhomepage.html'));
});

//if customer try to registration while already login redirect to customerhomepage
app.get('/Customerregistration.html', (req, res) => {
    if (req.session.user) {
        res.redirect('/customerhomepage');
    } else {
        res.sendFile(path.join(__dirname,'Customerregistration.html'));
    }
});

//if Worker try to registration while already login redirect to customerhomepage
app.get('/workerregistration.html', (req, res) => {
    if (req.session.user) {
        res.redirect('/workerhomepage');
    } else {
        res.sendFile(path.join(__dirname,'workerregistration.html'));
    }
});

// Logout route to clear the session
app.get('/logout', (req, res) => {
    console.log('Logging out...');
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session', err);
            return res.status(500).send('Failed to log out');
        }
        console.log('Session destroyed');
        res.redirect('/login.html');  
    });
});


const cleanupInterval = 1 * 60 * 1000; 

setInterval(() => {
    const tempDir = 'public/image/temporary';

    // Read the files in the temporary directory
    fs.readdir(tempDir, (err, files) => {
        if (err) throw err;

        files.forEach(file => {
            const filePath = path.join(tempDir, file);
            const fileStat = fs.statSync(filePath);

            // Delete files older than 1 day
            if (Date.now() - fileStat.mtimeMs > cleanupInterval) {
                fs.unlink(filePath, (err) => {
                    if (err) console.error('Error deleting old file:', file);
                    else console.log('Deleted old file:', file);
                });
            }
        });
    });
}, cleanupInterval);  

