import ear from "rabbit-ear";

export const initializeWebGL = (canvasElement) => {
	if (!canvasElement) {
		canvasElement = document.querySelector("canvas");
	}
	const devicePixelRatio = window.devicePixelRatio || 1;
	// set the size of the drawingBuffer based on the size it's displayed.
	canvasElement.width = canvasElement.clientWidth * devicePixelRatio;
	canvasElement.height = canvasElement.clientHeight * devicePixelRatio;
	// const gl2 = canvasElement.getContext("webgl2");
	// if (gl2) { return { gl: gl2, version: 2 }; }
	const gl1 = canvasElement.getContext("webgl");
	if (gl1) { return { gl: gl1, version: 1 }; }
	throw "WebGl not Supported";
};

export const makeOrthographicCamera = (canvasWidth, canvasHeight, frameNum = 0) => {
	const vmin = Math.min(canvasWidth, canvasHeight) / 1.05;
	const projectionMatrix3D = ear.math.makeOrthographicMatrix4(
		1 + ((canvasHeight - vmin) / vmin) / 2,
		1 + ((canvasWidth - vmin) / vmin) / 2,
		-((canvasHeight - vmin) / vmin) / 2,
		-((canvasWidth - vmin) / vmin) / 2,
		-10,
		10);
	const translationMatrix3D = ear.math.makeMatrix4Translate(0, 0, -2);
	return ear.math.multiplyMatrices4(projectionMatrix3D, translationMatrix3D);
};

export const makePerspectiveCamera = (canvasWidth, canvasHeight, frameNum = 0) => {
	const vmin = Math.min(canvasWidth, canvasHeight) / 1.05;
	const projectionMatrix3D = ear.math.makePerspectiveMatrix4(Math.PI / 4, canvasWidth / canvasHeight, 0.01, 100);
	const cameraPos = [
		1 * Math.cos(frameNum / 100),
		1 * Math.sin(frameNum / 100),
		1];
	// (cameraPosition, target, up)
	const lookAtMatrix = ear.math.makeLookAtMatrix4(cameraPos, [0, 0, 0], [0,0,1]);
	const modelViewMatrix = ear.math.invertMatrix4(lookAtMatrix);
	const translationMatrix3D = ear.math.makeMatrix4Translate(-0.5, -0.5, -1);
	let matrix3D = ear.math.multiplyMatrices4(projectionMatrix3D, modelViewMatrix);
	return ear.math.multiplyMatrices4(matrix3D, translationMatrix3D);
};
