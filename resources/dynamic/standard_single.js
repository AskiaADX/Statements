/* standard_single.js */
{%
Dim i
Dim ar = CurrentQuestion.AvailableResponses
Dim inputName

For i = 1 To ar.Count
	inputName = ar[i].InputName()
%}
{element : document.getElementById('{%= inputName%}')}{%= On(i < ar.Count, ",", "") %}
{% Next %}
