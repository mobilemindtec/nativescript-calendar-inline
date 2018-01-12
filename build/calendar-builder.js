var CalendarBuilder, moment, observable,
  indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

moment = require('~/support/moment');

observable = require('data/observable');

CalendarBuilder = (function() {
  CalendarBuilder.prototype.weekDays = [
    {
      text: 'Dom'
    }, {
      text: 'Seg'
    }, {
      text: 'Ter'
    }, {
      text: 'Qua'
    }, {
      text: 'Qui'
    }, {
      text: 'Sex'
    }, {
      text: 'Sab'
    }
  ];

  CalendarBuilder.prototype.months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

  CalendarBuilder.prototype.disableEndWeekDays = true;

  CalendarBuilder.prototype.weekDaysToDisable = [];

  CalendarBuilder.prototype.daysToDisable = [];

  CalendarBuilder.prototype.startDate = new Date();

  CalendarBuilder.prototype.current = void 0;

  CalendarBuilder.prototype.minDate = void 0;

  CalendarBuilder.prototype.maxDate = void 0;

  CalendarBuilder.prototype.days = [];

  CalendarBuilder.prototype.selected = void 0;

  CalendarBuilder.prototype.prevDate = void 0;

  CalendarBuilder.prototype.nextDate = void 0;

  CalendarBuilder.prototype.label = void 0;

  function CalendarBuilder(args) {
    console.log("# CalendarBuilder init");
    this.init(args);
  }

  CalendarBuilder.prototype.setDisableEndWeekDays = function(disableEndWeekDays) {
    return this.disableEndWeekDays = disableEndWeekDays;
  };

  CalendarBuilder.prototype.setWeekDaysToDisable = function(weekDaysToDisable) {
    return this.weekDaysToDisable = weekDaysToDisable;
  };

  CalendarBuilder.prototype.setDaysToDisable = function(daysToDisable) {
    return this.daysToDisable = daysToDisable;
  };

  CalendarBuilder.prototype.onPrev = function() {
    var prev;
    prev = this.prevDate.toDate();
    this.prevDate = moment(this.prevDate).subtract(1, 'months');
    this.nextDate = moment(this.prevDate).add(2, 'months');
    return this.onDates(prev);
  };

  CalendarBuilder.prototype.onNext = function() {
    var next;
    next = this.nextDate.toDate();
    this.nextDate = moment(this.nextDate).add(1, 'months');
    this.prevDate = moment(this.nextDate).subtract(2, 'months');
    return this.onDates(next);
  };

  CalendarBuilder.prototype.init = function(args) {
    if (args) {
      if (args.weekDays && args.weekDays.length > 0) {
        this.weekDays = args.weekDays;
      }
      if (args.months && args.months.length > 0) {
        this.months = args.months;
      }
      if (args.startDate) {
        this.startDate = args.startDate;
      }
      if (args.disableEndWeekDays !== void 0) {
        this.disableEndWeekDays = args.disableEndWeekDays;
      }
      if (args.weekDaysToDisable) {
        this.weekDaysToDisable = args.weekDaysToDisable;
      }
      if (args.minDate) {
        this.minDate = args.minDate;
      }
      if (args.maxDate) {
        this.maxDate = args.maxDate;
      }
      if (args.daysToDisable) {
        this.daysToDisable = args.daysToDisable;
      }
    }
    this.selected = void 0;
    this.nextDate = moment(this.startDate).add(1, 'months');
    this.prevDate = moment(this.startDate).subtract(1, 'months');
    return this.onDates(this.startDate);
  };

  CalendarBuilder.prototype.onLabel = function() {
    var month, year;
    month = this.months[this.current.get('month')];
    year = this.current.get('year');
    return this.label = month + " " + year;
  };

  CalendarBuilder.prototype.hasNext = function() {
    if (this.maxDate) {
      if (this.current.isAfter(this.maxDate, 'month') || this.current.isSame(this.maxDate, 'month')) {
        return false;
      }
    }
    return true;
  };

  CalendarBuilder.prototype.hasPrev = function() {
    if (this.minDate) {
      if (this.current.isBefore(this.minDate, 'month') || this.current.isSame(this.minDate, 'month')) {
        return false;
      }
    }
    return true;
  };

  CalendarBuilder.prototype.onDates = function(startDate) {
    var cssClassContainer, cssClassText, currentDate, date, dates, dayOfWeek, i, j, k, l, lastDayOfMount, len, maxDateCheck, minDateCheck, ref, ref1, ref2, startDayOfWeek, today, valid;
    dates = [];
    today = -1;
    this.current = moment(startDate);
    currentDate = this.current.format('YYYY-MM-DD');
    startDayOfWeek = moment(currentDate).date(1).day() - 1;
    lastDayOfMount = moment(currentDate).add(1, 'months').date(1).subtract(1, 'days').get('date');
    minDateCheck = -1;
    maxDateCheck = -1;
    if (moment().isSame(startDate, 'month')) {
      today = moment().get('date');
    }
    if (this.maxDate) {
      if (this.current.isAfter(this.maxDate, 'month')) {
        this.days = [];
        return [];
      }
      if (this.current.isSame(this.maxDate, 'month')) {
        maxDateCheck = moment(this.maxDate).date();
      }
    }
    if (this.minDate) {
      if (this.current.isBefore(this.minDate, 'month')) {
        this.days = [];
        return [];
      }
      if (this.current.isSame(this.minDate, 'month')) {
        minDateCheck = moment(this.minDate).date();
      }
    }
    if (startDayOfWeek > -1) {
      for (i = j = 0, ref = startDayOfWeek; 0 <= ref ? j <= ref : j >= ref; i = 0 <= ref ? ++j : --j) {
        dates.push({
          text: "",
          valid: false,
          cssClassContainer: 'calendar-data-item calendar-data-item-invalid',
          cssClassText: 'calendar-data-item-text'
        });
      }
    }
    for (i = k = 1, ref1 = lastDayOfMount; 1 <= ref1 ? k <= ref1 : k >= ref1; i = 1 <= ref1 ? ++k : --k) {
      cssClassContainer = 'calendar-data-item';
      cssClassText = 'calendar-data-item-text';
      valid = true;
      if (today === i) {
        cssClassContainer = 'calendar-data-item calendar-data-item-today';
        cssClassText = 'calendar-data-item-text calendar-data-item-text-today';
      }
      if (this.disableEndWeekDays) {
        dayOfWeek = moment(currentDate).date(i).day();
        if (dayOfWeek === 0 || dayOfWeek === 6) {
          cssClassContainer = 'calendar-data-item calendar-data-item-disable';
          cssClassText = 'calendar-data-item-text calendar-data-item-text-disable';
          valid = false;
        }
      }
      if (this.weekDaysToDisable) {
        dayOfWeek = moment(currentDate).date(i).day();
        if (indexOf.call(this.weekDaysToDisable, dayOfWeek) >= 0) {
          cssClassContainer = 'calendar-data-item calendar-data-item-disable';
          cssClassText = 'calendar-data-item-text calendar-data-item-text-disable';
          valid = false;
        }
      }
      if (this.daysToDisable) {
        ref2 = this.daysToDisable;
        for (l = 0, len = ref2.length; l < len; l++) {
          date = ref2[l];
          if (moment(currentDate).date(i).isSame(date, 'day')) {
            cssClassContainer = 'calendar-data-item calendar-data-item-disable';
            cssClassText = 'calendar-data-item-text calendar-data-item-text-disable';
            valid = false;
          }
        }
      }
      if (minDateCheck !== -1) {
        if (i <= minDateCheck) {
          cssClassContainer = 'calendar-data-item calendar-data-item-disable';
          cssClassText = 'calendar-data-item-text calendar-data-item-text-disable';
          valid = false;
        }
      }
      if (maxDateCheck !== -1) {
        if (i >= maxDateCheck) {
          cssClassContainer = 'calendar-data-item calendar-data-item-disable';
          cssClassText = 'calendar-data-item-text calendar-data-item-text-disable';
          valid = false;
        }
      }
      date = moment(currentDate).date(i).format('YYYY-MM-DD');
      if (this.selected) {
        if (moment(date).isSame(this.selected.get('date'))) {
          cssClassContainer = 'calendar-data-item calendar-data-item-selected';
          cssClassText = 'calendar-data-item-text calendar-data-item-text-selected';
        }
      }
      dates.push(observable.fromObject({
        valid: valid,
        text: i,
        today: today === i,
        cssClassContainer: cssClassContainer,
        cssClassText: cssClassText,
        cssClassContainerCopy: cssClassContainer,
        cssClassTextCopy: cssClassText,
        date: date
      }));
    }
    this.days = dates;
    this.onLabel();
    return dates;
  };

  CalendarBuilder.prototype.onSelect = function(item) {
    if (item && item.get('valid')) {
      this.onUnselect();
      this.selected = item;
      this.selected.set('cssClassContainer', 'calendar-data-item calendar-data-item-selected');
      return this.selected.set('cssClassText', 'calendar-data-item-text calendar-data-item-text-selected');
    }
  };

  CalendarBuilder.prototype.onUnselect = function() {
    if (this.selected) {
      this.selected.set('cssClassContainer', this.selected.cssClassContainerCopy);
      return this.selected.set('cssClassText', this.selected.cssClassTextCopy);
    }
  };

  return CalendarBuilder;

})();

exports.CalendarBuilder = CalendarBuilder;
