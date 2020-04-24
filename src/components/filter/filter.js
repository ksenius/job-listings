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

    this._getSavedSelectedTags();
  }

  filterElements(tagValue) {
    if (!this.tags.size) {
      this._prependFilter();
    }

    this._addTag(tagValue);
    this._toggleElementsVisibility();
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

    localStorage.removeItem('filterTags');
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
    this._saveSelectedTags();
  }

  _createTagElement(tagValue) {
    const tagElement = createElement('span', 'filter__tag', tagValue);

    this._attachTagClickHandler(tagElement, tagValue);

    this.tagsContainer.append(tagElement);
  }

  _toggleElementsVisibility() {
    this.elements.forEach((element) => {
      const hasSelectedTags = this._checkSelectedTags(element);

      if (hasSelectedTags) {
        this._showElement(element);
      } else {
        this._hideElement(element);
      }
    });
  }

  _checkSelectedTags(element) {
    const elementTags = this._getElementTags(element);
    const selectedTags = Array.from(this.tags);

    const hasSelectedTags = selectedTags.every(
      (tag) => elementTags.indexOf(tag) !== -1
    );

    return hasSelectedTags;
  }

  _getElementTags(element) {
    return element.dataset.filterTags.split(',').filter((item) => item !== '');
  }

  _hideElement(element) {
    const isHidden = element.classList.contains(hiddenElementClass);

    if (isHidden) return;

    const elementHeight = element.offsetHeight;
    const elementBottomMargin = getComputedStyle(element).marginBottom;

    anime({
      targets: element,
      keyframes: [
        {
          opacity: [1, 0],
          duration: 300,
        },
        {
          height: [elementHeight, 0],
          marginBottom: [elementBottomMargin, 0],
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
    const elementBottomMargin = getComputedStyle(element).marginBottom;

    anime({
      targets: element,
      keyframes: [
        {
          opacity: 0,
          height: [0, elementHeight],
          marginBottom: [0, elementBottomMargin],
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
    this._toggleElementsVisibility();

    if (!this.tags.size) {
      this._removeFilter();
      localStorage.removeItem('filterTags');
    } else {
      this._saveSelectedTags();
    }

    target.remove();
  }

  _saveSelectedTags() {
    const selectedTags = JSON.stringify(Array.from(this.tags));

    try {
      localStorage.setItem('filterTags', selectedTags);
    } catch (error) {
      console.error(error);
    }
  }

  _getSavedSelectedTags() {
    try {
      const savedTagsString = localStorage.getItem('filterTags');

      if (savedTagsString) {
        const savedTags = JSON.parse(savedTagsString);

        this.tags = new Set(savedTags);

        savedTags.forEach((tag) => this._createTagElement(tag));

        this._prependFilter();

        this.elements.forEach((element) => {
          const hasFilterTags = this._checkSelectedTags(element);

          if (!hasFilterTags) {
            element.classList.add(hiddenElementClass);
          }
        });
      }
    } catch (error) {
      console.error(error);
      localStorage.removeItem('filterTags');
    }
  }
}

export default Filter;
