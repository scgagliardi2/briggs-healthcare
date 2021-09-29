define('MatrixMultiAdd.RowHead.View', [
    'Backbone',
    'matrix_multi_add_rowHead.tpl'

], function MatrixMultiAddRowHeadView(
    Backbone,
    Template
) {
    'use strict';

    return Backbone.View.extend({
        template: Template,
        getContext: function getContext() {
            return {
                model: this.model
            };
        }
    });
});
