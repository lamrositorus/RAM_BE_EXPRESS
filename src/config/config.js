   require('dotenv').config();

   const env = process.env.NODE_ENV || 'development';

   const development = {
     db: {
       user: process.env.DB_USER,
       host: process.env.DB_HOST,
       database: process.env.DB_NAME,
       password: process.env.DB_PASSWORD,
       port: process.env.DB_PORT,
     },
     port: process.env.PORT || 5000
   };

   const production = {
     db: {
       user: process.env.DB_USER,
       host: process.env.DB_HOST,
       database: process.env.DB_NAME,
       password: process.env.DB_PASSWORD,
       port: process.env.DB_PORT,
     },
     port: process.env.PORT || 5000
   };

   const config = {
     development,
     production
   };

   module.exports = config[env];
   