var xml_http = new ActiveXObject('MSXML2.XMLHttp');

xml_http.open('POST', 'http://localhost:10080/gntp', false);
xml_http.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
xml_http.send(encodeURI('text=bosy&title=test&twitter_screen_name=ne_sachirou&sticky=on'));
WScript.Echo(xml_http.responseText);