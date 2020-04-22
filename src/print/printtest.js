

import {messages} from "../js/messages";
import {createPdf} from "./printUtils";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";

const fonts = {
	Roboto: {
		normal: '../styles/fonts/Roboto-Regular.ttf',
		bold: '../styles/fonts/Roboto-Medium.ttf',
		italics: '../styles/fonts/Roboto-Italic.ttf',
		bolditalics: '../styles/fonts/Roboto-Italic.ttf',
	},
};




function printShoppingList (data){
    pdfMake.vfs = pdfFonts.pdfMake.vfs;

    var docDefinition = geDocDefinition();

    let processedData = processData (data);
    console.log(JSON.stringify(processedData));

    docDefinition.content.push (printData(processedData));
    //
    pdfMake.createPdf(docDefinition).open();
}

function printData (content){
	let c =	[{
	  			style: 'tableStandard',
	  			table: {
	  				widths: [350, 100],
	  				body: content,
	  			},
	  			layout: 'noBorders'
	  		}];

	c.push ( '\n' );
	c.push ( '\n' );

	return (c);

}

function processData (data){
    let c = [];
    let n = data.length;

    let prevCategory = ""

    for (let i=0; i<n; i++){
        let e = [];
        if (data[i].categoryName != prevCategory){
            e = [{text: data[i].categoryName, style: 'fontbold'}, ""];
            c.push(e);
            e = [];
        }
        e = [data[i].productName, data[i].quantity];
        c.push(e);
        prevCategory = data[i].categoryName;
        // console.log(JSON.stringify(data[i]));
    }
    return (c);
}

function geDocDefinition (){
	var docDefinition = {
		  	info: {
    			title: "ΛΙΣΤΑ ΑΓΟΡΩΝ",
    		},
			content: [],
	  		styles: {
	  			header: {
	  				fontSize: 16,
	  				bold: true,
	  				margin: [0, 0, 0, 10]
	  			},
	  			subheader: {
	  				fontSize: 14,
	  				bold: true,
	  				margin: [0, 10, 0, 5]
	  			},
	  			titlebold: {
	  				fontSize: 12,
	  				bold: true,
	  				margin: [0, 10, 0, 5]
	  			},
	  			titlenormal: {
	  				fontSize: 12,
	  				bold: false,
	  				margin: [0, 10, 0, 5]
	  			},
	  			tableStandard: {
	  				margin: [0, 0, 0, 0]
	  			},
	  			tableHeader: {
	  				bold: true,
	  				fontSize: 11,
	  				color: 'black'
	  			},
	  			totalamount: {
	  				bold: true
	  			},
	  			fontbold: {
	  				bold: true
	  			},
	  			grayout: {
	  				color: 'gray'
	  			}
	  		},
	  		defaultStyle: {
	  			fontSize: 11
	  		}
	};

	// if (prcode != null){
	// 	docDefinition.info.title = messages[prcode] + '-' + messages[printout] + '-' + fd.monthyear
	// }

	return (docDefinition);

}

export {printShoppingList};