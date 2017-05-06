import { postLogin } from './server';

const TOKEN = '/Token';
const LOGIN_ERR_MSG = `
  The username or password you have entered is invalid.
`;

export function login(user) {
    var data = 'username=' + user.username + '&password=' + user.password + '&grant_type=password';
    return new Promise((resolve, reject) => {
        return postLogin(TOKEN, data)
            .then(json => { return { payload: resolve(json) }; })
            .then(null, (err) => reject(new Error(LOGIN_ERR_MSG)));
    });
}
