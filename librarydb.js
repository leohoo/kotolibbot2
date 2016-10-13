var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'orchard',
  user     : 'library',
  password : 'kotolib',
  database : 'library'
});

connection.connect();

process.stdin.setEncoding('utf8');

var input = "";
process.stdin.on('readable', () => {
  var chunk = process.stdin.read();
  if (chunk !== null) {
    input += chunk;
  }
});

process.stdin.on('end', () => {
  process.stdout.write(input + "\n");
  json = JSON.parse(input);
  books = json.books;
  for(i=0; i<books.length; i++){
    process.stdout.write(`barcode: ${books[i]["バーコード番号"]}, title: ${books[i]["タイトル"]}, checkout: ${books[i]["貸出日"]}, due: ${books[i]["返却期限日"]}\n`);

    connection.query(`call addbook('${json.card}', '${books[i]["バーコード番号"]}', '${books[i]["タイトル"]}', '${books[i]["貸出日"]}', '${books[i]["返却期限日"]}')`);
  }
  connection.end();
});
