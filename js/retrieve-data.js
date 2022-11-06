var Airtable = require('airtable');
var base = new Airtable({apiKey: 'keyw0ok8Ma97ObyvG'}).base('appcemMdOTCe9KNHy');

client = new Paho.MQTT.Client("driver.cloudmqtt.com", 38703, "web_" + parseInt(Math.random() * 100, 10));

client.onConnectionLost = onConnectionLost;
client.onMessageArrived = onMessageArrived;

var options = {
    useSSL: true,
    userName: "cuyeuthr",
    password: "AFv4roDihIZB",
    onSuccess:onConnect,
    onFailure:doFail
}

client.connect(options);

function onConnect() {
    // Once a connection has been made, make a subscription and send a message.
    console.log("onConnect");
    document.getElementById("running").innerHTML = "<img src='../images/live-green.gif'>";   
    client.subscribe("A/#");
    client.subscribe("B/#");
    client.subscribe("C/#");

    //message = new Paho.MQTT.Message("Hello CloudMQTT");
    //message.destinationName = "/cloudmqtt";
    //client.send(message);
}

function doFail(e){
    console.log(e);
    document.getElementById("running").innerHTML = "<img src='../images/Red_circle.gif'>";   
    console.log('Connection error: ', err)
}

// called when the client loses its connection
function onConnectionLost(responseObject) {
    if (responseObject.errorCode !== 0) {
      console.log("onConnectionLost:"+responseObject.errorMessage);
    }
    document.getElementById("running").innerHTML = "<img src='../images/Red_circle.gif'>";   
}

  // called when a message arrives
function onMessageArrived(message) {

    console.log(message.destinationName);
    let n = String(message.destinationName)
    console.log(message.destinationName);
    const topico = n.split('/')
    console.log(topico);
    console.log("onMessageArrived:"+message.payloadString);

    //const topico = destinationName.split('/')
    //console.log("topico",topico)
    
    let qualidade = "";
    let auxDadosColetados = [];

    const aux =  message.payloadString;
    const mensagem = JSON.parse(aux)

    let mesa = topico[0];
    let lote = topico[1];
    let dispositivo = topico[2];
    let idSensor = topico[3];
    let parametro = topico[4];
    let valor = mensagem.valor;
    let Timestamp = mensagem.timestamp;

    if(parametro=="temperatura"){qualidade = analyzeTemperature(valor);}
    if(parametro=="solo"){qualidade = analyzeSoil(valor);}
    if(parametro=="umidade_ar"){qualidade = analyzeAir(valor);}

    adicionarDados(idSensor,dispositivo,mesa,lote,parametro,valor,qualidade,Timestamp);
}

function adicionarDados(idSensor,dispositivo,mesa,lote,parametro,valor,qualidade,Timestamp){

    var date = new Date(Date.parse(Timestamp));
    base('Sensors Data').create([
        {
        "fields": {
            "ID Sensor": idSensor,
            "Dispositivo": dispositivo,
            "Mesa": mesa,
            "Lote": lote,
            "Parametro": parametro,
            "Valor": valor,
            "Qualidade": qualidade,
            "Timestamp": Date.parse(Timestamp),
            "Hour":  date.getHours () - 12
        }
        }
    ], function(err, records) {
        if (err) {
        console.error(err);
        return;
        }
        records.forEach(function (record) {
        console.log(record.getId());
        });
    });
}

function analyzeTemperature(value){

    var content = ""    

    if(value<26){
      if(value>14){
        content = "ideal";
      }
      else{
        content = "naoideal";
      }
    }
    else{
        content = "naoideal";
    }
  
    return(content)
}
  
function analyzeAir(value){
  
    var content = ""    

    if(value<76){
      if(value>64){
        content = "ideal";
      }
      else{
        content = "naoideal";
      }
    }
    else{
        content = "naoideal";
    }
  
    return(content)
}
  
function analyzeSoil(value){
  
    var content = ""    

    if(value<61){
      if(value>44){
        content = "ideal";
      }
      else{
        content = "naoideal";
      }
    }
    else{
        content = "naoideal";
    }
  
    return(content)
}

