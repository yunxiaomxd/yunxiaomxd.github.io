export function createProgram(gl: WebGLRenderingContext, vertexShader: WebGLShader, fragmentShader: WebGLShader) {
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

export function createShader(gl: WebGLRenderingContext, type: number, source: string) {
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

export function init(ref: React.RefObject<HTMLCanvasElement>) {
  const canvas = ref.current as HTMLCanvasElement;
  canvas.width = 1080;
  canvas.height = 640;
  const gl = canvas.getContext('webgl') as WebGLRenderingContext;

  return { canvas, gl };
}

export const uniforms = {
  u_time: 1,
  u_resolution: [1, 1],
  u_mouse: [1, 1],
};

export const scene = [
  -1, 1, 0,
  1, 1, 0,
  -1, -1, 0,
  1, 1, 0,
  -1, -1, 0,
  1, -1, 0,
];