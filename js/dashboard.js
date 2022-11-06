var Airtable = require('airtable');
var base = new Airtable({apiKey: 'keyw0ok8Ma97ObyvG'}).base('appcemMdOTCe9KNHy');

let dadosColetados = [];


window.onload = function(){
    awaitData()
}

function awaitData(){
    content = " "
    content += "<div class='main-card dashboard-wait-data'>"
    content += "<div class='card-inner'>"
    content += "<span class='material-icons-outlined'>pending</span>"
    content += "<span class='text-primary font-weight-bold'>Aguarde, os dados estão sendo coletados</span>"
    content += "</div>"
    content += "</div>"
    document.getElementById("main-wait-data").innerHTML = content
}
//const url = 'wss://2qvqp2.stackhero-network.com:443';
//const username = 'dummy';
//const password = 'tvxR7FxWIVbmc89DFSNF8qHXS2YkUeRy';
//const url ='ws://broker.emqx.io:8083/mqtt'


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
    document.getElementById("main-wait-data").innerHTML = "";

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

    switch(qualidade){
        case "ideal":
            var bool = true;
            break;
        case "naoideal":
            var bool = false;
            break;
        default:
            var bool = false;
    }

    auxDadosColetados.push(bool)
    auxDadosColetados.push(dispositivo);
    auxDadosColetados.push(idSensor);
    auxDadosColetados.push(mesa);
    auxDadosColetados.push(lote);
    auxDadosColetados.push(parametro);
    auxDadosColetados.push(valor);
    auxDadosColetados.push(qualidade);
    auxDadosColetados.push(Timestamp);

    var tamanho = dadosColetados.length;
    var update = false;

    if(tamanho==0){
        dadosColetados.push(auxDadosColetados)
    }
    else{
        for(var i=0;i<tamanho; i++) {
            if(dadosColetados[i][1]==dispositivo && dadosColetados[i][2]==idSensor){
                dadosColetados[i][0] = bool;
                dadosColetados[i][6] = valor;
                dadosColetados[i][7] = qualidade;
                update = true;
            }
        }
        if(update==false){
            dadosColetados.push(auxDadosColetados)
        }
    }
    buildMainDashboard();
    buildOneSensor(); 
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

function buildMainDashboard(){
    document.getElementById("main-card-dashboard").innerHTML = "";
    var content = "";

    var qualidade = 0;

    for (var i = 0; i < dadosColetados.length; i++) {
        if(dadosColetados[i][0]==false){
            qualidade++;
        }
    }

    if(qualidade==0){
        content += "<div class='main-card dashboard-ok'>"
        content += "<div class='card-inner'>"
        content += "<span class='material-icons-outlined'>warning_amber</span>"
        content += "<span class='text-primary font-weight-bold'>As condições estão ideais para a sua plantação</span>"
        content += "</div>"
        content += "</div>"
    }
    else{
        content += "<div class='main-card dashboard-nok'>"
        content += "<div class='card-inner'>"
        content += "<span class='material-icons-outlined'>warning_amber</span>"
        content += "<span class='text-primary font-weight-bold'>As condições não estão ideais para a sua plantação</span>"
        content += "</div>"
        content += "</div>"
    }
    document.getElementById("main-card-dashboard").innerHTML = content;
}

function buildOneSensor(){
    document.getElementById("sensores").innerHTML =  " ";
    var content = "";

    for (var i = 0; i < dadosColetados.length; i++) {
        if(dadosColetados[i][0]==false){
            var dispositivo = dadosColetados[i][1];
            var id = dadosColetados[i][2];
            var mesa = dadosColetados[i][3];
            var lote = dadosColetados[i][4];
            var parametro = dadosColetados[i][5];
            var valor = dadosColetados[i][6];

            var unidade = "";
            var ideal = ""
        
            if(parametro=="temperatura"){
                unidade = "°C";
                ideal = "15°C a 25°C";
                parametro = "Temperatura";
            }
            if(parametro=="umidade_ar"){
                unidade = "%";
                ideal = "65% a 75%";
                parametro = "Umidade do Ar";
            }
            if(parametro=="solo"){
                unidade = "%";
                ideal = "45% a 60%";
                parametro = "Umidade do Solo";
            }
        
            content += "<div class='card'>"
            content += "<div class='card-inner'>"
            content += "<p class='text-primary font-weight-bold'>"+ parametro +"</p>"
            content += "<span class='material-icons-outlined'>sensors</span>"
            content += "</div>"
            content += "<span class='text-primary text-value'>"+ valor + unidade +"</span>"
            content += "<span class='text-primary'>Mesa: "+ mesa +"</span>"
            content += "<span class='text-primary'>Lote: "+ lote +"</span>"
            content += "<span class='text-primary'>Código: "+ id +"</span>"
            content += "<span class='text-primary'>Dispositivo: "+ dispositivo+"</span>"
            content += "<span class='text-primary'>Condições ideais :"+ ideal +"</span>"
            content += "</div>"

            
        }
    }
    document.getElementById("sensores").innerHTML =  content;
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


