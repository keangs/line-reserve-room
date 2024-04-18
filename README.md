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

### Deploy

1. แก้ไขโปรแกรมที่ branch master
2. commit code
3. ไปที่ branch gh-pages
4. git merge master
5. npm run build
6. git add dist
7. git commit -m "update Static"
8. git subtree push --prefix dist origin gh-pages
