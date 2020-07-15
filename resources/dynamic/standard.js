/* standard.js */
 DomReady.ready(function() {
{%
Dim i

Dim strOtherRID = ""
Dim strOtherQID = ""

Dim ar = CurrentQuestion.AvailableResponses
For i = 1 to ar.Count
    If ar[i].isOpen = True Then
        If strOtherRID <> "" Then
          strOtherRID = strOtherRID + ","
            strOtherQID = strOtherQID + ","
        Endif
        strOtherRID = strOtherRID + ar[i].Index
        strOtherQID = strOtherQID + ar[i].OpenQuestion.InputName()
    Endif
Next i

%}
    var statementsOther = new StatementsOther({
        instanceId : '{%= CurrentADC.InstanceId%}',
        currentQuestion: '{%:= CurrentQuestion.Shortcut %}',
		width : 400,
		imageAlign : '{%= CurrentADC.PropValue("imageAlign") %}',
		imageWidth : 100,
		imageHeight : 100,
		isMultiple: {%= (CurrentQuestion.Type = "multiple") %},
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
        otherRID : '{%= strOtherRID %}',
		otherQID : '{%= strOtherQID %}',
    expandableHeaders : {%= (CurrentADC.PropValue("expandableHeaders") = "1") %},
    deselectionEnabled : {%= (CurrentADC.PropValue("deselectionEnabled") = "1") %},    
    accordionInitialState : '{%= CurrentADC.PropValue("accordionInitialState") %}',
		rangeGradientDirection : '{%= CurrentADC.PropValue("rangeGradientDirection") %}',
        mergeColumnWidth : '{%= CurrentADC.PropValue("mergeColumnWidth") %}',
        responseHeight : '{%= CurrentADC.PropValue("responseHeight") %}',
		{% IF CurrentADC.PropValue("useRange") = "1" Then %}
			range: '{%= CurrentADC.PropValue("responseColourPrimary") %};{%= CurrentADC.PropValue("responseColourPrimary") %};{%= CurrentADC.PropValue("responseColourRangePrimary") %};{%= CurrentADC.PropValue("responseColourRangePrimary") %}',
		{% EndIF %}
		items : [
			{% IF CurrentQuestion.Type = "single" Then %}
				{%:= CurrentADC.GetContent("dynamic/standard_single.js").ToText()%}
			{% ElseIf CurrentQuestion.Type = "multiple" Then %}
				{%:= CurrentADC.GetContent("dynamic/standard_multiple.js").ToText()%}
			{% EndIF %}
		]
    });
});
