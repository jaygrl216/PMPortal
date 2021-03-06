package com.sgt.pmportal.services;

import java.io.IOException;
import java.net.URISyntaxException;
import java.text.ParseException;
import java.util.List;

import org.json.JSONArray;
import org.json.JSONObject;

import com.atlassian.jira.rest.client.JiraRestClient;
import com.sgt.pmportal.domain.JiraProject;
import com.sgt.pmportal.resource.ConfigResource;

public class AlertService implements Runnable {

	//This could literally take an hour. This method should only be run on a weekly basis, if that

	public void run(){
		JSONObject userObject = null;
		try {
			userObject = ConfigResource.getUsersUnexposed();
		} catch (IOException e) {
			e.printStackTrace();
		}
		JSONArray userArray=userObject.getJSONArray("users");
		for (int i=0; i<userArray.length(); i++){
			JSONObject user=userArray.getJSONObject(i);
			String email=user.getString("email");
			if (email!=null && email!=""){
				String username=user.getString("username");
				String password=user.getString("password");
				String url=user.getString("url");
				Double seaMin=Double.valueOf(user.getString("seaMin"));
				Double seaMax=Double.valueOf(user.getString("seaMax"));
				Double eeaMin=Double.valueOf(user.getString("eeaMin"));
				Double eeaMax=Double.valueOf(user.getString("eeaMax"));
				Long bugMax=Long.valueOf(user.getString("bugMax"));
				JiraRestClient client = null;
				try {
					client = GeneralServices.login(url, username, password);
				} catch (URISyntaxException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
				String authorization=GeneralServices.encodeAuth(username, password);
				ProjectServices projectService=new ProjectServices(client, authorization, url);
				List<JiraProject> projectList=projectService.getAllJiraProjects();
				MetricsServices metricService=new MetricsServices(client, authorization, url);
				for (JiraProject project:projectList){
					String key=project.getKey();
					String projectName=project.getName();
					Double sea = 1.0;
					try {
						sea = metricService.calculateProjectSEA(project, null);
					} catch (IOException | ParseException e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}
					Double eea = 1.0;
					try {
						eea = metricService.calculateProjectEEA(project, null);
					} catch (IOException | ParseException e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}
					Long bugs=metricService.calculateBugs(key);
					if (sea<seaMin || sea>seaMax){
						String body="Your Schedule Estimation Accuracy value for project \""+projectName+"\" has exceeded the accepted limitations. "
								+ "The accepted range was from " +seaMin + " to " +seaMax + ", but the SEA value is "+sea+".";
						sendMail(email,body);
					};
					if (eea<eeaMin || eea>eeaMax){
						String body="Your Effort Estimation Accuracy value for project \""+projectName+"\" has exceeded the accepted limitations. "
								+ "The accepted range was from " +eeaMin + " to " +eeaMax + ", but the EEA value is "+eea+".";
						sendMail(email,body);
					};
					if (bugs>bugMax){
						String body="Your Bug count for project \""+projectName+"\" has exceeded the accepted limitations. "
								+ "The accepted maximum was " +bugMax+ ", but the Bug count is "+bugs+".";
						sendMail(email,body);
					};
				}
			}
		}
	}
	//This method sends an alert notification
	public static void sendMail(String m_to, String body){
		@SuppressWarnings("unused")
		NotificationService nService=new NotificationService(m_to, "PM-Portal Alert", body);
	}
}
