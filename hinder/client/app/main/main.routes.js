'use strict';

export default function routes($stateProvider) {
  'ngInject';

  $stateProvider.state(
  	'main', {
    url: '/',
    template: '<main></main>'
  },
  'photos', {
  	url: '/photos',
  	template: '<main></main>'
  });
}
