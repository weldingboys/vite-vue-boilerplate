const fs = require('fs');
const path = require('path');

console.log();

let envFlag = process.argv.slice(2)[0];

let env = fs.readFileSync(path.join(process.cwd(), envFlag), 'utf-8');

const envPairs = env.split('\r\n');

if (envPairs[envPairs.length - 1].split(' = ')[0] === 'VUE_APP_DEPLOY_TIME') {
	envPairs.pop();
	env = envPairs.join('\r\n');
}

const lastOne = `VUE_APP_DEPLOY_TIME = ${new Date()}`;

env = env.concat('\r\n').concat(lastOne);

fs.writeFileSync(path.join(process.cwd(), envFlag), env, 'utf-8');
