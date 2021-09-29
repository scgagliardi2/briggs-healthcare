define('CustomerSegments.Home.View', [
    'Backbone',
    'SC.Configuration',

    'CustomerSegments.Helper',

    'Home.View',

    'Utils',

    'jQuery',
    'underscore'
], function CustomerSegmentsBanner(
    Backbone,
    Configuration,

    Helper,

    HomeView,

    Utils,

    jQuery,
    _
) {
    'use strict';

    _.extend(HomeView.prototype, {
        initialize: _.wrap(HomeView.prototype.initialize, function wrapInitialize(fn) {
            var self = this;

            fn.apply(this, _.toArray(arguments).slice(1));


            this.model = new Backbone.Model({
                carousel: {}
            });

            jQuery.when(Helper.setGroupsInfo()).done(function whenSetGroupsInfo(response) {
                var carousel;
                var groupBanners = response.groupBanners;
                var configBanners = _.map(Configuration.get('home.carouselImages', []), function mapCarouselImages(url) {
                    if (_.isObject(url)) {
                        return {
                            href: url.href,
                            image: url.image.indexOf(_.getAbsoluteUrl()) === -1 ? _.getAbsoluteUrl(url.image) : url.image,
                            linktext: url.linktext,
                            text: url.text,
                            title: url.title
                        };
                    }

                    return url;
                });

                carousel = Helper.checkBannerImage(groupBanners, configBanners);

                _.extend(Configuration.get('home'), {
                    carouselImages: carousel
                });

                self.model.set('carousel', carousel);
            });

            this.listenTo(this.model, 'all', jQuery.proxy(this.render, this));
        })
    });
});
