import request from 'request'

export default class MemberModel {
	constructor() {
		this._members = [];
		// github starts pages at 1
		this.pageNum = 1;
		this.options = {
		  url: 'https://api.github.com/repos/' + process.env.REPO + '/contributors?page='+ this.pageNum,
		  headers: {
		    'User-Agent': 'request',
		    'Authorization': process.env.NO_AUTH ? '' : 'token ' + process.env.TOKEN
		  }
		};
	}

	get members() {
		return this._members
	}

	fetch() {
		request(this.options, this.memberCallback.bind(this))
	}

	memberCallback(error, response, body) {
	  if (!error && response.statusCode == 200) {
	    const data = JSON.parse(body);

	    this._members = this._members.concat(data.map(m => {
	      return {user: m.login, user_pic: m.avatar_url}
	    }));	    
	    // chaining multiple page calls for the events
	    if (this.pageNum < 3) {
	      this.pageNum++;
	      this.options.url = 'https://api.github.com/repos/' + process.env.REPO + '/contributors?page=' + this.pageNum;
	      request(this.options, this.memberCallback.bind(this));
	    }

	  } else {
	    console.log('member fetch error');
	  }
	}
}