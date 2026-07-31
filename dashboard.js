function updateClock(){

const now=new Date();

document.getElementById("currentDate").innerHTML=
now.toLocaleDateString("en-US",{

weekday:"long",
day:"numeric",
month:"long",
year:"numeric"

});

document.getElementById("currentTime").innerHTML=
now.toLocaleTimeString();

}

setInterval(updateClock,1000);

updateClock();