import '../container/container';
import '../job-card/job-card';
import '../filter/filter';
import './job-list.scss';
import Filter from '../filter/filter';
import anime from 'animejs/lib/anime.es.js';

class JobList {
  constructor(element) {
    this.element = element;

    this._getElements();
    this._createFilter();
  }

  init() {
    this._animateJobCards();
    this._attachTagClickHandler();
  }

  _getElements() {
    this.jobCards = this.element.querySelectorAll('.js-job-list__card');
    this.tags = this.element.querySelectorAll('.js-job-card__tag');
  }

  _createFilter() {
    const container = this.element.querySelector('.js-job-list__container');

    this.filter = new Filter(this.jobCards, container);

    this.filter.element.classList.add('job-list__filter');
  }

  _animateJobCards() {
    anime({
      targets: this.jobCards,
      translateY: [50, 0],
      opacity: [0, 1],
      duration: 200,
      delay: anime.stagger(100, { start: 200 }),
      easing: 'easeOutQuad',
    });
  }

  _attachTagClickHandler() {
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
