/* #License 
 *
 * The MIT License (MIT)
 *
 * This software consists of voluntary contributions made by many
 * individuals. For exact contribution history, see the revision history
 * available at https://github.com/shovelapps/shovelapps-cms
 *
 * The following license applies to all parts of this software except as
 * documented below:
 *
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 *
 * All files located in the node_modules and external directories are
 * externally maintained libraries used by this software which have their
 * own licenses; we recommend you read them, as their terms may differ from
 * the terms above.
 *
 * Copyright (c) 2014-2015 Shovel apps, Inc. All rights reserved.
 * (info@shovelapps.com) / www.shovelapps.com / www.shovelapps.org
 */

module.exports = menumodule;

function menumodule(app) {
  var menus = {};
  menus.admin = [];
  app.locals.menus = menus;
  return new menuManager(app);
}

function menuManager(app) {
  if (!(this instanceof menuManager)) {
    return new menuManager(app);
  }

  this.app = app;
}
/**
 * Registers a menu entry and pushes it to the menus.admin items array
 *
 * Each time a new menu item is registered, the array sorts itself based on
 * property 'weight'.
 *
 * @param menuItem {Object}
 * menuItem.href {String} url where the menu points
 * menuItem.title {String} The text for the menu item
 * menuItem.icon {String} - optional, an icon ref according to... [icons lib here]
 * menuItem.weight {Int} - optional, a weight for the item, for sort purposes
 *
 * @param clean {Boolean}: indicates if the menuItem should be trimmed
 * of excessive properties
 */
menuManager.prototype.registerAdminMenu = function(menuItem, clean) {
  var newItem = {};
  var defaultWeight = menuItem.weight || this.heaviestAdminMenuItem() + 1;
  if (clean) {
    newItem = {
      href: menuItem.href,
      title: menuItem.title,
      icon: menuItem.icon,
      weight: defaultWeight
    }
  } else {
    newItem = menuItem;
  }
  this.app.locals.menus.admin.push(newItem);
  this.sortAdminMenuItems();
}


/**
 * Registers an admin menu item group... exp
 */
menuManager.prototype.registerAdminGroupMenu = function(headerItem, items) {
  //fastest array dupe
  var groupItems = items.slice();
  //quick sort
  groupItems.sort(function(a, b) {
    return a.weigth > b.weight
  });
  //register entry
  this.registerAdminMenu({
    title: headerItem.title,
    icon: headerItem.icon,
    description: headerItem.description,
    weight: headerItem.weight,
    items: groupItems
  });
}

/**
 * Sorts admin menu items based on property 'weight'
 * As a side effect, it adds property 'weight' with default value 0 to every
 * member of the array who doesn't have one, basically normalizing the array
 * for sorting.
 */
menuManager.prototype.sortAdminMenuItems = function() {
  this.app.locals.menus.admin.forEach(function(i) {
    i.weight = i.weight || 0;
  });

  this.app.locals.menus.admin.sort(function(a, b) {
    return a.weight > b.weight;
  });
}


/**
 * Returns the maximum weight among the admin menu items
 *
 * @return {Int}: the weight of the heaviest admin menu item.
 */
menuManager.prototype.heaviestAdminMenuItem = function() {
  this.sortAdminMenuItems();
  return this.app.locals.menus.admin.length ? this.app.locals.menus.admin[this.app.locals.menus.admin.length - 1]['weight'] : 0;
}


/**
 * Returns the lightest weight among the admin menu items
 *
 * @return {Int}: the weight of the lightest admin menu item.
 */
menuManager.prototype.lightestAdminMenuItem = function() {
  this.sortAdminMenuItems();
  return this.app.locals.menus.admin.length ? this.app.locals.menus.admin[0]['weight'] : 0;
}