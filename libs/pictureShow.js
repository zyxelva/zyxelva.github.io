/* global hexo */

'use strict';

hexo.extend.filter.register('theme_inject', function(injects) {
  injects.head.raw('default', '<meta name="referrer" content="no-referrer"/>');
});
