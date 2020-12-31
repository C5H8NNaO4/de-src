
const glob = require('glob');
const path = require('path');
const fs = require('fs');
const {in: target, verbose, length = 1, force} = require('./args');

const shift = (p) => {
    return path.normalize(p).split(path.sep).slice(length).join('/')
}

const compose = (...fns) => (...args) => fns.forEach(fn => fn(...args));

const link = (p, file) => `module.exports = require('${shift(path.relative(p,file)).replace(/\\/g,'/')}')`

glob(path.join(target, '/**/*.js'), (err, files) => {
    files.map(shift).forEach(compose(
        (p) => force && (path.extname(p)?fs.unlink:fs.rmdir)(p, (err) => console.log(err || `Deleted '${p}'`)),
        (p) => fs.mkdirSync(path.dirname(p), {recursive: true}),
        (p,i) => fs.writeFileSync(p, link(p, files[i])),
        (p,i) => verbose && console.log(`Linking '${p}' -> '${files[i]}'`)
    ))
    
    console.log (`Linked ${files.length} files.`)
})

