package com.sgt.pmportal.services;

import java.util.ArrayList;
import java.util.List;

import com.atlassian.jira.rest.client.JiraRestClient;
import com.atlassian.jira.rest.client.domain.BasicIssue;
import com.atlassian.jira.rest.client.domain.User;
import com.sgt.pmportal.domain.JiraIssue;
import com.sgt.pmportal.domain.JiraUser;

/**
 * A class that works with Jira Users
 * 
 * @author Jada Washington
 * @author Aman Mital
 *
 */
public class UserServices {
	JiraRestClient client;
	
	/**
	 * Constructor for UserServices
	 * @param client
	 */
	public UserServices(JiraRestClient client) {
		this.client = client;
	}
	
	/**
	 * Gets the lead of a project
	 * 
	 * @param projectKey
	 * @return
	 */
	public JiraUser getProjectLead(String projectKey){
		return toJiraUser(client.getUserClient().getUser
				(client.getProjectClient().getProject(projectKey).claim().getLead().getName()).claim());
	}
	
	/**
	 * Gets who is assigned to an issue
	 * @param issueKey
	 * @return
	 */
	public JiraUser getAssignee(String issueKey){
		return toJiraUser(client.getUserClient().getUser
				(client.getIssueClient().getIssue(issueKey).claim().getAssignee().getName()).claim());
	}
	
	/**
	 * Returns JiraIssues associated with a user
	 * 
	 * @param username
	 * @return
	 */
	public List<JiraIssue> assignedTo(String username) {
		ArrayList<JiraIssue> issues = new ArrayList<>();
		Iterable<BasicIssue> issueList = client.getSearchClient().searchJql(
				"assignee=" + username,1000,0).claim().getIssues();
		System.out.print("Loading Issues for User: " + username + " ...");
		for (BasicIssue i: issueList){
			System.out.print(".");
			JiraIssue j = GeneralServices.toJiraIssue(i, client);
			issues.add(j);
		}
		System.out.println();
		return issues;
	}
	
	/**
	 * Returns a JiraUser representation of a User
	 * @param user
	 * @return
	 */
	public JiraUser toJiraUser(User user){
		return new JiraUser(user.getName(), user.getDisplayName(), 
				user.getEmailAddress(), user.getTimezone(), user.getAvatarUri());
	}

}