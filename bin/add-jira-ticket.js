#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { program } = require('commander');
const { getIssueTicket }  = require('../dist/index');

const prependTicket = async (commitmsgFile, host) => {
    const ticket = await getIssueTicket(host);
    const content = fs.readFileSync(commitmsgFile);
    fs.writeFileSync(commitmsgFile, `${ticket} ${content}`)
}

const install = (host) => {
    const gitDir = path.join(process.cwd(), '.git');

    if (!fs.existsSync(gitDir)) {
        throw new Error('You should run `add-jira-ticket install` in a project\'s root with git')
    }

    const prepareCommitMsgFile = path.join(gitDir, 'hooks/prepare-commit-msg')

    if (!fs.existsSync(prepareCommitMsgFile)) {
        fs.writeFileSync(prepareCommitMsgFile, '');
    }

    const scriptToAppend = `\nexec < /dev/tty && npx commitmsg-with-jira-ticket commit $1 --host=${host}`

    let commitMsgFileContent = fs.readFileSync(prepareCommitMsgFile, 'utf-8');
    commitMsgFileContent = commitMsgFileContent.replace(/.*commitmsg-with-jira-ticket.*/g, '')

    fs.writeFileSync(prepareCommitMsgFile, commitMsgFileContent + scriptToAppend);
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