
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

// project specific matrix stuff

// Note: This matrix flips the Y axis so that 0 is at the top.
export const makePerspectiveMatrix2D = (width, height) => [
	2 / width, 0, 0,
	0, -2 / height, 0,
	-1, 1, 1
];


// Note: This matrix flips the Y axis so that 0 is at the top.
// export const makePerspectiveMatrix3D = (width, height) => [
// 	2 / width, 0, 0, 0,
// 	0, -2 / height, 0, 0,
// 	0, 0, 1, 0,
// 	-1, 1, 0, 1,
// ];

export const makePerspectiveMatrix3D = (fieldOfViewInRadians, aspect, near, far) => {
	var f = Math.tan(Math.PI * 0.5 - 0.5 * fieldOfViewInRadians);
	var rangeInv = 1.0 / (near - far);
	return [
		f / aspect, 0, 0, 0,
		0, f, 0, 0,
		0, 0, (near + far) * rangeInv, -1,
		0, 0, near * far * rangeInv * 2, 0
	];
};

		function cross(a, b) {
			return [a[1] * b[2] - a[2] * b[1],
							a[2] * b[0] - a[0] * b[2],
							a[0] * b[1] - a[1] * b[0]];
		}
		function subtractVectors(a, b) {
			return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
		}
		function normalize(v) {
			var length = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
			// make sure we don't divide by 0.
			return length > 1e-6
				? [v[0] / length, v[1] / length, v[2] / length]
				: [0, 0, 0]
		}

export const makeLookAtMatrix3D = (cameraPosition, target, up) => {
	var zAxis = normalize(subtractVectors(cameraPosition, target));
	var xAxis = normalize(cross(up, zAxis));
	var yAxis = normalize(cross(zAxis, xAxis));

	return [
		 xAxis[0], xAxis[1], xAxis[2], 0,
		 yAxis[0], yAxis[1], yAxis[2], 0,
		 zAxis[0], zAxis[1], zAxis[2], 0,
		 cameraPosition[0],
		 cameraPosition[1],
		 cameraPosition[2],
		 1,
	];
};

export const makeOrthographicMatrix3D = (left, right, bottom, top, near, far) => [
	2 / (right - left), 0, 0, 0,
	0, 2 / (top - bottom), 0, 0,
	0, 0, 2 / (near - far), 0,

	(left + right) / (left - right),
	(bottom + top) / (bottom - top),
	(near + far) / (near - far),
	1,
];

// matrix math


export const multiplyMatrices2D = (a, b) => {
	const a00 = a[0 * 3 + 0];
	const a01 = a[0 * 3 + 1];
	const a02 = a[0 * 3 + 2];
	const a10 = a[1 * 3 + 0];
	const a11 = a[1 * 3 + 1];
	const a12 = a[1 * 3 + 2];
	const a20 = a[2 * 3 + 0];
	const a21 = a[2 * 3 + 1];
	const a22 = a[2 * 3 + 2];
	const b00 = b[0 * 3 + 0];
	const b01 = b[0 * 3 + 1];
	const b02 = b[0 * 3 + 2];
	const b10 = b[1 * 3 + 0];
	const b11 = b[1 * 3 + 1];
	const b12 = b[1 * 3 + 2];
	const b20 = b[2 * 3 + 0];
	const b21 = b[2 * 3 + 1];
	const b22 = b[2 * 3 + 2];
	return [
		b00 * a00 + b01 * a10 + b02 * a20,
		b00 * a01 + b01 * a11 + b02 * a21,
		b00 * a02 + b01 * a12 + b02 * a22,
		b10 * a00 + b11 * a10 + b12 * a20,
		b10 * a01 + b11 * a11 + b12 * a21,
		b10 * a02 + b11 * a12 + b12 * a22,
		b20 * a00 + b21 * a10 + b22 * a20,
		b20 * a01 + b21 * a11 + b22 * a21,
		b20 * a02 + b21 * a12 + b22 * a22,
	];
};

export const makeTranslationMatrix2D = (tx, ty) => {
	return [
		1, 0, 0,
		0, 1, 0,
		tx, ty, 1,
	];
};

export const makeRotationMatrix2D = (angleInRadians) => {
	var c = Math.cos(angleInRadians);
	var s = Math.sin(angleInRadians);
	return [
		c,-s, 0,
		s, c, 0,
		0, 0, 1,
	];
};

export const makeScaleMatrix2D = (sx, sy) => {
	return [
		sx, 0, 0,
		0, sy, 0,
		0, 0, 1,
	];
};

export const multiplyMatrices3D = (a, b) => {
	var b00 = b[0 * 4 + 0];
	var b01 = b[0 * 4 + 1];
	var b02 = b[0 * 4 + 2];
	var b03 = b[0 * 4 + 3];
	var b10 = b[1 * 4 + 0];
	var b11 = b[1 * 4 + 1];
	var b12 = b[1 * 4 + 2];
	var b13 = b[1 * 4 + 3];
	var b20 = b[2 * 4 + 0];
	var b21 = b[2 * 4 + 1];
	var b22 = b[2 * 4 + 2];
	var b23 = b[2 * 4 + 3];
	var b30 = b[3 * 4 + 0];
	var b31 = b[3 * 4 + 1];
	var b32 = b[3 * 4 + 2];
	var b33 = b[3 * 4 + 3];
	var a00 = a[0 * 4 + 0];
	var a01 = a[0 * 4 + 1];
	var a02 = a[0 * 4 + 2];
	var a03 = a[0 * 4 + 3];
	var a10 = a[1 * 4 + 0];
	var a11 = a[1 * 4 + 1];
	var a12 = a[1 * 4 + 2];
	var a13 = a[1 * 4 + 3];
	var a20 = a[2 * 4 + 0];
	var a21 = a[2 * 4 + 1];
	var a22 = a[2 * 4 + 2];
	var a23 = a[2 * 4 + 3];
	var a30 = a[3 * 4 + 0];
	var a31 = a[3 * 4 + 1];
	var a32 = a[3 * 4 + 2];
	var a33 = a[3 * 4 + 3];

	return [
		b00 * a00 + b01 * a10 + b02 * a20 + b03 * a30,
		b00 * a01 + b01 * a11 + b02 * a21 + b03 * a31,
		b00 * a02 + b01 * a12 + b02 * a22 + b03 * a32,
		b00 * a03 + b01 * a13 + b02 * a23 + b03 * a33,
		b10 * a00 + b11 * a10 + b12 * a20 + b13 * a30,
		b10 * a01 + b11 * a11 + b12 * a21 + b13 * a31,
		b10 * a02 + b11 * a12 + b12 * a22 + b13 * a32,
		b10 * a03 + b11 * a13 + b12 * a23 + b13 * a33,
		b20 * a00 + b21 * a10 + b22 * a20 + b23 * a30,
		b20 * a01 + b21 * a11 + b22 * a21 + b23 * a31,
		b20 * a02 + b21 * a12 + b22 * a22 + b23 * a32,
		b20 * a03 + b21 * a13 + b22 * a23 + b23 * a33,
		b30 * a00 + b31 * a10 + b32 * a20 + b33 * a30,
		b30 * a01 + b31 * a11 + b32 * a21 + b33 * a31,
		b30 * a02 + b31 * a12 + b32 * a22 + b33 * a32,
		b30 * a03 + b31 * a13 + b32 * a23 + b33 * a33,
	];
};

export const makeTranslationMatrix3D = (tx, ty, tz) => {
	return [
		1,  0,  0,  0,
		0,  1,  0,  0,
		0,  0,  1,  0,
		tx, ty, tz, 1,
	];
};
		 
export const makeXRotationMatrix3D = (angleInRadians) => {
	var c = Math.cos(angleInRadians);
	var s = Math.sin(angleInRadians);
	return [
		1, 0, 0, 0,
		0, c, s, 0,
		0, -s, c, 0,
		0, 0, 0, 1,
	];
};

export const makeYRotationMatrix3D = (angleInRadians) => {
	var c = Math.cos(angleInRadians);
	var s = Math.sin(angleInRadians);
	return [
		c, 0, -s, 0,
		0, 1, 0, 0,
		s, 0, c, 0,
		0, 0, 0, 1,
	];
};

export const makeZRotationMatrix3D = (angleInRadians) => {
	var c = Math.cos(angleInRadians);
	var s = Math.sin(angleInRadians);
	return [
		 c, s, 0, 0,
		-s, c, 0, 0,
		 0, 0, 1, 0,
		 0, 0, 0, 1,
	];
};

export const makeScaleMatrix3D = (sx, sy, sz) => {
	return [
		sx, 0,  0,  0,
		0, sy,  0,  0,
		0,  0, sz,  0,
		0,  0,  0,  1,
	];
};

export const invertMatrix3D = (m) => {
	// var A2323 = m.m22 * m.m33 - m.m23 * m.m32 ;
	// var A1323 = m.m21 * m.m33 - m.m23 * m.m31 ;
	// var A1223 = m.m21 * m.m32 - m.m22 * m.m31 ;
	// var A0323 = m.m20 * m.m33 - m.m23 * m.m30 ;
	// var A0223 = m.m20 * m.m32 - m.m22 * m.m30 ;
	// var A0123 = m.m20 * m.m31 - m.m21 * m.m30 ;
	// var A2313 = m.m12 * m.m33 - m.m13 * m.m32 ;
	// var A1313 = m.m11 * m.m33 - m.m13 * m.m31 ;
	// var A1213 = m.m11 * m.m32 - m.m12 * m.m31 ;
	// var A2312 = m.m12 * m.m23 - m.m13 * m.m22 ;
	// var A1312 = m.m11 * m.m23 - m.m13 * m.m21 ;
	// var A1212 = m.m11 * m.m22 - m.m12 * m.m21 ;
	// var A0313 = m.m10 * m.m33 - m.m13 * m.m30 ;
	// var A0213 = m.m10 * m.m32 - m.m12 * m.m30 ;
	// var A0312 = m.m10 * m.m23 - m.m13 * m.m20 ;
	// var A0212 = m.m10 * m.m22 - m.m12 * m.m20 ;
	// var A0113 = m.m10 * m.m31 - m.m11 * m.m30 ;
	// var A0112 = m.m10 * m.m21 - m.m11 * m.m20 ;

	// var det = m.m00 * ( m.m11 * A2323 - m.m12 * A1323 + m.m13 * A1223 ) 
	// 		- m.m01 * ( m.m10 * A2323 - m.m12 * A0323 + m.m13 * A0223 ) 
	// 		+ m.m02 * ( m.m10 * A1323 - m.m11 * A0323 + m.m13 * A0123 ) 
	// 		- m.m03 * ( m.m10 * A1223 - m.m11 * A0223 + m.m12 * A0123 ) ;
	// det = 1 / det;

	// return new Matrix4x4() {
	// 	 m00 = det *   ( m.m11 * A2323 - m.m12 * A1323 + m.m13 * A1223 ),
	// 	 m01 = det * - ( m.m01 * A2323 - m.m02 * A1323 + m.m03 * A1223 ),
	// 	 m02 = det *   ( m.m01 * A2313 - m.m02 * A1313 + m.m03 * A1213 ),
	// 	 m03 = det * - ( m.m01 * A2312 - m.m02 * A1312 + m.m03 * A1212 ),
	// 	 m10 = det * - ( m.m10 * A2323 - m.m12 * A0323 + m.m13 * A0223 ),
	// 	 m11 = det *   ( m.m00 * A2323 - m.m02 * A0323 + m.m03 * A0223 ),
	// 	 m12 = det * - ( m.m00 * A2313 - m.m02 * A0313 + m.m03 * A0213 ),
	// 	 m13 = det *   ( m.m00 * A2312 - m.m02 * A0312 + m.m03 * A0212 ),
	// 	 m20 = det *   ( m.m10 * A1323 - m.m11 * A0323 + m.m13 * A0123 ),
	// 	 m21 = det * - ( m.m00 * A1323 - m.m01 * A0323 + m.m03 * A0123 ),
	// 	 m22 = det *   ( m.m00 * A1313 - m.m01 * A0313 + m.m03 * A0113 ),
	// 	 m23 = det * - ( m.m00 * A1312 - m.m01 * A0312 + m.m03 * A0112 ),
	// 	 m30 = det * - ( m.m10 * A1223 - m.m11 * A0223 + m.m12 * A0123 ),
	// 	 m31 = det *   ( m.m00 * A1223 - m.m01 * A0223 + m.m02 * A0123 ),
	// 	 m32 = det * - ( m.m00 * A1213 - m.m01 * A0213 + m.m02 * A0113 ),
	// 	 m33 = det *   ( m.m00 * A1212 - m.m01 * A0212 + m.m02 * A0112 ),
	// };
	var A2323 = m[2*4 + 2] * m[3*4 + 3] - m[2*4 + 3] * m[3*4 + 2];
	var A1323 = m[2*4 + 1] * m[3*4 + 3] - m[2*4 + 3] * m[3*4 + 1];
	var A1223 = m[2*4 + 1] * m[3*4 + 2] - m[2*4 + 2] * m[3*4 + 1];
	var A0323 = m[2*4 + 0] * m[3*4 + 3] - m[2*4 + 3] * m[3*4 + 0];
	var A0223 = m[2*4 + 0] * m[3*4 + 2] - m[2*4 + 2] * m[3*4 + 0];
	var A0123 = m[2*4 + 0] * m[3*4 + 1] - m[2*4 + 1] * m[3*4 + 0];
	var A2313 = m[1*4 + 2] * m[3*4 + 3] - m[1*4 + 3] * m[3*4 + 2];
	var A1313 = m[1*4 + 1] * m[3*4 + 3] - m[1*4 + 3] * m[3*4 + 1];
	var A1213 = m[1*4 + 1] * m[3*4 + 2] - m[1*4 + 2] * m[3*4 + 1];
	var A2312 = m[1*4 + 2] * m[2*4 + 3] - m[1*4 + 3] * m[2*4 + 2];
	var A1312 = m[1*4 + 1] * m[2*4 + 3] - m[1*4 + 3] * m[2*4 + 1];
	var A1212 = m[1*4 + 1] * m[2*4 + 2] - m[1*4 + 2] * m[2*4 + 1];
	var A0313 = m[1*4 + 0] * m[3*4 + 3] - m[1*4 + 3] * m[3*4 + 0];
	var A0213 = m[1*4 + 0] * m[3*4 + 2] - m[1*4 + 2] * m[3*4 + 0];
	var A0312 = m[1*4 + 0] * m[2*4 + 3] - m[1*4 + 3] * m[2*4 + 0];
	var A0212 = m[1*4 + 0] * m[2*4 + 2] - m[1*4 + 2] * m[2*4 + 0];
	var A0113 = m[1*4 + 0] * m[3*4 + 1] - m[1*4 + 1] * m[3*4 + 0];
	var A0112 = m[1*4 + 0] * m[2*4 + 1] - m[1*4 + 1] * m[2*4 + 0];
	// console.log("A1212", A1212);

	var det = m[0*4 + 0] * ( m[1*4 + 1] * A2323 - m[1*4 + 2] * A1323 + m[1*4 + 3] * A1223 ) 
	        - m[0*4 + 1] * ( m[1*4 + 0] * A2323 - m[1*4 + 2] * A0323 + m[1*4 + 3] * A0223 ) 
	        + m[0*4 + 2] * ( m[1*4 + 0] * A1323 - m[1*4 + 1] * A0323 + m[1*4 + 3] * A0123 ) 
	        - m[0*4 + 3] * ( m[1*4 + 0] * A1223 - m[1*4 + 1] * A0223 + m[1*4 + 2] * A0123 );
	// console.log("det", det);

	det = 1 / det;

	// console.log("det", det);

	return [
		 det *   ( m[1*4 + 1] * A2323 - m[1*4 + 2] * A1323 + m[1*4 + 3] * A1223 ),
		 det * - ( m[0*4 + 1] * A2323 - m[0*4 + 2] * A1323 + m[0*4 + 3] * A1223 ),
		 det *   ( m[0*4 + 1] * A2313 - m[0*4 + 2] * A1313 + m[0*4 + 3] * A1213 ),
		 det * - ( m[0*4 + 1] * A2312 - m[0*4 + 2] * A1312 + m[0*4 + 3] * A1212 ),
		 det * - ( m[1*4 + 0] * A2323 - m[1*4 + 2] * A0323 + m[1*4 + 3] * A0223 ),
		 det *   ( m[0*4 + 0] * A2323 - m[0*4 + 2] * A0323 + m[0*4 + 3] * A0223 ),
		 det * - ( m[0*4 + 0] * A2313 - m[0*4 + 2] * A0313 + m[0*4 + 3] * A0213 ),
		 det *   ( m[0*4 + 0] * A2312 - m[0*4 + 2] * A0312 + m[0*4 + 3] * A0212 ),
		 det *   ( m[1*4 + 0] * A1323 - m[1*4 + 1] * A0323 + m[1*4 + 3] * A0123 ),
		 det * - ( m[0*4 + 0] * A1323 - m[0*4 + 1] * A0323 + m[0*4 + 3] * A0123 ),
		 det *   ( m[0*4 + 0] * A1313 - m[0*4 + 1] * A0313 + m[0*4 + 3] * A0113 ),
		 det * - ( m[0*4 + 0] * A1312 - m[0*4 + 1] * A0312 + m[0*4 + 3] * A0112 ),
		 det * - ( m[1*4 + 0] * A1223 - m[1*4 + 1] * A0223 + m[1*4 + 2] * A0123 ),
		 det *   ( m[0*4 + 0] * A1223 - m[0*4 + 1] * A0223 + m[0*4 + 2] * A0123 ),
		 det * - ( m[0*4 + 0] * A1213 - m[0*4 + 1] * A0213 + m[0*4 + 2] * A0113 ),
		 det *   ( m[0*4 + 0] * A1212 - m[0*4 + 1] * A0212 + m[0*4 + 2] * A0112 ),
	];
};