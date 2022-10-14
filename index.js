const path = require('path');
const { Compiler } = require('@adobe/htlengine');
const { writeFileSync } = require('fs');
const { readFile } = require('fs/promises');

async function sightly(input, data) {
    const runtimeVars = Object.keys(data);

    let compiler = new Compiler()
        .includeRuntime(true)
        .withRuntimeGlobalName('htl');

    runtimeVars.forEach((k) => {
        compiler = compiler.withRuntimeVar(k);
    });

    let compiled = await compiler.compileToString(input);
    const template = eval(compiled);
    const html = await template(data);

    return html
}

async function sightlyFromFile(input, data) {
    const inputFile = await readFile(input);
    const htl = inputFile.toString();
    return sightly(htl, data);
}

async function sightlyToFileFromFile(input, output, data) {
    const compiled = await sightlyFromFile(input, data);
    writeFileSync(output, compiled);
}

(async function () {
    const data = { doc: { title: 'string' } }
    sightlyToFileFromFile('./index.html', './output.html', data);
})();
