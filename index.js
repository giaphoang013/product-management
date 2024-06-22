const express = require('express')
const methodOverride = require('method-override')
const flash = require('express-flash')
const cookieParser = require("cookie-parser");
const session = require("express-session");


// sửa lỗi 504 theo youtube
const cors = require("cors");
const corsConfig = {
  origin: "*",
  credent: true,
  methods: ["GET", "POST", "PUT", "DELETE"]
}
app.options("", cors(corsConfig))
app.use(cors(corsConfig));

// 
var bodyParser = require('body-parser')

require("dotenv").config();

const database = require("./config/database")
const systemConfig = require("./config/system")

const route = require("./routes/client/index.route")
const routeAdmin = require("./routes/admin/index.route")
database.connect();

const app = express()
app.use(methodOverride('_method'))

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

const port = process.env.PORT;

app.set('views', `${__dirname}/views`);
app.set('view engine', 'pug');


// Express-flash thư viện để hiển thị thông báo
app.use(cookieParser("HDHHKSDJ"));
app.use(session({ cookie: { maxAge: 60000 }}));
app.use(flash());
// App Local variables
app.locals.prefixAdmin = systemConfig.prefixAdmin;


// khi online phải thêm dirname
app.use(express.static(`${__dirname}/public`))
routeAdmin(app)
route(app)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})