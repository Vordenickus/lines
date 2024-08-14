const FRACTION = 220;

/**
 * Тротлим анимацию на 60 кадров в секунду
 * 
 * Дельта не используется, поэтому если кадров будет меньше ничего хорошего не будет
 */
const TARGET_FPS = 60;
const TARGET_FRAME_TIME = 1000 / TARGET_FPS;

const CARCASS_COLOR = '#ff0';
const CARCASS_LINE_WIDTH = 2;

const LINES_COLOR = '#ff0';
const LINES_LINE_WIDTH = 2;

document.addEventListener('DOMContentLoaded', () => {
	const canvas = document.querySelector('#road');
	const context = canvas.getContext('2d');

	/**
	 * Каркас
	 */
	const lines = {
		left: [[300, 0], [0, 1000]],
		right: [[700, 0],[1000, 1000]],
		up: [[700, 0],[300, 0]],
		down: [[1000, 1000], [0, 1000]],
	}
	
	/**
	 * Все цифры предрасчитаны чтобы повысить производительность, ради христа не трогайте их, если не понимаете что делаете
	 * 
	 * Если всетаки надо поменяь то стройте массив нодов на линии и считайте оттуда. Тут использовалась точность в 9000 нодов на линию
	 */
	const startMoveValues = [
		{
			left: [262.5, 125],
			right: [737.5, 125],
		},
		{
			left: [200, 333.3333333333333],
			right: [800, 333.3333333333333],
		},
		{
			left: [112.5, 625],
			right: [887.5, 625],
		},
		{
			left: [0, 1000],
			right: [1000, 1000],
		},
	];

	const precalculatePoints = (start, end, segments) => {
		const xDelta = (end[0] - start[0]) / segments;
		const yDelta = (end[1] - start[1]) / segments;

		const points = [];

		for (let i = 1; i <= segments; i++) {
			points.push([start[0] + i * xDelta, start[1] + i * yDelta]);
		}

		return points.reverse();
	};

lines.left_route = precalculatePoints(lines.left[0], lines.left[1], 9000);
lines.right_route = precalculatePoints(lines.right[0], lines.right[1], 9000);
const routeLimit = Math.min(lines.left_route.length, lines.right_route.length);

let indexes = [
	Math.floor(routeLimit / 8) * 7,
	Math.floor(routeLimit / 6) * 4,
	Math.floor(routeLimit / 8) * 3,
	0,
];

const startPoints = [
	indexes[0],
	indexes[1],
	indexes[2],
	indexes[3]
];

const f = Math.floor(routeLimit / 8) * 3;

console.log([lines.left_route[f], lines.right_route[f]]);

const endPoints = [
	routeLimit,
	indexes[0],
	indexes[1],
	indexes[2],
];
	
	let current = [
		{
			left: [startMoveValues[0].left[0], startMoveValues[0].left[1]],
			right: [startMoveValues[0].right[0], startMoveValues[0].right[1]],
		},
		{
			left: [startMoveValues[1].left[0], startMoveValues[1].left[1]],
			right: [startMoveValues[1].right[0], startMoveValues[1].right[1]],
		},
		{
			left: [startMoveValues[2].left[0], startMoveValues[2].left[1]],
			right: [startMoveValues[2].right[0], startMoveValues[2].right[1]],
		},
		{
			left: [startMoveValues[3].left[0], startMoveValues[3].left[1]],
			right: [startMoveValues[3].right[0], startMoveValues[3].right[1]],
		},
	];
	
	const endMoveValues = [
		{
			left: [300, 0],
			right:  [700, 0],
		},
		{
			left: [startMoveValues[0].left[0], startMoveValues[0].left[1]],
			right: [startMoveValues[0].right[0], startMoveValues[0].right[1]],
		},
		{
			left: [startMoveValues[1].left[0], startMoveValues[1].left[1]],
			right: [startMoveValues[1].right[0], startMoveValues[1].right[1]],
		},
		{
			left: [startMoveValues[2].left[0], startMoveValues[2].left[1]],
			right: [startMoveValues[2].right[0], startMoveValues[2].right[1]],
		}
	];
	
	const deltas = [
		{
			left: {
				x: startMoveValues[0].left[0] - endMoveValues[0].left[0],
				y: startMoveValues[0].left[1] - endMoveValues[0].left[1],
			},
			right: {
				x: endMoveValues[0].right[0] - startMoveValues[0].right[0],
				y: startMoveValues[0].right[1] - endMoveValues[0].right[1],
			}
		},
		{
			left: {
				x: startMoveValues[1].left[0] - endMoveValues[1].left[0],
				y: startMoveValues[1].left[1] - endMoveValues[1].left[1],
			},
			right: {
				x: endMoveValues[1].right[0] - startMoveValues[1].right[0],
				y: startMoveValues[1].right[1] - endMoveValues[1].right[1],
			}
		},
		{
			left: {
				x: startMoveValues[2].left[0] - endMoveValues[2].left[0],
				y: startMoveValues[2].left[1] - endMoveValues[2].left[1],
			},
			right: {
				x: endMoveValues[2].right[0] - startMoveValues[2].right[0],
				y: startMoveValues[2].right[1] - endMoveValues[2].right[1],
			}
		},
		{
			left: {
				x: startMoveValues[3].left[0] - endMoveValues[3].left[0],
				y: startMoveValues[3].left[1] - endMoveValues[3].left[1],
			},
			right: {
				x: endMoveValues[3].right[0] - startMoveValues[3].right[0],
				y: startMoveValues[3].right[1] - endMoveValues[3].right[1],
			}
		},
	];
	
	const steps = [
		{
			left: {
				x: deltas[0].left.x / FRACTION,
				y: deltas[0].left.y / FRACTION,
			},
			right: {
				x: deltas[0].right.x / FRACTION,
				y: deltas[0].right.y / FRACTION,
			}
		},
		{
			left: {
				x: deltas[1].left.x / FRACTION,
				y: deltas[1].left.y / FRACTION,
			},
			right: {
				x: deltas[1].right.x / FRACTION,
				y: deltas[1].right.y / FRACTION,
			}
		},
		{
			left: {
				x: deltas[2].left.x / FRACTION,
				y: deltas[2].left.y / FRACTION,
			},
			right: {
				x: deltas[2].right.x / FRACTION,
				y: deltas[2].right.y / FRACTION,
			}
		},
		{
			left: {
				x: deltas[3].left.x / FRACTION,
				y: deltas[3].left.y / FRACTION,
			},
			right: {
				x: deltas[3].right.x / FRACTION,
				y: deltas[3].right.y / FRACTION,
			}
		}
	];

	let lastFrame = 0;
	let dTime = 1;

	/**
	 * цикл анимации
	 */
	const animation = () => {
		if (lastFrame > 0 && performance.now() - lastFrame < TARGET_FRAME_TIME) {
			requestAnimationFrame(animation);
			return;
		}

		context.clearRect(0,0, 1000, 1000);

		context.beginPath();
		context.strokeStyle = CARCASS_COLOR;
		context.lineWidth = CARCASS_LINE_WIDTH;

		/* рисуем каркас */
		Object.entries(lines).forEach((entry) => {
			const key = entry[0];
			const value = entry[1];

			if (['left', 'right', 'up', 'down'].includes(key)) {
				context.moveTo(value[0][0], value[0][1]);
				context.lineTo(value[1][0], value[1][1]);
			}
		});
		context.stroke();

		/**
		 * рисуем анимированные линии
		 */
		context.beginPath();
		context.lineWidth = LINES_LINE_WIDTH;
		context.strokeStyle = LINES_COLOR;
		current.forEach((entry) => {
			const left = entry.left;
			const right = entry.right;

			context.moveTo(left[0], left[1]);
			context.lineTo(right[0], right[1]);
		})
		context.stroke();

		current = current.map((entry, index) => {
			const FACTION = 4;

			entry.left[0] -= (steps[index].left.x) * FACTION * dTime;
			entry.right[0] += (steps[index].right.x) * FACTION * dTime;

			entry.left[1] -= (steps[index].left.y) * FACTION * dTime;
			entry.right[1] -= (steps[index].right.y) * FACTION * dTime;

			if (
				entry.left[1] < endMoveValues[index].left[1]
				&&
				entry.right[1] < endMoveValues[index].right[1]
				&&
				entry.left[0] > endMoveValues[index].left[0]
				&&
				entry.right[0] < endMoveValues[index].right[0]
			) {
				return {
					left: [startMoveValues[index].left[0], startMoveValues[index].left[1]],
					right: [startMoveValues[index].right[0], startMoveValues[index].right[1]]
				};
			}
			return entry;
		});

		const frameTime = performance.now() - lastFrame;
		dTime = frameTime / TARGET_FRAME_TIME;
		lastFrame = performance.now();
		requestAnimationFrame(animation);
	};
	requestAnimationFrame(animation);
});