#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { program } = require('commander');
const { getIssueTicket }  = require('../dist/index');

const prependTicket = async (commitmsgFile, host) => {
    const ticket = await getIssueTicket(host);

    if (ticket === '<skip prepend jira ticket>') {
        return
    }

    const content = fs.readFileSync(commitmsgFile);
    fs.writeFileSync(commitmsgFile, `${ticket} ${content}`)
}

const install = (host) => {
    const gitDir = path.join(process.cwd(), '.git');

    if (!fs.existsSync(gitDir)) {
        throw new Error('You should run `add-jira-ticket install` in a project\'s root with git')
    }

    const commitMsgFile = path.join(gitDir, 'hooks/commit-msg')

    if (!fs.existsSync(commitMsgFile)) {
        fs.writeFileSync(commitMsgFile, '');
    }

    const scriptToAppend = `\nexec < /dev/tty && npx -y commitmsg-with-jira-ticket commit $1 --host=${host} || exit 0`

    let commitMsgFileContent = fs.readFileSync(commitMsgFile, 'utf-8');
    commitMsgFileContent = commitMsgFileContent.replace(/.*commitmsg-with-jira-ticket.*/g, '')

    fs.writeFileSync(commitMsgFile, commitMsgFileContent + scriptToAppend);
    console.info('Successfully installed!')
}

program
    .version(require('../package.json').version)
    .command('commit')
    .argument('<commitmsgFile>')
    .requiredOption('--host <host>', 'Your jira host')
    .action(async (commitmsgFile, options) => {
        await prependTicket(commitmsgFile, options.host);
    })

program
    .command('install')
    .requiredOption('--host <host>', 'Your jira host')
    .action((options) => {
        install(options.host);
    })

program.parse(process.argv)
