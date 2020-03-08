// import { createBrowserHistory as createHistory } from 'history';
/*
if you use createBrowserHistory mode
look this post to configuration you server
http://readystate4.com/2012/05/17/nginx-and-apache-rewrite-to-support-html5-pushstate/
 */
import { createHashHistory } from 'history';
declare var process;

const h = createHashHistory({
  basename: process.env.APP_BASE_PATH,
})

export default h;
