import { type RouteConfig, index, prefix, route } from "@react-router/dev/routes";

const devRoutes = import.meta.env.DEV ? prefix("dev", [route("components", "dev/components.tsx")]) : [];

export default [
  index("routes/home.tsx"),
  route("play", "routes/play.tsx"),
  route("leaderboard", "routes/leaderboard.tsx"),
  route("players", "routes/players.tsx"),
  ...devRoutes,
] satisfies RouteConfig;
