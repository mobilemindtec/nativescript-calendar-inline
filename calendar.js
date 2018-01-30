var CalendarBuilder, CalendarView, GridLayout, GridView, Image, ItemSpec, Label, StackLayout, builder, isInt, moment, observable, platform, that, view,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

observable = require('data/observable');

platform = require('platform');

CalendarBuilder = require('./calendar-builder').CalendarBuilder;

moment = require('moment-mini');

GridLayout = require('tns-core-modules/ui/layouts/grid-layout').GridLayout;

StackLayout = require('tns-core-modules/ui/layouts/stack-layout').StackLayout;

ItemSpec = require('tns-core-modules/ui/layouts/grid-layout').ItemSpec;

Label = require('tns-core-modules/ui/label').Label;

Image = require('tns-core-modules/ui/image').Image;

builder = require('tns-core-modules/ui/builder');

GridView = require('nativescript-grid-view').GridView;

view = require("ui/core/view");

that = {};

CalendarView = (function(superClass) {
  extend(CalendarView, superClass);

  CalendarView.prototype._iconPrevSrc = __dirname + "/icons/icon_calendar_prev.png";

  CalendarView.prototype._iconNexSrc = __dirname + "/icons/icon_calendar_next.png";

  CalendarView.prototype.weekdayItemTemplate = function() {
    return "<StackLayout>\n  <Label text=\"{{ text }}\" class=\"classDataNavigationHeaderItem\"/>\n</StackLayout>    ";
  };

  CalendarView.prototype.dayMonthItemTemplate = function() {
    return "<StackLayout class=\"{{ bgClasse }}\">\n  <Label text=\"{{ text }}\" class=\"{{ textClasse }}\"/>\n</StackLayout> ";
  };

  function CalendarView() {
    CalendarView.__super__.constructor.call(this);
    this.calendarBuilder = new CalendarBuilder({
      minDate: moment().toDate(),
      maxDate: moment().add('months', 3).toDate()
    });
  }

  CalendarView.prototype.initialized = false;

  CalendarView.prototype.initNativeView = function() {
    var colWidth, height, result, rowHeaderHeight, rowHeight;
    result = CalendarView.__super__.initNativeView.call(this);
    that = this;
    colWidth = (platform.screen.mainScreen.widthPixels / platform.screen.mainScreen.scale) / 8;
    rowHeight = colWidth - (colWidth * 0.3);
    rowHeaderHeight = 30;
    height = (rowHeight * 0.5) + (rowHeight * 6);
    this.className = 'classCalendarGrid';
    this.gridNavigation = new GridLayout();
    this.gridNavigation.addColumn(new ItemSpec(40, 'pixel'));
    this.gridNavigation.addColumn(new ItemSpec(1, 'star'));
    this.gridNavigation.addColumn(new ItemSpec(40, 'pixel'));
    this.gridNavigation.className = 'classDataNavigation';
    this.imgPrev = new Image();
    this.imgPrev.src = this._iconPrevSrc;
    this.imgPrev.className = 'classDataNavigationPrevIcon';
    this.imgPrev.on('tap', function(view) {
      return that.onPrev('view');
    });
    GridLayout.setColumn(this.imgPrev, 0);
    this.gridNavigation.addChild(this.imgPrev);
    this.lblMonth = new Label();
    this.lblMonth.text = "";
    this.lblMonth.className = 'classDataNavigationTitle';
    GridLayout.setColumn(this.lblMonth, 1);
    this.gridNavigation.addChild(this.lblMonth);
    this.imgNext = new Image();
    this.imgNext.src = this._iconNexSrc;
    this.imgNext.className = 'classDataNavigationNextIcon';
    this.imgNext.on('tap', function(view) {
      return that.onNext(view);
    });
    GridLayout.setColumn(this.imgNext, 2);
    this.gridNavigation.addChild(this.imgNext);
    this.addRow(new ItemSpec(1, 'auto'));
    this.addRow(new ItemSpec(30, 'pixel'));
    this.addRow(new ItemSpec(1, 'auto'));
    GridLayout.setRow(this.gridNavigation, 0);
    this.addChild(this.gridNavigation);
    this.gridWeekDays = new GridView();
    this.gridWeekDays.verticalSpacing = 1;
    this.gridWeekDays.horizontalSpacing = 1;
    this.gridWeekDays.colWidth = colWidth;
    this.gridWeekDays.rowHeight = rowHeaderHeight;
    this.gridWeekDays.itemTemplate = this.weekdayItemTemplate();
    this.gridWeekDays.items = [];
    GridLayout.setRow(this.gridWeekDays, 1);
    this.addChild(this.gridWeekDays);
    this.gridMonthDays = new GridView();
    this.gridMonthDays.verticalSpacing = 3;
    this.gridMonthDays.horizontalSpacing = 1;
    this.gridMonthDays.colWidth = colWidth;
    this.gridMonthDays.rowHeight = rowHeight;
    this.gridMonthDays.on('itemTap', function(view) {
      return that.onDateTap(view);
    });
    this.gridMonthDays.itemTemplate = this.dayMonthItemTemplate();
    this.gridMonthDays.items = [];
    GridLayout.setRow(this.gridMonthDays, 2);
    this.addChild(this.gridMonthDays);
    this.calendarUpdate();
    return result;
  };

  CalendarView.prototype.calendarUpdate = function() {
    this.gridWeekDays.items = [];
    if (this._weekdayNames && this._weekdayNames.length > 0) {
      this.gridWeekDays.items = this._weekdayNames;
    } else {
      this.gridWeekDays.items = this.calendarBuilder.weekDays;
    }
    if (this._monthNames && this._monthNames.length > 0) {
      this.calendarBuilder.setMonths(this._monthNames);
    }
    if (this._weekendsToDisable) {
      this.calendarBuilder.setWeekDaysToDisable(this._weekendsToDisable);
    }
    if (this._daysToDisable) {
      this.calendarBuilder.setDaysToDisable(this._daysToDisable);
    }
    this.calendarBuilder.init({
      minDate: this._minDate ? this._minDate : moment().toDate(),
      maxDate: this._maxDate ? this._maxDate : moment().add('months', 3).toDate(),
      disableEndWeekDays: this._disableWeekend,
      startDate: this._startDate ? this._startDate : void 0
    });
    if (this._iconPrev) {
      this.imgPrev.src = this._iconPrev;
    }
    if (this._iconNext) {
      this.imgNext.src = this._iconNext;
    }
    this.onDateChange();
    this.onSizeChange();
    return this.initialized = true;
  };

  CalendarView.prototype.onPropertyChange = function(propertyName, value) {
    switch (propertyName) {
      case 'rowHeight':
        this._rowHeight = value;
        break;
      case 'rowWidth':
        this._rowHeight = value;
        break;
      case 'weekdayNames':
        this._weekdayNames = value;
        break;
      case 'monthNames':
        this._monthNames = value;
        break;
      case 'startDate':
        this._startDate = value;
        break;
      case 'minDate':
        this._minDate = value;
        break;
      case 'maxDate':
        this._maxDate = value;
        break;
      case 'disableWeekend':
        this._disableWeekend = value;
        break;
      case 'weekendsToDisable':
        this._weekendsToDisable = value;
        break;
      case 'daysToDisable':
        this._daysToDisable = value;
        break;
      case 'iconPrev':
        this._iconPrev = value;
        break;
      case 'iconNext':
        this._iconNext = value;
        break;
      default:
        console.log("property " + propertyName + " not found");
    }
    if (this.initialized) {
      return this.calendarUpdate();
    }
  };

  CalendarView.prototype.onClear = function() {
    return this.calendarUpdate();
  };

  CalendarView.prototype.onSizeChange = function() {
    var colWidth, days, height, rowHeaderHeight, rowHeight;
    days = this.calendarBuilder.days;
    colWidth = (platform.screen.mainScreen.widthPixels / platform.screen.mainScreen.scale) / 8;
    rowHeight = colWidth - (colWidth * 0.3);
    rowHeaderHeight = 30;
    height = (rowHeight * 0.5) + (rowHeight * 6);
    this.gridMonthDays.colWidth = this._rowHeight > 0 ? this._rowHeight : colWidth;
    this.gridMonthDays.rowHeight = rowHeight;
    this.gridWeekDays.colWidth = this._rowHeight > 0 ? rowWidth : colWidth;
    this.gridWeekDays.rowHeight = this._rowHeight > 0 ? this._rowHeight : rowHeaderHeight;
    this.imgPrev.visibility = this.calendarBuilder.hasPrev() ? 'visible' : 'collapse';
    return this.imgNext.visibility = this.calendarBuilder.hasNext() ? 'visible' : 'collapse';
  };

  CalendarView.prototype.onDateTap = function(args) {
    var item;
    if (args.index > -1) {
      item = this.calendarBuilder.days[args.index];
      this.calendarBuilder.onSelect(item);
      this.onDateChange();
      if (this.calendarBuilder.selected) {
        return this.notify({
          eventName: CalendarView.itemTapEvent,
          object: this,
          date: this.calendarBuilder.selected.get('date')
        });
      }
    }
  };

  CalendarView.prototype.onNext = function(args) {
    this.calendarBuilder.onNext();
    if (this.calendarBuilder.days) {
      this.onDateChange();
      return this.onSizeChange();
    }
  };

  CalendarView.prototype.onPrev = function(args) {
    this.calendarBuilder.onPrev();
    if (this.calendarBuilder.days) {
      this.onDateChange();
      return this.onSizeChange();
    }
  };

  CalendarView.prototype.onDateChange = function() {
    var i, it, len, ref;
    this.lblMonth.text = this.calendarBuilder.label;
    this.gridMonthDays.items = [];
    ref = this.calendarBuilder.days;
    for (i = 0, len = ref.length; i < len; i++) {
      it = ref[i];
      if (it.get('today')) {
        it.set('bgClasse', 'classDataItem classDataItemToday');
        it.set('textClasse', 'classDataItemText classDataItemTodayText');
      } else if (it.get('selected')) {
        it.set('bgClasse', 'classDataItem classDataItemSelected');
        it.set('textClasse', 'classDataItemText classDataItemSelectedText');
      } else if (it.get('invalid')) {
        it.set('bgClasse', 'classDataItem classDataItemInvalid');
        it.set('textClasse', '');
      } else if (!it.get('enabled')) {
        it.set('bgClasse', 'classDataItem classDataItemDisabled');
        it.set('textClasse', 'classDataItemText classDataItemDisabledText');
      } else {
        it.set('bgClasse', ' classDataItem');
        it.set('textClasse', 'classDataItemText');
      }
    }
    return this.gridMonthDays.items = this.calendarBuilder.days;
  };

  return CalendarView;

})(GridLayout);

CalendarView.itemTapEvent = "itemTap";

exports.Calendar = CalendarView;

exports.rowHeightProperty = new view.Property({
  name: "rowHeight",
  defaultValue: void 0,
  affectsLayout: true,
  valueConverter: function(value) {
    if (typeof value === 'number') {
      return value;
    }
    if (isInt(value)) {
      return parseInt(value, 10);
    }
    return 0;
  },
  valueChanged: function(target, oldValue, newValue) {
    return target.onPropertyChange('rowHeight', newValue);
  }
});

exports.rowHeightProperty.register(CalendarView);

exports.rowWidthProperty = new view.Property({
  name: "rowWidth",
  defaultValue: void 0,
  affectsLayout: true,
  valueConverter: function(value) {
    if (typeof value === 'number') {
      return value;
    }
    if (isInt(value)) {
      return parseInt(value, 10);
    }
    return 0;
  },
  valueChanged: function(target, oldValue, newValue) {
    return target.onPropertyChange('rowWidth', newValue);
  }
});

exports.rowWidthProperty.register(CalendarView);

exports.weekdayNamesProperty = new view.Property({
  name: "weekdayNames",
  defaultValue: [],
  affectsLayout: true,
  valueChanged: function(target, oldValue, newValue) {
    var i, it, items, len;
    items = [];
    if (newValue) {
      for (i = 0, len = newValue.length; i < len; i++) {
        it = newValue[i];
        items.push({
          text: it
        });
      }
    }
    return target.onPropertyChange('weekdayNames', items);
  }
});

exports.weekdayNamesProperty.register(CalendarView);

exports.monthNamesProperty = new view.Property({
  name: "monthNames",
  defaultValue: [],
  affectsLayout: true,
  valueChanged: function(target, oldValue, newValue) {
    return target.onPropertyChange('monthNames', newValue);
  }
});

exports.monthNamesProperty.register(CalendarView);

exports.startDateProperty = new view.Property({
  name: "startDate",
  defaultValue: void 0,
  affectsLayout: true,
  valueChanged: function(target, oldValue, newValue) {
    return target.onPropertyChange('startDate', newValue);
  }
});

exports.startDateProperty.register(CalendarView);

exports.minDateProperty = new view.Property({
  name: "minDate",
  defaultValue: void 0,
  affectsLayout: true,
  valueChanged: function(target, oldValue, newValue) {
    return target.onPropertyChange('minDate', newValue);
  }
});

exports.minDateProperty.register(CalendarView);

exports.maxDateProperty = new view.Property({
  name: "maxDate",
  defaultValue: void 0,
  affectsLayout: true,
  valueChanged: function(target, oldValue, newValue) {
    return target.onPropertyChange('maxDate', newValue);
  }
});

exports.maxDateProperty.register(CalendarView);

exports.disableWeekendProperty = new view.Property({
  name: "disableWeekend",
  defaultValue: true,
  affectsLayout: true,
  valueConverter: function(value) {
    if (typeof value === 'boolean') {
      return value;
    }
    return value === "true";
  },
  valueChanged: function(target, oldValue, newValue) {
    return target.onPropertyChange('disableWeekend', newValue);
  }
});

exports.disableWeekendProperty.register(CalendarView);

exports.weekendsToDisableProperty = new view.Property({
  name: "weekendsToDisable",
  defaultValue: [],
  affectsLayout: true,
  valueChanged: function(target, oldValue, newValue) {
    return target.onPropertyChange('weekendsToDisable', newValue);
  }
});

exports.weekendsToDisableProperty.register(CalendarView);

exports.daysToDisableProperty = new view.Property({
  name: "daysToDisable",
  defaultValue: [],
  affectsLayout: true,
  valueChanged: function(target, oldValue, newValue) {
    return target.onPropertyChange('daysToDisable', newValue);
  }
});

exports.daysToDisableProperty.register(CalendarView);

exports.iconPrevProperty = new view.Property({
  name: "iconPrev",
  defaultValue: void 0,
  affectsLayout: true,
  valueChanged: function(target, oldValue, newValue) {
    return target.onPropertyChange('iconPrev', newValue);
  }
});

exports.iconPrevProperty.register(CalendarView);

exports.iconNextProperty = new view.Property({
  name: "iconNext",
  defaultValue: void 0,
  affectsLayout: true,
  valueChanged: function(target, oldValue, newValue) {
    return target.onPropertyChange('iconNext', newValue);
  }
});

exports.iconNextProperty.register(CalendarView);

isInt = function(value) {
  return !isNaN(value) && parseInt(Number(value)) === value && !isNaN(parseInt(value, 10));
};
