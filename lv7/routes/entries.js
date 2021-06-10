var Entry = require('../lib/entry');
const user = require('../lib/middleware/user');
const User = require('../lib/user');

//Dohvat objava
exports.list = function(req, res, next){
  var page = req.page;
  //Entry.getRange(0, -1, function(err, entries) {
  Entry.getRange(page.from, page.to, function(err, entries) {
    if (err) return next(err);   
    entries.forEach(e => {
      if(e.clanovi!==undefined)
      e.clanovi= e.clanovi.slice(0,-2)
    });
     
    
    res.render('entries', {
      title: 'Entries',
      entries: entries,
    });
  });
};


exports.archive = function(req,res){
  console.log(req.query.name) 
  entry = new Entry;
  entry.archive(req.query.name);
  res.redirect('/');

}


//Prikaz forme za unos objava
exports.form = function(req, res){
  res.render('post', { title: 'Objave'});
};

exports.formadd = function(req,res){
  let user = new User;
  user.getAll(function(usernames){
    console.log(usernames)
    res.render('dodajclana', {naziv:req.query.naziv, users:usernames })
  });  
}

exports.dodajclana = function(req,res){
  let entry = new Entry;
  entry.dodajclana(req.body.naziv,req.body.clan)
  res.redirect('/')
}

//Spremanje objava
exports.submit = function(req, res, next){
  var data = req.body;

  var entry = new Entry({
    "username": res.locals.user.name,
    "naziv": data.naziv,
    "opis": data.opis,
    "cijena": data.cijena,
    "obavljeno": data.obavljeno,
    "pocetak": data.pocetak,
    "zavrsetak": data.zavrsetak,
    "archived": 0,
    "clanovi": ""
  });

  console.log(entry)
  entry.save(function(err) {
    if (err) return next(err);
    if (req.remoteUser) {
      res.json({message: 'Entry added.'});
    } else {
      res.redirect('/');
    }
  });
};
