export function forButNotInCombo(header){
  if(header.meObject !== undefined){

    switch (header.meObject.group1) { 
      case "Häll med utsugsfläkt":{
        header.forFlags.hobFan = true
      } break;
      case "Häll och ugn":{
        header.forFlags.hob = true;
        header.forFlags.oven = true;
      } break;
      case "Häll och kombi":{
        header.forFlags.hob = true;
        header.forFlags.combiMicro = true;
      } break;
      case "Häll och kompaktugn":{
        header.forFlags.hob = true;
        header.forFlags.compactOven = true;
      } break;
      case "Ugn och kombi": {
          header.forFlags.oven = true;
          header.forFlags.combiMicro = true;
      } break;
      case "Ugn och KompaktUgn": {
          header.forFlags.oven = true;
          header.forFlags.compactOven = true;
      } break;
      case "KompaktUgn och mikro": {
          header.forFlags.compactOven = true;
          header.forFlags.micro = true;
      } break;
      case "Ugn och mikro": {
          header.forFlags.oven = true;
          header.forFlags.micro = true;
      } break;
      case "Ugn": {
        header.forFlags.oven = true;
      }break;
      case "KompaktUgn": {
        header.forFlags.compactOven = true;
      }break;
      case "Kombi":{
        header.forFlags.combiMicro = true;
      }break;
      case "Fläkt":{
        header.forFlags.fan = true;
      }break;
      case "Kyl/frys":{
        header.forFlags.fridgeOrF = true;
      }break;
      case "Mikrovågsugn":{
        header.forFlags.micro = true;
      }break;
      case "Diskho":
        header.forFlags.sink = true;
        break;
      case "Häll":{
        header.forFlags.hob = true;
      }break;
      case "Hörn":{
        header.corner = true;
        if(header.meObject.group2 === "Diskho")
        {
          header.forFlags.sink = true;
        }
      }break;
      case "HörnVäggSkåp":{
        header.corner = true;
        header.description = `Vägghörnskåp 87,5 cm`
      }break;
    }
  }
  
}