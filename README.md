# Micro-Manager

![Micro-Manager](https://raw.githubusercontent.com/bakenator/micro-manager/master/public/example.png)

Micro-Manager is a little application that can be used to keep your workers under your thumb.
The application tracks github events as they come into a repository and lists them chronologically by user.
This view can give you an overall picture of what code changes have been made in a day.

## Instructions to Run:

1. In the micro-manager directory create a file titled `.env` and add the following contents to the file.

```
SESSION_SECRET=anySecretPhrase
REPO=mrdoob/three.js
NO_AUTH=true
```

2. In the micro-manager directory run `docker build -t micro-manager .`
3. Run `docker images` and find the image ID of the micro-manager repo
4. Run `docker run -p 80:3000 [image-id]` with your image id (no brackets needed)
5. Open `http://localhost` in your browser and the app should be running!


## To Stop Server:

1. Open a new console session and run `docker container ls`
2. Find the CONTAINER ID for your app and run `docker stop [CONTAINER ID]`


## Showing a Private Repo

If you would like to show events for your org's private repo, you will need a GitHub Personal Access Token.
https://blog.github.com/2013-05-16-personal-api-tokens/
The permissions you will need to select for the token are: repo, read:org, read:user, read:discussion
Once you have your access token, add it to the .env, which should now look like this
```
SESSION_SECRET=anySecretPhrase
REPO=YOUR_ORG/YOUR_REPO
TOKEN=TheGHToken
NO_AUTH=true
```

If you rebuild the docker container and run it, the app should now show events for your own repo


## Groups

I got tired of having to click the same people for my working group every morning, so I added a config to the server that accepts a json definition of groups.  Each group will appear in the members list with a different background color than normal member.  When clicked, the group will remove all selected office drones and add in each github member in the group.
Groups can be added through a config file in the top level directory titled `groups.json`.  This file is included in the .gitignore by default.

The file will need to be formatted like so:
```
{
	"groups": [
		{"name":"GroupWhatever1", "members": ["GHName1", "GHName2", "GHName3"]},
		{"name":"GroupSomething2", "members": ["GHName3", "GHName1", "GHName4"]}
	]
}
```


## Hosting and using Github Oauth

This is an in process feature, but could be adapted for your org.
If the membership to your org is public, or there are different repo permissions in your org, the current auth scheme will not work.

If you remove the `NO_AUTH=true` the app will force the user to authenticate with a Github Application
You can create your own application on Github. https://developer.github.com/apps/building-oauth-apps/
In order to test the Oauth, you will need to host the application on the web and provide the address to github.
In the Oauth App setup, the Authorization callback URL should be `the-app-address.com/githubauth`

Once you create your application and receive your keys, add them to the .env as well.  It should look like so
```
SESSION_SECRET=anySecretPhrase
TOKEN=personalAccessToken
REPO=yourOrg/yourRepo
ORG=yourOrg
GH_BASIC_CLIENT_ID=yourGHClientID
GH_BASIC_SECRET_ID=yourGHSecretID
```

The current auth system in place takes the user's token and checks to see if they can see members of the github org.  If they can, a hash of the token is stored and the user authenticates to the app with that.  You can update how the app authenticates a user in the file `server/authentication.js:checkToken`
