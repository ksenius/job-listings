import '../container/container';
import '../job-card/job-card';
import '../filter/filter';
import './job-list.scss';
import Filter from '../filter/filter';

class JobList {
  constructor(element) {
    this.element = element;

    this._getTagElements();
    this._createFilter();
  }

  init() {
    this._bindEventListeners();
  }

  _getTagElements() {
    this.tags = this.element.querySelectorAll('.js-job-card__tag');
  }

  _createFilter() {
    const jobCards = this.element.querySelectorAll('.js-job-list__card');
    const container = this.element.querySelector('.js-job-list__container');

    this.filter = new Filter(jobCards, container);

    this.filter.element.classList.add('job-list__filter');
  }

  _bindEventListeners() {
    this.tags.forEach((tag) => {
      tag.addEventListener('click', (event) => {
        this._handleTagClick(event);
      });
    });
  }

  _handleTagClick(event) {
    const target = event.currentTarget;

    const tagType = target.dataset.type;
    const tagValue = target.innerHTML;

    this.filter.filterElements(tagType, tagValue);
  }
}

export default JobList;
