var Airtable = require('airtable');
var base = new Airtable({apiKey: 'keyw0ok8Ma97ObyvG'}).base('appcemMdOTCe9KNHy');

const d = new Date();
let hora = d.getHours();
//let formula = "{Hour}="+String(hora-12)+" & {Dispositivo}='oi'"

window.onload = function(){
    getDevices().then(function(result){
      devicesShow(result);
    })
}

async function getDevices(){
  let records = await base('Sensors Data').select({
      view: "Grid view",
      fields: ["Dispositivo"]
  }).all()
  return records
}

function devicesShow(result){
  let devices = [];

  for (let index = 0; index < result.length; index++) {
    var d = result[index].fields["Dispositivo"];
    
    if(devices.length==0){
      devices.push(d);
    }
    else{
      var bool = false;
      for (let index = 0; index < devices.length; index++) {
        if(devices[index]==d){
          bool = true;
        }
      }
      if(!bool){
        devices.push(d);
      }
    }
  }
  displaySelect(devices)
}


function displaySelect(devices){
  document.getElementById("select-device").innerHTML = " "
  
  var content = " "
  content += "<select id='devices'>";

  for (let index = 0; index < devices.length; index++) {
    content += "<option value='"+devices[index]+"'>"+devices[index]+"</option>"
  }
  
  content += "</select>"
  content += "<button onclick='submitDevice()'>Procurar</button>"  

  document.getElementById("select-device").innerHTML = content;
}

function submitDevice(){
  var dispositivo = document.getElementById("devices").value;
  hour()
  getData(dispositivo).then(function(result){
    console.log(result)  
    show(result);
  })

}

async function getData(dispositivo){

  let formula = "AND({Hour}="+ String(hora-12) +",{Dispositivo}='"+dispositivo+"')";
  console.log(formula)

  let records = await base('Sensors Data').select({
      view: "Grid view",
      fields: ["ID Sensor","Dispositivo","Valor","Timestamp","Hour"],
      maxRecords: 800,
      filterByFormula: formula
  }).all()
  return records
}

function show(result){

  document.getElementById("chart").innerHTML="";

  let lTs = [];
  let T_A2_1 = [];
  let U_A2_1 = [];
  let S_B1_1 = [];
  let S_C1_1 = [];
  let S_B1_2 = [];
  let S_A2_1 = [];

  for (let index = 0; index < result.length; index++) {
    id = result[index].fields["ID Sensor"];
    dispositivo = result[index].fields["Dispositivo"];
    valor = result[index].fields["Valor"];
    timestamp = result[index].fields["Timestamp"];

    let size = lTs.length - 1
    
    if(lTs.length!=0){
      if(lTs[size]!=timestamp){
        lTs.push(timestamp);
      }
    }
    else{
      lTs.push(timestamp);
    }

    switch(id){
      case "T_A2_1":
          T_A2_1.push(valor);
          break;
      case "U_A2_1":
          U_A2_1.push(valor);
          break;
      case "S_B1_1":
          S_B1_1.push(valor);
          break;
      case "S_C1_1":
          S_C1_1.push(valor);
          break;
      case "S_B1_2":
          S_B1_2.push(valor);
          break;
      case "S_A2_1":
          S_A2_1.push(valor);
          break;
      default:
          break;
    
    }
  }
  var options = {
    series: [{
      name: "T_A2_1",
      data: T_A2_1
  },{
    name: "U_A2_1",
    data: U_A2_1
  },{
    name: "S_B1_1",
    data: S_B1_1
  },{
    name: "S_C1_1",
      data: S_C1_1
  },{
    name: "S_B1_2",
    data: S_B1_2
  },{
    name: "S_A2_1",
    data: S_A2_1
  }],
    chart: {
    height: 800,
    type: 'line',
    zoom: {
      enabled: true
    }
  },
  dataLabels: {
    enabled: true
  },
  stroke: {
    curve: 'smooth'
  },
  title: {
    align: 'left'
  },
  grid: {
    row: {
      colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
      opacity: 0.5
    },
  },
  xaxis: {
    categories: lTs,
  }
  };

  var chart = new ApexCharts(document.querySelector("#chart"), options);
  chart.render();
}

function hour() {
  var date = new Date;
  var content = "";
  content += "<div class='main-card dashboard-wait-data'>"
  content += "<div class='card-inner'>"
  content += "<span class='material-icons-outlined'>schedule</span>"
  content += "<span class='text-primary font-weight-bold'>Resultados para o seguinte horário: "+ date.getHours() +":00 ás "+ date.getHours()+":59</span>"
  content += "</div>"
  content += "</div>"
  document.getElementById("main-hour").innerHTML = content
}