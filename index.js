var express = require('express'); //require為使用那些模組
var mongodb = require('mongodb'); //使用模組mongodb
var app = express(); //建立express實體，將express初始化，去NEW一個express，變數app才是重點。

var mongodbURL =
'mongodb://sandy1209:a0919493100@ds125021.mlab.com:25021/sandy1209'; //將MongoDB的位置在Server程式碼中以一個變數儲存

var myDB; //建立一個全域變數myDB
mongodb.MongoClient.connect(mongodbURL, function(err, db){ //使用mongodb.MongoClient的方法connect()進行連線
	if(err){                                               //事件監聽器用在非同步程式碼，不確定何時會用到
		console.log(err);                                  //若回傳的參數有error，用console.log()印出錯誤內容
	} else{
		myDB = db;                                         //在mongoDB成功連線後，留住db物件
		console.log('connection success');                 //若沒有錯誤表示連線成功，印出connection success
	}
});

app.get('/', function(request, response){ //app.get就是幫你做路由(分辨做哪種事情，類似事件監聽器 ex:新增資料、查詢資料、刪除資料、修改資料)。
	response.status(200).send('<html><body><H1>Hello World</H1></body></html>'); // 200為http通訊協定 表示連線成功
	response.end(); //end為回傳給使用者
});

app.get('/api/test', function(request, response){ //連接到/api/test才會做的事情，request帶有連接進來的資訊(參數)，response為回傳的內容。
	var collection = myDB.collection('sandy'); //使用myDB的方法collection('data')取得data這個collection
	collection.find({}).toArray(function(err, docs){ //使用collection的方法find()取得資料表內的內容，{}表示取得全部內容
		if(err){                                     //使用toArray()將資料轉成陣列，function的docs是轉成陣列後的結果
			response.status(406).end();              //轉陣列過程若有err，回傳給錯誤碼406，此為Http協定狀態碼      
		} else{                                      //.end()為將資料回傳給使用者
			response.type('application/json');       //沒有錯誤回傳狀態碼200並附帶著資料，因為MongoDB存的資料就是JSON，所以不用特別轉換
			response.status(200).send(docs);
			response.end();
		}
   });
});

var server = app.listen(process.env.PORT || 8080, function() {
  var port = server.address().port;
  console.log("App now running on port", port);
});



