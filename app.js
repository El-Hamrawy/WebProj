var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

const itemsOnSale = [
  { name: 'Full boned thigh', price: 370, photo: '/images/1.jpg', category: 'beef backside' },
  { name: 'Whole thigh without bone', price: 440, photo: '/images/2.jpg', category: 'beef backside' },
  { name: 'Rose Beef ', price: 460, photo: '/images/3.jpg', category: 'beef backside' },
  { name: 'Tenderloin', price: 500, photo: '/images/4.jpg', category: 'beef backside' },
  { name: 'topside beef ', price: 450, photo: '/images/5.png ', category: 'beef backside' },
  { name: 'calf', price: 450, photo: '/images/6.jpg', category: 'beef backside' },
  { name: 'Beef Topside Shank', price: 450, photo: '/images/7.jpg', category: 'beef backside' },
  { name: 'kolata', price: 450, photo: '/images/8.jpg', category: 'beef backside' },
  { name: ' Eye of Round', price: 450, photo: '/images/9.jpg', category: 'beef backside' },
  { name: 'backside beef ', price: 450, photo: '/images/10.jpg', category: 'beef backside' },
  { name: 'سن', price: 450, photo: '/images/11.jpg', category: 'beef Frontside' },
  { name: 'Shoulder', price: 450, photo: '/images/12.jpg', category: 'beef Frontside' },
  { name: 'Topside Shank', price: 450, photo: '/images/13.jpg', category: 'beef Frontside' },
  { name: 'Neck', price: 430, photo: '/images/14.jpg', category: 'beef Frontside' },
  { name: 'دوش', price: 350, photo: '/images/15.jpg', category: 'beef Frontside' },
  { name: 'Whole sheep', price: 450, photo: '/images/16.jpg', category: 'lamb' },
  { name: ' whole thigh ', price: 500, photo: '/images/17.jpg', category: 'lamb' },
  { name: ' ribs', price: 500, photo: '/images/18.jpg', category: 'lamb' },
  { name: 'Ulna meatus', price: 500, photo: '/images/19.jpg', category: 'lamb' },
  { name: 'neck', price: 450, photo: '/images/20.jpg', category: 'lamb' },
  { name: ' tail fat', price: 300, photo: '/images/21.jpg', category: 'lamb' },
  { name: 'lamb intestines', price: 300, photo: '/images/22.jpg', category: 'lamb' },
  { name: 'دوش', price: 300, photo: '/images/23.jpg', category: 'lamb' },
  
  // Add more items with photos and categories here
];

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
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
});


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});
app.listen(3006, function() {
  console.log('App is running on port 3000');
});
module.exports = app;
