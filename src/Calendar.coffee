observable = require 'data/observable'
platform = require "platform"
calendarBuilder = require "./calendar-builder"
moment = require('~/support/moment')

that = { }

class CalendarView



  constructor: () ->
    that = @

    that.builder = new calendarBuilder.CalendarBuilder({
      minDate: moment().toDate()
      maxDate: moment().add('months', 3).toDate()
      disableEndWeekDays: false
    })

    that.viewModel = observable.fromObject({
      weekDays: that.builder.weekDays
      days: []
      label: ""
      colWidth: 0
      rowHeight: 0
      height: 0
      rowHeaderHeight: 0
      hasNext: true
      hasPrev: true
    })
    that.onDateChange()
    that.onSizeChange()

    that.viewModel.onConfigure = that.onConfigure
    that.viewModel.onClear = that.onClear

  onClear: () ->
    that.builder = new calendarBuilder.CalendarBuilder({
      minDate: moment().toDate()
      maxDate: moment().add('months', 3).toDate()
      disableEndWeekDays: false
    })
    that.onDateChange()
    that.onSizeChange()

  onConfigure: (params) ->
    console.log("*** CalendarView.onConfigure")
    
    that.builder.setWeekDaysToDisable(params.weekDaysToDisable)
    that.builder.setDaysToDisable(params.daysToDisable)
    
    that.builder.init({
      minDate: params.minDate.toDate()
      maxDate: params.maxDate.toDate()
      disableEndWeekDays: false
    })

    that.onDateChange()
    that.onSizeChange()

  onSizeChange: () ->
    days = that.builder.days
    colWidth = ((platform.screen.mainScreen.widthPixels / platform.screen.mainScreen.scale) / 8 )
    rowHeight = colWidth - (colWidth * 0.3)
    rowHeaderHeight = 30
    height = (rowHeight * 0.5) + (rowHeight * 6)

    that.viewModel.set('colWidth', colWidth)
    that.viewModel.set('rowHeight', rowHeight)
    that.viewModel.set('rowHeaderHeight', rowHeaderHeight)
    that.viewModel.set('height', height)
    that.viewModel.set('hasNext', that.builder.hasNext())
    that.viewModel.set('hasPrev', that.builder.hasPrev())

  onDateTap: (args) ->
    if args.index > -1
      item = that.builder.days[args.index]
      that.builder.onSelect(item)
      that.onDateChange()
      # back result
      if that.builder.selected
        that.viewModel.listener(that.builder.selected.get('date'))

  onNext: (args) ->
    that.builder.onNext()
    if that.builder.days
      that.onDateChange()
      that.onSizeChange()

  onPrev: (args) ->
    that.builder.onPrev()
    if that.builder.days
      that.onDateChange()
      that.onSizeChange()

  onDateChange: () ->
    that.viewModel.set('days', [])
    that.viewModel.set('days', that.builder.days)
    that.viewModel.set('label', that.builder.label)

  onLoaded: (args) ->
    that.page = args.object
    that.page.bindingContext = that.viewModel
    console.log("CalendarView.onLoaded")

module.exports = new CalendarView();
