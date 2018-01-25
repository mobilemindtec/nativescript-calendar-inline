moment = require('moment-mini')
observable = require 'data/observable'

class CalendarBuilder 

  weekDays: [
    {text: 'Dom'}
    {text: 'Seg'}
    {text: 'Ter'}
    {text: 'Qua'}
    {text: 'Qui'}
    {text: 'Sex'}
    {text: 'Sab'}
  ]  

  months: [
    'Janeiro',
    'Fevereiro',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro',
  ]

  disableEndWeekDays: true
  weekDaysToDisable: []
  daysToDisable: []
  startDate: new Date()
  current: undefined
  minDate: undefined
  maxDate: undefined
  days: []

  selected: undefined

  prevDate: undefined
  nextDate: undefined
  label: undefined

  constructor: (args) ->

    console.log("# CalendarBuilder init")    

    @init(args)
    

  setDisableEndWeekDays: (disableEndWeekDays) ->
    @disableEndWeekDays = disableEndWeekDays

  setWeekDaysToDisable: (weekDaysToDisable) ->
    @weekDaysToDisable = weekDaysToDisable

  setDaysToDisable: (daysToDisable) ->
    @daysToDisable = daysToDisable

  onPrev: () ->
    prev = @prevDate.toDate()
    @prevDate = moment(@prevDate).subtract(1, 'months')
    @nextDate = moment(@prevDate).add(2, 'months')
    return @onDates(prev)

  onNext: () ->
    next = @nextDate.toDate()    
    @nextDate = moment(@nextDate).add(1, 'months')
    @prevDate = moment(@nextDate).subtract(2, 'months')
    return @onDates(next)

  init: (args) ->

    if args 
      
      if args.weekDays and args.weekDays.length > 0
        @weekDays = args.weekDays
      
      if args.months and args.months.length > 0
        @months = args.months

      if args.startDate
        @startDate = args.startDate
      
      if args.disableEndWeekDays != undefined
        @disableEndWeekDays = args.disableEndWeekDays
      
      if args.weekDaysToDisable
        @weekDaysToDisable = args.weekDaysToDisable

      if args.minDate
        @minDate = args.minDate
      
      if args.maxDate
        @maxDate = args.maxDate
      
      if args.daysToDisable
        @daysToDisable = args.daysToDisable

    @selected = undefined
    
    @nextDate = moment(@startDate).add(1, 'months')
    @prevDate = moment(@startDate).subtract(1, 'months')

    @onDates(@startDate)

  onLabel: () ->
    month = @months[@current.get('month')]
    year = @current.get('year')
    @label = "#{month} #{year}"

  hasNext: () ->
    if @maxDate
      ## is after than current
      if @current.isAfter(@maxDate, 'month') || @current.isSame(@maxDate, 'month')
        return false
    return true

  hasPrev: () ->
    if @minDate
      if @current.isBefore(@minDate, 'month') || @current.isSame(@minDate, 'month')
        return false          
    return true


  onDates: (startDate) ->
    # get current day
    dates = []
    today = -1
    @current = moment(startDate)
    currentDate = @current.format('YYYY-MM-DD')
    # get first week day of current month
    startDayOfWeek = moment(currentDate).date(1).day() - 1
    # get last day of current month
    lastDayOfMount = moment(currentDate).add(1, 'months').date(1).subtract(1, 'days').get('date')

    minDateCheck = -1
    maxDateCheck = -1    

    # set today if same month/year
    if moment().isSame(startDate, 'month')      
      today = moment().get('date')

    if @maxDate
      ## is after than current
      if @current.isAfter(@maxDate, 'month')
        @days = []
        return []

      if @current.isSame(@maxDate, 'month')
        # get my day of current month
        maxDateCheck = moment(@maxDate).date()

    if @minDate
      ## is before than current
      if @current.isBefore(@minDate, 'month')
        @days = []
        return []

      if @current.isSame(@minDate, 'month')
        # get my day of current month
        minDateCheck = moment(@minDate).date()

    if startDayOfWeek > -1
      for i in [0..startDayOfWeek]
        dates.push({
          text: ""
          valid: false 
          cssClassContainer: 'calendar-data-item calendar-data-item-invalid'
          cssClassText: 'calendar-data-item-text'
        })

    for i in [1..lastDayOfMount]

      cssClassContainer = 'calendar-data-item'
      cssClassText = 'calendar-data-item-text'
      valid = true

      # check date is today
      if today == i
        cssClassContainer = 'calendar-data-item calendar-data-item-today'
        cssClassText = 'calendar-data-item-text calendar-data-item-text-today'


      # disable week days
      if @disableEndWeekDays        
        dayOfWeek = moment(currentDate).date(i).day()
        if dayOfWeek == 0 || dayOfWeek == 6
          cssClassContainer = 'calendar-data-item calendar-data-item-disable'
          cssClassText = 'calendar-data-item-text calendar-data-item-text-disable'
          valid = false

      if @weekDaysToDisable
        dayOfWeek = moment(currentDate).date(i).day()
        if dayOfWeek in @weekDaysToDisable
          cssClassContainer = 'calendar-data-item calendar-data-item-disable'
          cssClassText = 'calendar-data-item-text calendar-data-item-text-disable'
          valid = false

      if @daysToDisable
        for date in @daysToDisable
          if moment(currentDate).date(i).isSame(date, 'day')
            cssClassContainer = 'calendar-data-item calendar-data-item-disable'
            cssClassText = 'calendar-data-item-text calendar-data-item-text-disable'
            valid = false

      # disable min date
      if minDateCheck != -1
        if i <= minDateCheck 
          cssClassContainer = 'calendar-data-item calendar-data-item-disable'
          cssClassText = 'calendar-data-item-text calendar-data-item-text-disable'          
          valid = false

      if maxDateCheck != -1
        if i >= maxDateCheck
          cssClassContainer = 'calendar-data-item calendar-data-item-disable'
          cssClassText = 'calendar-data-item-text calendar-data-item-text-disable'          
          valid = false      

      date = moment(currentDate).date(i).format('YYYY-MM-DD')
      if @selected
        if moment(date).isSame(@selected.get('date'))
          cssClassContainer = 'calendar-data-item calendar-data-item-selected'
          cssClassText = 'calendar-data-item-text calendar-data-item-text-selected'

      dates.push(observable.fromObject({
        valid: valid
        text: i 
        today: today == i 
        cssClassContainer: cssClassContainer
        cssClassText: cssClassText
        cssClassContainerCopy: cssClassContainer
        cssClassTextCopy: cssClassText
        date: date
      }))
    
    @days = dates
    @onLabel()
    return dates

  onSelect: (item) ->
    if item && item.get('valid')
      
      @onUnselect()
      
      @selected = item

      @selected.set('cssClassContainer', 'calendar-data-item calendar-data-item-selected')
      @selected.set('cssClassText', 'calendar-data-item-text calendar-data-item-text-selected')


  onUnselect: () ->
    if @selected      
      @selected.set('cssClassContainer', @selected.cssClassContainerCopy)
      @selected.set('cssClassText',  @selected.cssClassTextCopy)


exports.CalendarBuilder = CalendarBuilder
