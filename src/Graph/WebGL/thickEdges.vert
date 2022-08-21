uniform mat4 matrix;
uniform float thickness;
attribute vec2 position;
attribute vec3 v_color;

attribute vec2 edge_vector;
attribute vec2 vertex_vector;

varying vec3 blend_color;

void main () {
	float sign = vertex_vector[0];
	vec2 side = normalize(vec2(edge_vector.y * sign, -edge_vector.x * sign)) * thickness;
	gl_Position = matrix * vec4(side + position, 1, 1);
	blend_color = v_color;
}
