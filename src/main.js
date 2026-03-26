import "../styles/index.css";
import alarmGif from "../images/alarm.gif";
import clearSkyImage from "../images/clear sky.jpg";
import cloudsImage from "../images/clouds.jpg";
import drizzleImage from "../images/drizzle.jpg";
import fogImage from "../images/fog.jpg";
import rainImage from "../images/rain.jpg";
import snowImage from "../images/snow.jpg";
import thunderstormImage from "../images/thunderstorm.jpg";

const STORAGE_KEYS = {
  items: "saved-items",
  weather: "saved-weather",
};

const WEATHER_IMAGES = {
  "clear sky": clearSkyImage,
  clouds: cloudsImage,
  drizzle: drizzleImage,
  rain: rainImage,
  snow: snowImage,
  thunderstorm: thunderstormImage,
  fog: fogImage,
};

const FOG_WEATHER_TYPES = new Set([
  "mist",
  "smoke",
  "haze",
  "dust",
  "fog",
  "sand",
  "ash",
  "squall",
  "tornado",
]);

const DEFAULT_WEATHER = "drizzle";

const todoInput = document.querySelector("#todo-input");
const todoList = document.querySelector("#todo-list");
const deleteAllButton = document.querySelector("#delete-all-button");
const locationNameTag = document.querySelector("#location-name-tag");
const toastElement = document.querySelector("#liveToast");
const toastAlarmIcon = document.querySelector("#toast-alarm-icon");

const savedTodoList = readStorage(STORAGE_KEYS.items, []);
const savedWeatherData = readStorage(STORAGE_KEYS.weather, null);

toastAlarmIcon.src = alarmGif;
setBackground(DEFAULT_WEATHER);

function readStorage(key, fallbackValue) {
  const storedValue = localStorage.getItem(key);

  if (!storedValue) {
    return fallbackValue;
  }

  try {
    return JSON.parse(storedValue);
  } catch {
    return fallbackValue;
  }
}

function createTodo(storageData = null) {
  const todoContents = storageData?.contents ?? todoInput.value.trim();

  if (!todoContents) {
    return;
  }

  const newButton = document.createElement("button");
  const newListItem = document.createElement("li");
  const newSpan = document.createElement("span");

  newButton.type = "button";
  newButton.setAttribute("aria-label", "할 일 완료 상태 변경");
  newSpan.textContent = todoContents;

  if (storageData?.complete) {
    newListItem.classList.add("complete");
  }

  newListItem.append(newButton, newSpan);
  todoList.prepend(newListItem);
  todoInput.value = "";
  saveItems();

  newButton.addEventListener("click", () => {
    newListItem.classList.toggle("complete");
    saveItems();
  });

  newListItem.addEventListener("dblclick", () => {
    newListItem.remove();
    saveItems();
  });
}

function saveItems() {
  const items = Array.from(todoList.children, (item) => ({
    contents: item.querySelector("span")?.textContent ?? "",
    complete: item.classList.contains("complete"),
  }));

  if (items.length === 0) {
    localStorage.removeItem(STORAGE_KEYS.items);
    return;
  }

  localStorage.setItem(STORAGE_KEYS.items, JSON.stringify(items));
}

function deleteAllItems() {
  todoList.replaceChildren();
  saveItems();
}

function setBackground(weather) {
  const backgroundImage = WEATHER_IMAGES[weather] ?? WEATHER_IMAGES.fog;
  document.body.style.backgroundImage = `url("${backgroundImage}")`;
}

function normalizeWeather(mainWeather = "") {
  const weather = mainWeather.toLowerCase();

  if (weather === "clear") {
    return "clear sky";
  }

  if (FOG_WEATHER_TYPES.has(weather)) {
    return "fog";
  }

  return WEATHER_IMAGES[weather] ? weather : "fog";
}

function applyWeatherData({ location, weather }) {
  const normalizedWeather = WEATHER_IMAGES[weather] ? weather : "fog";

  localStorage.setItem(
    STORAGE_KEYS.weather,
    JSON.stringify({ location, weather: normalizedWeather }),
  );

  locationNameTag.textContent = location || "ToDo";
  setBackground(normalizedWeather);
}

async function weatherSearch({ latitude, longitude }) {
  try {
    const queryString = new URLSearchParams({
      lat: String(latitude),
      lon: String(longitude),
    });
    const response = await fetch(`/api/weather?${queryString}`);
    const weatherResponse = await response.json();

    if (!response.ok) {
      throw new Error(weatherResponse.message || "날씨 정보를 불러오지 못했습니다.");
    }

    applyWeatherData({
      location: weatherResponse.location,
      weather: normalizeWeather(weatherResponse.weather),
    });
  } catch (error) {
    console.error(error);
  }
}

function askForLocation() {
  if (!navigator.geolocation) {
    return;
  }

  navigator.geolocation.getCurrentPosition(
    ({ coords }) => {
      weatherSearch(coords);
    },
    (error) => {
      console.error(error);
    },
  );
}

function showDeleteToast() {
  const toast = window.bootstrap?.Toast.getOrCreateInstance(toastElement);
  toast?.show();
}

todoInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    createTodo();
  }
});

deleteAllButton.addEventListener("click", () => {
  deleteAllItems();
  showDeleteToast();
});

savedTodoList.slice().reverse().forEach((item) => createTodo(item));

if (savedWeatherData) {
  applyWeatherData(savedWeatherData);
} else {
  askForLocation();
}
