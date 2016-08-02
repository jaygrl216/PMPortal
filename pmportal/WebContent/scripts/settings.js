var email=getCookie("email").toString();
$("#userText").val(getCookie("username").toString());
$("#urlText").val(getCookie("url").toString());
if (email!=""){
$("#emailInput").val(email);
};

var hostURL=window.location.host;
function saveSettings(){
	var eaddress=$("#emailInput").val();
	var user=$("#userText").val();
	var baseURL=$("#urlText").val();
	var pass=$("#passText").val();
	var remember=$("#rememberBox").prop("checked");

	var testResource="http://"+hostURL+"/pmportal/rest/test/login/" + user + "/" + pass + "/" +baseURL;
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
			setCookie(user, pass, baseURL, remember);
			alert("Successfully saved credentials")
		}else{
			alert("Login failed!");
};
});
	settingsCookie(eaddress);
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