var email=getCookie("email").toString();
if (email!=""){
	$("#emailInput").val(email);
};
var pm=getCookie("pm").toString();
if (pm==""){
	window.location="index.html";
};
var hostURL=window.location.host;
function passCheck(){
	$("#curPass").css("border", "2px inset #ffffff")
	$("#newPass").css("border","2px inset #ffffff");
	$("#confirmPass").css("border", "2px inset #ffffff");
	var curPass=$("#curPass").val();
	var newPass=$("#newPass").val();
	var confirmPass=$("#confirmPass").val();
	if (newPass!=""){
		if (newPass==confirmPass){
			var testResource = "http://" + hostURL
			+ "/pmportal/rest/test/login/" + pm + "/" + curPass;
			$.ajax({
				type : "GET",
				dataType : "text",
				url : testResource
			}).fail(function(xhr, status, errorThrown) {
				console.log("Error: " + errorThrown);
				console.log("Status: " + status);
				console.dir(xhr);
				alert("Failed to contact server!");
			}).done(function(response) {
				if (response == "Success") {
					saveSettings();
				}else{
					alert("Wrong password!");
					$("#curPass").css("border", "2px inset #ff0000");
				};
			});
		}else{
			alert("Passwords do not match!");
			$("#newPass").css("border","2px inset #ff0000");
			$("#confirmPass").css("border", "2px inset #ff0000");
		};
	}else{
		saveSettings();
	};
};
function saveSettings(){
	var newPass=$("#newPass").val();
	var eaddress=$("#emailInput").val();
	var jname=$("#userText").val();
	var baseURL=$("#urlText").val();
	var jpass=$("#passText").val();
	var alias=$("#alias").val();
	var seaMin=$("#seaMin").val();
	var seaMax=$("#seaMax").val();
	var eeaMin=$("#eeaMin").val();
	var eeaMax=$("#eeaMax").val();
	var bugMax=$("#bugMax").val();
	var testResource="http://"+hostURL+"/pmportal/rest/test/jira/" + jname + "/" + jpass + "/" +baseURL;
	if (jname!=""){
		$.ajax({
			type:"GET",
			dataType:"text",
			url:testResource
		}).fail(function( xhr, status, errorThrown ) {
			console.log( "Error: " + errorThrown );
			console.log( "Status: " + status );
			console.dir( xhr );
			$("#fail").css("visibility","visible");
		}).done(function(response){
			if (response=="Success"){
				saveToConfig(jname, jpass, baseURL, alias, eaddress, newPass);
				saveBounds(seaMin, seaMax, eeaMin, eeaMax, bugMax);
				alert("Settings saved!");
			}else{
				alert("Login failed!");
			};
		});
	}else{
		saveToConfig(jname, jpass, baseURL, alias,eaddress, newPass);
		saveBounds(seaMin, seaMax, eeaMin, eeaMax, bugMax);
		alert("Settings saved!");
	};
};
function saveToConfig(jname, jpass, baseURL, alias, eaddress, newPass){
	var updateRequest = "{\"pm\":\"" + pm + "\", \"password\":\""
	+ newPass + "\", \"email\":\"" + eaddress + "\"}";
	var saveRequest="{\"pm\":\"" + pm + "\", \"username\":\"" +jname+"\", \"password\":\""+ jpass + "\", \"url\":\"" + baseURL+"\", \"alias\":\"" + alias+"\", \"seaMin\":\""+0.8+"\", \"seaMax\":\""+1.25+"\", \"eeaMin\":\""+0.8+"\", \"eeaMax\":\""+1.25+"\", \"bugMax\":\""+10+"\"}";
	var updateResource = "http://" + hostURL + "/pmportal/rest/config/save/update";
	var saveResource = "http://" + hostURL + "/pmportal/rest/config/save";
	$.ajax({
		type : "POST",
		data : updateRequest,
		dataType : "text",
		url : updateResource
	}).fail(function(xhr, status, errorThrown) {
		console.log("Error: " + errorThrown);
		console.log("Status: " + status);
		console.dir(xhr);
	}).done(function(response) {
		if  (jname!=""){
			$.ajax({
				type : "POST",
				data : saveRequest,
				dataType : "text",
				url : saveResource
			}).fail(function(xhr, status, errorThrown) {
				console.log("Error: " + errorThrown);
				console.log("Status: " + status);
				console.dir(xhr);
			});
		}
		settingsCookie(eaddress);
		//clear password boxes
		$("#curPass").val("");
		$("#newPass").val("");
		$("#confirmPass").val("");
	});
};

//the bounds are saved for the current jira user
function saveBounds(seaMin, seaMax, eeaMin, eeaMax, bugMax){
	var username=getCookie("username");
	var password=getCookie("password");
	var jiraurl=getCookie("url");
	var getResource="http://"+hostURL+"/pmportal/rest/config/get/user/"+pm+"/"+jiraurl;
	var saveResource = "http://" + hostURL + "/pmportal/rest/config/save";
	//Get the current user's data, then update it
	$.ajax({
		type:"GET",
		dataType:"json",
		url:getResource
	}).fail(function( xhr, status, errorThrown ) {
		console.log( "Error: " + errorThrown );
		console.log( "Status: " + status );
		console.dir( xhr );
	}).done(function(jsonObject){
		var alias=jsonObject.alias.toString();
		var saveRequest="{\"pm\":\"" + pm + "\", \"username\":\"" +username+"\", \"password\":\""+ password + "\", \"url\":\"" + jiraurl+"\", \"alias\":\"" + alias+"\", \"seaMin\":\""+seaMin+"\", \"seaMax\":\""+seaMax+"\", \"eeaMin\":\""+eeaMin+"\", \"eeaMax\":\""+eeaMax+"\", \"bugMax\":\""+bugMax+"\"}";
		$.ajax({
			type : "POST",
			data : saveRequest,
			dataType : "text",
			url : saveResource
		}).fail(function(xhr, status, errorThrown) {
			console.log("Error: " + errorThrown);
			console.log("Status: " + status);
			console.dir(xhr);
		});
	});
};

function testEmail(){
	var eaddress=$("#emailInput").val();
	var testResource="http://"+hostURL+"/pmportal/rest/test/email/"+eaddress;
	$.ajax({
		type:"GET",
		dataType:"text",
		url:testResource
	}).fail(function( xhr, status, errorThrown ) {
		console.log( "Error: " + errorThrown );
		console.log( "Status: " + status );
		console.dir( xhr );
		alert("Failed to reach server!")
	}).done(function(response){
		if (response=="Sent"){
			alert("An email has been sent to the specified address");
		}else{
			alert("Email failed to send!");
		};
	});
};

function resetSEA(){
	$("#seaMin").val("0.8");
	$("#seaMax").val("1.25");
};
function resetEEA(){
	$("#eeaMin").val("0.8");
	$("#eeaMax").val("1.25");
};
function resetBugs(){
	$("#bugMax").val("10");
};

function logout(){
	setCookie("","","","");
	settingsCookie("");
	window.location="index.html";
}
