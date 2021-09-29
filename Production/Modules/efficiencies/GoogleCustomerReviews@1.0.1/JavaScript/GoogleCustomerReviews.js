define('GoogleCustomerReviews', [
    'SC.Configuration',
    'GoogleCustomerReviews.LoadScript',
    'GoogleCustomerReviews.OrderWizard.Steps'
], function GoogleCustomerReviews(
    Configuration,
    GCR
) {
    'use strict';

    return {
        mountToApp: function mountToApp(application) {
            var configuration = Configuration && Configuration.get('googleCustomerReviews');

            if (configuration.showBadge) {
                application.getLayout().on('afterAppendView', function beforeCompositeViewRender() {
                    window.renderBadge = function renderBadge() {
                        var ratingBadgeContainer = document.createElement('div');
                        document.body.appendChild(ratingBadgeContainer);
                        window.gapi.load('ratingbadge', function gapiLoad() {
                            window.gapi.ratingbadge.render(ratingBadgeContainer, {
                                'merchant_id': configuration.merchantId,
                                'position': configuration.position
                            });
                        });
                    };
                });

                GCR.loadScript('renderBadge');
            }
        }
    };
});
