if (!require('piping')()) { return; }

const electron = require('electron')
const proc = require('child_process')
const child = proc.spawn(electron, process.argv.slice(2), {stdio: 'inherit'})
child.on('close', function (code) { process.exit(code) })
