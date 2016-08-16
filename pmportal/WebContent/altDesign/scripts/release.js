var username=getCookie("username").toString();
if (username==""){
	window.location="index.html";
};
var password=getCookie("password").toString();
var baseURL=getCookie("url").toString();
var hostURL = window.location.host;
var homeResource = "http://"+hostURL+"/pmportal/rest/home/" + username + "/" + password + "/" + baseURL;
//var issueResource = "http://"+hostURL+"/pmportal/rest/issues/" + projKey + "/" + username + "/" + password + "/" + baseURL;
//var metricResource = "http://"+hostURL+"/pmportal/rest/metrics/project/basic/" + projKey + "/" + username + "/" + password + "/" + baseURL;
var stop = 0;
var projectArray;
var projKey = "";
var date = "";
var week = "";
var current = new Date();

switch(current.getDay()) {
    case 0:
        week = week .concat("Sunday ");
        break;
    case 1:
        week = week.concat("Monday ");
        break;
    case 2:
        week = week.concat("Tuesday ");
        break;
    case 3:
        week = week.concat("Wednesday ");
        break;
    case 4:
        week = week.concat("Thursday ");
        break;
    case 5:
        week = week.concat("Friday ");
        break;
    case 6:
        week = week.concat("Saturday ");
        break;
}

switch(current.getMonth()) {
    case 0:
        date = date.concat("January ");
        break;
    case 1:
        date = date.concat("February ");
        break;
    case 2:
        date = date.concat("March ");
        break;
    case 3:
        date = date.concat("April ");
        break;
    case 4:
        date = date.concat("May ");
        break;
    case 5:
        date = date.concat("June ");
        break;
    case 6:
        date = date.concat("July ");
        break;
    case 7:
        date = date.concat("August ");
        break;
    case 8:
        date = date.concat("September ");
        break;
    case 9:
        date = date.concat("October");
        break;
    case 10:
        date = date.concat("November ");
        break;
    case 11:
        date = date.concat("December ");
        break;
}

date = date.concat(current.getDate() + ", 20" + (current.getYear() - 100));


var barData = {
		labels: [],
		datasets: [
		           {
		        	   label: 'Issues Created',
		        	   backgroundColor: "rgba(105, 214, 209, 0.6)",
		        	   borderColor: "rgba(105, 214, 209, 0.8)",
		        	   data: []
		           },
		           {
		        	   label: 'Issues Completed',
		        	   backgroundColor: "rgba(41, 40, 46, 0.8)",
		        	   borderColor: "rgba(41, 40, 46, 1)",
		        	   data: []
		           }
		           ],
};

var pieData = {
		labels: [
		         "Completed",
		         "To Do",
		         ],

		         datasets: [
		                    {
		                    	data: [0,0],
		                    	backgroundColor: [
		                    	                  "#6AF263",
		                    	                  "#D8F545",
		                    	                  ],
		                    	                  hoverBackgroundColor: [
		                    	                                         "#BAFAB6",
		                    	                                         "#E6F59A",
		                    	                                         ]
		                    }]
};


$(document).ready(function(){
    $('#section5').append("<p>" + week + "<br>"+ date + "</p>");
    
    $("#projList").on( "click", "li" , function () {
		var item = $(this).text();
		$.each(projectArray, function (index, proj) {
			if(proj.name == item) {
				showProjectData(index);
			}
		});
	});
});

$.ajax({
	url: homeResource,
	dataType: "json"
}).fail(function(xhr, status, errorThrown ) {
	console.log("Error: " + errorThrown );
	console.log("Status: " + status );
	console.dir(xhr);
}).done(function(jsonObject){
	responseObject = jsonObject;

	projectArray = responseObject.projects;

	$.each(projectArray, function (index, proj) {
		var num = index + 1;
		$("#projectList").append("<li>" + proj.name +  "</li>");
	});
});

$(document).ajaxStop(function () {
    if(stop == 0) {
        createBar();
        createPie();
        showInitialData();
        stop = 1;
    }
});

function showInitialData() {
	var project = projectArray[0];
    console.log(project);

    $('#info').empty();
    $('#info').append("<h3> Project Information </h3>").append("<p> Project Name: " + project.name+ "</p>").append
    ("<p> Project Lead: " + project.lead.displayName+ "</p>").append("<p> Project Due Date: " + project.due + "</p>");
//    projDate = project.due.split("-");
//    due = new Date();
//    due.setMonth(projDate[0]);
//    due.setDate(projDate[1]);

     projKey = project.key;
    $("#metricLink").attr("href", "metrics.html?project=" + projKey);
    metricResource = "http://"+hostURL+"/pmportal/rest/metrics/project/basic/" + projKey + "/" + username + "/" + password + "/" + baseURL;
    issueResource = "http://"+hostURL+"/pmportal/rest/issues/" + projKey + "/" + username + "/" + password + "/" + baseURL;

    $.ajax({
		url: metricResource,
		dataType: "json"
	}).fail(function(xhr, status, errorThrown ) {
		console.log("Error: " + errorThrown );
		console.log("Status: " + status );
		console.dir(xhr);
	}).done(function(jsonObject){
		responseObject3 = jsonObject;
		metrics = responseObject3;
		pieData.datasets[0].data[0] = Math.round(metrics.progress * 100) / 100;
		pieData.datasets[0].data[1] = Math.round((100 - metrics.progress) * 100) / 100;
		createPie();
	});


    $.ajax({
		url: issueResource,
		dataType: "json"
	}).fail(function(xhr, status, errorThrown ) {
		console.log("Error: " + errorThrown );
		console.log("Status: " + status );
		console.dir(xhr);
	}).done(function(jsonObject){
		console.log("SUCCESS");
		responseObject2 = jsonObject;
		issueArray = responseObject2.issues;
		var completed = 0;
		var toDo = 0;

		$.each(issueArray, function (index, issue) {
			if(issue.status == "Resolved" || issue.status == "Closed" || issue.status == "Done") {
				completed = completed + 1;
			} else {
				toDo = toDo + 1;
			}
		});
		barData.datasets[0].data[0] = issueArray.length
		barData.datasets[1].data[0]= completed;
		createBar();
	});
}

function createBar() {
	var ctx = document.getElementById('bar').getContext('2d');
	barChart = new Chart(ctx, {
		type: 'bar',
		data: barData,
		options: {
			maintainAspectRatio: false,
			responsive: true,
			scales: {
				yAxes: [{
					ticks: {
						beginAtZero:true
					}
				}]
			}
		}

	});
}

function createPie() {
	var ctx = document.getElementById('pie').getContext('2d');
	pieChart = new Chart(ctx, {
		type: 'pie',
		data: pieData,
		options: {
			maintainAspectRatio: true,
			responsive: true
		}
	});
}


