/* standard_single.js */
{% 
Dim i 
Dim ar = CurrentQuestion.AvailableResponses
Dim inputName
Dim caption

For i = 1 To ar.Count 
	inputName = ar[i].InputName()
	caption   = ar[i].Caption
%}
{element : document.getElementById('{%= inputName%}')}{%= On(i < ar.Count, ",", "") %}
{% Next %}