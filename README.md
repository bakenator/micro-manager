# Micro-Manager

## Instuctions to Run:

1. In the micro-manager directory create a file titled `.env` and add the following contents to the file.

```
SESSION_SECRET=replaceSecret
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
