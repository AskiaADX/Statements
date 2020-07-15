(function () {

    // Polyfill: Add a getElementsByClassName function IE < 9
    function polyfillGetElementsByClassName() {
        if (!document.getElementsByClassName) {
            document.getElementsByClassName = function(search) {
                var d = document, elements, pattern, i, results = [];
                if (d.querySelectorAll) { // IE8
                    return d.querySelectorAll("." + search);
                }
                if (d.evaluate) { // IE6, IE7
                    pattern = ".//*[contains(concat(' ', @class, ' '), ' " + search + " ')]";
                    elements = d.evaluate(pattern, d, null, 0, null);
                    while ((i = elements.iterateNext())) {
                        results.push(i);
                    }
                } else {
                    elements = d.getElementsByTagName("*");
                    pattern = new RegExp("(^|\\s)" + search + "(\\s|$)");
                    for (var j = 0, l = elements.length; j < l; j++) {
                        if ( pattern.test(elements[j].className) ) {
                            results.push(elements[j]);
                        }
                    }
                }
                return results;
            };
        }
	}

    function hasClass(el, className) {
		return el.classList ? el.classList.contains(className) : new RegExp('\\b'+ className+'\\b').test(el.className);
	}

	function addClass(el, className) {
		if (el.classList) el.classList.add(className);
		else if (!hasClass(el, className)) el.className += ' ' + className;
	}

	function removeClass(el, className) {
		if (el.classList) el.classList.remove(className);
		else el.className = el.className.replace(new RegExp('\\b'+ className+'\\b', 'g'), '');
	}

    function tbBorder(el) {
			var margin = el.offsetHeight - el.clientHeight;
			return margin;
		}

		function lrBorder(el) {
			var margin = el.offsetWidth - el.clientWidth;
			return margin;
		}

		function outerHeight(el) {
		  var height = el.offsetHeight;
		  var style = el.currentStyle || getComputedStyle(el);

		  height += parseInt(style.marginTop) + parseInt(style.marginBottom);
		  return height;
		}

		function outerWidth(el) {
		  var width = el.offsetWidth;
		  var style = el.currentStyle || getComputedStyle(el);

		  width += parseInt(style.marginLeft) + parseInt(style.marginRight);
		  return width;
		}

    // Convert RGB to hex
	function trim(arg) {
		return arg.replace(/^\s+|\s+$/g, "");
	}
	function isNumeric(arg) {
		return !isNaN(parseFloat(arg)) && isFinite(arg);
	}
	function isRgb(arg) {
		arg = trim(arg);
		return isNumeric(arg) && arg >= 0 && arg <= 255;
	}
	function rgbToHex(arg) {
		arg = parseInt(arg, 10).toString(16);
		return arg.length === 1 ? '0' + arg : arg;
	}
	function processRgb(arg) {
		arg = arg.split(',');

		if ( (arg.length === 3 || arg.length === 4) && isRgb(arg[0]) && isRgb(arg[1]) && isRgb(arg[2]) ) {
			if (arg.length === 4 && !isNumeric(arg[3])) { return null; }
			return '#' + rgbToHex(arg[0]).toUpperCase() + rgbToHex(arg[1]).toUpperCase() + rgbToHex(arg[2]).toUpperCase();
		} else {
			return null;
		}
	}

	function StatementsOther(options) {
        this.instanceId = options.instanceId || 1;
        var container = document.getElementById("adc_" + this.instanceId),
            images = [].slice.call(container.getElementsByTagName("img")),
        	total_images = container.getElementsByTagName("img").length;

        function loadImages( images, callback ) {
            var count = 0;

            function check( n ) {
                if( n == total_images ) {
                    callback();
                }
            }

            for( i = 0; i < total_images; ++i ) {
                var src = images[i].src;
                var img = document.createElement( "img" );
                img.src = src;

                img.addEventListener( "load", function() {
                    if( this.complete ) {
                        count++;
                        check( count );
                    }
                });
            }

        }

        window.addEventListener( "load", function() {
            if ( total_images > 0 ) {
                loadImages( images, function() {
                    init(options);
                });
            } else {
                init(options);
            }
        });

    }

    function init(options) {

        this.options = options;
		(options.responseWidth = options.responseWidth || "auto");
		(options.responseHeight = options.responseHeight || "auto");
		(options.imageAlign = options.imageAlign || '');
		(options.isSingle = Boolean(options.isSingle));
		(options.isMultiple = Boolean(options.isMultiple));
		(options.autoForward = Boolean(options.autoForward));
		(options.useRange = Boolean(options.useRange));
        (options.currentQuestion = options.currentQuestion || '');
        (options.mergeColumnWidth = parseInt(options.mergeColumnWidth, 10) || 480);
        (options.responseHeight = options.responseHeight || '');
        (options.deselectionEnabled = Boolean(options.deselectionEnabled));

        this.instanceId = options.instanceId || 1;
        polyfillGetElementsByClassName();
		var container = document.getElementById("adc_" + this.instanceId),
            columns =  container.getElementsByClassName('column'),
            responses =  [].slice.call(container.getElementsByClassName('response')),
            responseItems =  [].slice.call(container.getElementsByClassName('responseItem')),
            otherTextItems =  [].slice.call(container.getElementsByClassName('otherText')),
            images = [].slice.call(container.getElementsByTagName("img")),
			inputs = [].slice.call(document.getElementsByTagName("input")),
            submitBtns = [],
            nextBtn,
            items = options.items,
        	isMultiple = options.isMultiple,
          deselectionEnabled = options.deselectionEnabled,
            animateResponses = Boolean(options.animateResponses);

        for(var i = 0; i < inputs.length; i++) {
            if(inputs[i].type.toLowerCase() === 'submit') {
               submitBtns.push(inputs[i]);
            }
        }
        nextBtn = document.getElementsByName('Next')[0];

		var otherQIDarray = String(options.otherQID).split(","),
			otherRIDarray = String(options.otherRID).split(",");

		container.style.maxWidth = options.maxWidth;
        container.style.width = options.controlWidth;
        container.parentNode.style.width = '100%';
        container.parentNode.style.overflow = 'hidden';

		if ( options.controlAlign === "center" ) {
            container.parentNode.style.textAlign = 'center';
            container.style.margin = '0px auto';
		} else if ( options.controlAlign === "right" ) {
            container.style.margin = '0 0 0 auto';
		}

        var screenWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
        if ( options.columns > 1 && screenWidth > options.mergeColumnWidth )  {

			// Try to make all the repsonses the same height
           	for ( i=0; i < responseItems.length; i++ ) {
                responseItems[i].style.height = "";
            }

            for ( i=0; i < columns.length; i++ ) {
                columns[i].style.display = "block";
                columns[i].style.width = '100%';
            }

            for ( i=0; i < responseItems.length; i++ ) {
                responseItems[i].style.display = "inline-block";
                responseItems[i].style.width = (100/options.columns) + '%';
            }

            var style = responseItems[0].currentStyle || window.getComputedStyle(responseItems[0]),
            	widthDiff = (responseItems[0].offsetWidth + parseFloat(style.marginLeft) + parseFloat(style.marginRight)) - responseItems[0].clientWidth,
            	newWidth = ((columns[0].offsetWidth - (widthDiff * options.columns))/options.columns) - 10;
            for ( i = 0; i < responseItems.length; i++ ) {
                responseItems[i].style.width = newWidth+'px';
            }
            var maxResponseHeight = [];
            for ( i = 0; i < responseItems.length; i++) {
                if ( !responseItems[i].querySelector('.otherText') ) {
                	maxResponseHeight.push(responseItems[i].offsetHeight);
                }
            }

            var maxHeight = options.responseHeight;
            if (maxHeight === 'auto') {
            	maxHeight = Math.max.apply(null, maxResponseHeight);
            }
            for ( i = 0; i < responseItems.length; i++ ) {
                if ( responseItems[i].querySelector('.otherText') ) {
                    responseItems[i].style.height = "auto";
                    responseItems[i].style.minHeight = maxHeight + "px";
                } else {
                    responseItems[i].style.height = maxHeight+'px';
                }

            }

		}

      // Headers expand/collapsed
      var expandableHeaders = options.expandableHeaders
      var accordionInitialState = options.accordionInitialState
      if(expandableHeaders){
        var headerList = document.querySelectorAll('#adc_' + this.instanceId + ' .responseHeader');
        for (var i = 0; i < headerList.length; i++) {
          {
            if (accordionInitialState == 'collapsed') {
              var id = headerList[i].dataset.id;
              $("#headerGroup"+id).toggle();
              // $("i", headerList[i]).toggleClass("minus plus");
            }
          }
          headerList[i].onclick = function(){
            var id = this.dataset.id;
            if (animateResponses) {
              $("#headerGroup"+id).toggle('slow');
            } else {
              $("#headerGroup"+id).toggle();
            }
            $("i", this).toggleClass("plus minus");
          };
        }
      }

		// Other
        var otherElems = container.parentNode.querySelectorAll('.otherText');
        for ( i = 0; i < otherElems.length; i++ ) {
			otherElems[i].style.width = (responseItems[0].offsetWidth - 35) + 'px';
        	otherElems[i].style.display = "none";
        }

		var i;
		for (i = 0; i < otherQIDarray.length; ++i) {
            if ( otherQIDarray[i] ) {
                if ( document.getElementById(otherQIDarray[i]).value !== '' ) {
                    if ( otherQIDarray[i] != '' ) container.parentNode.querySelector('.responseItem[data-index="'+otherRIDarray[i]+'"] .otherText').value = document.getElementById(otherQIDarray[i]).value;
                }
                document.getElementById(String(otherQIDarray[i])).style.display = "none";
            } else {
                // error message
            }
		}

        // Check for missing images and resize
        for ( i=0; i<images.length; i++) {
            var size = {
                width: images[i].width,
                height: images[i].height
            };

            if (options.forceImageSize === "height" ) {
                if ( size.height > parseInt(options.maxImageHeight,10) ) {
                    var ratio = ( parseInt(options.maxImageHeight,10) / size.height);
                    size.height *= ratio;
                    size.width  *= ratio;
                }
            } else if (options.forceImageSize === "width" ) {
                if ( size.width > parseInt(options.maxImageWidth,10) ) {
                    var ratio = ( parseInt(options.maxImageWidth,10) / size.width);
                    size.width  *= ratio;
                    size.height *= ratio;
                }
            } else if (options.forceImageSize === "both" ) {
                if ( parseInt(options.maxImageHeight,10) > 0 && size.height > parseInt(options.maxImageHeight,10) ) {
                    var ratio = ( parseInt(options.maxImageHeight,10) / size.height);
                    size.height *= ratio;
                    size.width  *= ratio;
                }

                if ( parseInt(options.maxImageWidth,10) > 0 && size.width > parseInt(options.maxImageWidth,10) ) {
                    var ratio = ( parseInt(options.maxImageWidth,10) / size.width);
                    size.width  *= ratio;
                    size.height *= ratio;
                }

            }
            images[i].width = size.width;
            images[i].height = size.height;
        }

        // If image align is center
        if (options.imageAlign === "center") {
            for ( i=0; i<images.length; i++) {
                images[i].style.marginLeft = 'auto';
                images[i].style.marginRight = 'auto';
            }
            for ( i=0; i<responseItems.length; i++) {
                responseItems[i].style.textAlign = 'center';
            }
        }

        // add ns to last x items
        if ( options.numberNS > 0 ) {
            var nsItems = responseItems.slice(-options.numberNS);
            for ( i=0; i<nsItems.length; i++) {
                addClass(nsItems[i], 'ns');
                nsItems[i].style.filter = '';
            }
        }

        // Use range if on
        if ( options.useRange ) {
            var maxNumber = responseItems.length - options.numberNS,
                rangeArray = options.range.split(';');
            var rainbow1 = new Rainbow();
                rainbow1.setSpectrum(processRgb(rangeArray[0]), processRgb(rangeArray[2]));
                rainbow1.setNumberRange(0, maxNumber);
            var rainbow2 = new Rainbow();
                rainbow2.setSpectrum(processRgb(rangeArray[1]), processRgb(rangeArray[3]));
                rainbow2.setNumberRange(0, maxNumber);

            var nsItems = responseItems.slice(0, (options.numberNS > 0) ? 0-options.numberNS : responseItems.length);
            for ( i=0; i<nsItems.length; i++) {
                if ( options.rangeGradientDirection === 'ltr' ) {
                    nsItems[i].style.backgroundColor = '#'+rainbow1.colourAt(i);
                    addClass( nsItems[i], 'active' );
                    removeClass( nsItems[i], 'active' );
                } else {
                    nsItems[i].style.backgroundColor = '#'+rainbow2.colourAt(i);
                    addClass( nsItems[i], 'active' );
                    removeClass( nsItems[i], 'active' );
                }
            }
        }

        // Fix column width
		/*if ( parseInt(options.columns) > 1 && ( ($(this).find('.responseItem').eq(0).outerWidth(true) * parseInt(options.columns)) >= $(this).find('.column').eq(0).width() ) ) {
			var colWidthDiff = Math.ceil(($(this).find('.column').eq(0).width() - ($(this).find('.responseItem').eq(0).outerWidth(true) * parseInt(options.columns)))*0.5);
			$(this).find('.responseItem').width( $(this).find('.responseItem').eq(0).width() - (colWidthDiff + 1));
		}*/

        // Retrieve previous selection
        if ( !isMultiple ) {
            var input = items[0].element,
                currentValue = input.value;

            for ( i=0; i<responseItems.length; i++) {
                responseItems[i].setAttribute('data-id', i);
                var value = responseItems[i].getAttribute('data-value'),
                    isSelected = responseItems[i].getAttribute('data-value') === currentValue ? true : false;
                if (isSelected) {
                    addClass(responseItems[i], 'selected');
                     if ( otherRIDarray.indexOf(responseItems[i].getAttribute('data-index')) >= 0 ) {
                        var otherID = otherRIDarray.indexOf(responseItems[i].getAttribute('data-index'));
                        responseItems[i].querySelector('.otherText').style.display = '';
                        responseItems[i].querySelector('.otherText').focus();
                    }
                } else {
                    responseItems[i].style.filter = restoreRangeColour( responseItems[i].getAttribute('data-id') );
                    removeClass(responseItems[i], 'selected');
                }
            }
        } else if ( isMultiple ) {
            var input = document.querySelector(items[0].element),
                currentValues = String(input.value).split(","),
                currentValue;

            for ( i=0; i<currentValues.length; i++ ) {
                currentValue = currentValues[i];
                for ( var j=0; j<responses.length; j++) {
                    if ( hasClass( responses[j], 'responseItem' ) && !hasClass( responses[j], 'exclusive' ) ) addClass( responses[j], 'cb' );
                    responses[j].setAttribute('data-id', j);
                    var value = responses[j].getAttribute('data-value'),
                        isSelected = responses[j].getAttribute('data-value') == currentValue ? true : false;
                    if (isSelected) {
                        addClass(responses[j], 'selected');
                         if ( otherRIDarray.indexOf(responses[j].getAttribute('data-index')) >= 0 ) {
                            var otherID = otherRIDarray.indexOf(responses[j].getAttribute('data-index'));
                            responses[j].querySelector('.otherText').style.display = '';
                            responses[j].querySelector('.otherText').focus();
                        }
                    }
                }
            }
        }

        // Attach all events
        for ( i=0; i<responses.length; i++) {
            responses[i].onclick = function(e){
                (!isMultiple) ? selectStatementSingle(this) : selectStatementMultiple(this);
            };
        }

        function restoreRangeColour(index) {

            if ( options.useRange && !hasClass(responses[index], 'ns') ) {

                var maxNumber = responses.length - options.numberNS;
                var rangeArray = options.range.split(';');
                var rainbow1 = new Rainbow();
                    rainbow1.setSpectrum(processRgb(rangeArray[0]), processRgb(rangeArray[2]));
                    rainbow1.setNumberRange(0, maxNumber);
                var rainbow2 = new Rainbow();
                    rainbow2.setSpectrum(processRgb(rangeArray[1]), processRgb(rangeArray[3]));
                    rainbow2.setNumberRange(0, maxNumber);

                if ( options.rangeGradientDirection === 'ltr' ) {
                    return 'progid:DXImageTransform.Microsoft.gradient( startColorstr=#'+rainbow1.colourAt(index)+', endColorstr=#'+rainbow2.colourAt(index)+',GradientType=1 )';
                } else {
                    return 'progid:DXImageTransform.Microsoft.gradient( startColorstr=#'+rainbow1.colourAt(index)+', endColorstr=#'+rainbow2.colourAt(index)+',GradientType=0 )';
                }

            } else {
                return '';
            }
        }

        // For multi-coded question
        // Add the @valueToAdd in @currentValue (without duplicate)
        // and return the new value
        function addValue(currentValue, valueToAdd) {

            if (currentValue === '' || currentValue === null) {
                return valueToAdd;
            }
            var arr = String(currentValue).split(','), i, l, wasFound = false;
                for (i = 0, l = arr.length; i < l; i += 1) {
                if (arr[i] === valueToAdd) {
                    wasFound = true;
                    break;
                }
            }
            if (!wasFound) {
                currentValue += ',' + valueToAdd;
            }
            return currentValue;
        }

        // For multi-coded question
        // Remove the @valueToRemove from the @currentValue
        // and return the new value
        function removeValue(currentValue, valueToRemove) {
            if (currentValue === '' || currentValue === null) {
                return currentValue;
            }
            var arr = String(currentValue).split(','), i, l, newArray = [];
            for (i = 0, l = arr.length; i < l; i += 1) {
                if (arr[i] !== valueToRemove) {
                    newArray.push(arr[i]);
                }
            }
            currentValue = newArray.join(',');
            return currentValue;
        }

        // Select a statement
        // @this = target node
        function selectStatementSingle(target) {
            var input = items[0].element,
                value = target.getAttribute('data-value');
            // var deselectionEnabled = true;

            if (deselectionEnabled) {

              if (hasClass(target, 'selected')) {

                  // Un-select
                  target.style.filter = restoreRangeColour( target.getAttribute('data-id') );
                  removeClass(target, 'selected');
                  input.value = '';

                  if (target.querySelector('.otherText') !== null) {
                  	target.querySelector('.otherText').style.display = 'none';
                      target.querySelector('.otherText').value = '';
                      target.querySelector('.otherText').defaultValue = '';
                  }

              } else {
                var selectedElements = [].slice.call(container.getElementsByClassName('selected'));
                for ( i=0; i<selectedElements.length; i++) {
                  selectedElements[i].style.filter = restoreRangeColour( selectedElements[i].getAttribute('data-id') );
                  removeClass(selectedElements[i], 'selected');
                  if (selectedElements[i].querySelector('.otherText') !== null) {
                    selectedElements[i].querySelector('.otherText').style.display = 'none';
                      selectedElements[i].querySelector('.otherText').value = '';
                      selectedElements[i].querySelector('.otherText').defaultValue = '';
                  }
                }

                addClass(target, 'selected');
                input.value = value;

                if (otherRIDarray.indexOf(target.getAttribute('data-index')) === -1) {
                    if (container.parentNode.querySelector('.otherText')) {
                        container.parentNode.querySelector('.otherText').value = '';
                    }
                    for (i = 0; i < otherQIDarray.length; ++i) {
                        if ( otherQIDarray[i] != '' ) document.getElementById(otherQIDarray[i]).value = '';
                    }
                    if (container.parentNode.querySelector('.otherText')) {
                      container.parentNode.querySelector('.otherText').style.display = 'none';
                    }
                } else {
                    for (i = 0; i < otherQIDarray.length; ++i) {
                        if ( otherQIDarray[i] != '' ) document.getElementById(otherQIDarray[i]).value = '';
                    }
                    target.querySelector('.otherText').style.display = '';
                    target.querySelector('.otherText').focus();
                }

              }

            } else {

              var selectedElements = [].slice.call(container.getElementsByClassName('selected'));
              for ( i=0; i<selectedElements.length; i++) {
                selectedElements[i].style.filter = restoreRangeColour( selectedElements[i].getAttribute('data-id') );
                removeClass(selectedElements[i], 'selected');
                if (selectedElements[i].querySelector('.otherText') !== null) {
                	selectedElements[i].querySelector('.otherText').style.display = 'none';
                    selectedElements[i].querySelector('.otherText').value = '';
                    selectedElements[i].querySelector('.otherText').defaultValue = '';
                }
              }
              addClass(target, 'selected');
              input.value = value;

              if (otherRIDarray.indexOf(target.getAttribute('data-index')) === -1) {
                  if (container.parentNode.querySelector('.otherText')) {
                      container.parentNode.querySelector('.otherText').value = '';
                  }
                  for (i = 0; i < otherQIDarray.length; ++i) {
                      if ( otherQIDarray[i] != '' ) document.getElementById(otherQIDarray[i]).value = '';
                  }
                  if (container.parentNode.querySelector('.otherText')) {
                    container.parentNode.querySelector('.otherText').style.display = 'none';
                  }
              } else {
                  for (i = 0; i < otherQIDarray.length; ++i) {
                      if ( otherQIDarray[i] != '' ) document.getElementById(otherQIDarray[i]).value = '';
                  }
                  target.querySelector('.otherText').style.display = '';
                  target.querySelector('.otherText').focus();
              }

            }


            if (window.askia && window.arrLiveRoutingShortcut && window.arrLiveRoutingShortcut.length > 0 && window.arrLiveRoutingShortcut.indexOf(options.currentQuestion) >= 0) {
                askia.triggerAnswer();
            }
            // if auto forward do something
            if ( options.autoForward && (otherRIDarray.indexOf(target.getAttribute('data-index')) === -1 )) {
                nextBtn.click();
            }
        }

        // Select a statement for multiple
        // @this = target node
        function selectStatementMultiple(target) {
            var value = target.getAttribute('data-value'),
                 input = document.querySelector(items[target.getAttribute('data-id')].element),
                 isExclusive = target.classList.contains('exclusive') ? true : false,
                 currentValue = input.value;

            if (hasClass(target, 'selected')) {
                // Un-select
                target.style.filter = restoreRangeColour( target.getAttribute('data-id') );
                removeClass(target, 'selected');
                currentValue = removeValue(currentValue, value);

                if ( otherRIDarray.indexOf(target.getAttribute('data-index')) !== -1 ) {
                    var otherID = otherRIDarray.indexOf(target.getAttribute('data-index'));
                    target.querySelector('.otherText').style.display = 'none';
                    target.querySelector('.otherText').value = '';
                    if ( otherID !== -1 ) document.getElementById(otherQIDarray[otherID]).value = '';
				        }

            } else {
                // Select
                if (!isExclusive) {
                    // Check if any exclusive
                    currentValue = addValue(currentValue, value);

                    if ( otherRIDarray.indexOf(target.getAttribute('data-index')) !== -1 ) {
                        target.querySelector('.otherText').style.display = '';
                        target.querySelector('.otherText').focus();
                    }

                    // Un-select all exclusives
                    var exclusiveElements = [].slice.call(container.getElementsByClassName('exclusive'));

                    for ( i=0; i<exclusiveElements.length; i++) {
                        exclusiveElements[i].style.filter = restoreRangeColour( exclusiveElements[i].getAttribute('data-id') );
                        removeClass(exclusiveElements[i], 'selected');
                        currentValue = removeValue(currentValue, exclusiveElements[i].getAttribute('data-value'));

                        if ( otherRIDarray.indexOf(exclusiveElements[i].getAttribute('data-index')) !== -1 ) {
                            var otherID = otherRIDarray.indexOf(exclusiveElements[i].getAttribute('data-index'));
                            exclusiveElements[i].querySelector('.otherText').style.display = 'none';
                            exclusiveElements[i].querySelector('.otherText').value = '';
                            if ( otherID !== -1 ) document.getElementById(otherQIDarray[otherID]).value = '';
                        }
                    }

                } else {

                    // When exclusive un-select all others
                    var exclusiveElements = [].slice.call(container.getElementsByClassName('exclusive'));
                    var selectedElements = [].slice.call(container.getElementsByClassName('selected'));
                    for ( i=0; i<selectedElements.length; i++) {
                        selectedElements[i].style.filter = restoreRangeColour( selectedElements[i].getAttribute('data-id') );
                        removeClass(selectedElements[i], 'selected');
                    }
                    currentValue = value;
                    if ( otherRIDarray.indexOf(target.getAttribute('data-index')) === -1 ) {

						            var targetOthers = target.parentNode.querySelectorAll('.otherText');
                        for (j1 = 0; j1 < targetOthers.length; ++j1) {
                            targetOthers[j1].value = '';
                        }
                        for (i = 0; i < otherQIDarray.length; ++i) {
                            if ( otherQIDarray[i] != '' ) document.getElementById(otherQIDarray[i]).value = '';
                        }
                        for (j2 = 0; j2 < targetOthers.length; ++j2) {
                            targetOthers[j2].style.display = 'none';
                        }

					          } else {

                        var targetOthers = target.parentNode.querySelectorAll('.otherText');
                        for (j1 = 0; j1 < targetOthers.length; ++j1) {
                            targetOthers[j1].value = '';
                        }
                        for (i = 0; i < otherQIDarray.length; ++i) {
                            if ( otherQIDarray[i] != '' ) document.getElementById(otherQIDarray[i]).value = '';
                        }
                        for (j2 = 0; j2 < targetOthers.length; ++j2) {
                            targetOthers[j2].style.display = 'none';
                        }
                        target.querySelector('.otherText').style.display = '';
                        target.querySelector('.otherText').focus();
					}
                }
                addClass(target, 'selected');
            }

            // Update the value
            input.value = currentValue;
            if (window.askia && window.arrLiveRoutingShortcut && window.arrLiveRoutingShortcut.length > 0 && window.arrLiveRoutingShortcut.indexOf(options.currentQuestion) >= 0) {
                askia.triggerAnswer();
            }
        }

			if (container.querySelector('.otherText')) {
				container.querySelector('.otherText').blur();
			}

        function addEvent(el, type, handler) {
            if (el.attachEvent) el.attachEvent('on'+type, handler); else el.addEventListener(type, handler);
        }
        function removeEvent(el, type, handler) {
            if (el.detachEvent) el.detachEvent('on'+type, handler); else el.removeEventListener(type, handler);
        }

        for ( i=0; i<otherTextItems.length; i++ ) {
            otherTextItems[i].onclick = function(e) {
				e.stopPropagation();
			};
            addEvent(otherTextItems[i], 'keyup', function(e) {
                var elem = e.srcElement || e.target;
                document.getElementById(otherQIDarray[ parseInt(elem.getAttribute("data-id"))-1 ]).value = elem.value;
                if (window.askia
                    && window.arrLiveRoutingShortcut
                    && window.arrLiveRoutingShortcut.length > 0
                    && window.arrLiveRoutingShortcut.indexOf(options.currentQuestion) >= 0) {
                    askia.triggerAnswer();
                }
            }, false);
        }

        function scrollTo(element, to, duration) {
            if (duration <= 0) return;
            var difference = to - element.scrollTop;
            var perTick = difference / duration * 10;

            setTimeout(function() {
                element.scrollTop = element.scrollTop + perTick;
                if (element.scrollTop === to) return;
                scrollTo(element, to, duration - 10);
            }, 10);
        }

        // if error scroll to top
        if ( document.getElementById('error-summary') || document.getElementsByClassName('error') )
            scrollTo(document.body, 0, 600);

		// animate
        if ( animateResponses ){
			for ( i=0; i<responseItems.length; i++ ) {
                responseItems[i].style.top = "2000px";
                addClass(responseItems[i], 'animate');
            }
        }

        function revealEl(el, delay) {
            setTimeout(function(){
                el.style.top = "0px";
            }, delay);
            setTimeout(function(){
                removeClass(el,'animate');
            }, 500);
        }

        // reveal control
        // container.style.visibility = "visible";
        if ( animateResponses ){
			for ( i=0; i<responseItems.length; i++ ) {
                revealEl( responseItems[i], 100+ (i*50) );
            }
        }
        setTimeout(
            (function(passedElement){
                document.querySelector("#adc_" + passedElement).style.visibility = 'visible';
            }(this.instanceId)) , 300);
    }

	window.StatementsOther = StatementsOther;
}());
