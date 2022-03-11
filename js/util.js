function tryTo(description, callback){
  //console.log("Trying to "+description+".");
  for(let timeout=1000;timeout>0;timeout--){
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

function makeRuneList(){
  runes = {};
  let i = 0;
  while (true) {
    let w = getTPW(i)
    runes[w] = {
      word:w,//should be redundant
      spritesrc:"art/runes/"+w+".png",
      element:"none",
      timer:0,
      holder:false,
      wx:false,
      wy:false,
      x:false,
      y:false,
      setday:false,
      //cx:false,//current xy to save close enough position picked.
      //cy:false,
      hintday:false,//day the rune hint was set
    };
    i++;
    if(i >= runeTypesTotal) break;
  }
}

function makeRuneList2(){
  unassignedRunes = [];
  let i = 0;
  while (true) {
    unassignedRunes.push(getTPW(i));
    i++;
    if(i >= runeTypesTotal) break;
  }
  unassignedRunes = shuffle(unassignedRunes, worldRNG);
}

function getTPW(num){
  let l = ["akesi","ala","alasa","ale","anpa","ante","anu","awen","e","en","epiku","esun","ijo","ike","ilo","insa","jaki","jasima","jelo","jo","kala","kalama","kama","kasi","ken","kepeken","kili","kin","kipisi","kiwen","ko","kon","kule","kulupu","kute","la","lanpan","lape","laso","lawa","leko","len","lete","li","lili","linja","lipu","loje","lon","luka","lukin","lupa","ma","mama","mani","meli","meso","mi","mije","misikeke","moku","moli","monsi","monsuta","mu","mun","musi","mute","namako","nanpa","nasa","nasin","nena","ni","nimi","noka","oko","olin","ona","open","pakala","pali","palisa","pan","pana","pi","pilin","pimeja","pini","pipi","poka","pona","sama","seli","selo","seme","sewi","sijelo","sike","sin","sina","sinpin","sitelen","soko","sona","soweli","suli","suno","supa","suwi","tan","taso","yawa","telo","tenpo","toki","tomo","tonsi","tu","unpa","uta","utala","valo","van","vaso","vava","veka","vile","o","a","usavi","unu","kapesi","kiki","powe","soto","teje","misa","isipin","kan","majuna","linluwi","pake"];
  return l[num];
}

/*
https://lipu-linku.github.io/
consider omitting or handling differently:
a, e, la, li, o
en kin lon mu pi tu van
leko tonsi
epiku lanpan 
no:kijetesantakalu kokosila ku n pu 
include?: 
  usavi (magic)
  unu (purple)
  kapesi (brown, gray)
  kiki (spiky)
  powe (unreal, false, untrue; pretend; deceive, trick)
  soto teje (left right)
  misa (Glires or Eulipotyphla; rat, mouse, squirrel, rabbit, rodent; {~ suli} capybara)
  isipin (to think, to imagine, to believe, to remember, to recall; a thought, an idea {see pilin, toki, insa})
  kan (with, among, in the company of {see kepeken, poka})
  majuna (old, aged, ancient)
  linluwi (network, internet, connection; weave, braid, interlace)
  pake (stop, cease, halt; to block the way, to interrupt; to prevent {see pini})
  peto (cry, tears; sad, sadness)


["akesi","ala","alasa","ale","anpa","ante","anu","awen","e","en","epiku","esun","ijo","ike","ilo","insa","jaki","jasima","jelo","jo","kala","kalama","kama","kasi","ken","kepeken","kili","kin","kipisi","kiwen","ko","kon","kule","kulupu","kute","la","lanpan","lape","laso","lawa","leko","len","lete","li","lili","linja","lipu","loje","lon","luka","lukin","lupa","ma","mama","mani","meli","meso","mi","mije","misikeke","moku","moli","monsi","monsuta","mu","mun","musi","mute","namako","nanpa","nasa","nasin","nena","ni","nimi","noka","oko","olin","ona","open","pakala","pali","palisa","pan","pana","pi","pilin","pimeja","pini","pipi","poka","pona","sama","seli","selo","seme","sewi","sijelo","sike","sin","sina","sinpin","sitelen","soko","sona","soweli","suli","suno","supa","suwi","tan","taso","yawa","telo","tenpo","toki","tomo","tonsi","tu","unpa","uta","utala","valo","van","vaso","vava","veka","vile","o","a",","usavi","unu","kapesi","kiki","powe","soto","teje","misa","isipin","kan","majuna","linluwi","pake","apeja"]

["a","akesi","ala","alasa","ale","anpa","ante","anu","awen","e","en","epiku","esun","ijo","ike","ilo","insa","jaki","jasima","jelo","jo","kala","kalama","kama","kasi","ken","kepeken","kili","kin","kipisi","kiwen","ko","kon","kule","kulupu","kute","la","lanpan","lape","laso","lawa","leko","len","lete","li","lili","linja","lipu","loje","lon","luka","lukin","lupa","ma","mama","mani","meli","meso","mi","mije","misikeke","moku","moli","monsi","monsuta","mu","mun","musi","mute","namako","nanpa","nasa","nasin","nena","ni","nimi","noka","o","oko","olin","ona","open","pakala","pali","palisa","pan","pana","pi","pilin","pimeja","pini","pipi","poka","pona","sama","seli","selo","seme","sewi","sijelo","sike","sin","sina","sinpin","sitelen","soko","sona","soweli","suli","suno","supa","suwi","tan","taso","yawa","telo","tenpo","toki","tomo","tonsi","tu","unpa","uta","utala","valo","van","vaso","vava","veka","vile"]
*/
/*
https://stackoverflow.com/questions/41898612/format-console-log-with-color-and-variables-surrounding-non-formatted-text

console.log('aa %c Sample Text', 'color:green;');
console.log("%cHello, "+"World","color:red;","color:blue;");
console.log("%c%s"," is ","%c%d","years old.", "color:red","Bob", "color:blue", 42);
console.log("%c%s"+" is "+"%c%d"+"years old.", "color:red","Bob", "color:blue", 42);
console.log("%c is %c years %c old.", "color:red", "color:lightblue", "color:white");
console.log("%c%s%c = %c%s","background:orange", "Array[index0]", "background:inherit;", "background:yellow;font-style: italic;", "google.com")



*/