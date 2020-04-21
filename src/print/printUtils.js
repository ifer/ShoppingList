/*
printUtils.js
*/



// Creates pdf and if adblock is disabled opens it, otherwise downloads it
function createPdf(docDefinition, filename) {
	var testAd = document.createElement("div");
	testAd.innerHTML = "&nbsp;";
	testAd.className = "adsbox";
	document.body.appendChild(testAd);
	
	window.setTimeout(function() {

		if (testAd.offsetHeight === 0) { //adBlock enabled
			// console.log("AdBlock Enabled? ",true);
			pdfMake.createPdf(docDefinition).download(filename); 
		}
		else { //adBlock enabled
			// console.log("AdBlock Enabled? ",false);
			pdfMake.createPdf(docDefinition).open();
		}
		testAd.remove();
		
	}, 100);
		  
}

export {createPdf};