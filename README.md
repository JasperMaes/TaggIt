# Taggit
App for Mobile Web Applications and Security by [Jasper Maes](mailto:jasper.maes2@student.howest.be)

Web app also hosted on [GitHub](https://jaspermaes.github.io/Taggit/public/).

Repository located on [GitHub](https://github.com/JasperMaes/Taggit).

## Running the app locally
```bash
json-server --watch db.json
```
Followed by opening a [webbrowser](http://localhost:3000).

## Generating the rough ServiceWorker
```bash
  npm install -g sw-precache
  cd public
  sw-precache
```
