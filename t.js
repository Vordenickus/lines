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
		first_middle: [[300 + 133.3333333, 0], [333.333333, 1000]],
		second_middle: [[300 + 266.66666, 0], [666.666666, 1000]],
		up: [[300, 0],[700, 0]],
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
	lines.first_middle_route = precalculatePoints(lines.first_middle[0], lines.first_middle[1], 9000);
	lines.second_middle_route = precalculatePoints(lines.second_middle[0], lines.second_middle[1], 9000);
	const routeLimit = Math.min(lines.left_route.length, lines.right_route.length);
	
	const startMoveValues = [
		{
			left: lines.left_route[Math.floor(routeLimit / 8) * 7],
			right: lines.right_route[Math.floor(routeLimit / 8) * 7],
		},
		{
			left: lines.left_route[Math.floor(routeLimit / 6) * 4],
			right: lines.right_route[Math.floor(routeLimit / 6) * 4],
		},
		{
			left: lines.left_route[Math.floor(routeLimit / 8) * 3],
			right: lines.right_route[Math.floor(routeLimit / 8) * 3],
		},
		{
			left: lines.left_route[0],
			right: lines.right_route[0],
		},
	];

	let currentLoading = [];

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

	const LOADING_STATE = 'loading';
	const PLAYING_STATE = 'playing';
	const HIDING_STATE = 'hiding';
	const STOPED_STATE = 'stoped';

	let animationState = window.scrollY < 200 ? LOADING_STATE : HIDING_STATE;

	const animationManager = () => {
		if (lastFrame > 0 && performance.now() - lastFrame < TARGET_FRAME_TIME) {
			requestAnimationFrame(animationManager);
			return;
		}
		switch (animationState) {
			case PLAYING_STATE: 
				playingAnimation();
				break;
			case LOADING_STATE:
				loadingAnimation();
				break;
			case HIDING_STATE:
				hideAnimation();
				break;
			default:
			case STOPED_STATE:
				context.clearRect(0, 0, 1000, 1000);
				break;
		}

		const frameTime = performance.now() - lastFrame;
		dTime = frameTime / TARGET_FRAME_TIME;
		lastFrame = performance.now();
		requestAnimationFrame(animationManager);
	}

	let loadingIndex = 0;

	const hideAnimation = () => {
		context.clearRect(0, 0, 1000, 1000);
		if (currentLoading.length === 0) {
			return;
		}

		context.beginPath();
		context.strokeStyle = '#FF0';
		context.lineWidth = 2;

		let lastLoading = false;
		let lastLeft = false;
		let lastRight = false;

		Object.values(currentLoading).forEach((item) => {
			Object.entries(item).forEach((entry) => {
				if (!lastLoading) {
					return;
				}

				const key = entry[0];
				const value = entry[1];
	
				if (['left', 'right', 'up', 'down', 'first_middle', 'second_middle'].includes(key)) {
					if (value[0] !== 0 && value[1] !== 0) {
						context.moveTo(lastLoading[key][0], lastLoading[key][1]);
						context.lineTo(value[0], value[1]);
					}
				}

				if (key === 'left') {
					lastLeft = [value[0], value[1]];
				}

				if (key === 'right') {
					lastRight = [value[0], value[1]];
				}
			});
			lastLoading = item;
		});

		if (currentLoading[0]) {
			context.moveTo(currentLoading[0]['left'][0], currentLoading[0]['left'][1]);
			context.lineTo(currentLoading[0]['right'][0], currentLoading[0]['right'][1]);
		}

		context.moveTo(lastLeft[0], lastLeft[1]);
		context.lineTo(lastRight[0], lastRight[1]);

		Object.values(startMoveValues).forEach((moveValue) => {
			if (lastLeft[1] >= moveValue.left[1]) {
				context.moveTo(moveValue.left[0], moveValue.right[1]);
				context.lineTo(moveValue.right[0], moveValue.right[1]);
			}
		});

		context.stroke();

		currentLoading.splice(currentLoading.length - 3, 3);
		loadingIndex -= 300;

		if (loadingIndex <= 0) {
			loadingIndex = 0;
			animationState = STOPED_STATE;
			canvas.dispatchEvent(new CustomEvent('hide_stoped'));
		}
	}
	
	const loadingAnimation = () => {
		context.clearRect(0, 0, 1000, 1000);
		document.body.style.position = 'fixed';
		document.body.style.overflowY = 'scroll';
		document.body.style.width = '100%';

		context.beginPath();
		context.strokeStyle = '#FF0';
		context.lineWidth = 2;

		let lastLoading = false;
		let lastLeft = false;
		let lastRight = false;

		Object.values(currentLoading).forEach((item) => {
			Object.entries(item).forEach((entry) => {
				if (!lastLoading) {
					return;
				}

				const key = entry[0];
				const value = entry[1];
	
				if (['left', 'right', 'up', 'down', 'first_middle', 'second_middle'].includes(key)) {
					if (value[0] !== 0 && value[1] !== 0) {
						context.moveTo(lastLoading[key][0], lastLoading[key][1]);
						context.lineTo(value[0], value[1]);
					}
				}

				if (key === 'left') {
					lastLeft = [value[0], value[1]];
				}

				if (key === 'right') {
					lastRight = [value[0], value[1]];
				}
			});
			lastLoading = item;
		});

		context.moveTo(lastLeft[0], lastLeft[1]);
		context.lineTo(lastRight[0], lastRight[1]);

		Object.values(startMoveValues).forEach((moveValue) => {
			if (lastLeft[1] <= moveValue.left[1]) {
				context.moveTo(moveValue.left[0], moveValue.right[1]);
				context.lineTo(moveValue.right[0], moveValue.right[1]);
			}
		});

		if (loadingIndex >= routeLimit) {
			loadingIndex = routeLimit - 1;
		}
		
		context.stroke();

		for (let i = 0; i < 3; i++) {
			currentLoading.push({
				left: [lines.left_route[loadingIndex][0], lines.left_route[loadingIndex][1]],
				right: [lines.right_route[loadingIndex][0], lines.right_route[loadingIndex][1]],
				first_middle: [lines.first_middle_route[loadingIndex][0], lines.first_middle_route[loadingIndex][1]],
				second_middle: [lines.second_middle_route[loadingIndex][0], lines.second_middle_route[loadingIndex][1]],
				up: [0, 0],
				down: [0, 0]
			});

			loadingIndex += 100;
		}

		if (loadingIndex >= routeLimit) {
			animationState = PLAYING_STATE;
			document.body.style.position = '';
			document.body.style.overflowY = '';
			document.body.style.width = '%';
			canvas.dispatchEvent(new CustomEvent('loading_stoped'));
		}
	}

	/**
	 * цикл анимации
	 */
	const playingAnimation = () => {
		context.clearRect(0,0, 1000, 1000);

		context.beginPath();
		context.strokeStyle = CARCASS_COLOR;
		context.lineWidth = CARCASS_LINE_WIDTH;

		/* рисуем каркас */
		Object.entries(lines).forEach((entry) => {
			const key = entry[0];
			const value = entry[1];

			if (['left', 'right', 'up', 'down', 'first_middle', 'second_middle'].includes(key)) {
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
	};
	requestAnimationFrame(animationManager);

	let hideReversed = false;
	let loadReversed = false;

	window.addEventListener('scroll', (event) => {
		if (window.scrollY > 0 && animationState === PLAYING_STATE) {
			animationState = HIDING_STATE;
			if (!hideReversed) {
				currentLoading.reverse();
				hideReversed = true;
				loadReversed = false;
			}

		}

		if (window.scrollY === 0) {
			const callback = () => {
				animationState = LOADING_STATE;
				if (!loadReversed) {
					currentLoading.reverse();
					loadReversed = true;
					hideReversed = false;
				}
			}

			if (animationState === HIDING_STATE) {
				canvas.addEventListener('hide_stoped', () => {
					if (window.scrollY === 0) {
						callback();
					}
					canvas.removeEventListener('hide_stoped', callback);
				});
			} else {
				callback();
			}
		}
	}, {passive: false});
});