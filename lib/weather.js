function createError(message, status) {
  const error = new Error(message);
  error.status = status;
  return error;
}

export async function getWeatherData({ latitude, longitude, apiKey }) {
  if (!apiKey) {
    throw createError("서버 오류로 잠시 후 사용해주세요", 500);
  }

  if (!latitude || !longitude) {
    throw createError("위치 정보가 올바르지 않습니다.", 400);
  }

  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}`,
  );
  const weatherResponse = await response.json();

  if (!response.ok) {
    throw createError(
      weatherResponse.message || "날씨 정보를 불러오지 못했습니다.",
      response.status,
    );
  }

  return {
    location: weatherResponse.name,
    weather: weatherResponse.weather?.[0]?.main ?? "",
  };
}
