/**********TIME**********/
function startTime() {
    var today = new Date();
    var hours = today.getHours();
    var minutes = today.getMinutes();
    var seconds = today.getSeconds();
    
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var strTime = hours + ':' + minutes + ':' + seconds + ' ' + ampm;
    
    document.getElementById('time').innerHTML = "Time is: " +
    strTime;
    var t = setTimeout(startTime, 500);
}

/**********CLOCK**********/
function startClock() {
    
    var props = 'transform WebkitTransform MozTransform OTransform msTransform'.split(' '),
        prop,
        el = document.createElement('div');

    for(var i = 0, l = props.length; i < l; i++) {
        if(typeof el.style[props[i]] !== "undefined") {
            prop = props[i];
            break;
        }
    }
        var angle = 360/60,
            date = new Date(),
            hour = date.getHours() % 12,
            minute = date.getMinutes(),
            second = date.getSeconds(),
            hourAngle = (360/12) * hour + (360/(12*60)) * minute;

        if(prop) {
            $('#minute')[0].style[prop] = 'rotate('+angle * minute+'deg)';
            $('#second')[0].style[prop] = 'rotate('+angle * second+'deg)';
            $('#hour')[0].style[prop] = 'rotate('+hourAngle+'deg)';
        }
    
    var t = setTimeout(startClock, 1000);
    }


/**********DATE**********/
function getDate() {
    var today = new Date();
    
    var weekday = new Array(7);
    weekday[0]=  "Sunday";
    weekday[1] = "Monday";
    weekday[2] = "Tuesday";
    weekday[3] = "Wednesday";
    weekday[4] = "Thursday";
    weekday[5] = "Friday";
    weekday[6] = "Saturday";
    var day = weekday[today.getDay()];
    
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //January is 0!
    var yyyy = today.getFullYear();

    if (dd < 10) {
        dd = '0' + dd
    }

    if (mm < 10) {
        mm = '0' + mm
    }

    today = day + ", " +mm + '/' + dd + '/' + yyyy;
    document.getElementById("date").innerHTML = "Today is: " + today;
}


/**********CALENDAR**********/

var app = angular.module("calApp", []);
var monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];

 app.factory('weatherService', ['$http', '$q', function ($http, $q){
      function getWeather() {
        var deferred = $q.defer();
        $http.get('https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%20in%20(2211027)&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=')
          .success(function(data){
            deferred.resolve(data.query.results.channel);
          })
          .error(function(err){
            console.log('Error retrieving markets');
            deferred.reject(err);
          });
        return deferred.promise;
      }
      
      return {
        getWeather: getWeather
      };
    }]);


app.controller("calendarController", ['$scope','weatherService',function($scope,weatherService) {
    
    if (typeof (date) === 'undefined') {
        date = new Date();
    } else {
        date = new Date(date);
    }

    var year = date.getFullYear(),
            month = date.getMonth(),
            todate = (new Date()),
            monStr = monthNames[month],
            day = date.getDate(),
            dayInMon = (new Date(date.getFullYear(), date.getMonth() + 1, 0)).getDate();
            
            
            
    $scope.currMonth = monStr + ", " + year.toString();
    $scope.preMonth = new Date(year, month - 1, day);
    $scope.nextMonth = new Date(year, month + 1, day);
    $scope.todate = todate;
    $scope.weeks = new Array([],[],[],[],[],[],[]);
    

    
    
    var monthStartDate = (new Date(date.getFullYear(), date.getMonth(), 1));
    var monthStartDay = monthStartDate.getDay();
    var LastDayPrevMonth = new Date(year, month, 0);

    //Converting Sunday 0, Monday 1 to Monday 1, Sunday 7.
    if (monthStartDay === 0) {
        monthStartDay = 7;
    }

    var preMonDayIte = monthStartDay - 1;
    var preMonDateIte = 0;
    var weekSlot = 0;
    while (preMonDayIte > 0) {
        var preMonDate = new Date(year, month, preMonDateIte--);
        var day = {};
        day.number = preMonDate.getDate();
        day.id = 'pre_'+day.number;
        day.class = "disabled";
        day.data = day.number + "  ";
        $scope.weeks[weekSlot].push(day);
        preMonDayIte--;
    }
    $scope.weeks[weekSlot].reverse();
    var weekHasSpace = 7-$scope.weeks[0].length;
    if(weekHasSpace<1){
        weekSlot++;
        weekHasSpace = 7;
    }
    
    var dayIte = monthStartDay;
    for (var dateIte = 1; dayIte < 43, dateIte < dayInMon + 1; dayIte++, dateIte++) {
        var date = new Date(year, month, dateIte);
        var isToday = ((todate.getDate() === date.getDate()) ? true : false);
        var day = {};
        day.number = date.getDate();
        day.id = 'curr_'+day.number;
        day.weather = ' ';
        day.data = day.number + " " + day.weather;
        day.class = (isToday)?"today":"";
            var weekHasSpace = 7-$scope.weeks[weekSlot].length;
        if(weekHasSpace<1){
            weekSlot++;
            weekHasSpace = 7;
        }

        $scope.weeks[weekSlot].push(day);
    }

    var nextMonDayIte = dayIte;
    var nextMonDateIte = 1;
    while (nextMonDayIte < 43) {
        var nextMonDate = new Date(year, month + 1, nextMonDateIte++);
        var day = {};
        day.number = nextMonDate.getDate();
        day.id = 'next_'+day.number;
        day.class = "disabled";
        day.data = day.number + " ";
        var weekHasSpace = 7-$scope.weeks[weekSlot].length;
        if(weekHasSpace<1){
            weekSlot++;
            weekHasSpace = 7;
        }

        $scope.weeks[weekSlot].push(day);
        
        
        nextMonDayIte++;
    }
    
//    weatherService.getWeather().then(function(data){
//        $scope.weather = data;
//        document.getElementsByClassName('today')[0].innerHTML = data.item.condition.temp+"F "+data.item.condition.text;
//        console.log($scope.weather);
//    });
    
}]);

function createMonthlyView(date) {
    if (typeof (date) === 'undefined') {
        date = new Date();
    } else {
        date = new Date(date);
    }

    var year = date.getFullYear(),
            month = date.getMonth(),
            monStr = monthNames[month],
            day = date.getDate(),
            dayInMon = (new Date(date.getFullYear(), date.getMonth() + 1, 0)).getDate();


    // Change the header to match the current month
    $("#currMonth").html("<div class='calCap'>" + monStr + ", " + year.toString() + "</div>");

    var previous = "<a href='#' id='a_previousMonth' data-transition='slide' class='previous-btn icon left'>Previous</a>";
    $("#preMonth").html(previous);

    $("#a_previousMonth").click(function(event) {
        createMonthlyView(new Date(year, month - 1, day));
    });

}


/**********TEMPERATURE**********/
function getTemp() {
    var oReq = new XMLHttpRequest();
    oReq.onload = getWeather;
    oReq.open("get", "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%20in%20(2211027)&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=", true);
    oReq.send();

    function getWeather() {
        weatherData = JSON.parse(this.responseText).query;
        localStorage.setItem("weather", JSON.stringify(weatherData));
        var temperature = JSON.parse(localStorage.getItem("weather")).results.channel.item.condition.temp;
        var condition = JSON.parse(localStorage.getItem("weather")).results.channel.item.condition.text;
        //console.log(data);
        document.getElementById("temperature").innerHTML = "Current Temperature: " +temperature + "°F " + "Condition: " + condition;
    }
}


/************WEATHER************/
function detailedWeather(){
    var data = JSON.parse(localStorage.getItem("weather"));
    document.getElementById("weatherDetail").innerHTML="Current Temperature: "+data.results.channel.item.condition.temp + "°F  " + "<br />" + "Condition: " + data.results.channel.item.condition.text + "<br />" + "  High: "+data.results.channel.item.forecast[0].high + "<br />" + "  Low: "+data.results.channel.item.forecast[0].low;
}