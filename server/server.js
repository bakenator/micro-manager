require('dotenv').config()
import express from 'express'
import httpBase from 'http'
import socket from 'socket.io'
import bodyParser from 'body-parser'
import EventParser from './event-parser'
import EventList from './event-list'
import MemberModel from './member-model'
import session from 'express-session'
import ejs from 'ejs'
import Authentication from './authentication'

const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'))
app.set('view engine', 'ejs');
app.use(session({ 
  secret: process.env.SESSION_SECRET, 
  resave: false, 
  saveUninitialized: true
}))

const http = httpBase.Server(app);
const io = socket(http)
//building list of github users
const githubMembers = new MemberModel();
githubMembers.fetch()
// building list of previously occuring events
const githubEvents = new EventList();
githubEvents.fetch()

const auth = new Authentication();

app.get('/', function(req, res){
  if (auth.authorizedRequest(req)) {
    res.render('app.ejs', {token: req.session.token, repo: process.env.REPO});  
  } else {
    res.render('auth.ejs', {client_id: process.env.GH_BASIC_CLIENT_ID, repo: process.env.REPO});
  }
});

app.get('/githubauth', function(req, res) {
  const ghCode = req.query.code;
  // calls redirect once complete
  auth.ghOauth(ghCode, req, () => {
    res.redirect('/')
  })
})

app.post('/event', function(req, res){
  const ep = new EventParser()
  const hookEvent = ep.parseWebhook(req)
  var newEvent = ep.processEvent(hookEvent);
  githubEvents.add(newEvent);

  io.emit('newEvent', {newEvent});
  res.send({});
});

io.on('connection', function(socket){
  // user must send in a valid known token with the connection req
  if (!auth.authorizedSocket(socket)) { socket.disconnect() }
  // having the connection call for the starting info after react loads and is ready to receive
  socket.on('appLoad', function(msg) {
    const connOb = {
      githubEvents: githubEvents.events,
      githubMembers: githubMembers.members
    }
    socket.emit('startingEventList', connOb);
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});

// update events every minute, remove once webhooks work
setInterval(() => {
  githubEvents.fetch(() => {
    const connOb = {
      githubEvents: githubEvents.events,
      githubMembers: githubMembers.members
    }
    io.emit('updateEventList', connOb);
  })
}, 60000);

// remaining events
// ProjectCardEvent
// PullRequestReviewEvent - hook only?
