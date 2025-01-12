const express = require('express');
const exphbs = require('express-handlebars');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const flash = require('express-flash');

const server = express();

const conn = require('./db/conn');

// Models
const User = require('./models/User');
const Customer = require('./models/Customer');
const Machine = require('./models/Machines');

// Import Routes
const machinesRoutes = require('./routes/machinesRoutes');
const customersRoutes = require('./routes/customersRoutes');
const authRoutes = require('./routes/authRoutes');

// Import Controller
const MachineController = require('./controllers/MachineController');
const CustomerController = require('./controllers/CustomerController')

// Template Engine
server.engine('handlebars', exphbs.engine({
  defaultLayout: 'main',
  runtimeOptions: {
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true,
  }, helpers: {
    ifEquals: function (a, b, options) {
      if (a === b) {
        return options.fn(this);
      } else {
        return options.inverse(this);
      }
    }
  }
}));
server.set('view engine', 'handlebars');
server.set('views', './views');

// Receiving body answers
server.use(
  express.urlencoded({
    extended: true
  })
)

server.use(express.json())

// Session middleware
server.use(session({
    name: 'session',
    secret: 'our_secret',
    resave: false,
    saveUninitialized: false,
    store: new FileStore({
      logFn: function (){},
      path: require('path').join(require('os').tmpdir(), 'sessions'),
    }),
    cookie: {
      secure: false,
      maxAge: 3600000,
      // maxAge: 1000 * 60 * 60 * 24 -- 1 dia,
      expires: new Date(Date.now() + 3600000),
      httpOnly: true,
    }
  }));

// Flash messages
server.use(flash());

// Public path
server.use(express.static('public'));

// Set session to res
server.use((req, res, next) => {
  if(req.session.userid){
    res.locals.session = req.session
  }

  next()
})

// Routes
server.use('/machines', machinesRoutes);
server.use('/', authRoutes);
server.use((req, res, next) => {
  console.log(`Rota acessada: ${req.method} ${req.url}`);
  next();
});
server.get('/', MachineController.showMachines);
server.get('/customers', CustomerController.showCustomers);

conn
  // .sync({ force: true })
  .sync()
  .then(() => { 
    server.listen(3000);
  })
  .catch((err) => console.log(err));
  