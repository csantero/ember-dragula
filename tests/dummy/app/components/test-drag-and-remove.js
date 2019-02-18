/* eslint-disable no-console */

import Component from '@ember/component';

export default Component.extend({
  init() {
    this._super(...arguments);

    this.set('list', [{ name: 'Item 1' }, { name: 'Item 2' }, { name: 'Item 3' }]);
  },

  actions: {
    removeItem(item) {
      const list = this.get('list');
      this.set('list', list.filter((i) => i.name !== item.name));
      console.log(`Set list to a new list without ${item.name}`);
    }
  }
});
