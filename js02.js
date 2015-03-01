window.onload = initAll;												//first function call when page loads.
var xhr = false;
var xhr1 = false;
var ip,opurl,url;
var conceptArray,ipar;

// initall function inyializes the variables and events as the page is loaded
function initAll() {
	document.getElementById("b1").onclick = function() {
		ip = document.getElementById("t1").value;                           // ip stores the query string typed by the user.
		makeRequest("keywords/keywords.xml",setKey);						// opens keywords.xml and calls setKey function.
		return false;
		}
}

// makeRequest function is used to make XMLHttprequest using ajax to access the xml files on the server
function makeRequest(url,ResponseFunction) {
	if (window.XMLHttpRequest) {
		xhr = new XMLHttpRequest();
	}
	else {
		if (window.ActiveXObject) {
			try {
				xhr = new ActiveXObject("Microsoft.XMLHTTP");
			}
			catch (e) { }
		}
	}

	if (xhr) {
		xhr.onreadystatechange = ResponseFunction;
		xhr.open("GET", url, true);
		xhr.send(null);
	}
	else {
		document.getElementById("data").innerHTML = "Sorry, but I couldn't create an XMLHttpRequest";
	}
}


// setKey function matches the keywords from keywords.xml and stores the related concepts in conceptArray
function setKey()
{
	if (xhr.readyState == 4) {
		if (xhr.status == 200) {
			var allkey = xhr.responseXML.getElementsByTagName("name");
			var temp = ip.toLowerCase();
			
				for (var i=0; i<allkey.length; i++) 	
				{
						var str1 = allkey[i].firstChild.nodeValue.toLowerCase();
						if( temp.indexOf(str1) != -1 ) {
						par = allkey[i].parentNode;
						conceptArray = par.getElementsByTagName("concept");
						//var tr =document.getElementById("data").innerHTML;
						document.getElementById("data").innerHTML= str1+ " related concepts :<br>";
						break;
						}
				}
		
				if(i < allkey.length){
					makeRequest("concepts/concepts.xml",makeLink);				// opens concepts.xml and calls makeLink function.
				}
				else {
					document.getElementById("data").innerHTML= temp + " is invalid query....try again! <br> "; 
						}
		  	}


		else {
			document.getElementById("data").innerHTML= "There was a problem with the request " + xhr.status;
			}
		}
}



// makeLink function searches the concepts.xml and if matched opens the required page also gives the links to the child concepts of the topic
function makeLink()
{
	if (xhr.readyState == 4) {
		if (xhr.status == 200) {
			var lnklist = xhr.responseXML.getElementsByTagName("name");
			for (i = 0 ; i < conceptArray.length ; i++)
			{
				for (j = 0; j<lnklist.length ;j++)
				{
					if(lnklist[j].firstChild.nodeValue.search(conceptArray[i].firstChild.nodeValue) != -1)
					{
						
						var par = lnklist[j].parentNode;
						
						if(i==0)
						{
							window.open(par.getElementsByTagName("link")[0].firstChild.nodeValue);
						}
						
						
						var p = document.createElement('p');
						var txt = document.createTextNode(" ");
						p.appendChild(txt);
						document.getElementById("data").appendChild(p);
						
						
						var a = document.createElement('a');
						var linkText = document.createTextNode(lnklist[j].firstChild.nodeValue) ;
						a.appendChild(linkText);
						a.title = "my title text";
						a.href = par.getElementsByTagName("link")[0].firstChild.nodeValue;
						document.getElementById("data").appendChild(a);
						
					}
				}
			}
			
		}
		
	}
}
