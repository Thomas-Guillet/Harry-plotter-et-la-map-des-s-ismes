import C2S from "canvas2svg";

const canvas = document.querySelector('#canvas');
const ctx = canvas.getContext('2d');

const Hv = 1.2;
const W = 1174;
let H = 827;
// H = H*Hv;
const lignes = 50;
const points = W;
const dx = W / points;
const dy = H / lignes;
let svgExportCtx = new C2S(ctx.canvas.width, ctx.canvas.height);
let maxY = 0;

var items = [];
ctx.lineWidth = 1;
svgExportCtx.lineWidth = 1;
const url = 'http://seismes.cleverapps.io/api/2017-07-08/2017-08-09/5';
// const url = 'http://seismes.cleverapps.io/api/2017-01-08/2017-01-18/0';

const normalPDF = (x, mu, sigma) => {
	const sigma2 = Math.pow(sigma, 2);
	const numerator = Math.exp(-Math.pow(x - mu, 2) / (2 * sigma2));
	const denominator = Math.sqrt(2 * Math.PI * sigma2);
	return numerator / denominator;
};

let c = 0;



const drawline = (y) => {
// 	ctx.fillStyle = "rgba(255, 0, "+c+", 1)";
// ctx.strokeStyle = 'rgba(255, 0, '+c+', 1)';
	ctx.strokeStyle = 'black';
	svgExportCtx.strokeStyle = 'black';
	let x = 10;
	
	ctx.beginPath();
	svgExportCtx.beginPath();
	ctx.moveTo(0, y);
	svgExportCtx.moveTo(0, y);
	let newY = 0;
	let stateLine = true;
	let lastSwitch = -50;
	for (let i = 0; i < (points + 1); i++) {
		x += dx;
		newY = 0;
        for (let v = 0; v < items.length; v++) {
			const delta = Math.abs(y - items[v][1]);
            newY += y - ((1000 * normalPDF(x, items[v][0], 15 + delta))*(items[v][2]*0.5))*items.length;
		}
		if(maxY > (newY/items.length)){
			maxY = newY/items.length;
		}
		let pixelData = ctx.getImageData(x,newY/items.length,1,1);
		const opacity = pixelData.data[3];
		if(opacity != 0 && stateLine && i - lastSwitch >= 5){
			ctx.stroke();
			svgExportCtx.stroke();
			stateLine = false;
			lastSwitch = i;
		}else if(opacity != 0 && !stateLine && i - lastSwitch >= 5){
			stateLine = true;
			ctx.beginPath();
			svgExportCtx.beginPath();
			lastSwitch = i;
		}
		if(stateLine){
			ctx.lineTo(x, newY/items.length);
			svgExportCtx.lineTo(x, newY/items.length);
		}else{
			ctx.moveTo(x, newY/items.length);
			svgExportCtx.moveTo(x, newY/items.length);
		}
		
		
	}

	// ctx.lineTo(x, H);
	// svgExportCtx.lineTo(x, H);
	// ctx.lineTo(0, H);
	// svgExportCtx.lineTo(0, H);
	// ctx.lineTo(0, y);
	// svgExportCtx.lineTo(0, y);
	// ctx.closePath();
	// svgExportCtx.closePath();
	ctx.stroke();
	svgExportCtx.stroke();

	c = c+4;
	if(c == 255){
		c = 0;
	}
};



console.log('started !');
fetch(url)
.then(res => res.json())
.then((data) => {
    console.log(data['features'].length+' Séisme(s)');
    for(var i= 0; i < data['features'].length; i++)
    {
         let pointX = ((data['features'][i]['geometry']['coordinates'][0]+180)/360)*W;
         let pointY = ((data['features'][i]['geometry']['coordinates'][1]*(-1)+90)/180)*H;
         let magnitude = data['features'][i]['properties']['mag'];
         items.push([pointX, pointY, magnitude]);
    }

	let y = H;
	for (let i = 0; i < lignes; i++) {
		y -= dy;
		drawline(y);
		console.log('Ligne '+i+' sur '+lignes);
	}
	// maxY -= 40;
	// ctx.lineWidth = 4;
	// svgExportCtx.lineWidth = 4;
	// ctx.beginPath();
	// svgExportCtx.beginPath();
	// ctx.moveTo(0, maxY);
	// svgExportCtx.moveTo(0, maxY);
	// ctx.lineTo(W, maxY);
	// svgExportCtx.lineTo(W, maxY);
	// ctx.lineTo(W, H);
	// svgExportCtx.lineTo(W, H);
	// ctx.lineTo(0, H);
	// svgExportCtx.lineTo(0, H);
	// ctx.closePath();
	// svgExportCtx.closePath();
	// ctx.stroke();
	// svgExportCtx.stroke();

    console.log('ended !');
    console.log(items);
})
.catch(err => { throw err });

const download = (filename, content) => {
	let pseudoLink = document.createElement("a");
	pseudoLink.setAttribute("href", "data:image/svg+xml;charset=utf-8," + encodeURIComponent(content));
	pseudoLink.setAttribute("download", filename);
  
	pseudoLink.style.display = "none";
	document.body.appendChild(pseudoLink);
  
	pseudoLink.click();
  
	document.body.removeChild(pseudoLink);
  }
  
  document.querySelector('button').addEventListener(
	"click", () => {
	  let svg = svgExportCtx.getSerializedSvg();
	  let filename = "export.svg";
  
	  download(filename, svg);
	},
	false
  );