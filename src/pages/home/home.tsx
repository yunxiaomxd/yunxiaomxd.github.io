import { useEffect, useRef } from "react"
import { fragment, vertex } from "./shader";
import { createShader, createProgram, scene, uniforms, init } from "./gl";

import { Header } from "../../components";

import styles from './styles.module.scss';

export default function Home() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (ref.current) {
      const { gl } = init(ref);
    
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
        uniforms.u_time += 0.01;
    
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
    <>
      <canvas className={styles.canvas} ref={ref} />
      <Header />
    </>
  )
}