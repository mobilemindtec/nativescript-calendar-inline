observable = require 'data/observable'
platform = require 'platform'
CalendarBuilder = require('./calendar-builder').CalendarBuilder
moment = require 'moment-mini'
GridLayout = require('tns-core-modules/ui/layouts/grid-layout').GridLayout
StackLayout = require('tns-core-modules/ui/layouts/stack-layout').StackLayout
ItemSpec = require('tns-core-modules/ui/layouts/grid-layout').ItemSpec
Label = require('tns-core-modules/ui/label').Label
Image = require('tns-core-modules/ui/image').Image
builder = require 'tns-core-modules/ui/builder'
GridView = require('nativescript-grid-view').GridView
view = require("ui/core/view")

that = { }

class CalendarView extends GridLayout

  _iconPrevSrc: "#{__dirname}/icons/icon_calendar_prev.png"
  _iconNexSrc: "#{__dirname}/icons/icon_calendar_next.png"

 
  weekdayItemTemplate: () ->
    """
      <StackLayout>
        <Label text="{{ text }}" class="classDataNavigationHeaderItem"/>
      </StackLayout>    
    """

  dayMonthItemTemplate: () ->
    """
      <StackLayout class="{{ bgClasse }}">
        <Label text="{{ text }}" class="{{ textClasse }}"/>
      </StackLayout> 
    """


  constructor: () ->
    super()

    @calendarBuilder = new CalendarBuilder({
      minDate: moment().toDate()
      maxDate: moment().add('months', 3).toDate()      
    })    

  initialized: false

  initNativeView: () ->
    result = super()

    that = @
    colWidth = ((platform.screen.mainScreen.widthPixels / platform.screen.mainScreen.scale) / 8 )
    rowHeight = colWidth - (colWidth * 0.3)
    rowHeaderHeight = 30
    height = (rowHeight * 0.5) + (rowHeight * 6)

    @className = 'classCalendarGrid'

    @gridNavigation = new GridLayout()
    @gridNavigation.addColumn(new ItemSpec(40, 'pixel'))
    @gridNavigation.addColumn(new ItemSpec(1, 'star'))
    @gridNavigation.addColumn(new ItemSpec(40, 'pixel'))
    @gridNavigation.className = 'classDataNavigation'

    @imgPrev = new Image()
    @imgPrev.src = @_iconPrevSrc
    @imgPrev.className = 'classDataNavigationPrevIcon'
    @imgPrev.on 'tap', (view) ->
      that.onPrev('view')
    
    GridLayout.setColumn(@imgPrev, 0)
    @gridNavigation.addChild(@imgPrev)

    @lblMonth = new Label()
    @lblMonth.text = ""
    @lblMonth.className = 'classDataNavigationTitle'
    
    GridLayout.setColumn(@lblMonth, 1)
    @gridNavigation.addChild(@lblMonth)

    @imgNext = new Image()
    @imgNext.src = @_iconNexSrc
    @imgNext.className = 'classDataNavigationNextIcon'
    @imgNext.on 'tap', (view) ->      
      that.onNext(view)
    
    GridLayout.setColumn(@imgNext, 2)
    @gridNavigation.addChild(@imgNext)

    @addRow(new ItemSpec(1, 'auto'))
    @addRow(new ItemSpec(30, 'pixel'))
    @addRow(new ItemSpec(1, 'auto'))
    

    GridLayout.setRow(@gridNavigation, 0)
    @addChild(@gridNavigation)

    @gridWeekDays = new GridView()
    @gridWeekDays.verticalSpacing = 1
    @gridWeekDays.horizontalSpacing = 1
    @gridWeekDays.colWidth = colWidth
    @gridWeekDays.rowHeight = rowHeaderHeight
    @gridWeekDays.itemTemplate = @weekdayItemTemplate()

    @gridWeekDays.items = [ ]

    GridLayout.setRow(@gridWeekDays, 1)
    @addChild(@gridWeekDays)


    @gridMonthDays = new GridView()
    @gridMonthDays.verticalSpacing = 3
    @gridMonthDays.horizontalSpacing = 1
    @gridMonthDays.colWidth = colWidth
    @gridMonthDays.rowHeight = rowHeight
    
    @gridMonthDays.on 'itemTap', (view) ->
      that.onDateTap(view)

    @gridMonthDays.itemTemplate = @dayMonthItemTemplate()

    @gridMonthDays.items = []

    GridLayout.setRow(@gridMonthDays, 2)
    @addChild(@gridMonthDays)

    @calendarUpdate()

    return result

  calendarUpdate: () ->

    @gridWeekDays.items = []

    if @_weekdayNames and @_weekdayNames.length > 0
      @gridWeekDays.items = @_weekdayNames
    else
      @gridWeekDays.items = @calendarBuilder.weekDays

    if @_monthNames and @_monthNames.length > 0
      @calendarBuilder.setMonths(@_monthNames)


    if @_weekendsToDisable
      @calendarBuilder.setWeekDaysToDisable(@_weekendsToDisable)

    if @_daysToDisable
      @calendarBuilder.setDaysToDisable(@_daysToDisable)
    
    @calendarBuilder.init({
      minDate: if @_minDate then @_minDate else moment().toDate()
      maxDate: if @_maxDate then @_maxDate else moment().add('months', 3).toDate()
      disableEndWeekDays: @_disableWeekend
      startDate: if @_startDate then @_startDate else undefined
    })

    if @_iconPrev
      @imgPrev.src = @_iconPrev

    if @_iconNext
      @imgNext.src = @_iconNext

    @onDateChange()
    @onSizeChange()

    @initialized = true

  onPropertyChange: (propertyName, value) ->

    switch propertyName
      when 'rowHeight'
        @_rowHeight = value
      when 'rowWidth'
        @_rowHeight = value
      when 'weekdayNames'
        @_weekdayNames = value
      when 'monthNames'
        @_monthNames = value
      when 'startDate'
        @_startDate = value
      when 'minDate'
        @_minDate = value
      when 'maxDate'
        @_maxDate = value
      when 'disableWeekend'
        @_disableWeekend = value
      when 'weekendsToDisable'
        @_weekendsToDisable = value
      when 'daysToDisable'
        @_daysToDisable = value
      when 'iconPrev'
        @_iconPrev = value
      when 'iconNext'
        @_iconNext = value
      else
        console.log "property #{propertyName} not found"

    if @initialized
      @calendarUpdate()

  onClear: () ->
    @calendarUpdate()

  onSizeChange: () ->
    days = @calendarBuilder.days
    colWidth = ((platform.screen.mainScreen.widthPixels / platform.screen.mainScreen.scale) / 8 )
    rowHeight = colWidth - (colWidth * 0.3)
    rowHeaderHeight = 30
    height = (rowHeight * 0.5) + (rowHeight * 6)

    @gridMonthDays.colWidth = if @_rowHeight > 0 then @_rowHeight else colWidth
    @gridMonthDays.rowHeight = rowHeight

    @gridWeekDays.colWidth = if @_rowHeight > 0 then rowWidth else colWidth
    @gridWeekDays.rowHeight = if @_rowHeight > 0 then @_rowHeight else rowHeaderHeight    


    @imgPrev.visibility = if @calendarBuilder.hasPrev() then 'visible' else 'collapse'
    @imgNext.visibility = if @calendarBuilder.hasNext() then 'visible' else 'collapse'


  onDateTap: (args) ->
    if args.index > -1
      item = @calendarBuilder.days[args.index]
      @calendarBuilder.onSelect(item)
      @onDateChange()
      # back result      
      if @calendarBuilder.selected
        @notify({
          eventName: CalendarView.itemTapEvent,
          object: @,            
          date: @calendarBuilder.selected.get('date')
        });        

  onNext: (args) ->
    @calendarBuilder.onNext()
    if @calendarBuilder.days
      @onDateChange()
      @onSizeChange()

  onPrev: (args) ->
    @calendarBuilder.onPrev()
    if @calendarBuilder.days
      @onDateChange()
      @onSizeChange()

  onDateChange: () ->
    @lblMonth.text = @calendarBuilder.label
    @gridMonthDays.items = []

    for it in @calendarBuilder.days

      if it.get('today')

        it.set('bgClasse', 'classDataItem classDataItemToday')
        it.set('textClasse', 'classDataItemText classDataItemTodayText')

      else if it.get('selected')

        it.set('bgClasse', 'classDataItem classDataItemSelected')
        it.set('textClasse', 'classDataItemText classDataItemSelectedText')

      else if it.get('invalid')

        it.set('bgClasse', 'classDataItem classDataItemInvalid')
        it.set('textClasse', '')

      else if not it.get('enabled')

        it.set('bgClasse', 'classDataItem classDataItemDisabled')
        it.set('textClasse', 'classDataItemText classDataItemDisabledText')

      else

        it.set('bgClasse', ' classDataItem')
        it.set('textClasse', 'classDataItemText')

    @gridMonthDays.items = @calendarBuilder.days


CalendarView.itemTapEvent = "itemTap";

exports.Calendar = CalendarView


exports.rowHeightProperty = new view.Property({
  name: "rowHeight"
  defaultValue: undefined
  affectsLayout: true
  valueConverter: (value) ->

    if typeof value is 'number'
      return value
    
    if isInt(value)      
      return parseInt(value, 10)

    return 0

  valueChanged: (target, oldValue, newValue) ->
    target.onPropertyChange('rowHeight', newValue)
})
exports.rowHeightProperty.register(CalendarView)

exports.rowWidthProperty = new view.Property({
  name: "rowWidth"
  defaultValue: undefined
  affectsLayout: true
  valueConverter: (value) ->

    if typeof value is 'number'
      return value
    
    if isInt(value)      
      return parseInt(value, 10)

    return 0

  valueChanged: (target, oldValue, newValue) ->
    target.onPropertyChange('rowWidth', newValue)
})
exports.rowWidthProperty.register(CalendarView)

exports.weekdayNamesProperty = new view.Property({
  name: "weekdayNames"
  defaultValue: []
  affectsLayout: true
  valueChanged: (target, oldValue, newValue) ->

    items = []
    if newValue
      for it in newValue
        items.push({text: it})

    target.onPropertyChange('weekdayNames', items)
})
exports.weekdayNamesProperty.register(CalendarView)

exports.monthNamesProperty = new view.Property({
  name: "monthNames"
  defaultValue: []
  affectsLayout: true
  valueChanged: (target, oldValue, newValue) ->
    target.onPropertyChange('monthNames', newValue)
})
exports.monthNamesProperty.register(CalendarView)

exports.startDateProperty = new view.Property({
  name: "startDate"
  defaultValue: undefined
  affectsLayout: true
  valueChanged: (target, oldValue, newValue) ->
    target.onPropertyChange('startDate', newValue)
})
exports.startDateProperty.register(CalendarView)

exports.minDateProperty = new view.Property({
  name: "minDate"
  defaultValue: undefined
  affectsLayout: true
  valueChanged: (target, oldValue, newValue) ->
    target.onPropertyChange('minDate', newValue)
})
exports.minDateProperty.register(CalendarView)

exports.maxDateProperty = new view.Property({
  name: "maxDate"
  defaultValue: undefined
  affectsLayout: true
  valueChanged: (target, oldValue, newValue) ->
    target.onPropertyChange('maxDate', newValue)
})
exports.maxDateProperty.register(CalendarView)

exports.disableWeekendProperty = new view.Property({
  name: "disableWeekend"
  defaultValue: true
  affectsLayout: true
  valueConverter: (value) ->

    if typeof value is 'boolean'
      return value
    
    return value == "true"

  valueChanged: (target, oldValue, newValue) ->
    target.onPropertyChange('disableWeekend', newValue)
})
exports.disableWeekendProperty.register(CalendarView)

exports.weekendsToDisableProperty = new view.Property({
  name: "weekendsToDisable"
  defaultValue: []
  affectsLayout: true
  valueChanged: (target, oldValue, newValue) ->
    target.onPropertyChange('weekendsToDisable', newValue)
})
exports.weekendsToDisableProperty.register(CalendarView)

exports.daysToDisableProperty = new view.Property({
  name: "daysToDisable"
  defaultValue: []
  affectsLayout: true
  valueChanged: (target, oldValue, newValue) ->
    target.onPropertyChange('daysToDisable', newValue)
})
exports.daysToDisableProperty.register(CalendarView)

exports.iconPrevProperty = new view.Property({
  name: "iconPrev"
  defaultValue: undefined
  affectsLayout: true
  valueChanged: (target, oldValue, newValue) ->
    target.onPropertyChange('iconPrev', newValue)
})
exports.iconPrevProperty.register(CalendarView)

exports.iconNextProperty = new view.Property({
  name: "iconNext"
  defaultValue: undefined
  affectsLayout: true
  valueChanged: (target, oldValue, newValue) ->
    target.onPropertyChange('iconNext', newValue)
})
exports.iconNextProperty.register(CalendarView)

isInt = (value) ->
  return !isNaN(value) and parseInt(Number(value)) == value and !isNaN(parseInt(value, 10))
