// Dependencies
const express = require('express');
// Env
const { port } = require('./config/Config')
// App
const app = express();
// Modules
const { sequelize } = require('./config/Database');
// Models
require('./models/User');
require('./models/Session');
require('./models/Patient');
// Routes
const userRouter = require('./routes/user/User');
const loginRouter = require('./routes/user/Login');
const patientRouter = require('./routes/patient/Patient');

app.use(express.json());
app.use('/user', userRouter);
app.use('/login', loginRouter);
app.use('/patient', patientRouter);

// Connection with db
/*
sequelize
  .authenticate()
  .then(() => {
    console.log('Connection success');
    return sequelize.sync();
  })
  .then(() => {
    console.log('Sync models');
    app.listen(port, () => {
      console.log(`Server listen on http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error('Connection fail', error);
});
*/
module.exports = app;

