// Dependencies
const express = require('express');
let cors = require('cors');
// Env
const { port } = require('./config/Config')
// App
const app = express();
// Modules
const { sequelize } = require('./config/Database');
// Models
require('./models/User');
require('./models/Patient');
require('./models/Session');
require('./models/Associations')

// Routes
const userRouter = require('./routes/user/User');
const loginRouter = require('./routes/user/Login');
const patientRouter = require('./routes/patient/Patient');
const sessionRouter = require('./routes/session/Session');
const tokenRouter = require('./routes/user/Token');
const adminRouter = require('./routes/user/Admin');

app.use(cors());
app.use(express.json());
app.use('/user', userRouter);
app.use('/login', loginRouter);
app.use('/patient', patientRouter);
app.use('/session', sessionRouter);
app.use('/token', tokenRouter);
app.use("/admin",adminRouter);

// Connection with db
sequelize
  .authenticate()
  .then(() => {
    return sequelize.sync();
  })
  .then(() => {
    app.listen(port, () => {
      console.log(`Server listen on http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error('Connection fail', error);
});
module.exports = app;

