//Stvaranje Redic klijenta
var redis = require('redis');
var db = redis.createClient();

//Izvoz funkcije Entry iz modula
module.exports = Entry;

//Iteracija kroz objekt sa podacima
function Entry(obj) {
  for (var key in obj) {
    this[key] = obj[key];
  }
}

//Pretvara podatke u JSON i sprema u Redic bazu podataka
Entry.prototype.save = function(fn){
  var entryJSON = JSON.stringify(this);
  db.lpush(
    'entries',
    entryJSON,
    function(err) {
      if (err) return fn(err);
      fn();
    }
  );
};

Entry.prototype.archive = function (name){     
  toChange = null;
  db.lrange('entries', -100, 100, function(err, items){    
    items.forEach(function(item){
      item = JSON.parse(item)      
      if(item.naziv===name){        
        toChange = item;        
      }
    });
    if(toChange !=null){
      db.lrem('entries',100,JSON.stringify(toChange), function(){
        toChange.archived = 1;
        db.lpush(
          'entries',
          JSON.stringify(toChange)         
        );
      });
    }  });
}

Entry.prototype.dodajclana= function(name,clan){
  toChange = null;
  db.lrange('entries', -100, 100, function(err, items){    
    items.forEach(function(item){
      item = JSON.parse(item)      
      if(item.naziv===name){        
        toChange = item;        
      }
    });
    if(toChange !=null){
      db.lrem('entries',100,JSON.stringify(toChange), function(){
        toChange.clanovi = toChange.clanovi + clan + ", "
        console.log(toChange, "novi zapis")
        db.lpush(
          'entries',
          JSON.stringify(toChange)         
        );
      });
    }  });
}

//Funkcija koja dohva�a unose iz baze podataka
Entry.getRange = function(from, to, fn){
  db.lrange('entries', from, to, function(err, items){
    if (err) return fn(err);
    var entries = [];

    items.forEach(function(item){
      entries.push(JSON.parse(item));
    });

    fn(null, entries);
  });
};

//Funkcija koja vra�a broj unosa u bazi
Entry.count = function(fn){
  db.llen('entries', fn);
};
