/**
 *  @description LaColoc Functions
 *  @author Benoit Zohar
 */

var fn = {
	
	debug : function(a,b) {
		if (console && console.log) {
			if (b !== null && typeof b != 'undefined') console.log('[DEBUG]',a,b);
			else console.log('[DEBUG]',a);
		}
	},
    
    getDate: function (cdate, output_format) {
        if (!cdate) return false;
        if (!output_format) output_format = 'timestamp';

        var date_object = this.getDateObject(cdate);
        if (output_format == 'object') return date_object;
        else if (output_format == 'string' || output_format == 'string_no_hours' || output_format == 'string_with_minutes')
        {
            if (date_object.getTime() == 0) return '';
            var date_string = lc.getPreference('dateformat','dd/mm/yyyy');
            var date_day = date_object.getDate();
            var date_month = date_object.getMonth() + 1;
            date_string = date_string.replace('dd', date_day < 10 ? '0' + date_day.toString() : date_day);
            date_string = date_string.replace('mm', date_month < 10 ? '0' + date_month.toString() : date_month);
            date_string = date_string.replace('yyyy', date_object.getFullYear());
            if (output_format == 'string_no_hours') return date_string;
            var minutes = '0';
            if (output_format == 'string_with_minutes') minutes = date_object.getMinutes();
            if (parseInt(minutes, 10) < 10) minutes = '0'+minutes;
            var hours = date_object.getHours();
            if (parseInt(hours, 10) < 10) hours = '0'+hours;
            date_string += ' ' + hours + ':' + minutes;
            return date_string;
        }
        else if (output_format == 'ISO8601')
        {
            var date_iso = "";
            var date_day = date_object.getDate();
            var date_month = date_object.getMonth() + 1;
            date_iso += date_object.getFullYear();
            date_iso += "-";
            date_iso += date_month < 10 ? '0' + date_month.toString() : date_month;
            date_iso += "-";
            date_iso += date_day < 10 ? '0' + date_day.toString() : date_day;
            date_iso += "T";
            date_iso += date_object.getHours() < 10 ? '0' + date_object.getHours() : date_object.getHours();
            date_iso += ":";
            date_iso += date_object.getMinutes() < 10 ? '0' + date_object.getMinutes().toString() : date_object.getMinutes();
            date_iso += ":";
            date_iso += date_object.getSeconds() < 10 ? '0' + date_object.getSeconds().toString() : date_object.getSeconds();

            return date_iso
        }

        return cdate;
    },

    /**
     *	getDateObject: to get the given date as an object
     *	@param: date: date: date as string or timestamp
     *	@return: a date object
     **/
    getDateObject: function (date) {

        // Construction de l'objet date
        var d = new Date();
        // If date is already an object
        if (typeof(date) === 'object') return date;
        // if date is a string
        else if (date && isNaN(date) && date != '')
        {
            var rx;
            var dateformat = lc.getPreference('dateformat','dd/mm/yyyy');
            var delimiter = dateformat.match(/\w(.)\w(.)\w/);
            delimiter = delimiter[1];

            if (delimiter == '/') rx = date.match(/(\d+)\/(\d+)\/(\d+) ?(\d*):?0?0?/);
            else if (delimiter == '.') rx = date.match(/(\d+)\.(\d+)\.(\d+) ?(\d*):?0?0?/);
            else if (delimiter == '-') rx = date.match(/(\d+)\-(\d+)\-(\d+) ?(\d*):?0?0?/);

            if (rx == null) return null;

            if (dateformat == 'd' + delimiter + 'm' + delimiter + 'Y')
            {
                d = new Date(rx[3], rx[2] - 1, rx[1], rx[4] || 0);
            }
            else if (dateformat == 'm' + delimiter + 'd' + delimiter + 'Y')
            {
                d = new Date(rx[3], rx[1] - 1, rx[2], rx[4] || 0);
            }
            else if (dateformat == 'Y' + delimiter + 'm' + delimiter + 'd')
            {
                d = new Date(rx[1], rx[2] - 1, rx[3], rx[4] || 0);
            }
        }
        // Else if date is timestamp
        else if (!isNaN(date))
        {
            d.setTime(date * 1000);
        }

        return d;
    }


}
