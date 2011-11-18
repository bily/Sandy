/**
 * Sandy.shaderSource
 * package
 * 提供常用的shader 源码
 */
 
Sandy.register('.shaderSource', function (Sandy) {
    
    var gl = Sandy.gl;
    
    this.CopyFilter = [
        "//#name CopyFilter",
        "//#description All this shader does is to render a texture (typically a render texture) pixel-to-pixel.",
        "//#description It is useful in effects like Persistence",
        "//#author bartekd",

        "//#include CommonFilterInclude",

        "//#vertex",
        "//#include BasicFilterVertex",

        "//#fragment",
        "uniform sampler2D uTexture;",

        "varying vec2 vTextureCoord;",

        "void main(void) {",
        "vec4 p = texture2D(uTexture, vTextureCoord);",
        "gl_FragColor = vec4(p.rgb, 1.0);",
        "}",
    ""].join("\n");

    this.Depth = [
        "//#name Depth",
        "//#author bartekd",

        "//#include CommonInclude",

        "//#vertex",
        "//#include VertexInclude",
        "varying float depth;",

        "void main(void) {",
        "vec4 p = mMatrix * vec4(aVertexPosition, 1.0);",
        "gl_Position = pMatrix * vMatrix * p;",
        "depth = gl_Position.z/gl_Position.w;",
        "}",

        "//#fragment",
        "varying float depth;",

        "void main(void) {",
        "float d = 1.0 - depth;",

        "gl_FragColor = vec4(d, d, d, 1.0);",
        "}",
    ""].join("\n");

    this.Gouraud = [
        "//#name Gouraud",
        "//#author bartekd",

        "//#include CommonInclude",

        "//#vertex",
        "//#include VertexInclude",
        "//#include Lights",
        "uniform float specularIntensity;",
        "uniform float shininess;",

        "varying vec3 vLight;",
        "varying vec2 vTextureCoord;",

        "void main(void) {",
        "vec4 p = mMatrix * vec4(aVertexPosition, 1.0);",
        "gl_Position = pMatrix * vMatrix * p;",
        "vTextureCoord = getTextureCoord(aTextureCoord);",
        "vec3 n = normalize( nMatrix * aVertexNormal );",
        "vLight = computeLights(p, n, specularIntensity, shininess);",
        "}",

        "//#fragment",
        "uniform vec4 color;",
        "uniform sampler2D colorTexture;",
        "uniform bool hasColorTexture;",

        "varying vec3 vLight;",
        "varying vec2 vTextureCoord;",

        "void main(void) {",
        "vec4 tc = color;",
        "if(hasColorTexture) tc *= texture2D(colorTexture, vTextureCoord);",
        "gl_FragColor = vec4(tc.rgb * vLight, color.a);",
        "}",
    ""].join("\n");

    this.Lightmap = [
        "//#name Lightmap",
        "//#author bartekd",

        "//#include CommonInclude",

        "//#vertex",
        "//#include VertexInclude",
        "uniform vec4 lightmapAtlas;",

        "varying vec2 vTextureCoord;",
        "varying vec2 vTextureCoord2;",

        "void main(void) {",
        "vTextureCoord = getTextureCoord(aTextureCoord);",
        "vTextureCoord2 = aTextureCoord2 * lightmapAtlas.xy + lightmapAtlas.zw;",

        "gl_Position = mvpMatrix() * vec4(aVertexPosition, 1.0);",
        "}",

        "//#fragment",
        "uniform vec4 color;",
        "uniform sampler2D colorTexture;",
        "uniform sampler2D lightmapTexture;",

        "varying vec2 vTextureCoord;",
        "varying vec2 vTextureCoord2;",

        "void main(void) {",

        "vec4 tc = texture2D(colorTexture, vTextureCoord);",
        "vec4 lm = texture2D(lightmapTexture, vTextureCoord2);",

        "if(tc.a < 0.1) discard;",
        "else gl_FragColor = vec4(color.rgb * tc.rgb * lm.rgb, 1.0);",
        "}",
    ""].join("\n");

    this.Normal2Color = [
        "//#name Normal2Color",
        "//#author bartekd",

        "//#include CommonInclude",

        "//#vertex",
        "//#include VertexInclude",
        "varying vec3 vColor;",

        "void main(void) {",
        "gl_Position = mvpMatrix() * vec4(aVertexPosition, 1.0);",
        "vColor = normalize( aVertexNormal / 2.0 + vec3(0.5) );",
        "}",

        "//#fragment",
        "varying vec3 vColor;",

        "void main(void) {",
        "gl_FragColor = vec4(vColor, 1.0);",
        "}",
    ""].join("\n");

    this.Phong = [
        "//#name Phong",
        "//#description Classic phong shader",
        "//#author bartekd",

        "//#include CommonInclude",

        "//#vertex",
        "//#include VertexInclude",
        "varying vec4 vPosition;",
        "varying vec3 vLight;",
        "varying vec2 vTextureCoord;",
        "varying vec3 vNormal;",

        "void main(void) {",
        "vTextureCoord = getTextureCoord(aTextureCoord);",
        "vNormal = nMatrix * aVertexNormal;",
        "vPosition = mMatrix * vec4(aVertexPosition, 1.0);",
        "gl_Position = pMatrix * vMatrix * vPosition;",
        "gl_PointSize = 5.0;",
        "}",

        "//#fragment",
        "//#include Lights",
        "uniform vec4 color;",
        "uniform sampler2D colorTexture;",
        "uniform bool hasColorTexture;",
        "uniform float specularIntensity;",
        "uniform float shininess;",

        "varying vec4 vPosition;",
        "varying vec3 vLight;",
        "varying vec2 vTextureCoord;",
        "varying vec3 vNormal;",

        "void main(void) {",
        "vec4 tc = color;",
        "if(hasColorTexture) tc *= texture2D(colorTexture, vTextureCoord);",
        "vec3 l = computeLights(vPosition, vNormal, specularIntensity, shininess);",
        "gl_FragColor = vec4(tc.rgb * l, color.a);",
        "}",
    ""].join("\n");

    this.Reflective = [
        "//#name Reflective",
        "//#description Based on Cg tutorial: http://http.developer.nvidia.com/CgTutorial/cg_tutorial_chapter07.html",
        "//#author bartekd",

        "//#include CommonInclude",

        "//#vertex",
        "//#include VertexInclude",

        "varying vec3 vNormal;",
        "varying vec3 refVec;",

        "void main(void) {",
        "gl_Position = mvpMatrix() * vec4(aVertexPosition, 1.0);",
        "vNormal = normalize(nMatrix * aVertexNormal);",
        "vec3 incident = normalize( (vec4(aVertexPosition, 1.0) * mMatrix).xyz - uEyePosition);",
        "refVec = reflect(incident, vNormal);",
        "}",

        "//#fragment",
        "uniform samplerCube uCubemap;",

        "varying vec3 refVec;",

        "void main(void) {",
        "gl_FragColor = textureCube(uCubemap, refVec);",
        "}",
    ""].join("\n");

    this.Skybox = [
        "//#name Skybox",
        "//#author bartekd",

        "//#include CommonInclude",

        "//#vertex",
        "//#include VertexInclude",
        "uniform float mid;",

        "varying vec3 vVertexPosition;",

        "void main(void) {",
        "gl_Position = pMatrix * vMatrix * vec4(uEyePosition + aVertexPosition * mid, 1.0);",
        "vVertexPosition = aVertexPosition;",
        "}",

        "//#fragment",
        "uniform samplerCube uCubemap;",

        "varying vec3 vVertexPosition;",

        "void main(void) {",
        "gl_FragColor = textureCube(uCubemap, vVertexPosition);",
        "}",
    ""].join("\n");

    this.Toon = [
        "//#name Toon",
        "//#author bartekd",

        "//#include CommonInclude",

        "//#vertex",
        "//#include VertexInclude",
        "//#include Lights",
        "varying float vLight;",
        "varying vec2 vTextureCoord;",

        "void main(void) {",
        "vec4 p = mMatrix * vec4(aVertexPosition, 1.0);",
        "gl_Position = pMatrix * vMatrix * p;",
        "gl_PointSize = 10.0;",
        "vTextureCoord = getTextureCoord(aTextureCoord);",
        "vec3 n = normalize( nMatrix * aVertexNormal );",
        "vLight = computeLights(p, n, 0.0, 0.0).r;",
        "}",

        "//#fragment",
        "uniform vec4 uColor;",
        "uniform sampler2D uColorSampler;",

        "varying float vLight;",
        "varying vec2 vTextureCoord;",

        "void main(void) {",
        "vec4 tc = texture2D(uColorSampler, vec2(vLight, 0.5) );",
        "gl_FragColor = vec4(tc.rgb, 1.0);",
        "}",
    ""].join("\n");

    this.Vignette = [
        "//#name Vignette",
        "//#author bartekd",

        "//#vertex",
        "//#include BasicFilterVertex",

        "//#fragment",
        "//#include CommonFilterInclude",
        "uniform sampler2D uTexture;",
        "varying vec2 vTextureCoord;",

        "void main(void) {",
        "vec2 m = vec2(0.5, 0.5);",
        "float d = distance(m, vTextureCoord) * 1.0;",
        "vec3 c = texture2D(uTexture, vTextureCoord).rgb * (1.0 - d * d);",
        "gl_FragColor = vec4(c.rgb, 1.0);",
        "}",
    ""].join("\n");

    this.BasicFilterVertex = [
        "//#name BasicFilterVertex",
        "//#description A basic vertex shader for filters that use a full screen quad and have all the logic in fragment shader",
        "attribute vec2 aVertexPosition;",
        "attribute vec2 aTextureCoord;",

        "varying vec2 vTextureCoord;",

        "void main(void) {",
        "gl_Position = vec4(aVertexPosition, 0.0, 1.0);",
        "vTextureCoord = aTextureCoord;",
        "}",

    ""].join("\n");

    this.CommonFilterInclude = [
        "//#name CommonFilterInclude",
        "//#description Common uniforms and function for filters",
        "#ifdef GL_ES",
        "precision highp float;",
        "#endif",

        "uniform float uTime;",

        "float whiteNoise(vec2 uv, float scale) {",
        "float x = (uv.x + 0.2) * (uv.y + 0.2) * (10000.0 + uTime);",
        "x = mod( x, 13.0 ) * mod( x, 123.0 );",
        "float dx = mod( x, 0.005 );",
        "return clamp( 0.1 + dx * 100.0, 0.0, 1.0 ) * scale;",
        "}",
    ""].join("\n");

    this.CommonInclude = [
        "//#name CommonInclude",
        "//#description Collection of common uniforms, functions and structs to include in shaders (both fragment and vertex)",
        "#ifdef GL_ES",
        "precision highp float;",
        "#endif",

        "uniform float uTime;",
        "uniform mat4 mMatrix;",
        "uniform mat4 vMatrix;",
        "uniform mat3 nMatrix;",
        "uniform mat4 pMatrix;",
        "uniform vec3 uEyePosition;",
        "uniform vec4 uTileOffset;",

        "mat4 mvpMatrix() {",
        "return pMatrix * vMatrix * mMatrix;",
        "}",

        "mat4 mvMatrix() {",
        "return vMatrix * mMatrix;",
        "}",

        "float luminance(vec3 c) {",
        "return c.r * 0.299 + c.g * 0.587 + c.b * 0.114;",
        "}",

        "float brightness(vec3 c) {",
        "return c.r * 0.2126 + c.g * 0.7152 + c.b * 0.0722;",
        "}",

        "vec2 getTextureCoord(vec2 uv) {",
        "return uv * uTileOffset.xy + uTileOffset.zw;",
        "}",
    ""].join("\n");

    this.Lights = [
        "//#name Lights",
        "//#description Collection of light equations with the necessary",
        "//#description Requires CommonInclude",

        "struct lightSource {",
        "int type;",
        "vec3 direction;",
        "vec3 color;",
        "vec3 position;",
        "float intensity;",
        "};",

        "uniform lightSource uLight[4];",

        "const float C1 = 0.429043;",
        "const float C2 = 0.511664;",
        "const float C3 = 0.743125;",
        "const float C4 = 0.886227;",
        "const float C5 = 0.247708;",

        "//const vec3 L00  = vec3( 0.871297,  0.875222,  0.864470);",
        "//const vec3 L1m1 = vec3( 0.175058,  0.245335,  0.312891);",
        "//const vec3 L10  = vec3( 0.034675,  0.036107,  0.037362);",
        "//const vec3 L11  = vec3(-0.004629, -0.029448, -0.048028);",
        "//const vec3 L2m2 = vec3(-0.120535, -0.121160, -0.117507);",
        "//const vec3 L2m1 = vec3( 0.003242,  0.003624,  0.007511);",
        "//const vec3 L20  = vec3(-0.028667, -0.024926, -0.020998);",
        "//const vec3 L21  = vec3(-0.077539, -0.086325, -0.091591);",
        "//const vec3 L22  = vec3(-0.161784, -0.191783, -0.219152);",

        "const vec3 L00  = vec3( 0.078908,  0.043710,  0.054161);",
        "const vec3 L1m1 = vec3( 0.039499,  0.034989,  0.060488);",
        "const vec3 L10  = vec3(-0.033974, -0.018236, -0.026940);",
        "const vec3 L11  = vec3(-0.029213, -0.005562,  0.000944);",
        "const vec3 L2m2 = vec3(-0.011141, -0.005090, -0.012231);",
        "const vec3 L2m1 = vec3(-0.026240, -0.022401, -0.047479);",
        "const vec3 L20  = vec3(-0.015570, -0.009471, -0.014733);",
        "const vec3 L21  = vec3( 0.056014,  0.021444,  0.013915);",
        "const vec3 L22  = vec3( 0.021205, -0.005432, -0.030374);",

        "vec3 sphericalHarmonics(vec3 n, lightSource ls) {",

        "vec3 c =  C1 * L22 * (n.x * n.x - n.y * n.y) +",
        "C3 * L20 * n.z * n.z +",
        "C4 * L00 -",
        "C5 * L20 +",
        "2.0 * C1 * L2m2 * n.x * n.y +",
        "2.0 * C1 * L21  * n.x * n.z +",
        "2.0 * C1 * L2m1 * n.y * n.z +",
        "2.0 * C2 * L11  * n.x +",
        "2.0 * C2 * L1m1 * n.y +",
        "2.0 * C2 * L10  * n.z;",

        "c *= ls.intensity;",
        "return c;",
        "}",

        "vec3 hemisphere(vec4 p, vec3 n, lightSource ls) {",
        "vec3 lv = normalize(ls.position - p.xyz);",
        "return ls.color * (dot(n, lv) * 0.5 + 0.5);",
        "}",

        "vec3 phong(vec4 p, vec3 n, float si, float sh, lightSource ls){",
        "vec3 ld;",

        "if(ls.type == 1) ld = -ls.direction;",
        "else if(ls.type == 2) ld = normalize(ls.position - p.xyz);",

        "float dif = max(dot(n, ld), 0.0);",

        "float spec = 0.0;",

        "if(si > 0.0) {",
        "vec3 eyed = normalize(uEyePosition - p.xyz);",
        "vec3 refd = reflect(-ld, n);",
        "spec = pow(max(dot(refd, eyed), 0.0), sh) * si;",
        "};",

        "return ls.color * dif + ls.color * spec;",
        "}",

        "vec3 singleLight(vec4 p, vec3 n, float si, float sh, lightSource ls) {",
        "if(ls.type == 0) {",
        "return ls.color;",
        "} else if(ls.type == 1 || ls.type == 2) {",
        "return phong(p, n, si, sh, ls);",
        "} else if(ls.type == 3) {",
        "return hemisphere(p, n, ls);",
        "} else if(ls.type == 4) {",
        "return sphericalHarmonics(n, ls);",
        "} else {",
        "return vec3(0);",
        "}",
        "}",

        "vec3 computeLights(vec4 p, vec3 n, float si, float sh) {",
        "vec3 s = vec3(0);",
        "s += singleLight(p, n, si, sh, uLight[0]);",
        "s += singleLight(p, n, si, sh, uLight[1]);",
        "s += singleLight(p, n, si, sh, uLight[2]);",
        "s += singleLight(p, n, si, sh, uLight[3]);",
        "return s;",
        "}",



    ""].join("\n");

    this.Modifiers = [
        "//#name Modifiers",
        "//#description A collection of modifier functions for geometry (only bend for now)",

        "vec3 bend(vec3 ip, float ba, vec2 b, float o, float a) {",
        "vec3 op = ip;",

        "ip.x = op.x * cos(a) - op.y * sin(a);",
        "ip.y = op.x * sin(a) + op.y * cos(a);",

        "if(ba != 0.0) {",
        "float radius = b.y / ba;",
        "float onp = (ip.x - b.x) / b.y - o;",
        "ip.z = cos(onp * ba) * radius - radius;",
        "ip.x = (b.x + b.y * o) + sin(onp * ba) * radius;",
        "}",

        "op = ip;",
        "ip.x = op.x * cos(-a) - op.y * sin(-a);",
        "ip.y = op.x * sin(-a) + op.y * cos(-a);",

        "return ip;",
        "}",
    ""].join("\n");

    this.VertexInclude = [
        "//#name VertexInclude",
        "//#description Common attributes for a mesh - include this in a vertex shader so you don't rewrite this over and over again",
        "attribute vec3 aVertexPosition;",
        "attribute vec3 aVertexNormal;",
        "attribute vec2 aTextureCoord;",
        "attribute vec2 aTextureCoord2;",
        "attribute vec4 aVertexColor;",
    ""].join("\n");


});