exports.getCurrentTime = function() {
    let now_date = new Date();
    let year = now_date.getFullYear();
    let month = now_date.getMonth() + 1;
    let day = now_date.getDate();
    let hour = now_date.getHours();
    let minute = now_date.getMinutes();
    let second = now_date.getSeconds();
    let t_month = month < 10 ? '0'+month : month;
    let t_day = day < 10 ? '0'+day : day;
    let t_hour = hour < 10 ? '0'+hour : hour;
    let t_minute = minute < 10 ? '0'+minute : minute;
    let t_second = second < 10 ? '0'+second : second;
    let date_time = year+"-"+t_month+"-"+t_day+" "+t_hour+":"+t_minute+":"+t_second;
    return date_time;
};

exports.getCurrentMonth = function() {
    let now_date = new Date();
    let year = now_date.getFullYear();
    let month = now_date.getMonth() + 1;    
    let t_month = month < 10 ? '0'+month : month;    
    let date = year+"-"+t_month;
    return date;
};

exports.getCurrentDate = function() {
    let now_date = new Date();
    let year = now_date.getFullYear();
    let month = now_date.getMonth() + 1;
    let day = now_date.getDate();    
    let t_month = month < 10 ? '0'+month : month;
    let t_day = day < 10 ? '0'+day : day;    
    let date = year+"-"+t_month+"-"+t_day;
    return date;
};

exports.getCurrentDateKr = function() {
    let now_date = new Date();
    let year = now_date.getFullYear();
    let month = now_date.getMonth() + 1;
    let day = now_date.getDate();
    let date = year+"년 "+month+"월 "+day+"일";
    return date;
};

exports.getYesterdayDate = function() {
    let now_date = new Date();
    now_date.setDate(now_date.getDate()-1);
    let year = now_date.getFullYear();
    let month = now_date.getMonth() + 1;
    let day = now_date.getDate();    
    let t_month = month < 10 ? '0'+month : month;
    let t_day = day < 10 ? '0'+day : day;    
    let date = year+"-"+t_month+"-"+t_day;
    return date;
};

exports.getBeforeDate = function(before_day) {
    let now_date = new Date();
    now_date.setDate(now_date.getDate()-before_day);
    let year = now_date.getFullYear();
    let month = now_date.getMonth() + 1;
    let day = now_date.getDate();    
    let t_month = month < 10 ? '0'+month : month;
    let t_day = day < 10 ? '0'+day : day;    
    let date = year+"-"+t_month+"-"+t_day;
    return date;
};

exports.getAfterDate = function(after_day) {
    let now_date = new Date();
    now_date.setDate(now_date.getDate()+after_day);
    let year = now_date.getFullYear();
    let month = now_date.getMonth() + 1;
    let day = now_date.getDate();    
    let t_month = month < 10 ? '0'+month : month;
    let t_day = day < 10 ? '0'+day : day;    
    let date = year+"-"+t_month+"-"+t_day;
    return date;
};

exports.getBeforeDateTime = function(before_day) {
    let now_date = new Date();
    now_date.setDate(now_date.getDate()-before_day);
    let year = now_date.getFullYear();
    let month = now_date.getMonth() + 1;
    let day = now_date.getDate();
    let hour = now_date.getHours();
    let minute = now_date.getMinutes();
    let second = now_date.getSeconds();
    let t_month = month < 10 ? '0'+month : month;
    let t_day = day < 10 ? '0'+day : day;
    let t_hour = hour < 10 ? '0'+hour : hour;
    let t_minute = minute < 10 ? '0'+minute : minute;
    let t_second = second < 10 ? '0'+second : second;
    let date_time = year+"-"+t_month+"-"+t_day+" "+t_hour+":"+t_minute+":"+t_second;
    return date_time;
};
exports.getAfterDateTime = function(before_day) {
    let now_date = new Date();
    now_date.setDate(now_date.getDate()+before_day);
    let year = now_date.getFullYear();
    let month = now_date.getMonth() + 1;
    let day = now_date.getDate();
    let hour = now_date.getHours();
    let minute = now_date.getMinutes();
    let second = now_date.getSeconds();
    let t_month = month < 10 ? '0'+month : month;
    let t_day = day < 10 ? '0'+day : day;
    let t_hour = hour < 10 ? '0'+hour : hour;
    let t_minute = minute < 10 ? '0'+minute : minute;
    let t_second = second < 10 ? '0'+second : second;
    let date_time = year+"-"+t_month+"-"+t_day+" "+t_hour+":"+t_minute+":"+t_second;
    return date_time;
};
exports.getBeforHour = function() {
    let now_date = new Date();
    now_date.setDate(now_date.getHours()-1);
    let year = now_date.getFullYear();
    let month = now_date.getMonth() + 1;
    let day = now_date.getDate();
    let hour = now_date.getHours();
    let minute = now_date.getMinutes();
    let second = now_date.getSeconds();
    let t_month = month < 10 ? '0'+month : month;
    let t_day = day < 10 ? '0'+day : day;
    let t_hour = hour < 10 ? '0'+hour : hour;
    let t_minute = minute < 10 ? '0'+minute : minute;
    let t_second = second < 10 ? '0'+second : second;
    let date_time = year+"-"+t_month+"-"+t_day+" "+t_hour+":"+t_minute+":"+t_second;
    return date_time;
};


exports.getCorrectDate = function(str_date) {
    let now_date = new Date(str_date);
    let year = now_date.getFullYear();
    let month = now_date.getMonth() + 1;
    let day = now_date.getDate();    
    let t_month = month < 10 ? '0'+month : month;
    let t_day = day < 10 ? '0'+day : day;    
    let date = year+"-"+t_month+"-"+t_day;
    return date;
};

exports.getCorrectDay = function(str_date) {
    let now_date = new Date(str_date);    
    let day = now_date.getDate();    
    return day;
};

exports.getCorrectDateTime = function(str_date) {
    let now_date = new Date(str_date);
    let year = now_date.getFullYear();
    let month = now_date.getMonth() + 1;
    let day = now_date.getDate();
    let hour = now_date.getHours();
    let minute = now_date.getMinutes();
    let second = now_date.getSeconds();
    let t_month = month < 10 ? '0'+month : month;
    let t_day = day < 10 ? '0'+day : day;
    let t_hour = hour < 10 ? '0'+hour : hour;
    let t_minute = minute < 10 ? '0'+minute : minute;
    let t_second = second < 10 ? '0'+second : second;
    let date_time = year+"-"+t_month+"-"+t_day+" "+t_hour+":"+t_minute+":"+t_second;
    return date_time;
};

exports.getDiffTime = function(minute) {
    let diffTime = "";

    if(minute < 60)
        diffTime = minute+"분";
    else if(minute < 60*24)
        diffTime = Math.floor(minute/60)+"시간 ";
    else if(minute < 60*24*366)
        diffTime = Math.floor(minute/60/24)+"일";
    else
        diffTime = Math.floor(minute/60/24/365)+"년";
    
    return diffTime;
};

exports.subStrWithoutBreakingTags = function(str, start, length) {    
    var countTags = 0;
    var returnString = "";
    var writeLetters = 0;
    
    while (!((writeLetters >= length) && (countTags == 0))) {
        var letter = str.charAt(start + writeLetters);
        if (letter == "<") {
            countTags++;
        }
        if (letter == ">") {
            countTags--;
        }
        returnString += letter;
        writeLetters++;
    }

    return returnString;
};