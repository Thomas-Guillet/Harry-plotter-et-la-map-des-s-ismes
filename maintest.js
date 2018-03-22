const canvas = document.querySelector('#canvas');
const ctx = canvas.getContext('2d');

const W = 1170;
const H = 827;
const lignes = 80;
const points = 1000;
const dx = W / points;
const dy = H / lignes;

const point = [];
point.push([500, 300, 2]);
point.push([150, 430, 2]);

const normalPDF = (x, mu, sigma) => {
	const sigma2 = Math.pow(sigma, 2);
	const numerator = Math.exp(-Math.pow(x - mu, 2) / (2 * sigma2));
	const denominator = Math.sqrt(2 * Math.PI * sigma2);
	return numerator / denominator;
};

const drawline = (y) => {
	let x = 0;
	ctx.beginPath();
	for (let i = 0; i < points; i++) {
		x += dx;
        let newY = 0;
        for (let v = 0; v < point.length; v++) {
			const delta = Math.abs(y - point[v][1]);
            newY += y - 1000 * normalPDF(x, point[v][0], 15 + delta);
        }
		ctx.lineTo(x, newY/point.length);
	}
	ctx.stroke();
};

ctx.fillStyle = 'red';
	for (let i = 0; i < point.length; i++) {
        ctx.fillRect(point[i][0] - 3, point[i][1] - 3, 6, 6);
    }

let y = 0;
for (let i = 0; i < lignes; i++) {
	y += dy;
	drawline(y);
}