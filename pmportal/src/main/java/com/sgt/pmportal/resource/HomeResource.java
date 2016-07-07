package com.sgt.pmportal.resource;

import java.io.IOException;
import java.net.URISyntaxException;
import java.text.ParseException;
import java.util.List;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import com.atlassian.jira.rest.client.JiraRestClient;
import com.sgt.pmportal.domain.JiraProject;
import com.sgt.pmportal.domain.Release;
import com.sgt.pmportal.services.GeneralServices;
import com.sgt.pmportal.services.ProjectServices;


@Path ("/home/{username}/{password}/{url:.+}")

public class HomeResource {
	
	public String getProjects(@PathParam ("username") String username, 
			@PathParam ("password")	String password, 
			@PathParam ("url") String url) throws URISyntaxException, IOException, ParseException{
		JiraRestClient client=GeneralServices.login(url, username, password);
		String authorization=GeneralServices.encodeAuth(username, password);
		ProjectServices projectService=new ProjectServices(client, authorization, url);
		List<JiraProject> projectList=projectService.getAllJiraProjects();
		StringBuilder responseString=new StringBuilder();
		responseString.append("{project:[");
		for (JiraProject project:projectList){
		responseString.append(project.JSONString());
		}
		responseString.append("]}");
		return responseString.toString();
	}
	
}

