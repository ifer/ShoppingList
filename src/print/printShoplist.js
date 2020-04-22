

import {messages} from "../js/messages";
import {createPdf} from "./printUtils";
import pdfFonts from "pdfmake/build/vfs_fonts";

var moment = require("moment");

// const fonts = {
// 	Roboto: {
// 		normal: '../styles/fonts/Roboto-Regular.ttf',
// 		bold: '../styles/fonts/Roboto-Medium.ttf',
// 		italics: '../styles/fonts/Roboto-Italic.ttf',
// 		bolditalics: '../styles/fonts/Roboto-Italic.ttf',
// 	},
// };

const dateFormat = "DD/MM/YYYY";
const checkboxurl = "../styles/img/checkbox.jpg";

var imgdata;

import pdfMake from "pdfmake/build/pdfmake";

async function printShoppingList (data){
    pdfMake.vfs = pdfFonts.pdfMake.vfs;

	// imgdata = await getBase64ImageFromURL(checkboxurl);
	imgdata = getChecboxImageData();  //ready image in base64

    let today = moment().format(dateFormat);
	var docDefinition = {
		  	info: {
    			title: messages.printShoplistTitle,
    		},
			content: [],
	  	    styles: getStyles(),
            defaultStyle: {
    			fontSize: 10
    		},
            header: {
    			columns: ["", { text: today, alignment: 'right', color: 'grey', margin: [0,20,20,0] }]

    		},

	};

    docDefinition.content.push (printPageHeader());

    let processedData = processData (data);
    // console.log(JSON.stringify(processedData));

    if(processedData.length == 0){
        return;
    }

    docDefinition.content.push (printData(processedData));
    //
    // createPdf(docDefinition).open();
	createPdf(docDefinition, 'shoplsit.pdf');
}

function printData (content){

	let c =	[{
	  			style: 'tableStandard',
	  			table: {
	  				widths: [300, 100, 50],
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
    if ((!data) || data.length==0){
        return c;
    }

    let n = data.length;

    let prevCategory = ""

    for (let i=0; i<n; i++){
        let e = [];
        if (data[i].categoryName != prevCategory){
            e = ["", "", ""];
            c.push(e);
            e = [{text: data[i].categoryName, style: 'fontbold'}, "", ""];
            c.push(e);
            e = [];
        }
        e = [{text: data[i].productName, style: 'productName'}, data[i].quantity, {image: imgdata, width: 12}];
        c.push(e);
        prevCategory = data[i].categoryName;
        // console.log(JSON.stringify(data[i]));
    }
    return (c);
}

function printPageHeader (){
	let c = [];
	c.push ({text: messages.printShoplistTitle, style: 'subheader', alignment: 'center' });
	c.push ( '\n' );

	return (c);
}

function getStyles (){
    let styles = {
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
                fontSize: 11,
                bold: true
            },
            grayout: {
                color: 'gray'
            },
            productName: {
                marginLeft: 15
            }

        };

        return styles;
}


function getChecboxImageData(){
	return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAYAAACpSkzOAAAA4UlEQVRIS+2W0Q2CMBCG7ygDMEpNy7tM4Ag6gk5gnEBHcAUn0HdK7CYwAHDmiCASX7BIfGgfm/b/8v+55H4EAJBSRmEY7oloAwAR301wCkQ8l2V5sNYWyBAhxJV5E4h/krBVVSWotT4S0ZZfIOIJAC7GmJsLVGu9BIBVXxeVUjnHxRBjzM4FMPzbM1EwiJ5uElcnQ1Acx7Ku63uj34KyLMMp3bRanREPGhuvj25sYt17H52Pzg/D1zPwB9EFQbBI09S6e3gp8EonIu4jzeKbZ5X/opzwCiei9Vs5ma1uzVUgH8q9xnET1/juAAAAAElFTkSuQmCC";
}

function getBase64ImageFromURL(url) {
    return new Promise((resolve, reject) => {
      var img = new Image();
      img.setAttribute("crossOrigin", "anonymous");
      img.onload = () => {
        var canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        var dataURL = canvas.toDataURL("image/png");
        resolve(dataURL);
      };
      img.onerror = error => {
        reject(error);
      };
      img.src = url;
    });
  }

export {printShoppingList};
