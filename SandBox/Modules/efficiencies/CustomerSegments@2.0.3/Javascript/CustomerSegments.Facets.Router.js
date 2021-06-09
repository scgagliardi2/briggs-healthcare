define('CustomerSegments.Facets.Router', [
    'CustomerSegments.Helper',
    'Facets.Router',
    'underscore'
], function CustomerSegmentsFacetsRouter(
    Helper,
    FacetsRouter,
    _
) {
    'use strict';

    _.extend(FacetsRouter.prototype, {
        facetLoading: function facetLoading() {
            // Check if Facets is already been add to searchApiMasterOptions
            if (!Helper.inFacets('custitem_item_customersegments')) {
                // Update searchApiMasterOptions to add Customer Segment Facets
                Helper.addToSearchApiMasterOptions(this);
            } else {
                this.showPage();
            }
        },
        categoryLoading: function categoryLoading() {
            // Check if Facets is already been add to searchApiMasterOptions
            if (!Helper.inFacets('custitem_item_customersegments')) {
                // Update searchApiMasterOptions to add Customer Segment Facets
                Helper.addToSearchApiMasterOptions(this, true);
            } else {
                this.showPage(true);
            }
        }
    });
});
