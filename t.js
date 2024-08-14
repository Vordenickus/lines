const FPS = 120;

const lines = {
	y_start: 800,
	y_end: 300,
	x_start: 800,
	x_end: 300,
	left: [[300, 300], [100, 800]], // [300, 300], [100, 800]
	right: [[800, 300], [900, 800]], // [800, 300], [900, 800]
	up: [[300, 300], [800, 300]], // [300, 300], [800, 300]
	down: [[100, 800], [900, 800]], // [100, 800], [900, 800]
	moving: [
		[[100, 800], [900, 800]]
	],
}

const startMoveValues = [
	{
		left: [275, 362.5],
		right: [812.5, 362.5],
	},
	{
		left: [233.33333333333331, 466.66666666666663],
		right: [833.3333333333334, 466.66666666666663],
	},
	{
		left: [175, 612.5],
		right: [862.5, 612.5],
	},
	{
		left: [100, 800],
		right: [900, 800],
	},
];

let current = [
	{
		left: [275, 362.5],
		right: [812.5, 362.5],
	},
	{
		left: [233.33333333333331, 466.66666666666663],
		right: [833.3333333333334, 466.66666666666663],
	},
	{
		left: [175, 612.5],
		right: [862.5, 612.5],
	},
	{
		left: [100, 800],
		right: [900, 800],
	},
];

const endMoveValues = [
	{
		left: [300, 300],
		right: [800, 300],
	},
	{
		left: [275, 362.5],
		right: [812.5, 362.5],
	},
	{
		left: [233.33333333333331, 466.66666666666663],
		right: [833.3333333333334, 466.66666666666663],
	},
	{
		left: [175, 612.5],
		right: [862.5, 612.5],
	}
];

const deltas = [
	{
		x: endMoveValues[0].left[0] - startMoveValues[0].left[0],
		y: startMoveValues[0].left[1] - endMoveValues[0].left[1],
	},
	{
		x: endMoveValues[1].left[0] - startMoveValues[1].left[0],
		y: startMoveValues[1].left[1] - endMoveValues[1].left[1],
	},
	{
		x: endMoveValues[2].left[0] - startMoveValues[2].left[0],
		y: startMoveValues[2].left[1] - endMoveValues[2].left[1],
	},
	{
		x: endMoveValues[3].left[0] - startMoveValues[3].left[0],
		y: startMoveValues[3].left[1] - endMoveValues[3].left[1],
	},
];

const steps = [
	{
		x: deltas[0].x / FPS,
		y: deltas[0].y / FPS,
	},
	{
		x: deltas[1].x / FPS,
		y: deltas[1].y / FPS,
	},
	{
		x: deltas[2].x / FPS,
		y: deltas[2].y / FPS,
	},
	{
		x: deltas[3].x / FPS,
		y: deltas[3].y / FPS,
	},
];


// const precalculatePoints = (start, end, segments) => {
// 	const xDelta = (end[0] - start[0]) / segments;
// 	const yDelta = (end[1] - start[1]) / segments;

// 	const points = [];

// 	for (let i = 1; i <= segments; i++) {
// 		points.push([start[0] + i * xDelta, start[1] + i * yDelta]);
// 	}

// 	return points.reverse();
// };

// lines.left_route = precalculatePoints(lines.left[0], lines.left[1], 9000);
// lines.right_route = precalculatePoints(lines.right[0], lines.right[1], 9000);
// const routeLimit = Math.min(lines.left_route.length, lines.right_route.length);

// let indexes = [
// 	Math.floor(routeLimit / 8) * 7,
// 	Math.floor(routeLimit / 6) * 4,
// 	Math.floor(routeLimit / 8) * 3,
// 	0,
// ];

// const startPoints = [
// 	indexes[0],
// 	indexes[1],
// 	indexes[2],
// 	indexes[3]
// ];

// const f = Math.floor(routeLimit / 6) * 4;

// console.log([lines.left_route[f], lines.right_route[f]]);

// const endPoints = [
// 	routeLimit,
// 	indexes[0],
// 	indexes[1],
// 	indexes[2],
// ];


document.addEventListener('DOMContentLoaded', () => {
	const canvas = document.querySelector('#road');

	const context = canvas.getContext('2d');

	const animation = () => {

		context.strokeStyle = '#ff0';
		context.lineWidth = 3;

		context.clearRect(0,0, 1000, 1000);
		context.beginPath();
		/* рисуем квадрат */
		Object.entries(lines).forEach((entry) => {
			const key = entry[0];
			const value = entry[1];

			if (['left', 'right', 'up', 'down'].includes(key)) {
				context.moveTo(value[0][0], value[0][1]);
				context.lineTo(value[1][0], value[1][1]);
			}
		});
		context.stroke();

		context.beginPath();
		context.strokeStyle = '#ff0';
		current.forEach((entry) => {
			const left = entry.left;
			const right = entry.right;

			context.moveTo(left[0], left[1]);
			context.lineTo(right[0], right[1]);
		})
		context.stroke();

		current = current.map((entry, index) => {
			entry.left[0] += steps[index].x;
			entry.right[0] -= steps[index].x;

			entry.left[1] -= steps[index].y;
			entry.right[1] -= steps[index].y;

			if (
				entry.left[1] <= endMoveValues[index].left[1]
			) {
				// console.log(startMoveValues[index].left[1]);
				return {
					left: [startMoveValues[index].left[0], startMoveValues[index].left[1]],
					right: [startMoveValues[index].right[0], startMoveValues[index].right[1]]
				};
			}
			return entry;
		});



		// context.beginPath();
		// context.strokeStyle = '#00f';
		// context.lineWidth = 4;
		
		// Object.values(lines.left_route).forEach(line => {
		// 	context.moveTo(line[0], line[1]);
		// 	context.lineTo(line[0] + 1, line[1] + 1);
		// });
		// Object.values(lines.right_route).forEach(line => {
		// 	context.moveTo(line[0], line[1]);
		// 	context.lineTo(line[0] + 1, line[1] + 1);
		// });

		// context.stroke();

		/* разделяем элементы */

		requestAnimationFrame(animation);
	};

	requestAnimationFrame(animation);
});