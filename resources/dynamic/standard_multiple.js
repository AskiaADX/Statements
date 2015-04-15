/* standard_multiple.js */
{% 
Dim i 
Dim ar = CurrentQuestion.AvailableResponses
Dim inputName = CurrentQuestion.InputName()
Dim isExclusive

For i = 1 To ar.Count 
    isExclusive = ar[i].IsExclusive
%}
{element : $("input[name='{%= CurrentQuestion.InputName("List")%}']"), isExclusive : {%= isExclusive%}}{%= On(i < ar.Count, ",", "") %}
{% Next %}