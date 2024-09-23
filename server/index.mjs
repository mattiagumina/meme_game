// imports
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import {check, validationResult} from 'express-validator';
import CONTROLLER from './controller.mjs';
import { getUser } from './dao/userDAO.mjs';

// Passport-related imports
import passport from 'passport';
import LocalStrategy from 'passport-local';
import session from 'express-session';

// init express
const app = new express();
const port = 3001;

// middleware
app.use(express.json());
app.use(morgan('dev'));
// set up and enable CORS
const corsOptions = {
  origin: 'http://localhost:5173',
  optionsSuccessStatus: 200,
  credentials: true
};
app.use(cors(corsOptions));

// Passport: set up local strategy
passport.use(new LocalStrategy(async function verify(username, password, cb) {
  const user = await getUser(username, password);
  if(!user)
    return cb(null, false, 'Incorrect username or password.');
    
  return cb(null, user);
}));

passport.serializeUser(function (user, cb) {
  cb(null, user);
});

passport.deserializeUser(function (user, cb) { // this user is id + username + name
  return cb(null, user);
});

const isLoggedIn = (req, res, next) => {
  if(req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({error: 'Not authorized'});
}

app.use(session({
  secret: "shhhhh... this is Mattia's secret!",
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.authenticate('session'));

// Serving Static Requests
app.use(express.static("public"));

/* ROUTES */

// GET MEME (if logged 3 memes, otherwise only 1 meme)
// GET /api/memes
app.get("/api/startGame",
  (req, res) => {
    CONTROLLER.CgetRandomMemes(req.user)
      .then(memes => res.json(memes))
      .catch(_ => res.status(500).end());
  }
)

// GET CAPTIONS (not require login)
// receive as body parameter the id of the 2 correct captions
// returns an array of 7 captions (that includes the 2 correts and 5 random)
// GET /api/captions
app.get("/api/startRound/:memeId",
  check("memeId").isInt(),
  (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
      return res.status(422).json({errors: errors.array()});
    }
    CONTROLLER.CgetRandomCaptions(req.params.memeId)
      .then(captions => res.json(captions))
      .catch(err => {
        if(err.customCode)
          res.status(err.customCode).json(err);
        else
          res.status(500).end();
      });
  }
)

// POST round
app.post("/api/endRound/:memeId",
  check("memeId").isInt(),
  check("captionOptions").isArray(),
  (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
      return res.status(422).json({errors: errors.array()});
    }
    CONTROLLER.CcheckCaptionCorrect(req.params.memeId, req.body.captionOptions, req.body.captionSelected)
      .then(result => res.json(result))
      .catch(err => {
        if(err.customCode)
          res.status(err.customCode).json(err);
        else
          res.status(500).end();
      });
  }
)

// POST GAME (require login)
// store the game (with its rounds) in the db
app.post("/api/games",
  isLoggedIn,
  check("rounds").isArray(),
  (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
      return res.status(422).json({errors: errors.array()});
    }
    CONTROLLER.CstoreGame(req.user.id, req.body.rounds)
      .then(gameId => res.json({gameId: gameId}))
      .catch(err => {
        if(err.customCode)
          res.status(err.customCode).json(err);
        else
          res.status(500).end();
      })
  }
)

// GET GAMES (require login)
// returns an array of all games played by the user who did the request
app.get("/api/games",
  isLoggedIn,
  (req, res) => {
    CONTROLLER.CgetGames(req.user.id)
      .then(games => res.json(games))
      .catch(_ => res.status(500).end());
  }
)

// GET ROUNDS (require login)
// return an array containing the 3 rounds of a game
app.get("/api/games/:gameId/rounds",
  isLoggedIn,
  check("gameId").isInt(),
  (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
      return res.status(422).json({errors: errors.array()});
    }
    CONTROLLER.CgetGameRounds(req.user.id, req.params.gameId)
      .then(rounds => res.json(rounds))
      .catch(err => {
        if(err.customCode)
          res.status(err.customCode).json(err);
        else
          res.status(500).end();
      });
  }
)

// POST /api/sessions
app.post('/api/sessions', function(req, res, next) {
  passport.authenticate('local', (err, user, info) => {
    if (err)
      return next(err);
      if (!user) {
        // display wrong login messages
        return res.status(401).send(info);
      }
      // success, perform the login
      req.login(user, (err) => {
        if (err)
          return next(err);
        
        // req.user contains the authenticated user, we send all the user info back
        return res.status(201).json(req.user);
      });
  })(req, res, next);
});

// GET /api/sessions/current
app.get('/api/sessions/current', (req, res) => {
  if(req.isAuthenticated()) {
    res.json(req.user);}
  else
    res.status(401).json({error: 'Not authenticated'});
});

// DELETE /api/session/current
app.delete('/api/sessions/current', (req, res) => {
  req.logout(() => {
    res.end();
  });
});

// activate the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});