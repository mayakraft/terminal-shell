import ear from "rabbit-ear";

export const initializeWebGL = (canvasElement, preferredVersion) => {
	const contextName = [null, "webgl", "webgl2"];
	// set the size of the drawingBuffer to include retina display level pixels (if exist),
	// the size can still change after, even with CSS, this only matters for getContext
	const devicePixelRatio = window.devicePixelRatio || 1;
	canvasElement.width = canvasElement.clientWidth * devicePixelRatio;
	canvasElement.height = canvasElement.clientHeight * devicePixelRatio;
	if (preferredVersion) {
		return ({
			gl: canvasElement.getContext(contextName[preferredVersion]),
			version: preferredVersion,
		});
	}
	// no user preference. attempt version 2 then 1 in that order
	const gl2 = canvasElement.getContext(contextName[2]);
	if (gl2) { return { gl: gl2, version: 2 }; }
	const gl1 = canvasElement.getContext(contextName[1]);
	if (gl1) { return { gl: gl1, version: 1 }; }
	throw new Error("WebGl not Supported");
};

// export const makeOrthographicCamera = (canvasDimensions, graphBoundingBox, frameNum = 0) => {
// 	// const scale = Math.min(...[0, 1].map((_, i) => canvasDimensions[i] / graphBoundingBox.span[i]));
// 	const scale = Math.max(...[0, 1].map((_, i) => graphBoundingBox.span[i]));
// 	const vmin = Math.min(...canvasDimensions) / 1.05;
// 	const halfSize = [0, 1].map(i => (canvasDimensions[i] - vmin) / vmin);
// 	// console.log(sides)
// 	const projectionMatrix3D = ear.math.makeOrthographicMatrix4(
// 		1 + halfSize[1],// + graphBoundingBox.min[1],
// 		1 + halfSize[0],// + graphBoundingBox.min[0],
// 		-halfSize[1],// + graphBoundingBox.min[1],
// 		-halfSize[0],// + graphBoundingBox.min[0],
// 		-10,
// 		10);
// 	const translationMatrix3D = ear.math.makeMatrix4Translate(-center[0], -center[1], 0);
// 	let matrix = ear.math.multiplyMatrices4(projectionMatrix3D, translationMatrix3D);
// 	// matrix = ear.math.multiplyMatrices4(matrix, ear.math.makeMatrix4Scale([scale, scale, scale]));
// 	return matrix;
// };

export const makeOrthographicCamera = (canvasDimensions, graphBoundingBox, frameNum = 0) => {
	const scale = Math.max(...[0, 1].map((_, i) => 1 / graphBoundingBox.span[i]));
	const center = graphBoundingBox.max
		.map((_, i) => (graphBoundingBox.max[i] + graphBoundingBox.min[i]) / 2);
	const vmin = Math.min(...canvasDimensions) / 1.05;
	const halfSize = [0, 1].map(i => ((canvasDimensions[i] - vmin) / vmin) / 2);
	const projectionMatrix3D = ear.math.makeOrthographicMatrix4(
		1 + halfSize[1],
		1 + halfSize[0],
		-halfSize[1],
		-halfSize[0],
		-10,
		10);
	const translationMatrix = ear.math.makeMatrix4Translate(-graphBoundingBox.min[0], -graphBoundingBox.min[1], 0);
	const scaleMatrix = ear.math.makeMatrix4Scale([scale, scale, scale])
	let matrix = ear.math.multiplyMatrices4(projectionMatrix3D, scaleMatrix);
	matrix = ear.math.multiplyMatrices4(matrix, translationMatrix);
	return matrix
};

// export const makeOrthographicCamera = (canvasDimensions, graphBoundingBox, frameNum = 0) => {
// 	const vmin = Math.min(...canvasDimensions) / 1.05;
// 	const halfSize = [0, 1].map(i => ((canvasDimensions[i] - vmin) / vmin) / 2);
// 	const projectionMatrix3D = ear.math.makeOrthographicMatrix4(
// 		1 + halfSize[1],
// 		1 + halfSize[0],
// 		-halfSize[1],
// 		-halfSize[0],
// 		-10,
// 		10);
// 	const translationMatrix3D = ear.math.makeMatrix4Translate(0, 0, -2);
// 	return ear.math.multiplyMatrices4(projectionMatrix3D, translationMatrix3D);
// };


// export const makeOrthographicCamera = (canvasDimensions, graphBoundingBox, frameNum = 0) => {
// 	const vmin = Math.min(...canvasDimensions) / 1.05;
// 	const graphVMin = Math.min(graphBoundingBox.span[0], graphBoundingBox.span[1]);
// 	const graphVMax = Math.max(graphBoundingBox.span[0], graphBoundingBox.span[1]);
// 	// console.log("graphVMin", graphVMin);
// 	const center = [0, 1]
// 		.map((_, i) => (graphBoundingBox.max[i] + graphBoundingBox.min[i]) / 2);
// 	const graphMin = Math.min(graphBoundingBox.min[0], graphBoundingBox.min[1]);
// 		// console.log("center", center);
// 	const halfSize = [0, 1]
// 		.map(i => ((canvasDimensions[i] - vmin) / vmin) / 2)
// 		.map(n => n * graphVMin);
// 	// console.log("halfSize" ,halfSize);
// 	const projectionMatrix3D = ear.math.makeOrthographicMatrix4(
// 		graphVMin + halfSize[1] + graphBoundingBox.min[1],
// 		graphVMin + halfSize[0] + graphBoundingBox.min[0],
// 		-halfSize[1] + graphBoundingBox.min[1],
// 		-halfSize[0] + graphBoundingBox.min[0],
// 		-10,
// 		10);
// 	const translationMatrix3D = ear.math.makeMatrix4Translate(0, 0, -2);
// 	return ear.math.multiplyMatrices4(projectionMatrix3D, translationMatrix3D);
// };


export const makePerspectiveCamera = (canvasDimensions, graphBoundingBox, frameNum = 0) => {
	// get the center of the graph as a 3D point
	const projectionMatrix3D = ear.math.makePerspectiveMatrix4(Math.PI / 4, canvasDimensions[0] / canvasDimensions[1], 0.01, 100);
	const cameraPos = [
		1 * Math.cos(frameNum / 100),
		1 * Math.sin(frameNum / 100),
		1];
	// makeLookAtMatrix4 (cameraPosition, target, up)
	const center = graphBoundingBox.max
		.map((_, i) => (graphBoundingBox.max[i] + graphBoundingBox.min[i]) / 2);
	while (center.length < 3) { center.push(0); }
	const lookAtMatrix = ear.math.makeLookAtMatrix4(cameraPos, [0, 0, 0], [0,0,1]);
	const viewMatrix = ear.math.invertMatrix4(lookAtMatrix);
	const modelMatrix = ear.math.makeMatrix4Translate(...ear.math.flip(center));
	let matrix3D = ear.math.multiplyMatrices4(projectionMatrix3D, viewMatrix);
	matrix3D = ear.math.multiplyMatrices4(matrix3D, modelMatrix);
	return matrix3D;
};
