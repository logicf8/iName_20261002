export function forButNotInFS(header){
  if(header.meObject !== undefined){
    switch(header.meObject.group1){
        case "Diskmaskin":{
          if(header.description === undefined) header.description = "Diskmaskin";
      } break;
    }
  }
  let text = header.originalTxt 
  switch(true){
    case text.includes("FASTNÄS"):
    case text.includes("TYLLSNÄS"):
    case text.includes("YTTERNÄS"):{
      if(header.description === undefined) header.description = "Kyl/frys";
    }break;
    case text.includes("TVÄTTAD"):{
      if(header.description === undefined) header.description = "Tvättmaskin/torktumlare";
    }break;
  }

    if(header.width === undefined) header.width = header.meObject.width;
    if(header.name === undefined) header.name = "Egen"; {
    if(header.group2 === undefined) header.group2 = header.meObject.group1;
  }
}