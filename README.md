# Micro-Manager

![Micro-Manager](https://raw.githubusercontent.com/bakenator/micro-manager/master/public/example.png)

Micro-Manager is a little application that can be used to keep your workers under your thumb.
The application tracks github events as they come into a repository and lists them chronologically by user.
This view can give you an overall picture of what code changes have been made in a day.

## Instructions to Run:

1. In the micro-manager directory create a file titled `.env` and add the following contents to the file.

```
SESSION_SECRET=anySecretPhrase
REPO=uber/deck.gl
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

If you rerun the instructions from before, the app should now show events for your own repo

## Hosting and using Github Oauth

This is an in process feature, but could be adapted for other orgs.
If the membership to your org is public, or there are different repo permissions in your org, this auth scheme will not work.

If you remove the `NO_AUTH=true` the app will force the user to authenticate with a Github Application
You can create your own application on Github. https://developer.github.com/apps/building-oauth-apps/
In order to test the Oauth, you will need to host the application on the web and provide the address to github.
In the Oauth App setup, the Authorization callback URL should be `your-site.com/githubauth`

Once you create your application and receive your keys, add them to the .env as well.  It should look like so
```
SESSION_SECRET=anySecretPhrase
TOKEN=personalAccessToken
REPO=yourOrg/yourRepo
ORG=yourOrg
GH_BASIC_CLIENT_ID=70a28544760635cebaae
GH_BASIC_SECRET_ID=b934edbe34b74d8c31e25acd1f24e38c60c9fdee
```

The current auth system in place takes the user's token and checks to see if they can see members of the github org.  If they can, a hash of the token is stored and the user authenticates to the app with that.  You can update how the app authenticates a user in the file `server/authentication.js:checkToken`
