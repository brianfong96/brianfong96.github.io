//http://indiegamr.com/generate-repeatable-random-numbers-in-js/
// in order to work 'Math.seed' must NOT be undefined,
// so in any case, you HAVE to provide a Math.seed
Math.seededRandom = function(max, min) {
    max = max || 1;
    min = min || 0;
 
    Math.seed = (Math.seed * 9301 + 49297) % 233280;
    var rnd = Math.seed / 233280;
    
    return min + rnd * (max - min);
}

function srandom(min, max)
{
    var r = Math.round(Math.seededRandom()*max);
    if (r < 0){
        r = 0;
    }
    else if (r >= max){
        r = max-1;
    }
    return r;
}


function randomsort(arr) { 
    var l = arr.length;
    var ret = [];
    var pos = [];

    for (i=0; i<l; i++){
        pos.push(i);
    }
    for (i=0; i<l; i++){
        var p = srandom(0, pos.length);        
        ret.push(arr[pos[p]]);
        pos[p] = pos[pos.length-1];
        pos.pop();
    }
	return ret.join("");
}

function generateSeed(seed)
{
    
    var ids = ["firstname", "lastname", "bday", "email", "username", "account", "length","exclude"];
    for (i=0; i<ids.length; i++){
        var element = document.getElementById(ids[i]).value;
        for (char=0; char<element.length; char++){
            seed += element.charCodeAt(char);
        }
    }

    return seed;
}

function generatePassword()
{
    var length = document.getElementById("length").value;   
    var pw_display = document.getElementById("pw");
    var lower = 'qwertyuiopasdfghjklzxcvbnm';
    var upper = lower.toUpperCase();
    var numbers = "1234567890"
    var symbols = "!@#$%^&*()-=_+[]:;',./?`~"
    var includeLower = document.getElementById("includeLower").checked;
    var includeUpper = document.getElementById("includeUpper").checked;
    var includeNumber = document.getElementById("includeNumbers").checked;
    var includeSymbols = document.getElementById("includeSymbols").checked;
    var exclude = document.getElementById("exclude").value;    
    var seed = 0;
    var pw = "";
    var allchar = [];

    if (includeLower && includeUpper)
    {
        allchar.push(lower+upper);
        seed += 1;
    }
    else if (includeLower){
        allchar.push(lower);
        seed += 1;
    }
    else if (includeUpper){
        allchar.push(upper);
        seed += 1;
    }
    if (includeNumber){
        allchar.push(numbers);
        seed += 1;
    }
    if (includeSymbols){
        allchar.push(symbols);
        seed += 1;
    }

    for (i=0;i<exclude.length;i++){
        for (j=0;j<allchar.length;j++){
            var pos = allchar[j].indexOf(exclude[i])
            if (pos != -1){
                allchar[j] = allchar[j].substr(0, pos) + allchar[j].substr(pos+1, allchar[j].length);
            }
        }    
    }

    Math.seed = generateSeed(seed);
    
    for (i=0; i<allchar.length; i++)
    {
        allchar[i] = randomsort(allchar[i]);
    }
    
    for (i=0; i<length; i++)
    {   
        var setNum = srandom(0, allchar.length);
        var charPos = srandom(0, allchar[setNum].length);           
        pw += allchar[setNum][charPos];
    }
    
    pw_display.innerHTML = "Your password is :<br>" + pw ;
    
    event.preventDefault();
}