var getLine = function(line) {
    
    var day = new Date().getDay();
    
    if (day == 0) {
        return require('./json/' + line + '-sunday.json');       
    } else if (day == 6) {
        return require('./json/' + line + '-saturday.json');
    } else {
        return require('./json/' + line + '.json');
    }
}

var getNextTrain = function(line, start, destination) {
    
    var line = getLine(line),
        stations = line.stations,
        lines = line.lines;
    
    var startIndex,
        stopIndex;
          
    for (i in stations) {
        if (stations[i].name == start) {
            startIndex = i;
        }
        if (stations[i].name == destination) {
            stopIndex = i;
        }
    }
    
    var direction = "Inbound";

    if (parseInt(startIndex) > parseInt(stopIndex)) {
        direction = "Outbound";
        startIndex = (stations.length-1) - startIndex;
        stopIndex = (stations.length-1) - stopIndex;
    }
    
    var currentTime = new Date(),
        train = {};
        
        train.start = currentTime*2,
        train.stop = currentTime*2,
        train.available = true;
        
    for (j in lines) {
        if (lines[j].direction == direction) {
            var time = lines[j].stops[startIndex].time;
            if (time != "") {
                var parsedTime = parseTime(time);
                if (parsedTime > currentTime && parsedTime < train.start && lines[j].stops[stopIndex].time != "") {
                    train.start = time;
                    if (lines[j].stops[stopIndex].time != "") {
                        train.stop = lines[j].stops[stopIndex].time;
                        train.available = true;
                    } else {
                        train.stop = "Does not stop at station";
                        train.available = false;
                    }
                    train.number = lines[j].name;
                }
            }
        }
    }
    
    if (train.start == currentTime*2) {
        return { "error": "No trains available today" };
    }
    
    return train;
}

var parseTime = function(timeStr, dt) {
    if (!dt) {
        dt = new Date();
    }
 
    var time = timeStr.match(/(\d+)(?::(\d\d))?\s*(p?)/i);
    if (!time) {
        return NaN;
    }
    var hours = parseInt(time[1], 10);
    if (hours == 12 && !time[3]) {
        hours = 0;
    }
    else {
        hours += (hours < 12 && time[3]) ? 12 : 0;
    }
 
    dt.setHours(hours);
    dt.setMinutes(parseInt(time[2], 10) || 0);
    dt.setSeconds(0, 0);
    return dt;
}


module.exports = getNextTrain;
