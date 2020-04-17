import './filter.scss';

function createElement(tag, className) {
  const element = document.createElement(tag);

  element.className = className;

  return element;
}

const hiddenElementClass = 'filter__hidden-element';

class Filter {
  constructor(elements, container) {
    this.elements = elements;
    this.container = container;
    this.tags = new Set();

    this._createFilterElement();
  }

  filterElements(tagType, tagValue) {
    if (this.tags.size === 0) {
      this.container.prepend(this.element);
    }

    this._addTag(tagValue);

    const tagCategory = this._getTagCategory(tagType);

    this.elements.forEach((element) => {
      const elementCategoryTags = element.dataset[`${tagCategory}`].split(',');

      const isHidden = element.classList.contains(hiddenElementClass);
      const hasTag = elementCategoryTags.indexOf(tagValue) !== -1;

      if (!isHidden && !hasTag) {
        element.classList.add(hiddenElementClass);
      }
    });
  }

  _createFilterElement() {
    this.element = createElement('div', 'filter');
    this.tagsContainer = createElement('div', 'filter__tags');

    this.clearButton = this._createClearButton();

    this.clearButton.addEventListener('click', () => {
      this._reset();
    });

    this.element.append(this.tagsContainer, this.clearButton);
  }

  _createClearButton() {
    const clearButton = createElement('button', 'filter__clear-button');
    clearButton.innerHTML = 'Clear';
    return clearButton;
  }

  _reset() {
    this.tags.clear();
    this.tagsContainer.innerHTML = '';
    this.element.remove();

    this.elements.forEach((element) => {
      element.classList.remove(hiddenElementClass);
    });
  }

  _addTag(value) {
    if (this.tags.has(value)) return;

    this.tags.add(value);

    const tagElement = this._createTagElement(value);

    tagElement.addEventListener('click', (event) => {
      this._handleTagClick(value, event);
    });

    this.tagsContainer.append(tagElement);
  }

  _createTagElement(value) {
    const tagElement = createElement('span', 'filter__tag');

    tagElement.innerHTML = value;

    return tagElement;
  }

  _handleTagClick(value, event) {
    const target = event.currentTarget;

    this.tags.delete(value);
    target.remove();

    this.elements.forEach((element) => {
      let elementAllTags = this._getAllElementTags(element);
      let filterTags = [...this.tags];

      const isHidden = element.classList.contains(hiddenElementClass);

      const hasFilterTags = filterTags.every(
        (tag) => elementAllTags.indexOf(tag) !== -1
      );

      if (hasFilterTags && isHidden) {
        element.classList.remove(hiddenElementClass);
      }
    });

    if (this.tags.size === 0) {
      this.element.remove();
    }
  }

  _getTagCategory(tagType) {
    let category =
      tagType === 'language' || tagType === 'tool' ? `${tagType}s` : tagType;

    return category;
  }

  _getAllElementTags(element) {
    let result = [];

    const elementCategories = element.dataset;

    for (let category in elementCategories) {
      const tags = elementCategories[category].split(',');

      result.push(...tags);
    }

    return result.filter((item) => item !== '');
  }
}

export default Filter;
