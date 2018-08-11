import request from 'request'
import EventParser from './event-parser'

export default class EventList {
	constructor() {
		this._events = [];
		// github starts pages at 1
		this.pageNum = 1;
		this.totalCheckPages = 10;
		this.options = {
		  url: 'https://api.github.com/repos/' + process.env.REPO + '/events?page=' + this.pageNum,
		  headers: {
		    'User-Agent': 'request',
		    'Authorization': 'token ' + process.env.TOKEN
		  }
		};
	}

	add(e) {
	  if (!e) { return }
	  this._events.unshift(e);
	  if (this._events.length > 300) {
	    this._events = this._events.slice(250);
	  }
	}

	concat(list) {
		this._events = this._events.concat(list)
	}

	get events() {
		return this._events
	}

	fetch(completeCallback) {
		// this is a hack, but ok for now
		this._completeCallback = completeCallback;
		request(this.options, this.eventCallback.bind(this))
	}

	eventCallback(error, response, body) {
	  if (!error && response.statusCode == 200) {
	    const data = JSON.parse(body);
	    const ep = new EventParser()
	    const events = data.map(d => {
	      return ep.processEvent(d);
	    })

	    const eventIds = this._events.map(e => e.id);
	    
	    let processedEvents = events.filter(e => e);
	    // removing any duplicates
	    processedEvents = processedEvents.filter(e => !eventIds.includes(e.id))

	    this._events = this._events.concat(processedEvents);
	    this._events.sort((a,b) => new Date(b.time) - new Date(a.time))
	    // chaining multiple page calls for the events
	    if (this.pageNum < this.totalCheckPages) {
	      this.pageNum++;
	      this.options.url = 'https://api.github.com/repos/' + process.env.REPO + '/events?page=' + this.pageNum;
	      request(this.options, this.eventCallback.bind(this));
	    } else {
	    	// limiting the # of api calls after the first full check is done
	    	this.totalCheckPages = 3;
	    	this.pageNum = 1
	    	this.options.url = 'https://api.github.com/repos/' + process.env.REPO + '/events?page=' + this.pageNum;
	    	this._completeCallback && this._completeCallback();
	    	this._completeCallback = null;
	    	return;
	    }

	  } else {
	    console.log('event fetch error');
	  }
	}

}