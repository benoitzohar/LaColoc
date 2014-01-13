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

        return fn.parseInt(date_object.getTime()/1000);
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
        else if (date && isNaN(date) && date != '') {
            var rx;
            var dateformat = lc.getPreference('dateformat','dd/mm/yyyy');
            var delimiter = dateformat.match(/\w(.)\w(.)\w/);
            delimiter = delimiter[1];

            if (delimiter == '/') rx = date.match(/(\d+)\/(\d+)\/(\d+) ?(\d*):?0?0?/);
            else if (delimiter == '.') rx = date.match(/(\d+)\.(\d+)\.(\d+) ?(\d*):?0?0?/);
            else if (delimiter == '-') rx = date.match(/(\d+)\-(\d+)\-(\d+) ?(\d*):?0?0?/);

            if (rx == null) return null;

            if (dateformat == 'dd' + delimiter + 'mm' + delimiter + 'yyyy')
            {
                d = new Date(rx[3], rx[2] - 1, rx[1], rx[4] || 0);
            }
            else if (dateformat == 'mm' + delimiter + 'dd' + delimiter + 'yyyy')
            {
                d = new Date(rx[3], rx[1] - 1, rx[2], rx[4] || 0);
            }
            else if (dateformat == 'yyyy' + delimiter + 'mm' + delimiter + 'dd')
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
    },
    
    exists : function(a) {
	    return (typeof(a)!='undefined' && a !== null);
    },
    
    parseInt : function(val,base) {
	    if (!base) base = 10;
	    return parseInt(val,base);
    },

    isValidEmail : function(str) { console.log('str,',str,' test=', /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(str));
	    return /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(str);
    },
    
    size : function(o) {
	    if (!o) return 0;
	    var size = 0, key;
	    if (typeof o == 'array') return o.length;
	    for (key in o) {
	        if (o.hasOwnProperty(key)) size++;
	    }
    	return size;
    },
    
    array_unique : function(arr) {
		var o = {}, i, l = arr.length, r = [];
		for(i=0; i<l;i+=1) o[arr[i]] = arr[i];
		for(i in o) r.push(o[i]);
		return r;
	},
	
	merge : function(base_object,merging_object) {
		var res = {};
		if (typeof base_object !== 'object' || typeof merging_object !== 'object') return {};
		for(k in base_object) res[k] = base_object[k];
		for(k in merging_object) res[k] = merging_object[k];
		return res;
	},
	
	/**
	 * getkeys() : return the keys of an object
	 * param: obj	Object	
	 * return	Array of String
	 */
	getKeys : function(obj){
		var keys = [];
		if (obj) {
			for(var key in obj) keys.push(key);
		}
		return keys;
	},

	/**
	 * inArray()
	 * param:	ar	Array	
	 * param:	value	String/Object : value to find
	 * return Boolean	True if the value is in the array
	 */
	inArray : function(ar,value) {
		if (!ar || !ar.length) return false; 
		for(var i=0;i<ar.length;i++) {
			if (ar[i] == value) return true;
		}
		return false;
	}

}
