/////////--Ликбез--/////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////
// ‘сonst’ — это признак того, что идентификатор не будет переприсвоен.								//
//																									//
// ‘let’ — это признак переменной, которая может быть переприсвоена,								//
//   как счетчик цикла или значение в математическом алгоритме. Также это признак того,				//
//   что переменная используется только в том блоке, в котором она определена, 						//
//	 а не во всей функции.																			//
//																									//
// ‘var’ — это самый слабый признак переменной в JavaScript.										//
//   Такая переменная может переприсваиваться или не переприсваиваться,								//
//   может использоваться как в блоке, так и во всей функции.										//
//																									//
// Особенность!!!																						//
//  let и const всегда нужно инициировать перед использованием										//
/////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////

const express = require('express'); // Стандартный  фреймворк для веб-разработки
const bodyParser = require('body-parser'); // Парсинг тела входящего запроса
const app = express();
const TelegramBot = require('./my_modules/TelegramBot'); // Кастомный модуль для отправки и редактирования сообщений и фото в Телеграм, с методами "Msg" и "SendPhoto" и др...
const leankit = require('./my_modules/leankit'); // Кастомный модуль для отправки и редактирования сообщений и фото в Телеграм, с методами "Msg" и "SendPhoto" и др...
var async = require('async');
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({limit: "300mb"}));
app.use(bodyParser.urlencoded({limit: "300mb", extended: true, parameterLimit:50000}));
// Add headers
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});


    //---------------------------------------------------------------- Подключение к mySQL
	var mysql = require("mysql")
    var mysqlConfig = {
        host: "localhost",
        user: "root",
        password: "gaguata03",
        database: '1c_database',
        multipleStatements: true

    }
    var connectToDB = function() {
        con = mysql.createConnection(mysqlConfig);
        con.connect(function(err) {
            if (err) {
                console.log('error with connection: ', err)
                setTimeout(connectToDB(), 2000)
            }
            console.log("Connected!");
            con.on('error', function(err) {
                if (err.code === 'PROTOCOL_CONNECTION_LOST') {
                    connectToDB()
                } else {
                    throw err
                }
            })

        });
    }
    connectToDB()
    //----------------------------------------------------------------

function querySql(sql){
    var query = con.query(sql, function(err, rows, fields) {
        if (err) { //throw err;
            console.log("err: ", err);
        };
        var a = JSON.stringify(rows);
        var json = JSON.parse(a);
        var k = json.length;
        console.log('json',json[0].firstname,'k= ',k);	
		return json[0].firstname;
	})
}


//Обработка входящих POST запросов от API.AI, 1С-тестово
app.post('/echo', function(req, res) {

	//Тело пришедшего пост запроса
    	console.log("req action+\n--------------------------------------------------------------------------------",req.body);
    //Инфо о сообщении с Телеграм
   		 //console.log("Data+\n--------------------------------------------------------------------------------",req.body.originalRequest && req.body.originalRequest.data.message);
    //Ответ на пост запрос
		//console.log("response-\n--------------------------------------------------------------------------------",res.body);
    //Инфо активированного интента
    	//console.log("intentName: ", req.body.result && req.body.result.metadata.intentName , "fulfillment speech: ", req.body.result && req.body.result.fulfillment.speech)

	//Переменная, хранящая тело ответа для АИ
    var jsonbody = {};
    var action = req.body && req.body.result && req.body.result.action;
    var ToUser = req.body.originalRequest && req.body.originalRequest.data.message.chat.id; 

    if (action == undefined){

    	action = "";
    }

    //Проверяем на значение действий интентов из запроса API AI
    //-------------------------------------------------------//

    //Добавление карточки Leankit
    if(req.body.result && req.body.result.action == "AddCard"){
    	 // zapros = addCard("рандом");
    	 jsonbody = {
			"followupEvent": {
      	 		"name": "SayHi"//,intentName == "Adding a card" 
      		 }
    	 };
    //Из Ангулара пост регистрация логин и тп
    }else if(action  == "login"){
    	var data = req.body.result.data;
    	var email = data.email
    	var password = data.passw

			// `select firstname from tbl_user
			// Where`
		var a;
		//Скачать модуль асинх !!!----------------
		async.series([
			function (callback){
			    var query = con.query(`SELECT * FROM tbl_user WHERE email = '${email}' AND password = '${password}'`, function(err, rows, fields) {
			        if (err) { console.log("err: ", err); callback(err,null)
			        }else{//throw err; 
			        	if(rows.length !== 0){
				        	//console.log('From mySQL: ', rows)
				        	var json = JSON.parse(JSON.stringify(rows));
							callback(null, json)
						}else{
							var error = 'Нет строк из mySQL с указанными реквизитами'
							callback(error,null)
						}
					}
				})
			}], function (err, results) {
				//console.log(results)
				//console.log('err   ',err)
				if(!err){
					var username  = results[0][0].firstname // [ [ { firstname: 'Alexandr' } ] ]
					console.log(username); 

					jsonbody ={
				        login: true,
				        displayText: ':)',
				        source: 'server',
				        username: username,
				        userid: results[0][0].id
		     	 	}    
		      	}else{
	 	     		console.log('func err: ',err)
					jsonbody ={
						login: false,
				        speech: "Неудача, попробуйте еще раз",
				        displayText: ':(',
				        source: 'server',
		     	 	}  
		      	}		
		     	res.json(jsonbody)
			});
		//--------------------Пример использования





					// jsonbody ={
				 //        speech: "Неудача, попробуйте еще раз",
				 //        displayText: password,
				 //        source: 'server',
		   //   	 	}
		//console.log('username',username)




		 

     // Посылаем анимацию(документ) в Telegram
    }else if(action  == "gif"){
    	var Document = 'C:/Program Files/nodejs/myanimate.gif'
	  	 TelegramBot.sendDocument(ToUser,Document);
   	// Выгрузка/обновление номенклатуры, цен, остатков
    }else if(req.body.result  == "ObnovlenieBasy"){

        nomenclatureToSQLUpload(req.body.ReplyData, req.body.trigger)
		jsonbody ={
		    speech: "uspeh!",
		    displayText: 'resultOfquery',
		    source: 'EVX web service',
		}

    // Запрос к вебсерсису 1С. Ключ к определеной процедуре создается в API.AI и вызывается интент из Telegram
    }else if(action == "VypolnitZaprosK1C" || (action.indexOf('VypolnitZaprosK1C') + 1)){
    	var keyTo1C = action.substring(action.indexOf('-')+1,action.length);
    	console.log('key to 1C: ',action.substring(action.indexOf('-')+1,action.length));

		zapros = "Запрос отправлен";
		let ToUser = req.body.originalRequest && req.body.originalRequest.data.message.chat.id; 
		Inquiry11C(keyTo1C,ToUser);

		// В командной строке вызываем PhantomJS и исполняем скрипт rasterize, делая скриншот странички с таблицей/графиком
		//cmdRasterize(ToUser);

    	 jsonbody = {
         speech: zapros,
         displayText: zapros,
         source: 'leankit',
    	 };
    
    // Интент добавления карточки с функцией 'slot-filling'. Проверка на незаконченность интента
    }else if(req.body.result && req.body.result.metadata && req.body.result.metadata.intentName == "Adding a card" && req.body.result.actionIncomplete == false){
		zapros = "---";
		console.log("Достаем инфу: \n" , req.body);
		let NameOfCard = req.body.result.parameters.NameofCard;
		let LaneId = req.body.result.parameters.NameLine;
		console.log("Достали ину :",NameOfCard, LaneId);
    	 zapros = leankit.addCard(NameOfCard,LaneId); // Id линии и название карточки
		 jsonbody ={
         speech: zapros,
         displayText: zapros,
         source: 'leankit',
     	 }
    // Первое условие 'slot-filling'
    }else if(req.body.result && req.body.result.metadata.intentName == "Adding a card" && req.body.result.fulfillment.speech == 'Задайте имя карточки!'){
    // Второе условие 'slot-filling'. Имя задано - второе условие предустановленное в АИ сообщение получателю. Вызываем соответствующую функцию
    }else if(req.body.result && req.body.result.metadata.intentName == "Adding a card" && req.body.result.fulfillment.speech == 'Выберите её позицию'){

     	//var Msg ="O'k";
     	//Устанавливаем ID пользователя, который отправил сообщение
     	let Id = req.body.originalRequest && req.body.originalRequest.data.message.chat.id; 
     	//Функция, запрашивающая данные о линиях с Leankit'a и отправляющая клавиатуру с выбором линий получателю Телеграмм'а
     	GetBoardIdentifiersPosylaemLiniiVTelegramRnopkami(Id);
    // Проверка параметров интента на определенные значения 'slot-filling'
    }else if(req.body.result && req.body.result.parameters.Otvet  == "Да" || req.body.result && req.body.result.parameters.Otvet  == "Нет"){
    	let text;
    	//ID входящего сообщения
    	let MsgId = req.body.originalRequest.data.callback_query.message.message_id;
    	//ID пользователя
    	let ChatId = req.body.originalRequest.data.callback_query.message.chat.id; 

    	//Проверка колбэка от инлайн клавиатуры
    	//let callback_query = req.body.originalRequest.data.callback_query; 
    	//console.log('callback_query', callback_query);

	     if(req.body.result && req.body.result.parameters.Otvet  == "Да"){

	     	text = "Запрос обрабатывается";
			Inquiry11C("Dolgi",ChatId);
	     }else{
	     	text = "Запрос отклонен";
	     }


	     //Удаляем сообщение с инлайн клавиатурой
	     TelegramBot.DeleteMessage(ChatId,MsgId);
	     //Переменная, которая отправляется ответом на запрос АИ в Телеграм
	     jsonbody = {
	         speech: text,
	         displayText: "zapros",
	         source: 'evxSrv',
    	 };

     	//}, 500);

    // Запрос из 1С обработка 'Тест1'
    }else if(req.body.KomandaIz1C  == "PodpisatiDokument"){
	     zapros = "Запрос принят";
		 jsonbody ={
	         speech: zapros,
	         displayText: zapros,
	         source: 'Server EVX',
     	 }
     	 
     	 //Нужно вызвать ивент, чтобы ответ на вопрос был распознан "slot-filling"
     	 //Ивент и интент отправят вопрос в телеграм
     	 //Посылаем инлайн клавиатуру, имеющая колбэк текст, который будет распознан АИ в предустановленом интенте. 
		 let markup = {  "inline_keyboard": [[{"text":"Да","callback_data":"КНПДда"},{"text":"Нет","callback_data":"КНПДнет"}]]};
		 TelegramBot.Msg('Подписать документ?;',378720720,markup);

	//Интент не обработан сервером
	}else{
    	 zapros = "Интент не обработан сервером (стандартный ответ)";
		 jsonbody ={
	         speech: zapros,
	         displayText: zapros,
	         source: 'leankit',
     	 }
    }

    //return res.json(jsonbody);
        //Или вместо этого - вызов события, которое запускает Интент ==========
	    //      "followupEvent": {
	    //   	 "name": "SayHi"//,
	    //		//Отправка любых данных?
	    //   	// "data": {
	    //    //   	"<parameter_name>": "<parameter_value>"
	    //   	 //}
	    // }
	     //     "data": {telegram: 'привет ,бро!'}
    	//}
	});//app.post...
app.post('/addToCart', function(req, res){

	var user_id = req.body.result.data.user_id
	var nom_id = req.body.result.data.nom_id
	var sklad_id = req.body.result.data.sklad_id
	var count = req.body.result.data.count
	var price_type = req.body.result.data.price_type
	var currency = req.body.result.data.currency

	var values = '(\'' + user_id + '\',\'' + nom_id + '\',\'' + sklad_id + '\',\'' + count + '\',\'' + price_type + '\',\'' + currency + '\'); show warnings'
	
	console.log('values:',values)
	var sql = `
		INSERT IGNORE INTO tbl_order(user_id, nom_id, sklad, count, price_type, currency)
		VALUES
			${values}
	`
    var query = con.query(sql, function(err, rows, fields) {
        if (err) { //throw err;
            console.log("err: ", err);
        };
        var a = JSON.stringify(rows);
        var json = JSON.parse(a);
        var k = json.length;
        console.log(json);
        res.json(json);
        //resp.send(rows);
    });	
})
app.get('/getTestAngular', function(req, res) {
	console.log("getTestAngular",req.query.Param)
	var Param = req.query.Param;

	if(1==1){	


	    // var xxx = {
	    // 	author:'27',
	    // 	title:'cream for face',
	    // 	sum:'299'
	    // };
	        //console.log(req);
	        var sql = `
				SELECT nom.id, nom.elem , tbl_amount.number, tbl_sklad.name as sklad,tbl_sklad.id as sklad_id, tbl_price.price, tbl_price.currency, tbl_price.edizm 
				FROM tbl_nomenclature AS nom, tbl_amount, tbl_sklad, tbl_price  
				WHERE
					nom.elem like '%${ Param }%'
				AND
					nom.id = tbl_amount.id_nom
				AND
					tbl_amount.id_sklad = tbl_sklad.id
				AND
					tbl_price.id_nom = nom.id
				AND
					tbl_price.id_price_type = '1'  
				Limit 100      
		`
		//console.log(sql)
	        var query = con.query(sql, function(err, rows, fields) {
	            if (err) { //throw err;
	                console.log("err: ", err);
	            };
	            var a = JSON.stringify(rows);
	            var json = JSON.parse(a);
	            var k = json.length;
	            //console.log(json);
	            console.log("JSON ответотправлен");
	            // for (var i = 0; i < json.length; i++) {
	            //     if (json[i].Name == 'крем для рук') {
	            //         name = json[i].Name;
	            //         console.log(name, ' ', i);
	            //     }
	            // }
	            //console.log("Result: ", json, 'length: ',k);
	            //console.log('length: ',k);
	            res.json(json);
	            //resp.send(rows);
	        });
	}
    //res.json({ Response: 'You are connected. Congratulations!' });
});

app.get('/getRandom10', function(req, res) {

	var mysql = require("mysql")
    var mysqlConfig = {
        host: "localhost",
        user: "root",
        password: "gaguata03",
        database: '1c_database'
    }
    var connectToDB = function() {
        con = mysql.createConnection(mysqlConfig);
        con.connect(function(err) {
            if (err) {
                console.log('error with connection: ', err)
                setTimeout(connectToDB(), 2000)
            }
            console.log("Connected!");
            con.on('error', function(err) {
                if (err.code === 'PROTOCOL_CONNECTION_LOST') {
                    connectToDB()
                } else {
                    throw err
                }
            })

        });
    }
    connectToDB()
    var sql = `
		SELECT r1.id, r1.elem , tbl_amount.number, tbl_sklad.name as sklad, tbl_price.price, tbl_price.currency, tbl_price.edizm 
		FROM tbl_nomenclature AS r1, tbl_amount, tbl_sklad, tbl_price  
		JOIN (SELECT CEIL(RAND() *  (SELECT MAX(id)  FROM tbl_nomenclature)) AS id) AS r2  WHERE r1.id >= r2.id  
		AND 
			r1.id = tbl_amount.id_nom 
		AND
			tbl_amount.id_sklad = tbl_sklad.id 
		AND
			tbl_price.id_nom = r1.id
		AND
			tbl_price.id_price_type = '1'
		    
		ORDER BY r1.id ASC  LIMIT 10    
	`

    var query = con.query(sql, function(err, rows, fields) {
        if (err) { //throw err;
            console.log("err: ", err);
        };
        var a = JSON.stringify(rows);
        var json = JSON.parse(a);
        var k = json.length;
        console.log(json);
        res.json(json);
        //resp.send(rows);
    });
    //res.json({ Response: 'You are connected. Congratulations!' });
});

app.get('/getToCart', function(req, res) {
	var user_id = req.query.user_id;
	var price_type = req.query.price_type;
	console.log('user id: ', user_id, 'price type: ', price_type);
    var sql = `
		SELECT nom_id, tbl_nomenclature.elem as nom, sklad as sklad_id, tbl_sklad.name as sklad, count, price_type as price_type_id, tbl_price_type.elem as price_type, currency 
		FROM tbl_order,tbl_nomenclature,tbl_sklad,tbl_price_type
		WHERE user_id = ${user_id}
		AND   nom_id = tbl_nomenclature.id
		AND   tbl_order.sklad = tbl_sklad.id
		AND   tbl_price_type.id = ${price_type}
	`
    var query = con.query(sql, function(err, rows, fields) {
        if (err) { //throw err;
            console.log("err: ", err);
        };
		var json = JSON.parse(JSON.stringify(rows));
        console.log('json ',json);
        console.log("JSON ответотправлен");
        res.json(json);
        //res.send(rows);
    });

})
const server = app.listen(process.env.PORT || 80, () => {
    console.log('Express server listening on port %d in %s mode', server.address().port, app.settings.env);
});


//========================================================= Qquery to 1C =========================================================
//Получаем данные, рендерим график

function Inquiry11C(pParam,ToUser){
	console.log('pParam',pParam);
	//client.setSecurity(new soap.BasicAuthSecurity('User', 'gaguata03'));
	//pParam="Dolgi";
	var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;  // npm install xmlhttprequest
	var xhr = new XMLHttpRequest();

	// создаём соединение типа POST, второй параметр - адрес, параметр true значит асинхронное, то есть браузер не будет ждать ответа сервера, 
	//а продолжит работу; далее пользователь и пароль с правами на операцию InputData (саму операцию можно выполнять в привилегированном режиме, чтобы не мучиться с правами)
	xhr.open('POST', 'http://188.237.141.56/TestWebOperation/ws/ServiceTG.1cws', true, "User", "gaguata03");
	xhr.onreadystatechange = function() {

             k=StausRequest(xhr,ToUser);

             // console.log("k^ ",k);
		// zapros = k;
		// //TelegramBot(zapros,ToUser);
		// //cmdRasterize(ToUser);
	};

	xhr.send(
		'<?xml version="1.0" encoding="UTF-8"?>'+
		 	'<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"> <soap:Header/> '+
			 	'<soap:Body>' +
			 	'<m:Operation xmlns:m="188.237.141.56/"> '+
				 	'<m:Param xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">'+
						 pParam + 
					'</m:Param> '+
			 	'</m:Operation>' +
			'</soap:Body>' +
		'</soap:Envelope>'
	);
}

function StausRequest(pXMLHTTP,ToUser){
	status = "";
	spisok = "";
	if (pXMLHTTP.readyState == 4) {
		if (pXMLHTTP.status != 200) {
			status = "Запрос завершился неудачно. Ответ сервера: " + pXMLHTTP.responseText;
		}
		else { 
			var l = RequestSuccessful(pXMLHTTP,ToUser);
			if (l!==undefined) {
				status = "Запрос отработан(Долги).";
				//k=l;
				//console.log(status,"ddddddd ",k);
			}
			else {
				status = "Запрос был отклонён.";
				//console.log(status, "dddd");
				
			};
			
		};
	};
	// console.log('status',status);
	return l;
}

function RequestSuccessful(pXMLHTTP,ToUser) {
	//dom = pXMLHTTP.responseXML;
	var stringData = "";
	//Получаем ответ в текстовом формате
	var responseText = pXMLHTTP.responseText;

	//Наш JSON ответ из 1С приходит в xml в теге response. Находим наш JSON ответ по входящим символам {}
	var OMGitsJSON = "{" + responseText.substring(responseText.indexOf("ReplyData")-1, responseText.lastIndexOf("}")) +"}";
	var d = responseText.substring(responseText.indexOf("{")-1, responseText.lastIndexOf("}"))
	//console.log("Ура, наш JSON: ", OMGitsJSON);
	//console.log('d ',d,' OMGitsJSON ',OMGitsJSON);
	var parse = JSON.parse(OMGitsJSON);
		//alert(parse.ReplyData[1].Name);
	console.log('typeof ', typeof array);
	if (typeof parse.ReplyData !='string'){
		var array = parse.ReplyData;
		n=array.length;
		//n=array;
		for (var i = 0; i < n; i++) {

			spisok = spisok  + "Конт: " +array[i].Name + "  Долг:" + array[i].Summ +" \n";
			stringData = stringData + "{name:\'"+array[i].Name+"\',data:["+(-array[i].Summ)+"]},";
		}

		//Рендерим график
		highchartsRender(stringData,ToUser);
		console.log('Ответ 1С сервиса: ',array);
	}else{
		console.log('Ответ 1С сервиса else: ',parse.ReplyData);
		TelegramBot.Msg(parse.ReplyData,ToUser);
	}
	//console.log('responseText ',pXMLHTTP.responseText);
	return spisok;
}

//================================================================================================================================

function GetBoardIdentifiersPosylaemLiniiVTelegramRnopkami(Id) {
    var request1 = require('request');
    var request2 = require('request');
    var username = "evx.serv1@mail.ru";
    var password ="gaguata03";//https://evxserv1.leankit.com/kanban/api/boards/{boardId}


    var kolvoPush = 0;
	var y = [];
	var options1 = {
	  uri: 'https://evxserv1.leankit.com/kanban/api/board/447781401/GetBoardIdentifiers',
	  method: 'Get',
	  //headers: {               
	  //   'Authorization': 'Basic ' + new Buffer("evx.serv1@mail.ru:gaguata03").toString('base64')                  
	  // },
      auth: {
      user: username,    //we can auth wia auth or header :)
      password: password
	  }
	};

	request2(options1, function (error, response, body) {
	  if (!error && response.statusCode == 200) {
	    let rta1 = response.body;//.body.result.id;
	    var parse1 = JSON.parse(rta1);
	    var arrayOfLinesWithFullNames = parse1.ReplyData[0].Lanes;
		 //    arrayOfLinesWithFullNamesID = parse1.ReplyData[0].Lanes.Id;
		// console.log("arrayOfLinesWithFullNamesID1 ",arrayOfLinesWithFullNames);
	    var s=arrayOfLinesWithFullNames.length;
	    console.log('kolvo s GetBoardIdentifiers: ', s);
	//======================================================================
          var x = [];
          //var s;


          // var arrayOfLines;
          // var arrayOfLinesWithFullNames;
          var options = {
              uri: 'https://evxserv1.leankit.com/kanban/api/boards/447781401',
              method: 'Get',
              //headers: {
              //   'Authorization': 'Basic ' + new Buffer("evx.serv1@mail.ru:gaguata03").toString('base64')
              // },
              auth: {
                  user: username,    //we can auth wia auth or header :)
                  password: password
              }
          };

          var karta ="Запрос GetBoardIdentifiers";
          request1(options, function (error, response, body) {
              if (!error && response.statusCode == 200) {
                  let rta = response.body;//.body.result.id;
                  var parse = JSON.parse(rta);
                  var arrayOfLines = parse.ReplyData[0].Lanes;
                  // arrayOfLinesID = parse.ReplyData[0].Lanes.Id;
                  // console.log("arrayOfLinesID1 ",arrayOfLinesID);
                  var k=arrayOfLines.length;
                  console.log('kolvo s boards/447781401: ', k);
                  var s4etnull = 0;
                  var kolvoPush = 0;
                  for (var i = 0; i < k; i++) {
                      //console.log("full name: ",arrayOfLinesWithFullNames[90].Name,"\n","Id: ",arrayOfLinesWithFullNames[90].Id);
                      var Name 			= arrayOfLines[i].Title;
                      //let ParentLaneId 	= arrayOfLines[i].ParentLaneId;
                      var ChildLaneIds	= arrayOfLines[i].ChildLaneIds[0];
                      var Idl 				= arrayOfLines[i].Id;
                      // ar.push(Id);
                      if(ChildLaneIds == undefined ){
                          //var a;
                          s4etnull++;
                          for (var j = 0; j < s; j++) {
                              var NameFull	= arrayOfLinesWithFullNames[j].Name;
                              var IdOfFull	= arrayOfLinesWithFullNames[j].Id;
                              //br.push(IdOfFull);
                              if(Idl == IdOfFull){
                                  let NameFullReplaceSymbol;;
                                  NameFullReplaceSymbol = NameFull.replace(/:/g, " -/- ");
                                  NameFullReplaceSymbol = NameFullReplaceSymbol.replace(/\(/g,"").replace(/\)/g,"");
                                  // {'value': '447870739', 'synonyms': [ '447870739', 'закрытие периода -/- надо' ] }
                                  toAPIAI  =  {'value':IdOfFull, 'synonyms':[IdOfFull, NameFullReplaceSymbol]}
                                  y.push(toAPIAI)
                                  x.push([NameFullReplaceSymbol]);
                                  //let entries = ["value": "Coffee Maker",]
                                  //x[j][0] = NameFull;
                                  kolvoPush++;
                                  //console.log("Полн Имя: ",NameFullReplaceSymbol, "Id",IdOfFull , ' ',kolvoPush);
                              }
                          }
                      }else{

                          console.log("Промах(родитель): ",arrayOfLinesWithFullNames[i].Name,"\n","Id: ",arrayOfLinesWithFullNames[i].Id, ' i :',i, ' Childs: ',ChildLaneIds[0]);
                          //s4etnull++;
                      }
                      //console.log("Nam: ",Name , "\n" ,"Id: ", Id, "\n "," *=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=") ;
                  }
                  console.log('parents dir: ',s4etnull)
                  toAI(y);
                  var markup = {  "keyboard": x,
                      "resize_keyboard":true,
                      "one_time_keyboard":true,
                  };
                  TelegramBot.Msg("из данного списка -> ",Id,markup);
                  //console.log("Differense: ", diff (ar, br)); // РАЗНИЦА В 8 ЛИНИЙ(В ОДНОМ ИЗ ЗАПРОСОС НЕ СЧИТАЮТСЯ БУДУЩИЕ РАБОТЫ И FIFNISHED)
                  //console.log("Количество линий для карточек: ", s4etnull, 'Всего: ',k) ;
                  //console.log("Количество линий для карточек:------ ",  'Всего: ',s) ;
              }else{
                  //console.log(response);
                  let rta = "Error: request1\n";
                  console.log(error,response.body);
                  //pogogdi(rta);
              }
              //console.log("body  ", response.body) ;
              // console.log("response  ", response) ;

          });

	//======================================================================
      }else{
	    //console.log(response);
	   let rta = "Error: request2\n";
	console.log(error,response.body);
	//pogogdi(rta);
	  }	})
} 

//Функция для использования PhantomJS модуля (Скриншот сайта) из коммандной строки
function cmdRasterize(ToUser){
	console.log(ToUser);
	var exec = require('child_process').exec;
	var cmd = 'phantomjs ./phantomjs_modules/rasterize.js http://188.237.141.56/ostatki.html?Param=Dolgi ExportDolgi.png';

	exec(cmd, function(error, stdout, stderr) {
	  // command output is in stdout
	if (error !=="null"){
	  	console.log("Ответ командной строки: " ,stdout);
	  	// По вызову данной колбэк функции, по окончанию рендеринга, отправляем изображение в Телеграм
	  	var Photo = 'ExportDolgi.png';
	  	TelegramBot.SendPhoto(ToUser,Photo);
	}else{
		console.log("Ошибка командной строки (рендеринг): " ,error) }
	});	    
}

function highchartsRender(stringData,ToUser) {
	var request1 = require('request');
	var options = {
		  uri: 'http://127.0.0.1:3003',
		  //uri : '19c5738d.ngrok.io',
		  method: 'POST',
		   headers: {           
		   "Content-Type": "application/json"   
		  //   'Authorization': 'Basic ' + new Buffer("evx.serv1@mail.ru:gaguata03").toString('base64')                  
		   },
		json: //js
	    
	      {
	      "infile": "{chart: {type: 'bar'},"+
	           " title: {"+
	                  "  text: '3Д график долгов контрагентов'"+
	             "   },"+
	        " subtitle: {"+
	                 " text: 'Текущее состояние по данным из 1С'"+
	             " },"+
	          " xAxis: {"+
	               " categories: ['Долги'],"+
	              "  labels: {"+
	                  "  rotation: -90,"+
	                   " style: {"+
	                        "fontSize: '18px',"+
	                      "  fontFamily: 'Verdana, sans-serif'"+
	                  "  }"+
	                "},"+
	             "   title: {"+
	                   " text: null"+
	               " }"+
	            "},"+
	                "yAxis: {"+
	                //"maxPadding: 1,"+
	               " min: 0,"+
	               " title: {"+
	                   " text: 'Молдавские леи',"+
	                    "align: 'high'"+
	               " },"+
	               " labels: {"+
	                    "overflow: 'justify'"+
	              "  }"+
	           " },"+
	          "  tooltip: {"+
	               " valueSuffix: ' millions'"+
	         "   },"+
	        "    plotOptions: {"+
	            "    bar: {"+
	                   " dataLabels: {"+
	                       " enabled: true"+
	                  "  }"+
	            "    }"+
	         "   },"+
	           " legend: {"+
	             "   layout: 'vertical',"+
	               " align: 'right',"+
	               " verticalAlign: 'top',"+
	               " x: -40,"+
	               " y: 70,"+
	              "  floating: false,"+
	               " borderWidth: 1,"+
	              "  backgroundColor: ((Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'),"+
	               " shadow: true"+
	          "  },"+
	          "  credits: {"+
	              "  enabled: false"+
	           " },"+
	          "series: ["+stringData+"]}",
	      "constr":"Chart",
	      "type":"image/png",
	      "outfile":"../img.png"
	    }
		// ‎277512646:AAEGlcK5nNLzCyL82ZlJKcliRJaOKMQP-_I
		// 347062706:AAHJFSlTqJRg8Gugs4Gfm7vHH4YAWhBnaSs
	}

	var text ="Запрос sendMessage";
	request1(options, function (error, response, body) {
	  	if (!error && response.statusCode == 200) {
		    // console.log(body.id) ;
		    // console.log("// Print the shortened url.");
		    // console.log(response.body.ReplyText);
		    let rta = response.body;
		    console.log("sc ",rta) ;
		    //Photo = 'img.png';
		 	TelegramBot.SendPhoto(ToUser,'img.png');
		 	}else{
		    //console.log(response);
		    	    let rt = response;

			let rta = "Error: We have a problem, bro  -  ";
		 	TelegramBot.Msg(rt,ToUser);
			console.log(rta, rt);
	  	}
	})
	return text;
}

//Обновление/добавление сущностей в API.AI
function toAI(entities) {

    var jsonn = {

        "name": "LanesFromServer",
        'entries': entities
    }
    var request1 = require('request');

    var options1 = {
        uri: 'https://api.api.ai/v1/entities?v=20150910',
        //uri: 'https://api.api.ai/v1/entities',
        method: 'PUT',
        headers: {
            'Authorization': 'Bearer' + '163893eeb676462ba15fca441d3d9e9c',
            "Content-Type": "application/json; charset=utf-8"
        },
        json: jsonn
        //json:true
    };


    request1(options1, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            let rta1 = response.body;//.body.result.id;
            //var parse1 = JSON.parse(rta1);
            console.log("API AI update entities succes ", rta1);

        } else {
            //console.log(response);
            let rta = "Error: We have a problem with entities(, bro\n";
            console.log("error ", error, response.body);
            //pogogdi(rta);
        }
    })
}

//Запросы к mySQL
function sqlquery(sql,arrayFrom1C,trigger){
	//console.log('кол-во аргументов', arguments.length == 2 ? 2 : 1 );
	var start = new Date();
    var mysql = require('mysql');
    var mysqlConfig ={
        host: "localhost",
        user: "root",
        password: "gaguata03",
        database: '1c_database',
        multipleStatements: true,
        connectTimeout:60000
    }
    var con = mysql.createConnection(mysqlConfig);
    var resultOfquery;
    // con.connect(function (err) {
    //     if (err) {
    //     	console.log('error with connection: ',err)
    //     }
    //     console.log("Connected!");
    //});
	console.log( start ); 

    if (arguments.length == 1){
        var query = con.query(sql, function(err, result) {
            //con.end();
            if (err) { //throw err;
                console.log("err: ", err);
            }
            if (result != undefined) {
                resultOfquery = result.message;
            } else {
                resultOfquery = 'no result from sql'
            }
            //console.log('test result: ',result)
            var a = JSON.stringify(result);
            //console.log('test a: ',a)
            var json = JSON.parse(a);
            console.log('test json: ',json)
            var k = json.length;
            //console.log('k ',k);
            // console.log('json ',json);
            // При ошибках и предупреждениях в результат добавляется массив с дополнительными данными
            if (json.length >= 2) {
                for (var i = 0; i < json[1].length; i++) {
                    //length = json[0];
                    //name = json[1].length;
                    console.log('Message: ', json[1][i].Message);

                }
                console.log('\n result: ', json[0].message)
            } else {
                console.log('\n result: ', result.message)
            }
        })

    }else if(arguments.length == 3){

    	if (trigger == '5') {
    	    console.log('trigger = 5')

    	    console.log('arrayFrom1C.length ', arrayFrom1C.length)
    	    for (var i = 0; i < arrayFrom1C.length; i++) {
    	        var sql =
    	            'INSERT IGNORE INTO tbl_amount (id_nom,id_sklad,number)' +
    	            'SELECT \'' + arrayFrom1C[i].nomenclature + '\', tbl_sklad.id, \'' + arrayFrom1C[i].number + '\'' +
    	            'FROM  tbl_sklad ' +
    	            'WHERE ' +
    	            'tbl_sklad.name = \'' + arrayFrom1C[i].sklad + '\'' + '; show warnings'
    	        var query = con.query(sql, function(err, result) {
    	            if (err) { //throw err;
    	                console.log("err: ", err);
    	            }
    	            if (result != undefined) {
    	                resultOfquery = result.message;
    	            } else {
    	                resultOfquery = 'no result from sql'
    	            }

    	            var a = JSON.stringify(result);
    	            var json = JSON.parse(a);
    	            var k = json.length;
    	            //console.log('k ',k);
    	            // console.log('json ',json);
    	            // При ошибках и предупреждениях в результат добавляется массив с дополнительными данными			       

    	            if (json.length >= 2) {
    	               
    	                for (var k = 0; k < json[1].length; k++) {
    	                    //length = json[0];
    	                    //name = json[1].length;
    	                    console.log('Message: ', json[1][k].Message, ' nomenclature: ', arrayFrom1C[k].nomenclature, ' sklad: ', arrayFrom1C[k].sklad, ' number: ', arrayFrom1C[k].number);

    	                }
    	                //console.log('\n result: ',json[0].message)	
    	            } else {
    	                //console.log('\n result: ',result.message)	
    	            }
    	        })
    	        if (i == arrayFrom1C.length - 1) {
    	            console.log('5 Запросы в цикле прошли без ошибок')
    	            var end = new Date()
    	            console.log('start: ', start, ' now: ', end)
    	        }
    	    }
    	}else if(trigger == '6'){
    		console.log('trigger = 6')

			for (var i = 0; i<arrayFrom1C.length; i++){
				var sql	= 
					'INSERT IGNORE INTO tbl_price (id_price_type,id_nom,price,date,currency,edizm) '+
					'SELECT tbl_price_type.id,\''+ arrayFrom1C[i].nomenclature + '\', \''+arrayFrom1C[i].price 	+'\',\'' + 
																		arrayFrom1C[i].date 		+'\',\'' + 
																		arrayFrom1C[i].currency	+'\',\'' + 
																		arrayFrom1C[i].edizm 		+'\' ' +
					'FROM tbl_price_type ' +
					'WHERE '+// tbl_nomenclature.elem = \''+arrayFrom1C[i].nomenclature+ '\'' +
					//'AND '+
					'tbl_price_type.elem = \''+arrayFrom1C[i].price_type+'\''+ '; show warnings'	
		        var query = con.query(sql, function (err, result) {
		            if (err) {//throw err;
		                console.log("err: ", err);
		            }
		            if (result != undefined){
		                resultOfquery = result.message;
		            }else{
		                resultOfquery = 'no result from sql'
		            }
			        var a = JSON.stringify(result);
			        var json = JSON.parse(a);
			       var k= json.length;
			       //console.log('k ',k);
			      // console.log('json ',json);
			      // При ошибках и предупреждениях в результат добавляется массив с дополнительными данными
			       if (json.length >= 2){

			        for (var k = 0; k < json[1].length; k++){
			                //length = json[0];
			                //name = json[1].length;
			                console.log('Message: ',json[1][k].Message,' nomenclature: ',arrayFrom1C[k].nomenclature,' price_type: ',arrayFrom1C[k].price_type,' date: ',arrayFrom1C[k].date );
			            
		      	 	 }
		            //console.log('\n result: ',json[0].message)	
			        }else{
			            //console.log('\n result: ',result.message)	
			        }
		        })
		        if(i == arrayFrom1C.length-1){
	      		  console.log('6 Запросы в цикле прошли без ошибок')
					var end = new Date()
					console.log( 'start: ',start, ' now: ',end )     		  
		        }
        	}

    	}
    }
   // con.end();
}

//Выгрузка цен, остатков, складов и др. из 1С 
function nomenclatureToSQLUpload(arrayFrom1C, trigger){
	// Номенклатура
	if (trigger == '1') {
	    var queryString = ''
	    console.log('Загрузка номенклатуры успешно запущена. N= ', arrayFrom1C.length)
	    for (var i = 0; i < arrayFrom1C.length; i++) {
	        //console.log(arrayFrom1C[i].P,arrayFrom1C[i].Name,arrayFrom1C[i].Q);

	        var elem = arrayFrom1C[i].elem;
	        var id = arrayFrom1C[i].id;

	        if (~elem.indexOf('\'')) {
	            console.log('elem', elem)
	            elem = elem.replace(/\'/g, '\\\''); 
	        }
	        //console.log(elem.indexOf('\''))
	        var comment = arrayFrom1C[i].comment;
	        if (comment == 'null') {
	            comment = null
	        } else if (comment.indexOf('\'') >= 0) {
	            console.log('comment1', comment)
	            comment = comment.replace(/\'/g, '\*')
	            console.log('comment1after', comment)
	            if (~comment.indexOf('\\')) {
	                comment = comment.replace(/\\/g, '\\\\');
	                //console.log(comment.indexOf('\''))
	            }
	        } else if (comment.indexOf('\\') >= 0) {
	            comment = comment.replace(/\\/g, '\\\\');
	            console.log('comment2', comment)
	            if (~comment.indexOf('\'')) {
	                comment = comment.replace(/\'/g, '\\\'')
	            }
	            //console.log(comment.indexOf('\''))
	        }
	        var bazov_ed_izm = arrayFrom1C[i].bazov_ed_izm;
	        if (bazov_ed_izm == 'null') {
	            bazov_ed_izm = null
	        } else if (~bazov_ed_izm.indexOf('\'')) {
	            console.log('bazov_ed_izm', bazov_ed_izm)
	            bazov_ed_izm = bazov_ed_izm.replace(/\'/g, '\*');
	        }

	        var stavkaNDS = arrayFrom1C[i].stavkaNDS
	        if (stavkaNDS == 'null') {
	            stavkaNDS = null
	        } else if (~stavkaNDS.indexOf('\'')) {
	            console.log('stavkaNDS', stavkaNDS)
	            stavkaNDS = stavkaNDS.replace(/\'/g, '\\\'');
	        }
	        // console.log(stavkaNDS.indexOf('\''))

	        var nomenkl_gruppa = arrayFrom1C[i].nomenkl_gruppa
	        if (nomenkl_gruppa == 'null') {
	            nomenkl_gruppa = null
	        } else if (~nomenkl_gruppa.indexOf('\'')) {
	            console.log('nomenkl_gruppa', nomenkl_gruppa)
	            nomenkl_gruppa = nomenkl_gruppa.replace(/\'/g, '\\\'');
	        }
	        //console.log(nomenkl_gruppa.indexOf('\''))

	        var vid_nomenkl = arrayFrom1C[i].vid_nomenkl
	        if (vid_nomenkl == 'null') {
	            vid_nomenkl = null
	            //console.log(vid_nomenkl)
	        } else if (~vid_nomenkl.indexOf('\'')) {
	            console.log('vid_nomenkl', vid_nomenkl)
	            vid_nomenkl = vid_nomenkl.replace(/\'/g, '\\\'');
	        }
	        //console.log(vid_nomenkl.indexOf('\''))


	        // elem = null  	
	        // queryString = queryString + '(\''+q+'\',\''+name+'\',\''+p+'\'),'
	        queryString = queryString + '(' + id + ',\'' + elem + '\',\'' + comment + '\',\'' + bazov_ed_izm + '\',\'' + stavkaNDS + '\',\'' + nomenkl_gruppa + '\',\'' + vid_nomenkl + '\'),'
	        // console.log('queryString ',queryString)
	        // console.log('nomenclature: ',elem ,
	        // 		' ',comment,
	        // 		' ',bazov_ed_izm,
	        // 		' ', stavkaNDS, 
	        // 		' ', nomencl_gruppa,
	        // 		' ', vid_nomencl
	        // 	)   
	    }
	    queryString = queryString.substring(0, queryString.length - 1) + '; show warnings';
	    //queryString = queryString.replace(/\'/g, '\\\'');
	    var sql = 'INSERT IGNORE INTO tbl_nomenclature ' +
	        '(id, elem, comment, bazov_ed_izm, stavkaNDS, nomenkl_gruppa, vid_nomenkl)' +
	        //'(Name,Q,P)' +
	        'VALUES' +
	        //'("1ertet","крем для ве","444"),' +
	        queryString;
	    //console.log (queryString)    	
	    sqlquery(sql);
	    // Тип цен
	}else if(trigger =='2') {
		console.log('триггер переключен в режим 2')
		var queryString =''
		for(var i = 0; i < arrayFrom1C.length; i++){
	        queryString = queryString + '(\'' + arrayFrom1C[i].elem + '\'),'
		}
		//Вырезаем всю строку до последней запятой
	    queryString = queryString.substring(0,queryString.length - 1)+ '; show warnings';

		var sql	= 'INSERT IGNORE INTO tbl_price_type ' +
	        '(elem)' +
	        //'(Name,Q,P)' +
	        'VALUES' +
	        //'("1ertet","крем для ве","444"),' +
	        queryString
	        //console.log (queryString)    	
		sqlquery(sql);
	// тип складов
	}else if(trigger =='3') {
		var queryString =''
		console.log('Типы складов')
		console.log(arrayFrom1C.length)
		for (var i = 0; i<arrayFrom1C.length; i++){
			// console.log('code ',arrayFrom1C[i].code,'name ',arrayFrom1C[i].name)
			console.log('name ',arrayFrom1C[i])
	        queryString = queryString + '(\''+arrayFrom1C[i]+ '\'),'
		}
	    queryString = queryString.substring(0,queryString.length - 1)+ '; show warnings';
		var sql	= 'INSERT IGNORE INTO tbl_sklad_type ' +
	        '(type)' +
	        //'(Name,Q,P)' +
	        'VALUES' +
	        //'("1ertet","крем для ве","444"),' +
	        queryString
	        //console.log (queryString)    	
		sqlquery(sql);
	// Склады
	}else if(trigger =='4') {
		var queryString =''
		console.log('Склады')
		//console.log(arrayFrom1C.length)
		for (var i = 0; i<arrayFrom1C.length; i++){
			console.log('code ',arrayFrom1C[i].code,'name ',arrayFrom1C[i].name, 'type ',arrayFrom1C[i].type)
			var sql	= 
				'INSERT IGNORE INTO tbl_sklad (name,code,type_id)'+
				'SELECT \''+arrayFrom1C[i].name+'\', \''+arrayFrom1C[i].code+'\', tbl_sklad_type.id '+
				'FROM tbl_sklad_type '+
				'WHERE tbl_sklad_type.type = \''+arrayFrom1C[i].type+'\''+ '; show warnings'	
			sqlquery(sql);
			}
	        //console.log (queryString)    	
	// Остатки
	}else if(trigger =='5') {
		//var queryString =''

		sqlquery(sql,arrayFrom1C,trigger); 	

		console.log('Остатки')
		console.log('Итого строк: ',arrayFrom1C.length)
	// Цены
	}else if(trigger =='6') {
		sqlquery(sql,arrayFrom1C,trigger); 	
		console.log('Цены')
		console.log('Итого строк: ',arrayFrom1C.length)
	 }
}