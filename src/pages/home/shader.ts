export const vertex = `
attribute vec2 a_position;
varying vec4 v_fragCoord;

void main() {
  vec4 position = vec4(a_position, 1.0, 1.0);
  gl_Position = position;
  v_fragCoord = position;
}
`;

export const fragment = `precision mediump float;
#define iterations 17
#define formuparam 0.53
#define volsteps 20
#define stepsize 0.1
#define zoom   0.800
#define tile   0.850
#define speed  0.010 
#define brightness 0.0015
#define darkmatter 0.300
#define distfading 0.730
#define saturation 0.850

varying vec4 v_fragCoord;
uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

void main() {
	vec2 uv = v_fragCoord.xy / u_resolution.xy - .5;
	uv.y *= u_resolution.y / u_resolution.x;
	vec3 dir = vec3(uv * zoom, 1.);
	float time = u_time * speed + .25;

	float a1 = .5 + u_mouse.x / u_resolution.x * 2.;
	float a2 = .8 + u_mouse.y / u_resolution.y * 2.;
	mat2 rot1 = mat2(cos(a1), sin(a1), -sin(a1), cos(a1));
	mat2 rot2 = mat2(cos(a2), sin(a2), -sin(a2), cos(a2));
	dir.xz *= rot1;
	dir.xy *= rot2;
	vec3 from = vec3(1., .5, 0.5);
	from += vec3(time * 2., time, -2.);
	from.xz *= rot1;
	from.xy *= rot2;
	
	float s = 0.1, fade = 1.;
	vec3 v = vec3(0.);
	for (int r = 0; r < volsteps; r++) {
		vec3 p= from + s * dir * .5;
		p = abs(vec3(tile) - mod(p, vec3(tile * 2.)));
		float pa, a = pa = 0.;
		for (int i = 0; i < iterations; i++) { 
			p = abs(p) / dot(p, p) - formuparam;
			a += abs(length(p) - pa);
			pa = length(p);
		}
		float dm = max(0., darkmatter - a * a *.001);
		a *= a * a / 3.;
		if (r > 6) fade *= 1. - dm;
		v += fade;
		v += vec3(s, s * s, s * s * s * s) * a * brightness * fade;
		fade *= distfading;
		s += stepsize;
	}
	v = mix(vec3(length(v)), v, saturation);
	gl_FragColor = vec4(v * .01, 1);	
}
`;