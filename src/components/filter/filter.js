import './filter.scss';
import anime from 'animejs/lib/anime.es.js';

function createElement(tag, className, text) {
  const element = document.createElement(tag);

  element.className = className;
  if (text) element.textContent = text;

  return element;
}

const hiddenElementClass = 'filter__hidden-element';

class Filter {
  constructor(elements, container) {
    this._createFilter();

    this.tags = new Set();

    this.elements = elements;
    this.container = container;
  }

  filterElements(tagType, tagValue) {
    if (!this.tags.size) {
      this._prependFilter();
    }

    this._addTag(tagValue);

    const tagCategory = this._getTagCategory(tagType);

    this.elements.forEach((element) => {
      const elementCategoryTags = element.dataset[`${tagCategory}`].split(',');

      const hasTag = elementCategoryTags.indexOf(tagValue) !== -1;

      if (!hasTag) this._hideElement(element);
    });
  }

  _createFilter() {
    this.element = createElement('div', 'filter');
    this.tagsContainer = createElement('div', 'filter__tags');
    this.clearButton = createElement('button', 'filter__clear-button', 'Clear');

    this._attachClearButtonClickHandler();

    this.element.append(this.tagsContainer, this.clearButton);
  }

  _prependFilter() {
    anime({
      targets: this.element,
      scale: [0, 1],
      duration: 400,
      easing: 'easeOutQuad',
      begin: () => {
        this.container.prepend(this.element);
      },
    });
  }

  _resetFilter() {
    this.tags.clear();
    this.tagsContainer.innerHTML = '';

    this._removeFilter();

    this.elements.forEach((element) => this._showElement(element));
  }

  _removeFilter() {
    anime({
      targets: this.element,
      scale: [1, 0],
      duration: 300,
      easing: 'easeOutQuad',
      complete: () => {
        this.element.remove();
      },
    });
  }

  _addTag(value) {
    if (this.tags.has(value)) return;

    this.tags.add(value);
    this._createTagElement(value);
  }

  _createTagElement(tagValue) {
    const tagElement = createElement('span', 'filter__tag', tagValue);

    this._attachTagClickHandler(tagElement, tagValue);

    this.tagsContainer.append(tagElement);
  }

  _getTagCategory(tagType) {
    const category =
      tagType === 'language' || tagType === 'tool' ? `${tagType}s` : tagType;

    return category;
  }

  _getAllElementTags(element) {
    const result = [];

    const elementCategories = element.dataset;

    for (let category in elementCategories) {
      const tags = elementCategories[category].split(',');

      result.push(...tags);
    }

    return result.filter((item) => item !== '');
  }

  _hideElement(element) {
    const isHidden = element.classList.contains(hiddenElementClass);

    if (isHidden) return;

    const elementHeight = element.offsetHeight;
    const elementMargin = getComputedStyle(element).margin;

    anime({
      targets: element,
      keyframes: [
        {
          opacity: [1, 0],
          duration: 300,
        },
        {
          height: [elementHeight, 0],
          margin: [elementMargin, 0],
          duration: 200,
        },
      ],
      easing: 'easeOutQuad',
      complete: () => {
        element.classList.add(hiddenElementClass);
        element.style.height = '';
        element.style.margin = '';
      },
    });
  }

  _showElement(element) {
    const isHidden = element.classList.contains(hiddenElementClass);

    if (!isHidden) return;

    const elementHeight = element.offsetHeight;
    const elementMargin = getComputedStyle(element).margin;

    anime({
      targets: element,
      keyframes: [
        {
          opacity: 0,
          height: [0, elementHeight],
          margin: [0, elementMargin],
          duration: 200,
        },
        {
          opacity: [0, 1],
          duration: 300,
        },
      ],
      easing: 'easeOutQuad',
      begin: () => {
        element.classList.remove(hiddenElementClass);
      },
      complete: () => {
        element.style.height = '';
        element.style.margin = '';
      },
    });
  }

  _attachClearButtonClickHandler() {
    this.clearButton.addEventListener('click', () => {
      this._resetFilter();
    });
  }

  _attachTagClickHandler(tagElement, tagValue) {
    tagElement.addEventListener('click', (event) => {
      this._handleTagClick(tagValue, event);
    });
  }

  _handleTagClick(tagValue, event) {
    const target = event.currentTarget;

    this.tags.delete(tagValue);

    this.elements.forEach((element) => {
      let elementTags = this._getAllElementTags(element);
      let filterTags = Array.from(this.tags);

      const hasFilterTags = filterTags.every(
        (tag) => elementTags.indexOf(tag) !== -1
      );

      if (hasFilterTags) this._showElement(element);
    });

    if (!this.tags.size) {
      this._removeFilter();
    }

    target.remove();
  }
}

export default Filter;
