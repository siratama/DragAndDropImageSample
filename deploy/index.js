(function () { "use strict";
var EReg = function(r,opt) {
	opt = opt.split("u").join("");
	this.r = new RegExp(r,opt);
};
EReg.__name__ = true;
EReg.prototype = {
	match: function(s) {
		if(this.r.global) this.r.lastIndex = 0;
		this.r.m = this.r.exec(s);
		this.r.s = s;
		return this.r.m != null;
	}
};
var haxe = {};
haxe.Timer = function(time_ms) {
	var me = this;
	this.id = setInterval(function() {
		me.run();
	},time_ms);
};
haxe.Timer.__name__ = true;
haxe.Timer.prototype = {
	run: function() {
	}
};
var js = {};
js.Boot = function() { };
js.Boot.__name__ = true;
js.Boot.__string_rec = function(o,s) {
	if(o == null) return "null";
	if(s.length >= 5) return "<...>";
	var t = typeof(o);
	if(t == "function" && (o.__name__ || o.__ename__)) t = "object";
	switch(t) {
	case "object":
		if(o instanceof Array) {
			if(o.__enum__) {
				if(o.length == 2) return o[0];
				var str = o[0] + "(";
				s += "\t";
				var _g1 = 2;
				var _g = o.length;
				while(_g1 < _g) {
					var i = _g1++;
					if(i != 2) str += "," + js.Boot.__string_rec(o[i],s); else str += js.Boot.__string_rec(o[i],s);
				}
				return str + ")";
			}
			var l = o.length;
			var i1;
			var str1 = "[";
			s += "\t";
			var _g2 = 0;
			while(_g2 < l) {
				var i2 = _g2++;
				str1 += (i2 > 0?",":"") + js.Boot.__string_rec(o[i2],s);
			}
			str1 += "]";
			return str1;
		}
		var tostr;
		try {
			tostr = o.toString;
		} catch( e ) {
			return "???";
		}
		if(tostr != null && tostr != Object.toString) {
			var s2 = o.toString();
			if(s2 != "[object Object]") return s2;
		}
		var k = null;
		var str2 = "{\n";
		s += "\t";
		var hasp = o.hasOwnProperty != null;
		for( var k in o ) {
		if(hasp && !o.hasOwnProperty(k)) {
			continue;
		}
		if(k == "prototype" || k == "__class__" || k == "__super__" || k == "__interfaces__" || k == "__properties__") {
			continue;
		}
		if(str2.length != 2) str2 += ", \n";
		str2 += s + k + " : " + js.Boot.__string_rec(o[k],s);
		}
		s = s.substring(1);
		str2 += "\n" + s + "}";
		return str2;
	case "function":
		return "<function>";
	case "string":
		return o;
	default:
		return String(o);
	}
};
js.Lib = function() { };
js.Lib.__name__ = true;
js.Lib.alert = function(v) {
	alert(js.Boot.__string_rec(v,""));
};
var sample = {};
sample.DragAndDropSample = function() {
	var _g = this;
	new $(function() {
		_g.initialize();
	});
};
sample.DragAndDropSample.__name__ = true;
sample.DragAndDropSample.main = function() {
	new sample.DragAndDropSample();
};
sample.DragAndDropSample.prototype = {
	initialize: function() {
		this.dropZone = new sample.DropZone();
		this.imageFileReader = new sample.ImageFileReader();
		this.imageViewer = new sample.ImageViewer();
		this.mainFunction = $bind(this,this.observeToDropZone);
		this.timer = new haxe.Timer(100);
		this.timer.run = $bind(this,this.run);
	}
	,run: function() {
		this.mainFunction();
	}
	,observeToDropZone: function() {
		var event = this.dropZone.getEvent();
		switch(event[1]) {
		case 0:
			return;
		case 1:
			var message = event[2];
			js.Lib.alert(message);
			break;
		case 2:
			var file = event[2];
			this.initializeToReadImageFile(file);
			break;
		}
	}
	,initializeToReadImageFile: function(file) {
		this.imageFileReader.start(file);
		this.mainFunction = $bind(this,this.observeToReadImageFile);
	}
	,observeToReadImageFile: function() {
		var event = this.imageFileReader.getEvent();
		switch(event[1]) {
		case 0:
			return;
		case 1:
			var data = event[2];
			this.imageViewer.show(data);
			this.mainFunction = $bind(this,this.observeToDropZone);
			break;
		}
	}
};
sample.DropZoneEvent = { __ename__ : true, __constructs__ : ["NONE","DROP_FILE_ERROR","DROPPED"] };
sample.DropZoneEvent.NONE = ["NONE",0];
sample.DropZoneEvent.NONE.__enum__ = sample.DropZoneEvent;
sample.DropZoneEvent.DROP_FILE_ERROR = function(message) { var $x = ["DROP_FILE_ERROR",1,message]; $x.__enum__ = sample.DropZoneEvent; return $x; };
sample.DropZoneEvent.DROPPED = function(file) { var $x = ["DROPPED",2,file]; $x.__enum__ = sample.DropZoneEvent; return $x; };
sample.DropZone = function() {
	var dropZoneElement = new $("#drop_zone");
	dropZoneElement.on("drop",null,$bind(this,this.drop));
	dropZoneElement.on("dragover",null,$bind(this,this.dragover));
	this.event = sample.DropZoneEvent.NONE;
};
sample.DropZone.__name__ = true;
sample.DropZone.prototype = {
	getEvent: function() {
		var n = this.event;
		this.event = sample.DropZoneEvent.NONE;
		return n;
	}
	,dragover: function(event) {
		this.preventEvent(event);
		event.originalEvent.dataTransfer.dropEffect = "copy";
	}
	,drop: function(event) {
		this.preventEvent(event);
		var files = event.originalEvent.dataTransfer.files;
		var file = files[0];
		if(!new EReg("image.*","").match(file.type)) this.event = sample.DropZoneEvent.DROP_FILE_ERROR("Set image file"); else this.event = sample.DropZoneEvent.DROPPED(file);
	}
	,preventEvent: function(event) {
		event.preventDefault();
		event.stopPropagation();
	}
};
sample.ImageFileReaderEvent = { __ename__ : true, __constructs__ : ["NONE","READ"] };
sample.ImageFileReaderEvent.NONE = ["NONE",0];
sample.ImageFileReaderEvent.NONE.__enum__ = sample.ImageFileReaderEvent;
sample.ImageFileReaderEvent.READ = function(data) { var $x = ["READ",1,data]; $x.__enum__ = sample.ImageFileReaderEvent; return $x; };
sample.ImageFileReader = function() {
	this.fileReader = new FileReader();
	this.fileReader.addEventListener("load",$bind(this,this.onLoadFile));
	this.event = sample.ImageFileReaderEvent.NONE;
};
sample.ImageFileReader.__name__ = true;
sample.ImageFileReader.prototype = {
	getEvent: function() {
		var n = this.event;
		this.event = sample.ImageFileReaderEvent.NONE;
		return n;
	}
	,onLoadFile: function(event) {
		this.event = sample.ImageFileReaderEvent.READ(event.target.result);
	}
	,start: function(file) {
		this.fileReader.readAsDataURL(file);
	}
};
sample.ImageViewer = function() {
	this.element = new $("#image_viewer");
	this.imageElement = new $("<img>").appendTo(this.element);
};
sample.ImageViewer.__name__ = true;
sample.ImageViewer.prototype = {
	show: function(imageSourceUri) {
		this.imageElement.attr("src",imageSourceUri);
	}
};
var $_, $fid = 0;
function $bind(o,m) { if( m == null ) return null; if( m.__id__ == null ) m.__id__ = $fid++; var f; if( o.hx__closures__ == null ) o.hx__closures__ = {}; else f = o.hx__closures__[m.__id__]; if( f == null ) { f = function(){ return f.method.apply(f.scope, arguments); }; f.scope = o; f.method = m; o.hx__closures__[m.__id__] = f; } return f; }
String.__name__ = true;
Array.__name__ = true;
sample.DragAndDropSample.main();
})();
