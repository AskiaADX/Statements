DomReady.ready(function() {
    
    var statements = new Statements({
        instanceId : '{%= CurrentADC.InstanceId%}',
        currentQuestion: '{%:= CurrentQuestion.Shortcut %}',
		width : 400,
		imageAlign : '{%= CurrentADC.PropValue("imageAlign") %}',
		imageWidth : 100,
		imageHeight : 100,
		isMultiple: {%= (CurrentQuestion.Type = "multiple") or (CurrentQuestion.Type = "multiple-loop") %},
		controlWidth : '{%= CurrentADC.PropValue("controlWidth") %}',
		columns: {%= CurrentADC.PropValue("columns") %},
		maxWidth : '{%= CurrentADC.PropValue("maxWidth") %}',
		maxImageWidth : '{%= CurrentADC.PropValue("maxImageWidth") %}',
		maxImageHeight : '{%= CurrentADC.PropValue("maxImageHeight") %}',
		forceImageSize : '{%= CurrentADC.PropValue("forceImageSize") %}',
        animateResponses: {%= (CurrentADC.PropValue("animateResponses") = "1") %},
		autoForward: {%= (CurrentADC.PropValue("autoForward") = "1") %},
		numberNS: {%= CurrentADC.PropValue("numberNS") %},
		useRange: {%= (CurrentADC.PropValue("useRange") = "1") %},
		responseTextPadding : '{%= CurrentADC.PropValue("responseTextPadding") %}',
		responseTextLineHeight : '{%= CurrentADC.PropValue("responseTextLineHeight") %}',
		showResponseHoverColour: {%= (CurrentADC.PropValue("showResponseHoverColour") = "1") %},
		showResponseHoverFontColour: {%= (CurrentADC.PropValue("showResponseHoverFontColour") = "1") %},
		showResponseHoverBorder: {%= (CurrentADC.PropValue("showResponseHoverBorder") = "1") %},
		controlAlign : '{%= CurrentADC.PropValue("controlAlign") %}',
		rangeGradientDirection : '{%= CurrentADC.PropValue("rangeGradientDirection") %}',
        mergeColumnWidth : '{%= CurrentADC.PropValue("mergeColumnWidth") %}',
		{% IF CurrentADC.PropValue("useRange") = "1" Then %}
			range: '{%= CurrentADC.PropValue("responseColourPrimary") %};{%= CurrentADC.PropValue("responseColourPrimary") %};{%= CurrentADC.PropValue("responseColourRangePrimary") %};{%= CurrentADC.PropValue("responseColourRangePrimary") %}',
		{% EndIF %}
		items : [
			{% IF (CurrentQuestion.Type = "single") or (CurrentQuestion.Type = "single-loop") Then %}
				{%:= CurrentADC.GetContent("dynamic/standard_single.js").ToText()%}
			{% ElseIf (CurrentQuestion.Type = "multiple") or (CurrentQuestion.Type = "multiple-loop") Then %}
				{%:= CurrentADC.GetContent("dynamic/standard_multiple.js").ToText()%}
			{% EndIF %}
		]
    });
    
});