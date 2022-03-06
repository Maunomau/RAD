function tryTo(description, callback){
  //console.log("Trying to "+description+".");
  for(let timeout=4000;timeout>0;timeout--){
    if(callback()){
      //console.log("Succeeded at "+description+" after "+(4001-timeout)+" attempt(s).");
      console.log("Succeeded at "+description+".");
      return;
    }
  }
  throw 'Timeout while trying to '+description;
}


//leaving these 2 mainly just so I can omit specifying rng to use
function randomRange(min, max, rng = gRNG){
  return rng.getUniformInt(min, max);
}
function shuffle(arr, rng = gRNG){
  return rng.shuffle(arr);
}

function rightPad(textArray){
  let finalText = "";
  textArray.forEach(text => {
    text+="";
    for(let i=text.length;i<10;i++){
      text+=" ";
    }
    finalText += text;
  });
  return finalText;
}


/*
https://stackoverflow.com/questions/41898612/format-console-log-with-color-and-variables-surrounding-non-formatted-text

console.log('aa %c Sample Text', 'color:green;');
console.log("%cHello, "+"World","color:red;","color:blue;");
console.log("%c%s"," is ","%c%d","years old.", "color:red","Bob", "color:blue", 42);
console.log("%c%s"+" is "+"%c%d"+"years old.", "color:red","Bob", "color:blue", 42);
console.log("%c is %c years %c old.", "color:red", "color:lightblue", "color:white");
console.log("%c%s%c = %c%s","background:orange", "Array[index0]", "background:inherit;", "background:yellow;font-style: italic;", "google.com")



*/