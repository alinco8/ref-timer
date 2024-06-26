// vite.config.ts
import { vitePlugin as remix } from "file:///Users/ali/Desktop/refresfing-timer/node_modules/@remix-run/dev/dist/index.js";
import { installGlobals } from "file:///Users/ali/Desktop/refresfing-timer/node_modules/@remix-run/node/dist/index.js";
import { defineConfig } from "file:///Users/ali/Desktop/refresfing-timer/node_modules/vite/dist/node/index.js";
import tsconfigPaths from "file:///Users/ali/Desktop/refresfing-timer/node_modules/vite-tsconfig-paths/dist/index.mjs";
installGlobals();
var vite_config_default = defineConfig({
  plugins: [remix(), tsconfigPaths()]
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvYWxpL0Rlc2t0b3AvcmVmcmVzZmluZy10aW1lclwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL2FsaS9EZXNrdG9wL3JlZnJlc2ZpbmctdGltZXIvdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL2FsaS9EZXNrdG9wL3JlZnJlc2ZpbmctdGltZXIvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyB2aXRlUGx1Z2luIGFzIHJlbWl4IH0gZnJvbSAnQHJlbWl4LXJ1bi9kZXYnO1xuaW1wb3J0IHsgaW5zdGFsbEdsb2JhbHMgfSBmcm9tICdAcmVtaXgtcnVuL25vZGUnO1xuaW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSc7XG5pbXBvcnQgdHNjb25maWdQYXRocyBmcm9tICd2aXRlLXRzY29uZmlnLXBhdGhzJztcblxuaW5zdGFsbEdsb2JhbHMoKTtcblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgICBwbHVnaW5zOiBbcmVtaXgoKSwgdHNjb25maWdQYXRocygpXSxcbn0pO1xuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUEyUixTQUFTLGNBQWMsYUFBYTtBQUMvVCxTQUFTLHNCQUFzQjtBQUMvQixTQUFTLG9CQUFvQjtBQUM3QixPQUFPLG1CQUFtQjtBQUUxQixlQUFlO0FBRWYsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDeEIsU0FBUyxDQUFDLE1BQU0sR0FBRyxjQUFjLENBQUM7QUFDdEMsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
