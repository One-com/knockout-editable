var ko = require('knockout');
var expect = require('unexpected').clone();

require('../lib/knockout-editable');

describe('knockout-editable', function () {
    describe('installation', function () {
        it('adds ko.extenders.editable', function () {
            expect(ko.extenders.editable, 'to be an object');
        });

        it('adds ko.editable', function () {
            expect(ko.extenders.editable, 'to be an object');
        });
    });

    describe('ko.extenders.editable', function () {

    });

    describe('ko.editable plugin', function () {
        describe('with a viewmodel that calls ko.editable on itself', function () {
            var ViewModel = function (data) {
                var that = this;

                data = data || {};

                that.name = ko.observable(data.name);

                that.surname = ko.observable(data.surname);

                that.showBalloon = ko.observable(false).extend({editable: false});

                that.observableArrayWithObservables = ko.observableArray([
                    ko.observable('lol'),
                    ko.observable('hor'),
                    ko.observable('dffd')
                ]);

                ko.editable(that);
            };

            var initialValues = {
                    name: 'Foo',
                    surname: 'Bar'
                },
                viewModel;

            beforeEach(function () {
                viewModel = new ViewModel(initialValues);
                viewModel.beginEdit();
            });

            it('starts out with hasChanges=false', function () {
                expect(viewModel.hasChanges(), 'to be', false);
            });

            describe('when changing editable values directly on the viewModel', function () {
                beforeEach(function () {
                    viewModel.name('Quux');
                    viewModel.surname('Bar');
                });

                it('sets hasChanges to true', function () {
                    expect(viewModel.hasChanges(), 'to be', true);
                });

                it('sets hasChanges to true on properties that have changed value', function () {
                    expect(viewModel.name.hasChanges(), 'to be', true);
                });

                it('keeps hasChanges false on properties that have kept the same value', function () {
                    expect(viewModel.surname.hasChanges(), 'to be', false);
                });
            });

            describe('when changing value of observable extended with editable:false', function () {
                beforeEach(function () {
                    viewModel.showBalloon(true);
                });

                it('keeps hasChanges false', function () {
                    expect(viewModel.hasChanges(), 'to be', false);
                });

                it('does not roll back changed value when calling rollback', function () {
                    viewModel.rollback();

                    expect(viewModel.showBalloon(), 'to be', true);
                });
            });

            describe('when changing of an observable within an observableArray', function () {
                beforeEach(function () {
                    viewModel.observableArrayWithObservables()[1]('borg');
                });

                it('sets hasChanges to true on viewModel', function () {
                    expect(viewModel.hasChanges(), 'to be', true);
                });

                it('keeps hasChanges false on the observableArray', function () {
                    expect(viewModel.observableArrayWithObservables.hasChanges(), 'to be', false);
                });

                it('sets hasChanges true on the updated item in the observableArray', function () {
                    expect(viewModel.observableArrayWithObservables()[1].hasChanges(), 'to be', true);
                });
            });

            describe('when calling rollback after having edited', function () {
                beforeEach(function () {
                    viewModel.name('Quux');

                    viewModel.rollback();
                });

                it('sets hasChanges back to false', function () {
                    expect(viewModel.hasChanges(), 'to be', false);
                });

                it('restores previous values', function () {
                    expect(viewModel.name(), 'to be', 'Foo');
                });
            });

            describe('when calling commit after having edited', function () {
                beforeEach(function () {
                    viewModel.name('Quux');

                    viewModel.commit();
                });

                it('sets hasChanges back to false', function () {
                    expect(viewModel.hasChanges(), 'to be', false);
                });

                it('retains new values', function () {
                    expect(viewModel.name(), 'to be', 'Quux');
                });
            });
        });
    });
});
