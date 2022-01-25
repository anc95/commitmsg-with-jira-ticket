import finder from 'chrome-cookie-finder';
import axios from 'axios';

const createGetCookie = (jiraHost: string) => {
    let cookie = '';

    const get = async () => {
        if (cookie) {
            return cookie;
        }

        const { cookies } = await finder({
            url: jiraHost,
            cookiePath: {
                darwin: process.env.HOME + '/Library/Application Support/Google/Chrome/Profile 1/Cookies'
            }
        });

        for (let key in cookies) {
            cookie += `${key}=${cookies[key]};`
        }

        return cookie;
    }

    return get;
}

let getCookie: any = null

const fetchIssues = async (keyword: string, host: string) => {
    if (!host) {
        throw Error('host is required')
    }

    getCookie = getCookie || createGetCookie(host);

    const cookie = await getCookie();

    const { data } = await axios.get(
        `${host}/rest/api/2/issue/picker?currentIssueKey=&showSubTasks=true&showSubTaskParent=true&currentProjectId=&_=1643005785148&query=${keyword || ''}`, 
        {
            headers: {
                Cookie: cookie
            }
        }
    )

    return data.sections[0].issues;
}

export { fetchIssues }