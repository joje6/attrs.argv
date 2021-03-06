var escapeQuot = function(val) {
	if( val && (val.substring(0,1) == '\'' || val.substring(0,1) == '"') && (val.substring(val.length - 1) == '\'' || val.substring(val.length - 1) == '"') ) {
		val = val.substring(1, val.length - 1);
	}
	return val;
};

var sum = function(target, key, value) {
	if( value !== false && !value ) value = '';
	
	if( target[key] ) {
		if( !(target[key] instanceof Array) ) {
			target[key] = [target[key]];
		}

		target[key].push(value);
	} else {
		target[key] = value;
	}
};

var parse = function( r, argv, mapping ) {
	argv = argv || {};
	for(var index=2, cnt=0; index < argv.length; index++,cnt++) {
		var val = argv[index];
		if( mapping ) {
			var key = mapping[cnt];
			r[key] = val;
			continue;
		}
		
		var pos;
		if( val && val.substring(0,1) == '-' ) {
			var key = val.substring(1);
			var value;

			if( key.substring(0,1) == '-' ) {
				key = key.substring(1);
			}
			
			if( (pos = key.indexOf('=')) > 0 ) {
				value = key.substring(pos + 1);
				key = key.substring(0,pos);

				sum(r, key, escapeQuot(value));
			} else {
				value = argv[index + 1];
				
				if( !value || value.substring(0,1) == '-' || value.indexOf('=') > 0 ) {
					sum(r, key, true);
				} else {
					sum(r, key, escapeQuot(value));
					index = index + 1;
				}
			}
		} else if( (pos = val.indexOf('=')) > 0 ) {
			var value = val.substring(pos + 1);
			var key = val.substring(0,pos);

			sum(r, key, escapeQuot(value));
		} else {
			sum(r, val, true);
		}
	};

	return r;
}

function config(mappings) {
	return parse({}, process.argv, mappings);
}

var argv = function() {};
argv.prototype = {
	mapping: function(mappings) {
		return parse({}, process.argv, mappings);
	}
};

var result = parse(new argv(), process.argv);

module.exports = result;
