var observableModule = require("data/observable");

function onNavigatingTo(args) {
    var page = args.object;

    page.bindingContext = new observableModule.fromObject({
      'startDate': new Date(2017, 0, 1),
      'minDate': new Date(2016, 11, 1),
      'maxDate': new Date(2017, 1, 30),
      'weekdayNames': [
        'D', 
        'S', 
        'T', 
        'Q', 
        'Q', 
        'S',
        'S'        
      ],
      'monthNames': [
        'Jan',
        'Fev',
        'Mar',
        'Abr',
        'Mai',
        'Jun',
        'Jul',
        'Ago',
        'Set',
        'Out',
        'Nov',
        'Dez'
      ],
      'daysToDisable': [
        new Date(2017, 0, 18)
      ]
    })

    


}

exports.itemTap = (ev) => {
  console.log("interface item tap " + ev.date)
}

exports.onNavigatingTo = onNavigatingTo;  