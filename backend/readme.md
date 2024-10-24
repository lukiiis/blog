Build using `npx tsc`
Run using `node dist/index.js` - nah dont use this

Can configure single command to build and run in package.json or later using Nx

### to run the server 
`npm run dev`

it uses `nodemon` to run the server with hot reloading 
so you dont have to run it on every code change
```json
    "dev": "npx nodemon src/index.ts",
```
