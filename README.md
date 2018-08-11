# activityPub

Instuctions to Run:

1. In the micro-manager directory create a file titled `.env` and add the following contents to the file.

```
SESSION_SECRET=replaceSecret
TOKEN=None
REPO=uber/deck.gl
ORG=uber
NO_AUTH=true
```

2. In the micro-manager directory run `docker build -t micro-manager .`
3. Run `docker images` and find the image ID of the micro-manager repo
4. Run `docker run -p 80:3000 [image-id]` with your image id (no brackets needed)
5. Open ``
