const canvas = document.querySelector('#canvas');
const ctx = canvas.getContext('2d');

const i__total_latitude = 181;
const i__total_longitude = 361;

const i__height = 827;
const i__width = 1170;
const i__size = 0.5;

const i__latitude = i__total_latitude * i__size;
const i__longitude = i__total_longitude * i__size;
const i__spacing = i__height / i__latitude;


var items = [];

const url = 'http://seismes.cleverapps.io/api/2017-09-08/2017-09-09/0';

const normalPDF = (x, mu, sigma) => {
	const sigma2 = Math.pow(sigma, 2);
	const numerator = Math.exp(-Math.pow(x - mu, 2) / (2 * sigma2));
	const denominator = Math.sqrt(2 * Math.PI * sigma2);
	return numerator / denominator;
};

const drawline = y => {
    ctx.beginPath();
    for (let i = 0; i < W; i++) {
        const distance = Math.abs(i - variableX);
        distance = Math.max(distance, 0.01);
        const amplitude = 1 / distance * 40
        ctx.lineTo(i, y - amplitude);
    }
    ctx.stroke();
};

const drawline = (y) => {
	let x = 0;
	ctx.beginPath();
	for (let i = 0; i < i__width; i++) {
		x += dx;
        let newY = 0;
        for (let v = 0; v < items.length; v++) {
			const delta = Math.abs(y - items[v][1]);
            newY += y - (1000 * normalPDF(x, items[v][0], 15 + delta))*items[v][2];
        }
		ctx.lineTo(x, newY/items.length);
	}
	ctx.stroke();
};

const draw_stroke = (ctx, x, y) => {
    ctx.beginPath();
    ctx.moveTo(x, y);
    let currentY = y;
    for (let i = 0; i < i__width; i++) {
        let amplitudeX = 0;
        let amplitudeY = 0;
        let finalD = 0;

        for (let it of items) {
            let variableX = ((it[0] + 180) / i__total_longitude) * i__width;
            let variableY = (((it[1]*(-1)) + 90) / i__total_latitude) * i__height;
            
            pointA = Math.pow((variableX - i) * 0.2, 2);
            pointB = Math.pow((variableY - y) * 3, 2);
            distance = Math.sqrt(pointA + pointB);
            // finalD += Math.pow(1/distance, 2) * Math.pow(it[2], 2) * 4;
            // finalD += 1/distance * Math.pow(it[2], 2) * 2;
            // console.log(Math.pow(Math.abs(Math.cos(Math.PI * distance / 2.0)), 1.5));
            // console.log('original :'+(1/distance * Math.pow(it[2], 2) * 2));
            finalD += Math.pow(Math.abs(Math.cos(Math.PI * distance / 2.0)), 1.5) * Math.pow(it[2], 2) * 2;

        }
        ctx.lineTo(i, y - finalD);
    }

    ctx.stroke();
}


const draw_stroke_test = (ctx, x, y) => {
    ctx.beginPath();
    ctx.moveTo(x, y);
    let currentX = 0;

    for (var i = 0; i <= i__width; i++){
        let currentY = y;
        for (let i of items) {
            let variableX = ((i[0] + 180) / i__total_longitude) * i__width;

            let rangeX = variableX / currentX;
            if(rangeX <= 1.1 && rangeX >= 0.9){

                if(rangeX <= 1.1 && rangeX > 1){
                    rangeX = (rangeX - 1.1) * (-1);
                }else if(rangeX >= 0.9 && rangeX < 1){
                    rangeX = rangeX - 0.9;
                }else{
                    rangeX = 0.1;
                }
                currentY = currentY - (rangeX * 100);

            }
        }

        ctx.lineTo(currentX, currentY);
        currentX++; 
    }

    ctx.stroke();
}


    
//  const x = 0;
//     const y = 700;
//     draw_stroke(ctx, x, y);

console.log('started !');
fetch(url)
.then(res => res.json())
.then((data) => {
    console.log(data['features'].length+' Séisme(s)');
    for(var i= 0; i < data['features'].length; i++)
    {
         let pointX = data['features'][i]['geometry']['coordinates'][0]/i__total_latitude;
         let pointY = data['features'][i]['geometry']['coordinates'][1];
         let magnitude = data['features'][i]['properties']['mag'];
         items.push([pointX, pointY, magnitude]);
    }

    for (var i = 0; i < i__latitude; i++){
        const x = 0;
        const y = i * i__spacing;
        draw_stroke(ctx, x, y);
    }
    console.log('ended !');
    console.log(items);
})
.catch(err => { throw err });