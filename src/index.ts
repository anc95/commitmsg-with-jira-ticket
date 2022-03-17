import * as inquirer from 'inquirer';
import autocomplete from 'inquirer-autocomplete-prompt'
import { fetchIssues } from './getJiraIssues';

inquirer.registerPrompt('autocomplete', autocomplete);

export const getIssueTicket = async (host: string) => {
    const answer = await inquirer.prompt([{
        type: 'autocomplete',
        name: 'value',
        message: 'Please select related JIRA issue',
        source: async function(answersSoFar, input) {
            const issues = await fetchIssues(input, host);
    
            return ['<skip prepend jira ticket>', ...issues.map(item => `[${item.key}] ${item.summaryText}`)]
        }
    }])

    return (answer.value as string).substring(1, answer.value.indexOf(']'))
}