
const glob = require('glob');
const path = require('path');
const fs = require('fs');
const {in: target, verbose} = require('./args');

const shift = (p) => {
    return path.normalize(p).split(path.sep).slice(1).join('/')
}

const compose = (...fns) => (...args) => fns.forEach(fn => fn(...args));

const link = (p, file) => `module.exports = require('${path.relative(p,file).replace(/\\/g,'/')}')`

glob(path.join(target, '/**/*.js'), (err, files) => {
    files.map(shift).forEach(compose(
        (p) => fs.mkdirSync(path.dirname(p), {recursive: true}),
        (p,i) => fs.writeFileSync(p, link(p, files[i])),
        (p,i) => verbose && console.log(`Linking '${p}' -> '${files[i]}'`)
    ))
    
    console.log (`Linked ${files.length} files.`)
})

