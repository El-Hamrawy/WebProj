var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var mysql = require('mysql2');
var crypto = require('crypto');

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");

var app = express();

// Crypto setup for cookie encryption
const algorithm = 'aes-256-ctr';
const secretKey = crypto.randomBytes(32).toString('hex');  // Generate a secure random secret key
const iv = crypto.randomBytes(16);

const encrypt = (text) => {
    const cipher = crypto.createCipheriv(algorithm, Buffer.from(secretKey, 'hex'), iv);
    const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');
};

const decrypt = (text) => {
    const parts = text.split(':');
    const iv = Buffer.from(parts[0], 'hex');
    const encryptedText = Buffer.from(parts[1], 'hex');
    const decipher = crypto.createDecipheriv(algorithm, Buffer.from(secretKey, 'hex'), iv);
    const decrypted = Buffer.concat([decipher.update(encryptedText), decipher.final()]);
    return decrypted.toString();
};

// Optionally connect to MySQL if credentials are provided
var db;
if (process.env.DB_HOST && process.env.DB_USER && process.env.DB_PASS && process.env.DB_NAME) {
    db = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME
    });

    db.connect((err) => {
        if (err) {
            console.error('Error connecting to the database: ' + err.stack);
            return;
        }
        console.log('Connected to database with thread ID: ' + db.threadId);
    });
} else {
    console.log('Database credentials not provided. Skipping DB connection.');
}

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.get('/database_test', (req, res)=>{
  db.query("SELECT 1 + 1 AS solution", (error, results, fields) => {
    if (error) {
      console.error("Error executing query:", error);
      return;
    }
    console.log("The solution is:", results[0].solution);
  });

})

const itemsOnSale = [
  { name: 'Full boned thigh', price: 370, photo: '/images/1.jpg', category: 'beef backside' },
  { name: 'Whole thigh without bone', price: 440, photo: '/images/2.jpg', category: 'beef backside' },
  { name: 'Rose Beef', price: 460, photo: '/images/3.jpg', category: 'beef backside' },
  { name: 'Tenderloin', price: 500, photo: '/images/4.jpg', category: 'beef backside' },
  { name: 'topside beef', price: 450, photo: '/images/5.png', category: 'beef backside' },
  { name: 'calf', price: 450, photo: '/images/6.jpg', category: 'beef backside' },
  { name: 'Beef Topside Shank', price: 450, photo: '/images/7.jpg', category: 'beef backside' },
  { name: 'kolata', price: 450, photo: '/images/8.jpg', category: 'beef backside' },
  { name: 'Eye of Round', price: 450, photo: '/images/9.jpg', category: 'beef backside' },
  { name: 'backside beef', price: 450, photo: '/images/10.jpg', category: 'beef backside' },
  { name: 'سن', price: 450, photo: '/images/11.jpg', category: 'beef Frontside' },
  { name: 'Shoulder', price: 450, photo: '/images/12.jpg', category: 'beef Frontside' },
  { name: 'Topside Shank', price: 450, photo: '/images/13.jpg', category: 'beef Frontside' },
  { name: 'Neck', price: 430, photo: '/images/14.jpg', category: 'beef Frontside' },
  { name: 'دوش', price: 350, photo: '/images/15.jpg', category: 'beef Frontside' },
  { name: 'Whole sheep', price: 450, photo: '/images/16.jpg', category: 'lamb' },
  { name: 'whole thigh', price: 500, photo: '/images/17.jpg', category: 'lamb' },
  { name: 'ribs', price: 500, photo: '/images/18.jpg', category: 'lamb' },
  { name: 'Ulna meatus', price: 500, photo: '/images/19.jpg', category: 'lamb' },
  { name: 'neck', price: 450, photo: '/images/20.jpg', category: 'lamb' },
  { name: 'tail fat', price: 300, photo: '/images/21.jpg', category: 'lamb' },
  { name: 'lamb intestines', price: 300, photo: '/images/22.jpg', category: 'lamb' },
  { name: 'دوش', price: 300, photo: '/images/23.jpg', category: 'lamb' },
];


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use("/", indexRouter);
app.use("/users", usersRouter);

app.get("/sign-in", (req, res) => {
    res.render("sign-in");
});
app.get("/sign-up", (req, res) => {
    res.render("sign-up");
});

app.post("/sign-up", (req, res) => {
    console.log("Received signup data:", req.body);
  // const { firstName, secondName, email, phoneNumber, password } = req.body;
    // const sql = "INSERT INTO users (firstName, secondName, email, phoneNumber, password) VALUES (?, ?, ?, ?, ?)";
    // db.query(sql, [firstName, secondName, email, phoneNumber, password], (err, result) => {
    //     if (err) {
    //         res.status(500).send('Error registering new user');
    //         return;
    //     }
    //     res.redirect('/sign-in'); // Redirect to sign-in page after successful registration
    // });

    res.send("Signup data received, check console for details.");
});

app.post("/sign-in", (req, res) => {
  console.log("Received sign-in data:", req.body);
   // const { email, password } = req.body;
    // const sql = "SELECT * FROM users WHERE email = ? AND password = ?";
    // db.query(sql, [email, password], (err, results) => {
    //     if (err) {
    //         res.status(500).send('Error logging in');
    //         return;
    //     }
    //     if (results.length > 0) {
    //         res.redirect('/items'); // Redirect to items page on successful login
    //     } else {
    //         res.send('Email or password is incorrect');
    //     }
    // });

    const { email } = req.body; // Assuming 'email' is the username
    const encryptedEmail = encrypt(email);
    res.cookie('user_session', encryptedEmail, { httpOnly: true, secure: false }); // Use secure: true in production with HTTPS
    res.send("Sign-in successful, encrypted cookie set.");
});

app.get('/items', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const searchQuery = req.query.search || '';
  const selectedCategory = req.query.category || '';
  const pageSize = 9;
  const offset = (page - 1) * pageSize;

  const filteredItems = itemsOnSale.filter(item =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (selectedCategory ? item.category === selectedCategory : true)
  );

  const paginatedItems = filteredItems.slice(offset, offset + pageSize);
  const totalItems = filteredItems.length;
  const totalPages = Math.ceil(totalItems / pageSize);

  const categories = [...new Set(itemsOnSale.map(item => item.category))];

  res.render('items', {
      items: paginatedItems,
      currentPage: page,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
      nextPage: page + 1,
      prevPage: page - 1,
      totalPages: totalPages,
      searchQuery: searchQuery,
      categories: categories,
      selectedCategory: selectedCategory
  });
    if (req.cookies.user_session) {
        const username = decrypt(req.cookies.user_session);
        console.log(`Decrypted username: ${username}`);
        res.render('items', { username: username }); // Passing username to the view if needed
    } else {
        res.redirect("/sign-in");
    }
});

app.use(function(req, res, next) {
    next(createError(404));
});

app.use(function(err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};
    res.status(err.status || 500);
    res.render("error");
});

app.listen(3006, function() {
    console.log('App is running on port 3006');
});

module.exports = app;
