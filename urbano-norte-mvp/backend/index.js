const cors = require('cors')
const swaggerUi = require('swagger-ui-express')
const swaggerDocs = require('./swagger.json')
const https = require('https')
const http = require('http')
const fs = require('fs')
const express = require('express');

const httpPort = 5000;
const httpsPort = 5050;


const app = express()

// Config JSON response
app.use(express.json())




app.use('/apidocs', swaggerUi.serve, swaggerUi.setup(swaggerDocs))

// Solve CORS
app.use(cors())

//solve cors https request
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});


const privateKey = fs.readFileSync('/etc/letsencrypt/live/carmedia.online/privkey.pem', 'utf8');
const certificate = fs.readFileSync('/etc/letsencrypt/live/carmedia.online/cert.pem', 'utf8');
const ca = fs.readFileSync('/etc/letsencrypt/live/carmedia.online/chain.pem', 'utf8');
 
const credentials = {
  key: privateKey,
  cert: certificate,
  ca: ca
};
 
const httpsServer = https.createServer(credentials, app);
const httpServer = http.createServer(app);


// Public folder for images
//app.use(express.static('public'))
app.use('/public', express.static('public'));

// Routes
const AdRoutes = require('./routes/AnuncioRoutes')
const UserRoutes = require('./routes/UserRoutes')

app.use('/anuncio', AdRoutes)
app.use('/users', UserRoutes)
app.use('/company', require('./routes/CompanyRoutes'))
app.use('/pacote', require('./routes/PacoteRoutes'))
app.use('/dadosanuncio', require('./routes/DadosAnuncioRoutes'))

httpServer.listen(httpPort, () => {
    console.log("Http server listing on port : " + httpPort)
  });
  
httpsServer.listen(httpsPort, () => {
console.log("Https server listing on port : " + httpsPort)
});

