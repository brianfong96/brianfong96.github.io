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

function randomInt(min, max)
{
    var r = Math.round(Math.seededRandom()*max);
    if (r < min){
        r = min;
    }
    else if (r >= max){
        r = max-1;
    }
    return r;
}

function encrypt(s)
{
    var e = "";
    for(var i = 0; i < s.length; i++)
    {
        var c = s.charCodeAt(i);
        var k = randomInt(0, 65535);
        r = c ^ k;
        Math.seed = Math.seed + k;        
        e += '&#'+r+';';
    }    
    return e;
}

function decrypt()
{
    Math.seed = prompt("Please enter the key", "0");
    var titles = document.getElementsByClassName("mbr-section-title display-1");
    var bodies = document.getElementsByClassName("lead");
    var results = "";
    for(var i = 0; i < titles.length; i++)
    {
        console.log(titles.item(i).innerHTML);
        var e = encrypt(titles.item(i).innerHTML);
        titles.item(i).innerHTML = e;        
        console.log(e);

        console.log(bodies.item(i).innerHTML);
        var e = encrypt(bodies.item(i).innerHTML);
        bodies.item(i).innerHTML = e;  
        console.log(e);
    } 
}