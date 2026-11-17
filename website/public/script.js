(() => {
  const root = document.documentElement;
  root.classList.add('js');

  const year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());

  const menuButton = document.querySelector('.menu-toggle');
  const nav = document.getElementById('primary-nav');
  if (menuButton && nav) {
    const closeMenu = () => {
      menuButton.setAttribute('aria-expanded', 'false');
      menuButton.setAttribute('aria-label', 'Open navigation');
      nav.classList.remove('is-open');
    };
    menuButton.addEventListener('click', () => {
      const open = menuButton.getAttribute('aria-expanded') !== 'true';
      menuButton.setAttribute('aria-expanded', String(open));
      menuButton.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
      nav.classList.toggle('is-open', open);
    });
    nav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
    document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
  }

  const revealItems = document.querySelectorAll('[data-reveal]');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealItems.forEach(item => item.classList.add('is-visible'));
  } else {
    revealItems.forEach(item => {
      const delay = Number(item.getAttribute('data-reveal-delay') || 0);
      item.style.setProperty('--reveal-delay', Math.min(delay, 240) + 'ms');
    });
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, {threshold: 0.12, rootMargin: '0px 0px -35px 0px'});
    revealItems.forEach(item => observer.observe(item));
  }

  const canvas = document.getElementById('operations-core');
  const visual = document.querySelector('.hero-visual');
  if (!canvas || !visual) return;
  const gl = canvas.getContext('webgl', {alpha: true, antialias: true, depth: true, powerPreference: 'low-power'});
  if (!gl) return;

  const vertexSource = 'attribute vec3 aPosition; attribute vec3 aNormal; uniform mat4 uMVP; uniform mat4 uModel; uniform float uTime; uniform float uPointSize; varying vec3 vNormal; varying vec3 vPosition; void main(){ vec3 p=aPosition; p += aNormal * 0.012 * sin(uTime * 1.15 + aPosition.y * 7.0 + aPosition.x * 4.0); vec4 world = uModel * vec4(p, 1.0); vPosition = world.xyz; vNormal = normalize(mat3(uModel) * aNormal); gl_Position = uMVP * vec4(p, 1.0); gl_PointSize = uPointSize; }';
  const fragmentSource = 'precision mediump float; uniform vec3 uColor; uniform vec3 uAccent; uniform float uAlpha; uniform float uPointSize; varying vec3 vNormal; varying vec3 vPosition; void main(){ if(uPointSize > 0.0){ vec2 q = gl_PointCoord - vec2(0.5); if(dot(q,q) > 0.25) discard; } vec3 n = normalize(vNormal); vec3 light = normalize(vec3(-0.45,0.72,0.62)); float diffuse = max(dot(n,light),0.0); float rim = pow(1.0 - max(dot(n,normalize(vec3(0.0,0.0,1.0))),0.0),2.1); float sheen = pow(max(dot(reflect(-light,n),vec3(0.0,0.0,1.0)),0.0),18.0); vec3 color = uColor * (0.28 + diffuse * 0.55) + uAccent * (rim * 0.82 + sheen * 0.42); gl_FragColor = vec4(color,uAlpha); }';

  const compile = (type, source) => {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      gl.deleteShader(shader);
      throw new Error('WebGL shader compilation failed');
    }
    return shader;
  };

  let program;
  try {
    program = gl.createProgram();
    gl.attachShader(program, compile(gl.VERTEX_SHADER, vertexSource));
    gl.attachShader(program, compile(gl.FRAGMENT_SHADER, fragmentSource));
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error('WebGL program link failed');
  } catch (error) {
    console.warn('STACKPROOF 3D visual fallback:', error);
    return;
  }

  const loc = {
    position: gl.getAttribLocation(program, 'aPosition'),
    normal: gl.getAttribLocation(program, 'aNormal'),
    mvp: gl.getUniformLocation(program, 'uMVP'),
    model: gl.getUniformLocation(program, 'uModel'),
    time: gl.getUniformLocation(program, 'uTime'),
    color: gl.getUniformLocation(program, 'uColor'),
    accent: gl.getUniformLocation(program, 'uAccent'),
    alpha: gl.getUniformLocation(program, 'uAlpha'),
    pointSize: gl.getUniformLocation(program, 'uPointSize')
  };

  const sphere = (() => {
    const lat = window.innerWidth < 760 ? 17 : 25;
    const lon = window.innerWidth < 760 ? 26 : 38;
    const vertices = [], normals = [], indices = [];
    for (let y = 0; y <= lat; y++) {
      const phi = y * Math.PI / lat;
      for (let x = 0; x <= lon; x++) {
        const theta = x * Math.PI * 2 / lon;
        const nx = Math.sin(phi) * Math.cos(theta);
        const ny = Math.cos(phi);
        const nz = Math.sin(phi) * Math.sin(theta);
        vertices.push(nx * 0.82, ny * 0.82, nz * 0.82);
        normals.push(nx, ny, nz);
      }
    }
    for (let y = 0; y < lat; y++) {
      for (let x = 0; x < lon; x++) {
        const a = y * (lon + 1) + x;
        const b = a + lon + 1;
        indices.push(a, b, a + 1, b, b + 1, a + 1);
      }
    }
    return {vertices: new Float32Array(vertices), normals: new Float32Array(normals), indices: new Uint16Array(indices)};
  })();

  const makeBuffer = (target, data) => {
    const buffer = gl.createBuffer();
    gl.bindBuffer(target, buffer);
    gl.bufferData(target, data, gl.STATIC_DRAW);
    return buffer;
  };
  const spherePosition = makeBuffer(gl.ARRAY_BUFFER, sphere.vertices);
  const sphereNormal = makeBuffer(gl.ARRAY_BUFFER, sphere.normals);
  const sphereIndex = makeBuffer(gl.ELEMENT_ARRAY_BUFFER, sphere.indices);

  const ringData = (count, radius) => {
    const positions = [], normals = [];
    for (let i = 0; i < count; i++) {
      const angle = i * Math.PI * 2 / count;
      positions.push(Math.cos(angle) * radius, 0, Math.sin(angle) * radius);
      normals.push(0, 1, 0);
    }
    return {positions: new Float32Array(positions), normals: new Float32Array(normals), count};
  };
  const ringA = ringData(144, 1.19);
  const ringB = ringData(144, 1.08);
  const ringAPosition = makeBuffer(gl.ARRAY_BUFFER, ringA.positions);
  const ringANormal = makeBuffer(gl.ARRAY_BUFFER, ringA.normals);
  const ringBPosition = makeBuffer(gl.ARRAY_BUFFER, ringB.positions);
  const ringBNormal = makeBuffer(gl.ARRAY_BUFFER, ringB.normals);

  const nodePositions = new Float32Array([
    0.0,0.82,0.0, 0.58,0.48,0.36, -0.62,0.32,0.27, 0.32,-0.64,0.28,
    -0.42,-0.52,-0.42, 0.58,-0.22,-0.42, -0.16,0.12,0.79, 0.0,-0.82,0.0
  ]);
  const nodeNormals = new Float32Array(nodePositions.length);
  for (let i = 0; i < nodePositions.length; i += 3) {
    const length = Math.hypot(nodePositions[i],nodePositions[i+1],nodePositions[i+2]) || 1;
    nodeNormals[i] = nodePositions[i]/length;
    nodeNormals[i+1] = nodePositions[i+1]/length;
    nodeNormals[i+2] = nodePositions[i+2]/length;
  }
  const nodePosition = makeBuffer(gl.ARRAY_BUFFER, nodePositions);
  const nodeNormal = makeBuffer(gl.ARRAY_BUFFER, nodeNormals);

  const identity = () => new Float32Array([1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]);
  const multiply = (a,b) => {
    const out = new Float32Array(16);
    for (let c=0;c<4;c++) for (let r=0;r<4;r++) out[c*4+r] = a[r]*b[c*4] + a[4+r]*b[c*4+1] + a[8+r]*b[c*4+2] + a[12+r]*b[c*4+3];
    return out;
  };
  const rotateX = angle => { const c=Math.cos(angle),s=Math.sin(angle),m=identity();m[5]=c;m[6]=s;m[9]=-s;m[10]=c;return m; };
  const rotateY = angle => { const c=Math.cos(angle),s=Math.sin(angle),m=identity();m[0]=c;m[2]=-s;m[8]=s;m[10]=c;return m; };
  const rotateZ = angle => { const c=Math.cos(angle),s=Math.sin(angle),m=identity();m[0]=c;m[1]=s;m[4]=-s;m[5]=c;return m; };
  const translateZ = z => { const m=identity();m[14]=z;return m; };
  const perspective = (fov,aspect,near,far) => {
    const f=1/Math.tan(fov/2),nf=1/(near-far),m=new Float32Array(16);
    m[0]=f/aspect;m[5]=f;m[10]=(far+near)*nf;m[11]=-1;m[14]=(2*far*near)*nf;
    return m;
  };

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let visible = true, paused = document.hidden, frame = 0, start = performance.now();
  let pointerX = 0, pointerY = 0, targetX = 0, targetY = 0, width = 1, height = 1;
  const mobile = () => window.innerWidth < 760;

  const resize = () => {
    const rect = visual.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, mobile() ? 1.15 : 1.5);
    width = Math.max(1, Math.round(rect.width * dpr));
    height = Math.max(1, Math.round(rect.height * dpr));
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width; canvas.height = height;
      gl.viewport(0,0,width,height);
      if (reduced && visible) draw(performance.now());
    }
  };

  const bindMesh = (positionBuffer, normalBuffer) => {
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.enableVertexAttribArray(loc.position);
    gl.vertexAttribPointer(loc.position,3,gl.FLOAT,false,0,0);
    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
    gl.enableVertexAttribArray(loc.normal);
    gl.vertexAttribPointer(loc.normal,3,gl.FLOAT,false,0,0);
  };

  const draw = now => {
    if (!visible || paused) return;
    const time = reduced ? 0 : (now - start) / 1000;
    pointerX += (targetX - pointerX) * 0.045;
    pointerY += (targetY - pointerY) * 0.045;
    const drift = reduced ? 0 : time * 0.16;
    const model = multiply(translateZ(-3.15), multiply(rotateY(drift + pointerX * 0.48), rotateX(-0.16 + pointerY * 0.36)));
    const proj = perspective(0.78, width / Math.max(1,height), 0.1, 30);
    const mvp = multiply(proj, model);

    gl.clearColor(0,0,0,0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);
    gl.useProgram(program);
    gl.uniformMatrix4fv(loc.mvp,false,mvp);
    gl.uniformMatrix4fv(loc.model,false,model);
    gl.uniform1f(loc.time,time);
    gl.uniform1f(loc.pointSize,0);
    gl.uniform3f(loc.color,0.12,0.19,0.13);
    gl.uniform3f(loc.accent,0.65,0.95,0.02);
    gl.uniform1f(loc.alpha,0.98);
    bindMesh(spherePosition,sphereNormal);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,sphereIndex);
    gl.drawElements(gl.TRIANGLES,sphere.indices.length,gl.UNSIGNED_SHORT,0);

    const ringModelA = multiply(translateZ(-3.15), multiply(rotateY(-drift*0.7 + pointerX*0.2), multiply(rotateZ(0.28 + pointerY*0.08),rotateX(1.12))));
    gl.uniformMatrix4fv(loc.model,false,ringModelA);
    gl.uniformMatrix4fv(loc.mvp,false,multiply(proj,ringModelA));
    gl.uniform1f(loc.alpha,0.42);
    gl.uniform3f(loc.color,0.18,0.24,0.13);
    gl.uniform3f(loc.accent,0.58,0.92,0.02);
    bindMesh(ringAPosition,ringANormal);
    gl.drawArrays(gl.LINE_LOOP,0,ringA.count);

    const ringModelB = multiply(translateZ(-3.15), multiply(rotateY(drift*0.55), multiply(rotateZ(-0.72),rotateX(0.54))));
    gl.uniformMatrix4fv(loc.model,false,ringModelB);
    gl.uniformMatrix4fv(loc.mvp,false,multiply(proj,ringModelB));
    gl.uniform1f(loc.alpha,0.25);
    bindMesh(ringBPosition,ringBNormal);
    gl.drawArrays(gl.LINE_LOOP,0,ringB.count);

    gl.uniformMatrix4fv(loc.model,false,model);
    gl.uniformMatrix4fv(loc.mvp,false,mvp);
    gl.uniform1f(loc.pointSize,mobile()?4:5);
    gl.uniform1f(loc.alpha,0.92);
    gl.uniform3f(loc.color,0.72,0.98,0.12);
    bindMesh(nodePosition,nodeNormal);
    gl.drawArrays(gl.POINTS,0,nodePositions.length/3);

    if (!reduced) frame = requestAnimationFrame(draw);
  };

  const onPointer = event => {
    const rect = visual.getBoundingClientRect();
    targetX = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
    targetY = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
    if (reduced) draw(performance.now());
  };
  visual.addEventListener('pointermove',onPointer,{passive:true});
  visual.addEventListener('pointerleave',() => {targetX=0;targetY=0;if(reduced)draw(performance.now());});
  const intersection = new IntersectionObserver(entries => {
    visible = entries[0].isIntersecting;
    if (visible && !paused && !reduced && !frame) frame = requestAnimationFrame(draw);
    if (!visible && frame) {cancelAnimationFrame(frame);frame=0;}
    if (visible && reduced) draw(performance.now());
  },{threshold:0.05});
  intersection.observe(visual);
  document.addEventListener('visibilitychange',() => {
    paused = document.hidden;
    if (paused && frame) {cancelAnimationFrame(frame);frame=0;}
    if (!paused && visible) {if(reduced)draw(performance.now());else if(!frame)frame=requestAnimationFrame(draw);}
  });
  window.addEventListener('resize',resize,{passive:true});
  resize();
  visual.classList.add('core-ready');
  if (reduced) draw(performance.now());
  else if (!paused) frame = requestAnimationFrame(draw);
})();