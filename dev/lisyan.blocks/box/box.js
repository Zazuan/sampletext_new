export let box = {
	pictureActive: function() {
		$(".box").each(function() {
			if ($(this).find(".box__item_radio").prop('checked')) {
			    $(this).find(".box__picture").addClass("box__picture_active");
			} else {
				$(this).find(".box__picture").removeClass("box__picture_active");
			}
		});
	},
	handlers: function() {
		$('.box .radio__input').change(function() {
			box.pictureActive();
		});
	},
	init: function () {
		box.handlers();
		box.pictureActive();
	}
};