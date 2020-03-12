import { writable } from 'svelte/store';

interface IHeaderData {
  title?: string;
  icon?: string;
  hidden?: boolean,
  viewPath?: string;
  col?: string;
  description?: string;
}

let initialState: IHeaderData = {
  title: '',
  icon: '',
  hidden: true,
  viewPath: '',
  col: 'lg-12',
  description: '',
};

export default function pageHeader() {
  const store = writable(initialState);

  return {
    subscribe: store.subscribe,
    update: (x: IHeaderData) =>
      store.update((u: IHeaderData) => {
        u.title = x.title;
        u.icon = x.icon;
        u.hidden = x.hidden || false;
        u.viewPath = x.viewPath;
        u.col = x.col;
        u.description = x.description || '';
        return u;
      })
  };
}