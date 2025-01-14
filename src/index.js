const express = require("express");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const path = require("path");
const collection = require("./config");
const bcrypt = require("bcryptjs");
const EventEmitter = require('events');

const app = express();

// Increase the maximum number of listeners for the TLSSocket EventEmitter
app.setMaxListeners(35);

// Set up MongoDB session store
const store = new MongoDBStore({
  uri: "mongodb+srv://Aryan:login123@userdetails.pktikgi.mongodb.net/?retryWrites=true&w=majority&appName=UserDetails",
  collection: "sessions",
});

// Catch errors
store.on("error", function (error) {
  console.error(error);
});

// Set up express-session middleware
app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: true,
    store: store,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 1 day (adjust as needed)
      secure: false, // Change to true if using HTTPS
    },
  })
);

// Serve static files from the 'public' directory
const publicPath = path.join(__dirname, '../public');
app.use(express.static(publicPath));

// Serve static files from the 'photos' directory
const photosPath = path.join(__dirname, '../photos');
app.use('/photos', express.static(photosPath));

// Serve static files from the 'models' directory
const modelsPath = path.join(__dirname, '../models');
app.use('/models', express.static(modelsPath));

// Set the directory where your views are located
app.set('views', path.join(__dirname,  '../views'));
// Use EJS as the view engine
app.set("view engine", "ejs");

// Middleware to set MIME type for CSS files
app.use(express.static('public', {
    setHeaders: (res, path) => {
        if (path.endsWith('.css')) {
            res.setHeader('Content-Type', 'text/css');
        }
    }
}));

// Middleware to parse JSON request bodies
app.use(express.json());

// Middleware to parse URL-encoded form data
app.use(express.urlencoded({ extended: false }));

// Middleware to check if user is logged in
const requireLogin = (req, res, next) => {
  if (req.session.loggedInUser) {
    next(); // User is logged in, proceed to the next middleware
  } else {
    res.redirect("/login"); // User is not logged in, redirect to login page
  }
};

// app.get("/", (req, res) => {
//   res.render("login");
// });

app.get("/", (req, res) => {
  // Redirect to index.ejs
  res.redirect("/views/index.html");
});

// Render the login page
app.get("/login", (req, res) => {
  res.render("login");
});

// Render the signup page
app.get("/signup", (req, res) => {
    res.render("login");
});

// Register User
app.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;

  try {
      // Check if the username already exists in the database
      const existingUser = await collection.findOne({ name: username });

      if (existingUser) {
          return res.send('User already exists. Please choose a different username.');
      } else {
          // Hash the password using bcrypt
          const saltRounds = 10; // Number of salt rounds for bcrypt
          const hashedPassword = await bcrypt.hash(password, saltRounds);

          // Create a new user
          const newUser = new collection({
              name: username,
              email: email, // Store email in the database
              password: hashedPassword
          });

          await newUser.save();

          console.log('User registered successfully');

          // After successful signup, set isLoggedIn to true and render index.ejs with user data
          req.session.loggedInUser = newUser;
          res.render("index", { isLoggedIn: true, user: newUser });
      }
  } catch (error) {
      console.error('Error registering user:', error);
      res.status(500).send('Internal Server Error');
  }
});


// Login user
app.post("/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await collection.findOne({ name: username });
      if (!user) {
        return res.send("User not found");
      }
  
      const isPasswordMatch = await bcrypt.compare(password, user.password);
      if (!isPasswordMatch) {
        return res.send("Incorrect password");
      }
  
      // Store user data in session
      req.session.loggedInUser = user;
  
      // Set isLoggedIn to true and render index.ejs with user data
      res.render("index", { isLoggedIn: true, user: user });
    } catch (error) {
      console.error("Error logging in user:", error);
      res.status(500).send("Internal Server Error");
    }
  });

  // Logout user
app.get("/logout", (req, res) => {
    // Destroy the session
    req.session.destroy((err) => {
      if (err) {
        console.error("Error logging out:", err);
        res.status(500).send("Internal Server Error");
      } else {
        // Redirect to the index page after logout
        res.redirect("/");
      }
    });
  });
  


// Serve the index.ejs file on the root route
app.get("/", (req, res) => {
    // Check if the user is logged in
    const loggedInUser = req.session.loggedInUser;
    const isLoggedIn = !!loggedInUser;

    // Render index.ejs and pass the isLoggedIn flag and user information if available
    res.render("index", { isLoggedIn, user: loggedInUser });
});

// Serve the index.ejs file on the /views/index.html route
app.get("/views/index.html", requireLogin, (req, res) => {
  // Retrieve user data from session
  const loggedInUser = req.session.loggedInUser;
  const isLoggedIn = !!loggedInUser;

  // Render index.ejs and pass the isLoggedIn flag and user information if available
  res.render("index", { isLoggedIn, user: loggedInUser });
});

// Serve the ngos.html file
app.get("/views/ngos.html", requireLogin, (req, res) => {
  const loggedInUser = req.session.loggedInUser;
  const isLoggedIn = !!loggedInUser;
  res.render("ngos", { isLoggedIn, user: loggedInUser });
});

// Serve the events.html file
app.get("/views/events.html", requireLogin, (req, res) => {
  const loggedInUser = req.session.loggedInUser;
  const isLoggedIn = !!loggedInUser;
  res.render("events", { isLoggedIn, user: loggedInUser });
});

// Serve the team.html file
app.get("/views/team.html", requireLogin, (req, res) => {
  const loggedInUser = req.session.loggedInUser;
  const isLoggedIn = !!loggedInUser;
  res.render("team", { isLoggedIn, user: loggedInUser });
});

//Serve health.html
app.get("/views/health.html", requireLogin, (req, res) => {
  const loggedInUser = req.session.loggedInUser;
  const isLoggedIn = !!loggedInUser;
  res.render("health", { isLoggedIn, user: loggedInUser });
});

//Serve agriculture.html
app.get("/views/agriculture.html", requireLogin, (req, res) => {
  const loggedInUser = req.session.loggedInUser;
  const isLoggedIn = !!loggedInUser;
  res.render("agriculture", { isLoggedIn, user: loggedInUser });
});

//Serve rural.html
app.get("/views/rural.html", requireLogin, (req, res) => {
  const loggedInUser = req.session.loggedInUser;
  const isLoggedIn = !!loggedInUser;
  res.render("rural", { isLoggedIn, user: loggedInUser });
});

//Serve right.html
app.get("/views/right.html", requireLogin, (req, res) => {
  const loggedInUser = req.session.loggedInUser;
  const isLoggedIn = !!loggedInUser;
  res.render("right", { isLoggedIn, user: loggedInUser });
});

//Serve mission.html
app.get("/views/mission.html", requireLogin, (req, res) => {
  const loggedInUser = req.session.loggedInUser;
  const isLoggedIn = !!loggedInUser;
  res.render("mission", { isLoggedIn, user: loggedInUser });
});

//Serve women.html
app.get("/views/women.html", requireLogin, (req, res) => {
  const loggedInUser = req.session.loggedInUser;
  const isLoggedIn = !!loggedInUser;
  res.render("women", { isLoggedIn, user: loggedInUser });
});

//Serve disable.html
app.get("/views/disable.html", requireLogin, (req, res) => {
  const loggedInUser = req.session.loggedInUser;
  const isLoggedIn = !!loggedInUser;
  res.render("disable", { isLoggedIn, user: loggedInUser });
});

//Serve elder.html
app.get("/views/elder.html", requireLogin, (req, res) => {
  const loggedInUser = req.session.loggedInUser;
  const isLoggedIn = !!loggedInUser;
  res.render("elder", { isLoggedIn, user: loggedInUser });
});

//Serve 4mission.html
app.get("/views/4mission.html", requireLogin, (req, res) => {
  const loggedInUser = req.session.loggedInUser;
  const isLoggedIn = !!loggedInUser;
  res.render("4mission", { isLoggedIn, user: loggedInUser });
});

//Serve donatenow.html
app.get("/views/donatenow.html", requireLogin, (req, res) => {
  const loggedInUser = req.session.loggedInUser;
  const isLoggedIn = !!loggedInUser;
  res.render("donatenow", { isLoggedIn, user: loggedInUser });
});

//Serve donating.html
app.get("/views/donating.html", requireLogin, (req, res) => {
  const loggedInUser = req.session.loggedInUser;
  const isLoggedIn = !!loggedInUser;
  res.render("donating", { isLoggedIn, user: loggedInUser });
});

//Serve donate.html
app.get("/views/donate.html", requireLogin, (req, res) => {
  const loggedInUser = req.session.loggedInUser;
  const isLoggedIn = !!loggedInUser;
  res.render("donate", { isLoggedIn, user: loggedInUser });
});

//Serve ngo2.html
app.get("/views/ngo2.html", requireLogin, (req, res) => {
  const loggedInUser = req.session.loggedInUser;
  const isLoggedIn = !!loggedInUser;
  res.render("ngo2", { isLoggedIn, user: loggedInUser });
});

//Serve education.html
app.get("/views/education.html", requireLogin, (req, res) => {
  const loggedInUser = req.session.loggedInUser;
  const isLoggedIn = !!loggedInUser;
  res.render("education", { isLoggedIn, user: loggedInUser });
});

//Serve agriculture.html
app.get("/views/hello.html", requireLogin, (req, res) => {
  const loggedInUser = req.session.loggedInUser;
  const isLoggedIn = !!loggedInUser;
  res.render("hello", { isLoggedIn, user: loggedInUser });
});

// Define Port for Application
const port = 5500;
const hostname = "127.0.0.1";
app.listen(port, hostname, () => {
  console.log(`Server listening on port ${port}`);
});
