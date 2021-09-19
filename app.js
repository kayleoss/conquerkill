var express = require('express'),
    app = express(),
    mongoose = require('mongoose'),
    passport = require('passport'),
    LocalStrategy = require('passport-local'),
    passportLocalMongoose = require('passport-local-mongoose'),
    bodyParse = require('body-parser'),
    User = require('./models/user'),
    Result = require('./models/results');


app.set('view engine','ejs');
app.use(express.static('public'));
app.use(bodyParse.urlencoded({extended:true}));
app.use(require('express-session')({
  secret:'Cats secretly like Dogs',
  resave: false,
  saveUninitialized: false
 }))
 app.use(passport.initialize());
 app.use(passport.session());
 passport.use(new LocalStrategy(User.authenticate()));
 passport.serializeUser(User.serializeUser());
 passport.deserializeUser(User.deserializeUser());
 app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.Username = User.username;
    next();
 });
//mongoose.connect('mongodb://localhost/game');
mongoose.connect('mongodb://kayleoss:paass4@ds135876.mlab.com:35876/game');
//MAIN ROUTES ====== >
app.get('/', (req, res) => {
  res.render('home');
});
app.get('/howtoplay', function(req, res){
  res.render('howtoplay');
});
app.get('/train', isLoggedIn, function(req, res){
  res.render('train');
});
app.get('/train/:animal', isLoggedIn, function(req, res){
  var currentUser = req.user;
  currentUser.luck= Math.floor(Math.random() * 9 + 1);
  var animal = req.params.animal;
  var animal_luck = Math.floor(Math.random() * 9 + 1);
  console.log( currentUser.luck + ' : ' + animal_luck);

  if (animal == 'lion'){
        if(animal_luck > currentUser.luck){
          var result = 'The ' + animal + ' defeated you.';
          res.render('training_result', {result: result, animal:animal});
        }else if(animal_luck < currentUser.luck){
          var result = 'You defeated the ' + animal + ' and gained 10 coins and 0.25 attack!';
          currentUser.attack += 0.25;
          currentUser.coins += 10;
          currentUser.save();
          res.render('training_result', {result: result, animal:animal});
        }else{
          var result = 'The ' + animal + ' ran away before you could fight it.'
          res.render('training_result', {result: result, animal:animal});
        };
  }else if (animal == 'elephant'){
          if(animal_luck > currentUser.luck){
            var result = 'The ' + animal + ' defeated you.';
            res.render('training_result', {result: result, animal:animal});
          }else if(animal_luck < currentUser.luck){
            var result = 'You defeated the ' + animal + ' and gained 10 coins and 0.25 defense!';
            currentUser.defense += 0.25;
            currentUser.coins += 10;
            currentUser.save();
            res.render('training_result', {result: result, animal:animal});
          }else{
            var result = 'The ' + animal + ' ran away before you could fight it.'
            res.render('training_result', {result: result, animal:animal});
          };
  }else{
    res.redirect('/train');
  }
});
app.get('/shop', function(req, res){
  res.render('shop');
});
app.get('/shop/:item', isLoggedIn, function(req, res){
  var item = req.params.item;
  switch (item){
    case 'silvershield':
      if (req.user.coins >= 1000){
        req.user.coins -= 1000;
        req.user.defense = 0;
        req.user.weapons.set(1, 'silver shield');
        req.user.defense += 15;
        req.user.save();
        res.redirect('/userhome');
      }else{
        res.render('purchase_failed');
      };
      break;
      case 'strongholdshield':
        if(req.user.coins >= 2000){
          req.user.coins -= 2000;
          req.user.defense = 0;
          req.user.weapons.set(1, 'stronghold shield');
          req.user.defense += 25;
          req.user.save();
          res.redirect('/userhome');
        }else{
          res.render('purchase_failed');
        }
        break;
        case 'dranikshield':
        if(req.user.coins >= 3000){
          req.user.coins -= 3000;
          req.user.defense = 0;
          req.user.defense += 35;
          req.user.weapons.set(1, 'dranik shield');
          req.user.save();
          res.redirect('/userhome');
        }else{
          res.render('purchase_failed');
        }
        break;
        case 'euphronosshield':
        if(req.user.coins >= 10000){
          req.user.coins -= 10000;
          req.user.defense = 0;
          req.user.defense += 50;
          req.user.weapons.set(1, 'euphronos shield');
          req.user.save();
          res.redirect('/userhome');
        }else{
          res.render('purchase_failed');
        }
        break;
        //weapons[0]
        case 'maceofeuphronos':
        if(req.user.coins >= 1000){
          req.user.coins -= 1000;
          req.user.attack = 0;
          req.user.attack += 15;
          req.user.weapons.set(0, 'mace of euphronos');
          req.user.save();
          res.redirect('/userhome');
        }else{
          res.render('purchase_failed');
        }
        break;
        case 'swordofeuphronos':
        if(req.user.coins >= 2000){
          req.user.coins -= 2000;
          req.user.attack = 0;
          req.user.attack += 25;
          req.user.weapons.set(0, 'sword of euphronos');
          req.user.save();
          res.redirect('/userhome');
        }else{
          res.render('purchase_failed');
        }
        break;
        case 'dranikgreatsword':
        if(req.user.coins >= 3000){
          req.user.coins -= 3000;
          req.user.attack = 0;
          req.user.attack += 35;
          req.user.weapons.set(0, 'dranik greatsword');
          req.user.save();
          res.redirect('/userhome');
        }else{
          res.render('purchase_failed');
        }
        break;
        case 'swordofearth':
        if(req.user.coins >= 10000){
          req.user.coins -= 10000;
          req.user.attack = 0;
          req.user.attack += 50;
          req.user.weapons.set(0, 'greatsword of planet earth');
          req.user.save();
          res.redirect('/userhome');
        }else{
          res.render('purchase_failed');
        }
        break;
        default: 
        res.render('purchase_failed');
  }
});
app.get('/login', function(req, res){
  res.render('login');
});
app.get('/signup',function(req, res){
  res.render('signup');
})
app.get('/donate', function(req, res){
  res.render('donate');
})
app.get('/userhome', isLoggedIn, function(req, res){
  User.where('username').ne(req.user.username)
  .sort( { field : 'asc', _id: -1})
  .exec((err, foundUsers)=>{
      if(err){
          res.send(err);
      }else{
          Result.find()
          .sort({ field : 'asc', _id: -1})
          .exec((err, results)=>{
            if(err){
              res.send(err);
            }else{
              res.render('userhome', {foundUsers: foundUsers, results: results});
            };   
          }); 
      }
  })
});

//SignUp and LogIn Routes =====>
app.post('/signup', usernameToLowerCase, function(req, res){
  User.register(new User({
    username: req.body.username,
    email:req.body.email,
    gender: req.body.gender,
    score: 0,
    coins: 100,
    attack: 10,
    defense: 10,
    weapons: ['crappy sword', 'crappy shield'],
    luck: Math.floor(Math.random() * 9 + 1)
  }), req.body.password, function(err, user){
    if (err){
     console.log(err);
     return res.render('home');
    }else{
     passport.authenticate('local')(req, res, function(){
      console.log('Signed Up');
      res.redirect('/userhome');
     });
    };
   });
});

app.post('/login', usernameToLowerCase, passport.authenticate('local', {
   successRedirect: '/userhome',
   failureRedirect: '/login'
}), function(req, res){
});
app.get('/logout',
  function(req, res){
    req.logout();
    res.redirect('/');
});
//fight routes =======================>>>>
app.get('/fight/:id', isLoggedIn,  function(req, res){
  User.findById(req.params.id, function(err, thisUser){
    if (err){
      console.log(err);
      res.send('there was a problem');
    }else{
      var finalresult= {};
      var otherUser = thisUser;
      var otherUser_total = otherUser.attack + otherUser.defense + otherUser.luck;
      var currentUser = req.user;
      var your_total = currentUser.attack + currentUser.defense + currentUser.luck;
      console.log(otherUser_total + ' ' + your_total);

      if (otherUser_total > your_total){
        otherUser.coins += 50;
        otherUser.score += 1;
        currentUser.coins -= 50;
        currentUser.score -= 1;
        otherUser.luck = Math.floor(Math.random() * 9 + 1);
        currentUser.luck=Math.floor(Math.random() * 9 + 1);
        otherUser.save();
        currentUser.save();
        finalresult = {
          currentUser: currentUser.username,
          otherUser: otherUser.username,
          winner: otherUser.username.toString(),
          loser:  currentUser.username.toString(),
          verdict: 'lost!'
        }
      }else if(otherUser_total < your_total){
        currentUser.coins += 50;
        currentUser.score += 1;
        otherUser.coins -= 50;
        otherUser.score -= 1;
        otherUser.luck = Math.floor(Math.random() * 9 + 1);
        currentUser.luck=Math.floor(Math.random() * 9 + 1);
        otherUser.save();
        currentUser.save();
        finalresult = {
          currentUser: currentUser.username,
          otherUser: otherUser.username,
          winner: currentUser.username.toString(),
          loser: otherUser.username.toString(),
          verdict: 'won!'
        } 
      }else{
        otherUser.luck = Math.floor(Math.random() * 9 + 1);
        currentUser.luck=Math.floor(Math.random() * 9 + 1);
        otherUser.save();
        currentUser.save();
        finalresult = {
          currentUser: currentUser.username,
          otherUser: otherUser.username,
          winner: currentUser.username.toString(),
          loser: otherUser.username.toString(),
          verdict: 'tied!'
        }
      }
  
      Result.create( finalresult , function(err, result){
        if (err){
          console.log(err);
        }else{
          res.render('fight', {results: result});
        }
      }); 
    }
  }); 
});


function isLoggedIn(req, res, next){
  if (req.isAuthenticated()){
        return next();
  }
  res.redirect('/login');
 }


 function usernameToLowerCase(req, res, next){
   req.body.username = req.body.username.toLowerCase();
   next();
 };

app.listen(process.env.PORT || 3000, process.env.IP, ()=> {
  console.log('======== Game Is Running! =========')
})
