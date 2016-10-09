var casper = require('casper').create({
  clientScripts: 'jquery.tabletojson.js',
  verbose: true,
  // logLevel: 'debug'
});
// const util = require('util');
// const util = require('/usr/local/lib/node_modules/util/util.js');

var cardno = casper.cli.raw.get("cardno");
var passwd = casper.cli.raw.get("passwd");

casper.start('https://www.koto-lib.tokyo.jp/opw/OPW/OPWUSER.CSP?DB=LIB');
casper.userAgent("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.116 Safari/537.36");

casper.then(function() {
  this.waitForSelector("input[name='usercardno']", function() {
    // casper.echo("fill form: " + cardno + "/" + passwd);
    casper.evaluate(function(user, pass){
      document.querySelector('input[name=usercardno]').value = user;
      document.querySelector('input[name=userpasswd]').value = pass;
    }, cardno, passwd);
  });
});

casper.thenClick('input[type=submit]', function() {
  casper.waitWhileVisible('input[name=usercardno]', function(){
    casper.capture("logged-in.png");
  });
});

var table;

casper.then(function(){
   table = this.evaluate(function() {
    t = document.querySelector("form[name=FormLEND] table:nth-of-type(2)");
    json = $(t).tableToJSON();
    r = [];
    for(i=0; i<json.length; i++) {
      if(!!json[i]["No."]) {
        r.push(json[i]);
      }
    }
    return r;
  });
  casper.echo(JSON.stringify(table));
/*
  for(var i=0; i<table.length; i++){
    casper.echo(util.format("barcode: %s, title: %s, checkout: %s, due: %s",
      table[i]["バーコード番号"], table[i]["タイトル"], table[i]["貸出日"], table[i]["返却期限日"]));
  }*/
});

casper.run();
