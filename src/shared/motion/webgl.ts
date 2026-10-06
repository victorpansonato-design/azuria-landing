/** Compile a small, self-contained scene. Failure leaves the HTML fallback visible. */
export function createSceneProgram(gl: WebGLRenderingContext, vertex: string, fragment: string) {
  const shaders: WebGLShader[] = [];
  const program = gl.createProgram();
  if (!program) return null;
  for (const [type, source] of [[gl.VERTEX_SHADER, vertex], [gl.FRAGMENT_SHADER, fragment]] as const) {
    const shader = gl.createShader(type);
    if (!shader) { shaders.forEach((s) => gl.deleteShader(s)); gl.deleteProgram(program); return null; }
    shaders.push(shader);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      shaders.forEach((s) => gl.deleteShader(s)); gl.deleteProgram(program); return null;
    }
    gl.attachShader(program, shader);
  }
  gl.linkProgram(program);
  shaders.forEach((s) => gl.deleteShader(s));
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) { gl.deleteProgram(program); return null; }
  gl.useProgram(program);
  return program;
}
