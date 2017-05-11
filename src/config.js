 export default {
   // token alives..
   expiresIn: '10d',

   mongo: {
     default: {
       dbname : 'WebSocket_iot_server',
       dbhost : 'localhost',
       dbport : 27017,
     },
   },

   server: {
     port: 3001,
   },

   users : [
     { username: 'admin', password: 'admin' },
     { username: 'guest', password: 'guest' },
   ]
 }
