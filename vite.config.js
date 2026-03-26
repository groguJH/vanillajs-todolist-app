import { defineConfig, loadEnv } from "vite";
import { getWeatherData } from "./lib/weather.js";

function createWeatherMiddleware(apiKey) {
  return async function weatherMiddleware(request, response, next) {
    if (!request.url) {
      next();
      return;
    }

    const url = new URL(request.url, "http://localhost");

    if (url.pathname !== "/api/weather") {
      next();
      return;
    }

    try {
      const weatherData = await getWeatherData({
        latitude: url.searchParams.get("lat"),
        longitude: url.searchParams.get("lon"),
        apiKey,
      });

      response.statusCode = 200;
      response.setHeader("Content-Type", "application/json");
      response.end(JSON.stringify(weatherData));
    } catch (error) {
      response.statusCode = error.status || 500;
      response.setHeader("Content-Type", "application/json");
      response.end(
        JSON.stringify({
          message: error.message || "날씨 정보를 불러오지 못했습니다.",
        }),
      );
    }
  };
}

function weatherApiPlugin(apiKey) {
  const middleware = createWeatherMiddleware(apiKey);

  return {
    name: "weather-api",
    configureServer(server) {
      server.middlewares.use(middleware);
    },
    configurePreviewServer(server) {
      server.middlewares.use(middleware);
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, __dirname, "");

  return {
    plugins: [weatherApiPlugin(env.WEATHER_API_KEY)],
  };
});
