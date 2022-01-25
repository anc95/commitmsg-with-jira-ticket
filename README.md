# commitmsg-with-jira-ticket
Add Jira ticket in interactive way to your commit msg

## Install
```sh
npm i -g commitmsg-with-jira-ticket
```

## Usage

```sh
Usage: add-jira-ticket [options] [command]

Options:
  -V, --version                     output the version number
  -h, --help                        display help for command

Commands:
  commit [options] <commitmsgFile>
  install [options]
  help [command]                    display help for command
```

### use cli

Firstly, install script to git prepare-commitmsg hook

```bash
npx commitmsg-with-jira-ticket install --host=http://www.jira.com
```

### with husky

// todo
