# nativescript-calendar-inline

### how to use

#### Code 
Import the code `build` content to `app/xml-declaration/Calendar` in yout project. 

#### Icons 

And `arrow-icons` to `app/res` in yout project. Or else change icon location in file `Calendar.xml`

#### Style

Change `common.css` as you prefere.

#### Use caledar XML

```
<Page loaded="onLoaded"
  xmlns:Calendar="xml-declaration/Calendar">


  <GridLayout rows="*">
    
    <Calendar:Calendar id="calendar" />

  </GridLayout>

</Page>
```

#### Initialize calendar in JS code

* `weekDaysToDisable`: days of week to disable, 0..6 (sun, sat) (`int`)
* `daysToDisable`: List of dates to disable (`Date`)
* `minDate`: Min date to show in calendar
* `maxDate`: Max date to show in calendar
* `disableEndWeekDays`: Disable all week days to all months showed
* `months`: Names of months, default pt-br
* `weekDays`: Names of weekdays, default pt-br

```
    calendar = page.getViewById("calendar")

    weekDaysToDisable = []
    daysToDisable = []

    limiteMin = that.getIntervaloMinimoDiasEntrega()
    limiteMax = that.getIntervaloMaximoDiasEntrega()

    minDate = moment().date() # today
    maxDate = moment().add('days', 90) # today + 90 days

    calendar.bindingContext.onConfigure({
      weekDaysToDisable: []
      daysToDisable: []
      minDate: minDate
      maxDate: maxDate
      disableEndWeekDays: true
      months: []
      weekDays: []
    })
    
    # bind date select event
    calendar.bindingContext.listener = (data) ->
      # do something
    
```


![alt text](https://github.com/mobilemindtec/nativescript-calendar-inline/blob/master/screenshot.png)
