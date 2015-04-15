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
{caption : "{%= caption %}", element : $('#{%= inputName%}')}{%= On(i < ar.Count, ",", "") %}
{% Next %}