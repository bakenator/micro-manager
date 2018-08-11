import request from 'request'
import crypto from 'crypto'

export default class Authentication {
	constructor() {
		this._authTokens = {}
	}

	authorizedRequest(req) {
		//test env can be set in .env since tokens dont work offline
		if (process.env.NO_AUTH) {return true}
		return (req.session && req.session.token && this._authTokens[req.session.token])
	}

	authorizedSocket(socket) {
		//test env can be set in .env since tokens dont work offline
		if (process.env.NO_AUTH) {return true}
		return (socket.handshake.query && socket.handshake.query.token && this._authTokens[socket.handshake.query.token])
	}

	ghOauth(ghCode, req, redirectCallback) {
		const postOps = {
		    url: 'https://github.com/login/oauth/access_token',
		    headers: {
		       "Content-Type": "application/json"
		    },
		    body: {
	           "client_id": process.env.GH_BASIC_CLIENT_ID,
    	       "client_secret": process.env.GH_BASIC_SECRET_ID,
		       "code": ghCode,
		       "accept": "json"
	        },
	           json:true
		}

		  request.post(postOps, (error, response, body) => {
		  	  // exiting early if scope not enough
		     if (body.scope !== 'read:org') {
		        redirectCallback();
		     }
		     const token = body.access_token
		     // checks that they can see the members of org
		     // only performs callback on success
		     this.checkToken(token, (isMember = false) => {
		     	if (isMember) {
			        const tokenHash = crypto.createHash('md5').update(token).digest('hex');
			        this._authTokens[tokenHash] = true;
			        req.session.token = tokenHash;
			    }
		        redirectCallback();
		     })
		  });
	}

	// pulls the org member list to make sure token is for a valid member
	checkToken(token, callback) {
		const options = {
		  url: 'https://api.github.com/orgs/' + process.env.ORG + '/members?page='+ 1,
		  headers: {
		    'User-Agent': 'request',
		    'Authorization': 'token ' + token
		  }
		};
		request(options, (error, response, body) => {
			if (error || response.statusCode != 200) { 
				callback(false);
				return;
			}
			// not a member if they can't see more than our 1 public member
		    const data = JSON.parse(body);
		    if (data.length < 5) { 
		    	callback(false);
		    	return;
		 	}

		    callback(true);
		});
	}

}