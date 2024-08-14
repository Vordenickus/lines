const FRACTION = 200;

document.addEventListener('DOMContentLoaded', () => {
	const canvas = document.querySelector('#road');

	const context = canvas.getContext('2d');
	const TARGET_FPS = 60;
	const TARGET_FRAME_TIME = 1000 / TARGET_FPS;
	let lastFrame = 0;


	const lines = {
		left: [[0, 1000], [300, 300]],
		right: [[700, 300], [1000, 1000]],
		up: [[300, 300], [700, 300]],
		down: [[0, 1000], [1000, 1000]],
	}

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
		Math.floor(routeLimit / 8) * 4,
		Math.floor(routeLimit / 8) * 3,
		0,
	];

	const startPoints = [
		indexes[0],
		indexes[1],
		indexes[2],
		indexes[3]
	];

	const f = 	Math.floor(routeLimit / 8) * 4;
	console.log([lines.left_route[f], lines.right_route[f]]);

	const endPoints = [
		routeLimit,
		indexes[0],
		indexes[1],
		indexes[2],
	];
	
	const startMoveValues = [
		{
			left: [37.5, 912.5],
			right: [737.5, 387.5],
		},
		{
			left: [150, 650],
			right: [850, 650],
		},
		{
			left: [187.5, 562.5],
			right: [887.5, 737.5],
		},
		{
			left: [0, 1000],
			right: [1000, 1000],
		},
	];
	
	let current = [
		{
			left: [37.5, 912.5],
			right: [737.5, 387.5],
		},
		{
			left: [150, 650],
			right: [850, 650],
		},
		{
			left: [187.5, 562.5],
			right: [887.5, 737.5],
		},
		{
			left: [0, 1000],
			right: [1000, 1000],
		},
	];
	
	const endMoveValues = [
		{
			left: [300, 300],
			right:  [700, 300],
		},
		{
			left: [37.5, 912.5],
			right: [737.5, 387.5],
		},
		{
			left: [150, 650],
			right: [850, 650],
		},
		{
			left: [187.5, 562.5],
			right: [887.5, 737.5],
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

	console.log(steps);

	const animation = () => {
		if (lastFrame > 0 && performance.now() - lastFrame < TARGET_FRAME_TIME) {
			requestAnimationFrame(animation);
			return;
		}

		context.lineWidth = 2;

		context.clearRect(0,0, 1000, 1000);

		context.beginPath();
		context.strokeStyle = '#ff0';
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
			return entry;
			const FACTION = 4;

			entry.left[0] -= (steps[index].left.x) * FACTION;
			entry.right[0] += (steps[index].right.x) * FACTION;

			entry.left[1] -= (steps[index].left.y) * FACTION;
			entry.right[1] -= (steps[index].right.y) * FACTION;

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

		lastFrame = performance.now();
		requestAnimationFrame(animation);
	};
	requestAnimationFrame(animation);
});