window.accessibleTabs = (function tabComponent(global, document) {
  'use strict';

  const tabInstances = new WeakMap();

  /**
   * Instantiate component
   * @constructor
   * @param {DOM Node} element
   */
  const TabsComponent = function TabsComponent(element, options) {
    if (!element || !element.nodeType) {
      throw new Error(
        'The DOM element was not found when creating the tab component'
      );
    }
    const defaults = {
      tabList: '.tab-list',
      tabItem: '.tab-item',
      tabLink: '.tab-link',
      tabPanel: '.tab-panel'
    };
    this.options = Object.assign(defaults, options);

    this.element = element;
    this.tabList = element.querySelector(this.options.tabList);
    this.tabItems = [].slice.call(
      this.tabList.querySelectorAll(this.options.tabItem)
    );
    this.tabLinks = [].slice.call(
      this.tabList.querySelectorAll(this.options.tabLink)
    );
    this.tabPanels = [].slice.call(
      element.querySelectorAll(this.options.tabPanel)
    );

    this.currentIndex = 0;

    this.tabList.setAttribute('role', 'tablist');

    this.tabItems.forEach((item, index) => {
      item.setAttribute('role', 'presentation');

      if (index === 0) {
        item.setAttribute('data-tab-active', '');
      }
    });

    this.tabLinks.forEach((item, index) => {
      item.setAttribute('role', 'tab');
      item.setAttribute('id', 'tab' + index);

      if (index > 0) {
        item.setAttribute('tabindex', '-1');
      } else {
        item.setAttribute('aria-selected', 'true');
      }
    });

    this.tabPanels.forEach((item, index) => {
      item.setAttribute('role', 'tabpanel');
      item.setAttribute('aria-labelledby', 'tab' + index);
      item.setAttribute('tabindex', '-1');

      if (index > 0) {
        item.setAttribute('hidden', '');
      }
    });

    this.eventCallback = handleEvents.bind(this);
    this.tabList.addEventListener('click', this.eventCallback, false);
    this.tabList.addEventListener('keydown', this.eventCallback, false);

    tabInstances.set(this.element, this);
  };

  TabsComponent.prototype = {
    /**
     * Event handler for tab interactions
     * @param {number} index - Index of tab being activiated
     * @param {string} direction -
     */
    handleTabInteraction: function handleTabInteraction(index, direction) {
      const currentIndex = this.currentIndex;
      let newIndex = index;

      // keyboard support, no direction passed in
      if (direction) {
        if (direction === 37) {
          newIndex = index - 1;
        } else {
          newIndex = index + 1;
        }
      }

      // Supports continuous tabbing when reaching beginning or end of tab list
      if (newIndex < 0) {
        newIndex = this.tabLinks.length - 1;
      } else if (newIndex === this.tabLinks.length) {
        newIndex = 0;
      }

      // update tabs
      this.tabLinks[currentIndex].setAttribute('tabindex', '-1');
      this.tabLinks[currentIndex].removeAttribute('aria-selected');
      this.tabItems[currentIndex].removeAttribute('data-tab-active');

      this.tabLinks[newIndex].setAttribute('aria-selected', 'true');
      this.tabItems[newIndex].setAttribute('data-tab-active', '');
      this.tabLinks[newIndex].removeAttribute('tabindex');
      this.tabLinks[newIndex].focus();

      // update tab panels
      this.tabPanels[currentIndex].setAttribute('hidden', '');
      this.tabPanels[newIndex].removeAttribute('hidden');

      this.currentIndex = newIndex;

      return this;
    },

    /**
     * Set tab panel focus
     * @param {number} index - Tab panel index to receive focus
     */
    handleTabsPanelFocus: function handleTabPanelFocus(index) {
      this.tabPanels[index].focus();

      return this;
    }
  };

  /**
   * Creates or returns existing component
   * @param {string} selector
   */
  function createTabsComponent(selector, options) {
    const element = document.querySelector(selector);
    return tabInstances.get(element) || new TabsComponent(element, options);
  }

  /**
   * Destroys an existing component
   * @param {DOM Node} element
   */
  function destroyTabsComponent(element) {
    if (!element || !element.nodeType) {
      throw new Error(
        'The DOM element was not found when deleting the tab component'
      );
    }

    let component = tabInstances.get(element);
    component.tabList.removeAttribute('role', 'tablist');

    component.tabItems.forEach((item, index) => {
      item.removeAttribute('role', 'presentation');

      if (index === 0) {
        item.removeAttribute('data-tab-active');
      }
    });

    component.tabLinks.forEach((item, index) => {
      item.removeAttribute('role', 'tab');
      item.removeAttribute('id', 'tab' + index);

      if (index > 0) {
        item.removeAttribute('tabindex', '-1');
      } else {
        item.removeAttribute('aria-selected', 'true');
      }
    });

    component.tabPanels.forEach((item, index) => {
      item.removeAttribute('role', 'tabpanel');
      item.removeAttribute('aria-labelledby', 'tab' + index);
      item.removeAttribute('tabindex', '-1');

      if (index > 0) {
        item.removeAttribute('hidden');
      }
    });

    component.tabList.removeEventListener('click', component.eventCallback);
    component.tabList.removeEventListener('keydown', component.eventCallback);
    tabInstances.delete(component.element);
  }

  /**
   * Handle event listener callbacks
   * @param {event} event
   */
  function handleEvents(event) {
    if (event.type === 'click') {
      event.preventDefault();
      TabsComponent.prototype.handleTabInteraction.call(
        this,
        this.tabLinks.indexOf(event.target)
      );
    }

    if (event.type === 'keydown') {
      const index = this.tabLinks.indexOf(event.target);

      // Left or right arrows
      if (event.which === 37 || event.which === 39) {
        event.preventDefault();
        TabsComponent.prototype.handleTabInteraction.call(
          this,
          index,
          event.which
        );
      }

      // Down arrow
      if (event.which === 40) {
        event.preventDefault();
        TabsComponent.prototype.handleTabsPanelFocus.call(this, index);
      }
    }
  }

  return {
    create: createTabsComponent,
    destroy: destroyTabsComponent
  };
})(window, document);

const tabComponent = accessibleTabs.create('[data-tab-component]')
