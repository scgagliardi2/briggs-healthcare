define('Backbone.View.PostContextHook', [
    'Backbone',
    'underscore',
    'Backbone.View.render'

], function PostContextHook(
    Backbone,
    _
) {
    'use strict';

    _.extend(Backbone.View.prototype, {
        /**
         * Returns template context. Added a postContext plugin to append extra data to context
         * @override
         * @overrideFn Backbone.View.render.getTemplateContext
         * */
        getTemplateContext: function getTemplateContext() {
            var templateContext;

            if (this.getContext) {
                templateContext = this.getContext();
                if (this.postContext) {
                    this.postContext.executeAll(templateContext, this);
                }
            } else {
                templateContext = _.extend({}, {
                    view: this
                });
            }
            return templateContext;
        }
    });
});
