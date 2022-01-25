#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { getIssueTicket }  = require('../dist/index');
const commitFile = process.argv[2]

const main = async () => {
    const ticket = await getIssueTicket();
    const content = fs.readFileSync(commitFile);
    fs.writeFileSync(commitFile, `${ticket} ${content}`)
}

if (commitFile === 'install') {
    const gitDir = path.join(process.cwd(), '.git');

    if (!fs.existsSync(gitDir)) {
        throw new Error('You should run `add-jira-ticket install` in a project\'s root with git')
    }

    const prepareCommitMsgFile = path.join(gitDir, 'hooks/prepare-commit-msg')

    if (!fs.existsSync(prepareCommitMsgFile)) {
        fs.writeFileSync(prepareCommitMsgFile, '');
    }

    const scriptToAppend = `\nexec < /dev/tty && npx commitmsg-with-jira-ticket`

    const commitMsgFileContent = fs.readFileSync(prepareCommitMsgFile, 'utf-8');

    if (commitMsgFileContent.includes('commitmsg-with-jira-ticket')) {
        return;
    }

    fs.writeFileSync(prepareCommitMsgFile, commitMsgFileContent + scriptToAppend);
    console.info('Successfully installed!')
}
else {
    main();
}