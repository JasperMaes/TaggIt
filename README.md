# Taggit
App for Mobile Web Applications and Security by [Jasper Maes](mailto:jasper.maes2@student.howest.be)

Web app also hosted on [GitHub](https://jaspermaes.github.io/Taggit/public/).

The repository is located on [GitHub](https://github.com/JasperMaes/Taggit).

## Running the app locally
```bash
json-server --watch db.json
```
Followed by opening a [webbrowser](http://localhost:3000).

**IMPORTANT:** The app uses the GeoLocation API. In Chrome, this is only enabled when using HTTPS or localhost.

## Generating the ServiceWorker
```bash
  npm install -g sw-precache
  sw-precache --config sw-precache-options.json --root='public' --verbose
```
