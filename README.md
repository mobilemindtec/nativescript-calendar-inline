# nativescript-calendar-inline

this plugin depends on `nativescript-grid-view` and `moment-mini`

#### Properties

<<<<<<< HEAD
* rowHeight - row height
* rowWidth - row width
* weekdayNames - weekday names
* monthNames - month names
* startDate - start date
* minDate - min date
* maxDate - max date
* disableWeekend - if weekend should be disable
* weekendsToDisable - list of wek days to disable (0..6)
* daysToDisable - list of dates do disable
* iconPrev - arrow icon prev
* iconNext - arrow icon next
* itemTap - item tap event
=======
Add `moment-mini` dependency.

#### Icons 
>>>>>>> fd4b644c5938389d10ea201e5f138288d201ad70


## Styles

You can override all style classes

```
@import '~nativescript-calendar-inline/calendar.css';
```

## Add calendar

```
<Page 
    xmlns="http://schemas.nativescript.org/tns.xsd" 
    navigatingTo="onNavigatingTo" 
    class="page"
    xmlns:cal="nativescript-calendar-inline">

    <GridLayout id="main" style='padding-top: 30'>
        <cal:Calendar id="calendar"
            itemTap="itemTap"
        />
    </GridLayout>

</Page>
    
    
```

## Selected date event

```
exports.itemTap = (ev) => {
  console.log("date selected " + ev.date)
}

```




![alt text](https://github.com/mobilemindtec/nativescript-calendar-inline/blob/master/img-1.png)


![alt text](https://github.com/mobilemindtec/nativescript-calendar-inline/blob/master/img-2.png)
