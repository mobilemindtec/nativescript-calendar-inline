var CalendarView, calendarBuilder, moment, observable, platform, that;

observable = require('data/observable');

platform = require("platform");

calendarBuilder = require("./calendar-builder");

moment = require('~/support/moment');

that = {};

CalendarView = (function() {
  function CalendarView() {
    that = this;
    that.builder = new calendarBuilder.CalendarBuilder({
      minDate: moment().toDate(),
      maxDate: moment().add('months', 3).toDate(),
      disableEndWeekDays: false
    });
    that.viewModel = observable.fromObject({
      weekDays: that.builder.weekDays,
      days: [],
      label: "",
      colWidth: 0,
      rowHeight: 0,
      height: 0,
      rowHeaderHeight: 0,
      hasNext: true,
      hasPrev: true
    });
    that.onDateChange();
    that.onSizeChange();
    that.viewModel.onConfigure = that.onConfigure;
    that.viewModel.onClear = that.onClear;
  }

  CalendarView.prototype.onClear = function() {
    that.builder = new calendarBuilder.CalendarBuilder({
      minDate: moment().toDate(),
      maxDate: moment().add('months', 3).toDate(),
      disableEndWeekDays: false
    });
    that.onDateChange();
    return that.onSizeChange();
  };

  CalendarView.prototype.onConfigure = function(params) {
    console.log("*** CalendarView.onConfigure");
    that.builder.setWeekDaysToDisable(params.weekDaysToDisable);
    that.builder.setDaysToDisable(params.daysToDisable);
    that.builder.init({
      minDate: params.minDate.toDate(),
      maxDate: params.maxDate.toDate(),
      disableEndWeekDays: false
    });
    that.onDateChange();
    return that.onSizeChange();
  };

  CalendarView.prototype.onSizeChange = function() {
    var colWidth, days, height, rowHeaderHeight, rowHeight;
    days = that.builder.days;
    colWidth = (platform.screen.mainScreen.widthPixels / platform.screen.mainScreen.scale) / 8;
    rowHeight = colWidth - (colWidth * 0.3);
    rowHeaderHeight = 30;
    height = (rowHeight * 0.5) + (rowHeight * 6);
    that.viewModel.set('colWidth', colWidth);
    that.viewModel.set('rowHeight', rowHeight);
    that.viewModel.set('rowHeaderHeight', rowHeaderHeight);
    that.viewModel.set('height', height);
    that.viewModel.set('hasNext', that.builder.hasNext());
    return that.viewModel.set('hasPrev', that.builder.hasPrev());
  };

  CalendarView.prototype.onDateTap = function(args) {
    var item;
    if (args.index > -1) {
      item = that.builder.days[args.index];
      that.builder.onSelect(item);
      that.onDateChange();
      if (that.builder.selected) {
        return that.viewModel.listener(that.builder.selected.get('date'));
      }
    }
  };

  CalendarView.prototype.onNext = function(args) {
    that.builder.onNext();
    if (that.builder.days) {
      that.onDateChange();
      return that.onSizeChange();
    }
  };

  CalendarView.prototype.onPrev = function(args) {
    that.builder.onPrev();
    if (that.builder.days) {
      that.onDateChange();
      return that.onSizeChange();
    }
  };

  CalendarView.prototype.onDateChange = function() {
    that.viewModel.set('days', []);
    that.viewModel.set('days', that.builder.days);
    return that.viewModel.set('label', that.builder.label);
  };

  CalendarView.prototype.onLoaded = function(args) {
    that.page = args.object;
    that.page.bindingContext = that.viewModel;
    return console.log("CalendarView.onLoaded");
  };

  return CalendarView;

})();

module.exports = new CalendarView();
