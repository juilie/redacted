// WebGL Shader for water effect background
class WaterBackgroundShader {
    constructor(imagePath) {
        this.imagePath = imagePath;
        this.canvas = null;
        this.gl = null;
        this.program = null;
        this.texture = null;
        this.positionBuffer = null;
        this.startTime = Date.now();
        this.image = new Image();
        this.imageLoaded = false;
        
        this.init();
    }
    
    init() {
        // Create canvas
        this.canvas = document.createElement('canvas');
        this.canvas.id = 'water-background';
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.zIndex = '-1';
        
        // Replace the image-background div with canvas
        const oldBg = document.querySelector('.image-background');
        if (oldBg) {
            oldBg.parentNode.insertBefore(this.canvas, oldBg);
            oldBg.remove();
        } else {
            document.body.insertBefore(this.canvas, document.body.firstChild);
        }
        
        // Setup WebGL
        this.gl = this.canvas.getContext('webgl') || this.canvas.getContext('experimental-webgl');
        if (!this.gl) {
            console.error('WebGL not supported');
            return;
        }
        
        // Set canvas size
        this.resize();
        window.addEventListener('resize', () => this.resize());
        
        // Load image
        this.image.crossOrigin = 'anonymous';
        this.image.onload = () => {
            this.imageLoaded = true;
            this.setupShader();
        };
        this.image.src = this.imagePath;
    }
    
    resize() {
        const dpr = window.devicePixelRatio || 1;
        this.canvas.width = window.innerWidth * dpr;
        this.canvas.height = window.innerHeight * dpr;
        this.canvas.style.width = window.innerWidth + 'px';
        this.canvas.style.height = window.innerHeight + 'px';
        
        if (this.gl) {
            this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
        }
    }
    
    setupShader() {
        const vertexShaderSource = `
            attribute vec2 a_position;
            varying vec2 v_texCoord;
            
            void main() {
                gl_Position = vec4(a_position, 0.0, 1.0);
                v_texCoord = (a_position + 1.0) * 0.5;
                v_texCoord.y = 1.0 - v_texCoord.y;
            }
        `;
        
        const fragmentShaderSource = `
            precision mediump float;
            
            uniform sampler2D u_texture;
            uniform float u_time;
            uniform vec2 u_resolution;
            varying vec2 v_texCoord;
            
            // Noise function
            float noise(vec2 p) {
                return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
            }
            
            // Smooth noise
            float smoothNoise(vec2 p) {
                vec2 i = floor(p);
                vec2 f = fract(p);
                f = f * f * (3.0 - 2.0 * f);
                
                float a = noise(i);
                float b = noise(i + vec2(1.0, 0.0));
                float c = noise(i + vec2(0.0, 1.0));
                float d = noise(i + vec2(1.0, 1.0));
                
                return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
            }
            
            // Fractal noise for water ripples
            float fractalNoise(vec2 p) {
                float value = 0.0;
                float amplitude = 0.5;
                float frequency = 1.0;
                
                for (int i = 0; i < 4; i++) {
                    value += amplitude * smoothNoise(p * frequency);
                    frequency *= 2.0;
                    amplitude *= 0.5;
                }
                
                return value;
            }
            
            void main() {
                vec2 uv = v_texCoord;
                
                // Create multiple layers of water ripples (slowed down)
                float ripple1 = sin(uv.x * 8.0 + u_time * 0.3) * sin(uv.y * 6.0 + u_time * 0.25) * 0.015;
                float ripple2 = sin(uv.x * 12.0 - u_time * 0.4) * sin(uv.y * 10.0 - u_time * 0.3) * 0.01;
                float ripple3 = sin((uv.x + uv.y) * 5.0 + u_time * 0.2) * 0.008;
                
                // Add noise-based distortion for more organic water movement (slowed down)
                vec2 noiseOffset = vec2(
                    fractalNoise(uv * 3.0 + vec2(u_time * 0.12, u_time * 0.08)) - 0.5,
                    fractalNoise(uv * 3.0 + vec2(u_time * 0.1, u_time * 0.14)) - 0.5
                ) * 0.02;
                
                // Combine all distortions
                vec2 distortion = vec2(ripple1 + ripple2, ripple2 + ripple3) + noiseOffset;
                
                // Apply distortion to UV coordinates for refraction effect
                vec2 distortedUV = uv + distortion;
                
                // Sample the texture with distortion
                vec4 color = texture2D(u_texture, distortedUV);
                
                // Add subtle chromatic aberration for water-like refraction
                vec2 redOffset = distortion * 1.2;
                vec2 blueOffset = distortion * 0.8;
                float r = texture2D(u_texture, uv + redOffset).r;
                float g = color.g;
                float b = texture2D(u_texture, uv + blueOffset).b;
                
                // Mix original with chromatic aberration
                color.rgb = mix(color.rgb, vec3(r, g, b), 0.3);
                
                // Add subtle brightness variation based on ripples for depth
                float depth = (ripple1 + ripple2 + ripple3) * 2.0;
                color.rgb += depth * 0.1;
                
                // Add slight blue tint for water effect
                color.rgb = mix(color.rgb, color.rgb * vec3(0.95, 0.98, 1.05), 0.15);
                
                // Enhance contrast slightly for underwater feel
                color.rgb = (color.rgb - 0.5) * 1.1 + 0.5;
                
                // Darken the image
                color.rgb *= 0.9;
                
                gl_FragColor = color;
            }
        `;
        
        // Compile shaders
        const vertexShader = this.compileShader(this.gl.VERTEX_SHADER, vertexShaderSource);
        const fragmentShader = this.compileShader(this.gl.FRAGMENT_SHADER, fragmentShaderSource);
        
        if (!vertexShader || !fragmentShader) return;
        
        // Create program
        this.program = this.gl.createProgram();
        this.gl.attachShader(this.program, vertexShader);
        this.gl.attachShader(this.program, fragmentShader);
        this.gl.linkProgram(this.program);
        
        if (!this.gl.getProgramParameter(this.program, this.gl.LINK_STATUS)) {
            console.error('Program linking error:', this.gl.getProgramInfoLog(this.program));
            return;
        }
        
        // Setup geometry
        this.positionBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);
        const positions = [
            -1, -1,
             1, -1,
            -1,  1,
            -1,  1,
             1, -1,
             1,  1,
        ];
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(positions), this.gl.STATIC_DRAW);
        
        // Create texture
        this.texture = this.gl.createTexture();
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
        this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, this.image);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);
        
        // Start animation loop
        this.animate();
    }
    
    compileShader(type, source) {
        const shader = this.gl.createShader(type);
        this.gl.shaderSource(shader, source);
        this.gl.compileShader(shader);
        
        if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
            console.error('Shader compilation error:', this.gl.getShaderInfoLog(shader));
            this.gl.deleteShader(shader);
            return null;
        }
        
        return shader;
    }
    
    animate() {
        if (!this.program || !this.imageLoaded) {
            requestAnimationFrame(() => this.animate());
            return;
        }
        
        const time = (Date.now() - this.startTime) / 1000.0;
        
        // Use shader program
        this.gl.useProgram(this.program);
        
        // Setup attributes
        const positionLocation = this.gl.getAttribLocation(this.program, 'a_position');
        this.gl.enableVertexAttribArray(positionLocation);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);
        this.gl.vertexAttribPointer(positionLocation, 2, this.gl.FLOAT, false, 0, 0);
        
        // Setup uniforms
        const textureLocation = this.gl.getUniformLocation(this.program, 'u_texture');
        const timeLocation = this.gl.getUniformLocation(this.program, 'u_time');
        const resolutionLocation = this.gl.getUniformLocation(this.program, 'u_resolution');
        
        this.gl.activeTexture(this.gl.TEXTURE0);
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
        this.gl.uniform1i(textureLocation, 0);
        this.gl.uniform1f(timeLocation, time);
        this.gl.uniform2f(resolutionLocation, this.canvas.width, this.canvas.height);
        
        // Draw
        this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);
        
        requestAnimationFrame(() => this.animate());
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new WaterBackgroundShader('./assets/images/redacted_cover.JPG');
    });
} else {
    new WaterBackgroundShader('./assets/images/redacted_cover.JPG');
}
