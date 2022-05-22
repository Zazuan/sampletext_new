import $ from 'jquery';
window.$ = $;
// window.jQuery = jQuery;

import 'jquery-ui/ui/widgets/sortable';

import * as sb from "./sidebar/sidebar";
import * as bx from "./box/box";

$(function() {

	// var sort = $(".m-items__row").sortable({
	// 	group: 'm-items',
	// 	handle: 'dragdrop',

		
	// })

	$("#draggable").sortable({
		handle: ".dragdrop"
	});

	var funcs = {
		Load: function () {
			let object = info.getPage();
			sb.sidebar.pageActive(object);
			switch(object) {
				case "themes":
					bx.box.init();
					break;
				
			}
		},

	}

	var info = {
		getPage: function(){
			return $("html").attr("data-page");
		},

	};

	function App() {

		funcs.Load();
	}

	App();
});




