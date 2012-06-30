(function($, _, Backbone) {
  "use strict";

  //  return the first item of a list only
  // usage: {{#first items}}{{name}}{{/first}}
  Handlebars.registerHelper('first', function(context, block) {
    return block(context[0]);
  });

  Handlebars.registerHelper("debug", function(optionalValue) {
    console.log("Current Context");
    console.log("====================");
    console.log(this);

    if (optionalValue) {
      console.log("Value");
      console.log("====================");
      console.log(optionalValue);
    }
  });

  //  format an ISO date using Moment.js
  //  http://momentjs.com/
  //  moment syntax example: moment(Date("2011-07-18T15:50:52")).format("MMMM YYYY")
  //  usage: {{dateFormat creation_date format="MMMM YYYY"}}
  Handlebars.registerHelper('dateFormat', function(context, block) {
    if (window.moment) {
      var f = block.hash.format || "YYYY-MM-DD h:mm a";
      return moment.utc(context, "YYYY-MM-DD hh:mm:ss z").local().format(f);
    } else {
      return context;   //  moment plugin not available. return data as is.
    }
  });

  $.fn.editable = function(target, callback) {
    var label = $(this);
    var form = target;
    var input = form.find('> input');
    var currentValue = input.val();
    var that = this;

    return this.each(function() {

      var startEditing = function() {
        label.toggle();
        form.css("display", "inline");
        input.focus();
      };

      var stopEditing = function() {
        label.toggle();
        form.toggle();
      };

      label.on('click', function(event) {
        event.preventDefault();
        startEditing();
      });

      input.on('blur', function(event) {
        event.preventDefault();
        stopEditing();
        label.html(input.val());
        if (callback) callback(input.val());
      });

      form.on('submit', function(event) {
        event.preventDefault();
        stopEditing();
        label.html(input.val());
        if (callback) callback(input.val());
      });

      input.on('keyup', function(event) {
        if (event.keyCode == 27) {
          event.preventDefault();
          stopEditing();
          input.val(currentValue);
        }
      });
    });
  };

  var colorPalette = [
    '#DEFFA1',
    // '#D26771',
    '#6CCC70',
    '#FF8900',
    '#A141C5',
    '#4A556C',
    '#239928',
  ];

  $.ColorFactory = {
    currentColorIndex: 0,
    get: function() {
      if (this.currentColorIndex >= colorPalette.length-1) {
        this.currentColorIndex = 0;
      }
      var color = colorPalette[this.currentColorIndex];
      this.currentColorIndex++;
      return color;
    }
  };

  $.TimeSelector = {
    getFrom: function(time, rangeString) {
      var range = this.getRange(rangeString);
      return Math.round((time - range) / 1000);
    },

    getPreviousFrom: function(time, rangeString) {
      var range = this.getRange(rangeString) * 2;
      return Math.round((time - range) / 1000);
    },

    getCurrent: function() {
      return Math.round((new Date()).getTime() / 1000);
    },

    getRange: function(rangeString) {
      var range = null;
      switch(rangeString) {
        case "30-minutes":
          range = 60*30;
          break;
        case "60-minutes":
          range = 60*60;
          break;
        case "3-hours":
          range = 60*60*3;
          break;
        case "12-hours":
          range = 60*60*12;
          break;
        case "24-hours":
          range = 60*60*24;
          break;
        case "3-days":
          range = 60*60*24*3;
          break;
        case "7-days":
          range = 60*60*24*7;
          break;
        case "4-weeks":
          range = 60*60*24*7*4;
          break;
        default:
          throw "Unknown rangeString: " + rangeString;
      }
      return range * 1000;
    }
  };

})($, _, Backbone);