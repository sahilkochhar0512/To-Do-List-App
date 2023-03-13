module.exports.getDate=getDate;
//module.exports is a javascript object
function getDate(){
var today=new Date();
    var options={
        weekday:"long",
        day: "numeric",
        month: "long"
        };
    //Below is the code to find particular day of the week
    return today.toLocaleDateString("en-us", options);
};
module.exports.getDay=getDay;
function getDay(){
var today=new Date();
    var options={
        weekday:"long",
        };
    //Below is the code to find particular day of the week
    return today.toLocaleDateString("en-us", options);
};
