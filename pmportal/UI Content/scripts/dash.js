var username = "jwashington";
var password = "Diamond2017";
var baseURL = "http://54.152.100.242/jira";
var homeResource = "http://localhost:8080/pmportal/rest/home/" + username + "/" + password + "/" + baseURL;
var responseObject;

 var barData = {
    labels: ['Italy', 'UK', 'USA', 'Germany', 'France', 'Japan'],
    datasets: [
        {
            label: '2010 customers #',
            fillColor: '#382765',
            data: [2500, 1902, 1041, 610, 1245, 952]
        },
        {
            label: '2014 customers #',
            fillColor: '#7BC225',
            data: [3104, 1689, 1318, 589, 1199, 1436]
        }
    ]
};

$.ajax({
url: homeResource,
dataType: "json"
}).fail(function(xhr, status, errorThrown ) {
    console.log("Error: " + errorThrown );
    console.log("Status: " + status );
    console.dir(xhr);
}).done(function(jsonObject){
    console.log("SUCCESS");
	responseObject = jsonObject;
});

$(document).ajaxStop(function () {
    var projectArray;
    projectArray = responseObject.projects;
    console.log(projectArray.length);

     $.each(projectArray, function (index, proj) {
        var num = index + 1;
        $("#projectList").append("<li>" + proj.name +  "</li>");
        console.log(proj);
        });
      $("#projectList li").click(function(){
        console.log("Project was clicked");
    });
    
    $("#graph1").append("<h5> Project Name: " + projectArray[0].name + "</h5>").append
        ("<h5> Project Lead: " + projectArray[0].lead.displayName + "</h5>");
});

$(document).ready(function() {
    var ctx = document.getElementById('clients').getContext('2d');
    var myBarChart = new Chart(ctx, {
    type: 'line',
    data: barData,
    options: {
        maintainAspectRatio: false,
        responsive: true
        }
    });
});
    
  

