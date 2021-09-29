/*eslint-disable*/
define('Address.Router.NoEdit', [
    'Address.Router',
    'Address.Edit.View',
    'Profile.Model',
    'Backbone',
    'underscore'
], function AddressRouterNoEdit(
    AddressRouter,
    AddressEditView,
    ProfileModel,
    Backbone,
    _
) {
    'use strict';

    _.extend(AddressRouter.prototype, {
        addressDetailed: function addressDetailed(id) {
            var terms = this.profileModel.get('paymentterms');
            var collection = this.profileModel.get('addresses');
            var model = collection.get(id);
            var view = new AddressEditView({
                application: this.application,
                collection: collection,
                model: model
            });
            if (this.profileModel.get('isLoggedIn') !== 'T') {
                return this.application.getLayout().notFound();
            }

            view.model.on('reset destroy add', function viewModelOn() {
                if (view.inModal && view.$containerModal) {
                    view.$containerModal.modal('hide');
                    view.destroy();
                } else {
                    Backbone.history.navigate('#addressbook', {
                        trigger: true
                    });
                }
            }, view);
            if ((terms)) {
                Backbone.history.navigate('#addressbook', {
                    trigger: true
                });
            } else {
                view.showContent();
            }
        }
    });
});
