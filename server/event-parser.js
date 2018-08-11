import moment from 'moment'

export default class EventParser {
	parseWebhook(req) {
		const data = req.body;
	    data.id = req.headers['x-github-delivery']
	    data.type = req.headers['x-github-event']
	    return data
	}

	// uppercase for api events, lower case for webhooks
	processEvent(e) {
	  // having each type directly access methods to avoid one long switch
	  try {
	 	 return this[e.type](e)
		} catch (e) {
		  return null;
		}
	}

	PushEvent(e) {
		const pEvent = {}
		pEvent.id = e.id;
	      pEvent.time = e.created_at;
	      pEvent.type = e.type;
	      pEvent.user = e.actor && e.actor.login;
	      pEvent.icon = '';
	      pEvent.text = '';
	      pEvent.icon = 'P';
	      pEvent.text = `Pushed ${e.payload.size} commits to ${e.payload.ref.replace(/refs\/heads\//g,'')} branch` 
	      return pEvent;
	}

	PullRequestEvent(e) {
		const pEvent = {}
		pEvent.id = e.id;
	      pEvent.time = e.created_at;
	      pEvent.type = e.type;
	      pEvent.user = e.actor && e.actor.login;
	      pEvent.icon = '';
	      pEvent.text = '';
	      pEvent.icon = 'PR';
	      if (e.payload.pull_request.merged) {
	        pEvent.text = `Merged PR #${e.payload.number} - ${e.payload.pull_request.title}`
	      } else {
	        pEvent.text = `${e.payload.action} PR #${e.payload.number} - ${e.payload.pull_request.title}`
	      }
	      return pEvent;
	}

	issues(e) {
		const pEvent = {}
		pEvent.id = e.id;
	      pEvent.type = e.type;
	      pEvent.user = e.sender.login;
	      pEvent.icon = 'I';
	      pEvent.time = moment().format()
	      pEvent.text = `${e.action} issue #${e.issue.number} - ${e.issue.title}`;
	      return pEvent;
	}

	IssuesEvent(e) {
		const pEvent = {}
		pEvent.id = e.id;
	      pEvent.type = e.type;
	      pEvent.user = e.actor.login;
	      pEvent.icon = 'I';
	      pEvent.time = e.created_at
	      pEvent.text = `${e.payload.action} issue #${e.payload.issue.number} - ${e.payload.issue.title}`;
	      return pEvent
	}

	CreateEvent(e) {
		// dont care about repo/tag creation
		if (e.payload.ref_type !== 'branch') {return}
		const pEvent = {}
		pEvent.id = e.id;
		pEvent.type = e.type
		pEvent.user = e.actor.login;
	      pEvent.icon = 'B';
	      pEvent.time = e.created_at
	      pEvent.text = `Created branch - ${e.payload.ref}`
	      return pEvent
	}

	IssueCommentEvent(e) {
		// dont care about comment edits
		if (e.payload.action !== 'created') {return}
		const pEvent = {}
		pEvent.id = e.id;
		pEvent.type = e.type
		pEvent.user = e.actor.login;
	      pEvent.icon = 'C';
	      pEvent.time = e.created_at
	      pEvent.text = `Commented on issue #${e.payload.issue.number} - ${e.payload.issue.title}`
	      return pEvent
	}

	PullRequestReviewCommentEvent(e) {
			const pEvent = {}
		pEvent.id = e.id;
		pEvent.type = e.type
		pEvent.user = e.actor.login;
	      pEvent.icon = 'C';
	      pEvent.time = e.created_at
	      pEvent.text = `Commented on PR #${e.payload.pull_request.number} - ${e.payload.pull_request.title}`
	      return pEvent
	}

}