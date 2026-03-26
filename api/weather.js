import { getWeatherData } from "../lib/weather.js";

export async function GET(request) {
  const url = new URL(request.url);
  const latitude = url.searchParams.get("lat");
  const longitude = url.searchParams.get("lon");

  try {
    const weatherData = await getWeatherData({
      latitude,
      longitude,
      apiKey: process.env.WEATHER_API_KEY,
    });

    return Response.json(weatherData);
  } catch (error) {
    console.error("날씨 정보를 불러오는 중 오류 발생:", error);

    return Response.json(
      { message: error.message || "날씨 정보를 불러오지 못했습니다." },
      { status: error.status || 500 },
    );
  }
}
