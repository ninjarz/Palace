

window.onload=function() {

};

function generate() {
    var date = [];
    for (var i = 0; i < 81; ++i) {
        var year = 0;
        var month = 0;
        var day = 0;

        if (random(0, 100) < 70) {
            year = 2016;
        } else {
            year = 2015;
        }
        if (year == 2015) {
            if (random(0, 100) < 90) {
                month = 12;
                day = random(1, 30);
            } else {
                month = 11;
                day = random(1, 31);
            }
        } else if (year == 2016) {
            month = random(1, 1);
            day = random(1, 27);
        }
        
        date.push([year, month, day].join("-"));
    }

    var result = document.getElementById("result");
    result.innerText = date.join("\n");
}

function random(min, max)
{
    var range = max - min;
    var rand = Math.random();
    return min + Math.round(rand * range);
}