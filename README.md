# line-reserve-room

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).


### Deploy 
@branch gh-pages
git merge master

npm run build

git add dist
git commit -m "update Static"
git subtree push --prefix dist origin gh-pages
