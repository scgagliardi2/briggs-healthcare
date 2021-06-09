define('CustomerSegments.Categories', [
    'SC.Configuration',
    'CustomerSegments.Helper',
    'Categories',
    'jQuery',
    'underscore'
], function CustomerSegmentsCategories(
    Configuration,
    Helper,
    Categories,
    jQuery,
    _
) {
    'use strict';

    _.extend(Categories, {
        mountToApp: _.wrap(Categories.mountToApp, function MountToApp(fn, application) {
            var self;
            var categories = SC.CATEGORIES;

            fn.apply(this, _.toArray(arguments).slice(1));
            self = this;

            if (Configuration.get('categories')) {
                /*
                 * Response from CustomerSegments Helper
                 * This ensure that Group information is already been set
                 * Filter category base on response*/
                jQuery.when(Helper.setGroupsInfo()).done(function whenSetGroupInfo(response) {
                    if (response.groupCategory) {
                        categories = _.filter(categories, function filterCategories(cat) {
                            return _.indexOf(response.groupCategory, cat.name) !== -1;
                        });
                    }

                    self.application = application;

                    _.each(categories, function eachCategories(category) {
                        self.topLevelCategories.push(category.fullurl);
                    });

                    self.addToNavigationTabs(categories);
                });
            }
        })
    });
});
