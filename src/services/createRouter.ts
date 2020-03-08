import Route from 'route-parser';
import history from './whistory';

// disable ts wanrning
declare var process;

export default (routes) => {
  let content;
  let unlisten;
  let target;
  let header;
  let navigator;

  const createRouteBehavior = (route) => {
    if (typeof route === 'function') {
      // '/': HomeSvelteComponent
      return svelteComponentOptions => (content = new route(svelteComponentOptions));
    }

    if (typeof route === 'object') {
      // { redirect: '/about' }
      if (route.redirect) {
        return () => history.push(route.redirect);
      }
    }

    if (typeof route === 'string') {
      // '/':'/home'
      return () => history.push(route);
    }

    return () => { };
  };

  const routeData = Object.keys(routes)
    .map(key => [key, routes[key]])
    .map(([key, value]) => ({
      route: new Route(key),
      behavior: createRouteBehavior(value),
    }));

  const handleRouteChange = (location) => {
    if (process.env.NODE_ENV === "development") {
      console.info("%croute changed => " + JSON.stringify(location), "color: #e2baff; font-size: 16");
    }

    if (content) {
      content.destroy();
      content = undefined;
    }

    for (let i = 0; i < routeData.length; i += 1) {
      let data = routeData[i].route.match(location.pathname);

      if (data) {
        data.pageHeader = header;            
        routeData[i].behavior({ target, data });
        navigator.location = location;
        break;
      }
    }
  };

  return {
    start: (location, targetElement, pageHeader, nav) => {
      target = targetElement;
      header = pageHeader;
      navigator = nav;
      unlisten = history.listen(handleRouteChange);
      handleRouteChange((history as any).location);
    },
    destory: () => {
      if (unlisten) {
        unlisten();
        unlisten = undefined;
      }
    },
  };
};
