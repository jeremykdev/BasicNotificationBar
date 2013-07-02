/* ==========================================

jQuery widget for notification bar

Add a basic notification bar at the top of a page.  By default the bar will disappear without any user input.

Dependencies:
jQuery 1.8.2 or higher (developed using 1.8.2). 
jQueryUI 1.9.2 or higher (developed using 1.9.1) , depends on widget factory and CSS themes
CSS file: basic-notification-bar.css

Note that widget has not been tested using jQuery 2.x.

version: 1.0.0

The MIT License (MIT)

Copyright 2013 Jeremy Knue

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

========================================== */

(function($) {


	$.widget("custom.basicnotificationbar", {

		//default options
		options: {
			text: "Alert"
			, showDuration: 4000 //hide after showing for this duration
			, autoShow: true
			, opacity: .7
			, backgroundColor: "#ff0000"  //use null to accept UI default
			, hideOptions: { effect: "slideUp", duration: 200 }  //options for animation on hide
			, showOptions: { effect: "slideDown", duration: 500 } //options for animation on show
			, links: [] //array objects, each object contains {  text:  "Example", and click: handlerFunctionName }
			
			
		} //end options

		, _create: function () {
			this.element.hide();
			this.element.addClass("ui-helper-reset");
			this.element.addClass("ui-widget");
			this.element.addClass("custom-basic-notification-bar");
			this.element.addClass("ui-front");
			this.element.css("opacity", this.options.opacity);


	
			if (this.options.backgroundColor != null) {
				this.element.css("background-color", this.options.backgroundColor);
			}
			
			this.instanceTimer = null;
			
			this.refresh();

		} //end create()


		

		, _destroy: function () {

			this.element.removeClass("ui-helper-reset");
			this.element.removeClass("ui-widget");
			this.element.removeClass("ui-front");
			this.element.removeClass("custom-basic-notification-bar");
			this.element.css("opacity", 1);

			//remove children with notification bar css classes
			$(this.element).children(".custom-basic-notification-bar-link").remove();
			$(this.element).children(".custom-basic-notification-bar-link-container").remove();



		} //end _destroy()


		, _addLink: function (linkObject) {

			//ignore any link object that doesn't have both 'click' and 'text' properties
			if (linkObject != null && linkObject.click != null && linkObject.text != null) {

			
				var content = '<a class="custom-basic-notification-bar-link" href="#">' + linkObject.text + '</a>';



				//add click handlers for both object's click variable and one to close the notification
				$(content).appendTo(this.element).click(linkObject.click).click($.proxy(function (e) {
					e.preventDefault();
					this.close();  //using proxy 'this' now refers to widget and we can call the close method
				}, this));
				
			}


		}

		, _removeAllLinks: function() {

			$(this.element).children("a.custom-basic-notification-bar-link").remove();

		} //end _removeAllLinks()


		, refresh: function() {
			this.element.text(this.options.text);

			

			//create a span with class 'custom-basic-notification-bar-link-container'
			if ($(this.element).children("span.custom-basic-notification-bar-link-container").length < 1) {
				$(this.element).append('<span class="custom-basic-notification-bar-link-container"></span>');
			}

			//setup close icon
			if ($(this.element).children("a.custom-basic-notification-bar-icon-wrapper").length < 1) {
				//add icon
				$(this.element).append('<a href="#" class="ui-icon ui-icon-closethick custom-basic-notification-bar-icon-wrapper"></a>');

				$(this.element).children("a.custom-basic-notification-bar-icon-wrapper").click($.proxy(function (e) {
					e.preventDefault();
					this.close();  //using proxy 'this' now refers to widget and we can call the close method
				}, this));
			}

			if (this.options.hideOptions != null) {
				this.hide = this.options.hideOptions;
			}

			if (this.options.showOptions != null) {
				this.show = this.options.showOptions;
			}

			if (this.options.autoShow == true) {
				this._show(this.element, this.show);
			}

			//delete existing links with class custom-basic-notification-bar-link
			this._removeAllLinks();

			//add links
			var linkSet = this.options.links || [];
			if (linkSet.length > 0) {

				for (var i = 0; i < linkSet.length; i++) {
					this._addLink(linkSet[i]);
				}

			}

			//if (this.options.applyButtonStylingToLinks) {

			//	$(this.element).children("a.custom-basic-notification-bar-link").button();

			//}


			//setup interval timer for to hide after showDuration expires
			// use jQuery proxy method to scope interval to widget
			// thanks to Doug Neiner, MSDN magazine: http://msdn.microsoft.com/en-us/magazine/ff706600.aspx
			this.instanceTimer = window.setInterval($.proxy(this.close, this), this.options.showDuration);

		} //end refresh()

		, close: function() {

			if (this.instanceTimer != null) {
				window.clearInterval(this.instanceTimer);
			}

			this._hide(this.element, this.hide);

		} //end close()
	});




}(jQuery));