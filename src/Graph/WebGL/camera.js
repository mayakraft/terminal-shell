import {
	makePerspectiveMatrix2D,
	makePerspectiveMatrix3D,
	makeLookAtMatrix3D,
	makeOrthographicMatrix3D,
	multiplyMatrices2D,
	makeTranslationMatrix2D,
	makeRotationMatrix2D,
	makeScaleMatrix2D,
	multiplyMatrices3D,
	makeTranslationMatrix3D,
	makeXRotationMatrix3D,
	makeYRotationMatrix3D,
	makeZRotationMatrix3D,
	makeScaleMatrix3D,
	invertMatrix3D,
} from "./Helpers";

const make2DCamera = () => {
	const projectionMatrix2D = makePerspectiveMatrix2D(canvasWidth, canvasHeight);
	const translationMatrix2D = makeTranslationMatrix2D(
		(canvasWidth - vmin) / 2,
		(canvasHeight - vmin) / 2,
	);
	const rotationMatrix2D = makeRotationMatrix2D(0);
	const scaleMatrix2D = makeScaleMatrix2D(vmin, vmin);
	let matrix2D = multiplyMatrices2D(projectionMatrix2D, translationMatrix2D);
	matrix2D = multiplyMatrices2D(matrix2D, rotationMatrix2D);
	matrix2D = multiplyMatrices2D(matrix2D, scaleMatrix2D);
	return matrix2D;
};

export const makeOrthographicCamera = (canvasWidth, canvasHeight, frameNum = 0) => {
	const vmin = Math.min(canvasWidth, canvasHeight) / 1.05;
	const projectionMatrix3D = makeOrthographicMatrix3D(
		-((canvasWidth - vmin) / vmin) / 2,
		1 + ((canvasWidth - vmin) / vmin) / 2,
		-((canvasHeight - vmin) / vmin) / 2,
		1 + ((canvasHeight - vmin) / vmin) / 2,
		0.01,
		100);
	const translationMatrix3D = makeTranslationMatrix3D(0, 0, -2);
	return multiplyMatrices3D(projectionMatrix3D, translationMatrix3D);
};

export const makePerspectiveCamera = (canvasWidth, canvasHeight, frameNum = 0) => {
	const vmin = Math.min(canvasWidth, canvasHeight) / 1.05;
	const projectionMatrix3D = makePerspectiveMatrix3D(Math.PI / 4, canvasWidth / canvasHeight, 0.01, 100);
	const cameraPos = [
		1 * Math.cos(frameNum / 100),
		1 * Math.sin(frameNum / 100),
		1];
	// (cameraPosition, target, up)
	const lookAtMatrix = makeLookAtMatrix3D(cameraPos, [0, 0, 0], [0,0,1]);
	const modelViewMatrix = invertMatrix3D(lookAtMatrix);
	const translationMatrix3D = makeTranslationMatrix3D(-0.5, -0.5, -1);
	let matrix3D = multiplyMatrices3D(projectionMatrix3D, modelViewMatrix);
	return multiplyMatrices3D(matrix3D, translationMatrix3D);
};
