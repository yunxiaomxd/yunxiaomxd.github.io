import { useEffect, useRef } from "react"

function createProgram(gl: WebGLRenderingContext, vertexShader: WebGLShader, fragmentShader: WebGLShader) {
  const program = gl.createProgram() as WebGLProgram;
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  const success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (success) {
    return program;
  }
 
  console.log(gl.getProgramInfoLog(program));
  gl.deleteProgram(program);
}

function createShader(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type) as WebGLShader;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (success) {
    return shader;
  }

  console.log(gl.getShaderInfoLog(shader));
  gl.deleteShader(shader);
}

const vertex = `
attribute vec2 a_position;
varying vec4 v_fragCoord;

void main() {
  vec4 position = vec4(a_position, 1.0, 1.0);
  gl_Position = position;
  v_fragCoord = position;
}
`;

const fragment = `precision mediump float;
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

const uniforms = {
  u_time: 1,
  u_resolution: [1, 1],
  u_mouse: [1, 1],
};

const scene = [
  -1, 1, 0,
  1, 1, 0,
  -1, -1, 0,
  1, 1, 0,
  -1, -1, 0,
  1, -1, 0,
];

export default function Home() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (ref.current) {
      const canvas = ref.current;
      canvas.width = document.documentElement.offsetWidth;
      canvas.height = document.documentElement.offsetHeight;;
      const gl = canvas.getContext('webgl') as WebGLRenderingContext;
    
      gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
    
      const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertex) as WebGLShader;
      const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragment) as WebGLShader;
    
      const program = createProgram(gl, vertexShader, fragmentShader) as WebGLProgram;
      gl.useProgram(program);
    
      const positionLocation = gl.getAttribLocation(program, 'a_position');
      const positionBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(scene), gl.STATIC_DRAW);
      gl.enableVertexAttribArray(positionLocation);
    
      const uTimeLocation = gl.getUniformLocation(program, 'u_time');
      const uResolutionLocation = gl.getUniformLocation(program, 'u_resolution');
      const uMouseLocation = gl.getUniformLocation(program, 'u_mouse');
    
      const render = () => {
        gl.useProgram(program);
        uniforms.u_time += 0.05;
    
        gl.uniform1f(uTimeLocation, uniforms.u_time);
        gl.uniform2fv(uResolutionLocation, uniforms.u_resolution);
        gl.uniform2fv(uMouseLocation, uniforms.u_mouse);
    
        const size = 3;
        const type = gl.FLOAT;
        const normalize = false;
        const stride = 0;
        const offset = 0;
        gl.vertexAttribPointer(positionLocation, size, type, normalize, stride, offset);
      
        const primitiveType = gl.TRIANGLES;
        const count = 6;
        gl.drawArrays(primitiveType, offset, count);
    
        requestAnimationFrame(render);
      };
    
      render();
    }
  }, [ref]);

  return (
    <div>
      <canvas ref={ref} />
    </div>
  )
}