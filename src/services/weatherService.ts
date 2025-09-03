export interface WeatherData {
  id: number;
  main: string;
  description: string;
  icon: string;
}

export interface MainWeatherData {
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  pressure: number;
  humidity: number;
}

export interface WeatherResponse {
  weather: WeatherData[];
  main: MainWeatherData;
  name: string;
  dt: number;
}

export interface ForecastItem {
  dt: number;
  dt_txt: string;
  main: MainWeatherData;
  weather: WeatherData[];
}

export interface ForecastResponse {
  list: ForecastItem[];
  city: {
    name: string;
  };
}

const API_KEY = 'demo';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export class WeatherService {
  static async getCurrentWeather(city: string): Promise<WeatherResponse> {
    try {
      const response = await fetch(
        `${BASE_URL}/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`
      );
      
      if (!response.ok) {
        throw new Error(`Weather API error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Failed to fetch weather:', error);
      return this.getMockCurrentWeather(city);
    }
  }

  static async getForecast(city: string): Promise<ForecastResponse> {
    try {
      const response = await fetch(
        `${BASE_URL}/forecast?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`
      );
      
      if (!response.ok) {
        throw new Error(`Weather API error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Failed to fetch forecast:', error);
      return this.getMockForecast(city);
    }
  }

  private static getMockCurrentWeather(city: string): WeatherResponse {
    return {
      weather: [
        {
          id: 801,
          main: 'Clouds',
          description: 'few clouds',
          icon: '02d',
        },
      ],
      main: {
        temp: 22,
        feels_like: 24,
        temp_min: 18,
        temp_max: 26,
        pressure: 1013,
        humidity: 65,
      },
      name: city,
      dt: Date.now() / 1000,
    };
  }

  private static getMockForecast(city: string): ForecastResponse {
    const now = new Date();
    const forecasts: ForecastItem[] = [];
    
    for (let i = 0; i < 5; i++) {
      const date = new Date(now.getTime() + i * 24 * 60 * 60 * 1000);
      forecasts.push({
        dt: date.getTime() / 1000,
        dt_txt: date.toISOString().split('T')[0] + ' 12:00:00',
        main: {
          temp: 20 + Math.random() * 15,
          feels_like: 22 + Math.random() * 15,
          temp_min: 15 + Math.random() * 10,
          temp_max: 25 + Math.random() * 10,
          pressure: 1010 + Math.random() * 20,
          humidity: 50 + Math.random() * 40,
        },
        weather: [
          {
            id: Math.floor(Math.random() * 900) + 200,
            main: ['Clear', 'Clouds', 'Rain', 'Snow'][Math.floor(Math.random() * 4)],
            description: 'partly cloudy',
            icon: '02d',
          },
        ],
      });
    }
    
    return {
      list: forecasts,
      city: { name: city },
    };
  }

  static getWeatherIcon(iconCode: string): string {
    const iconMap: Record<string, string> = {
      '01d': '☀️',
      '01n': '🌙',
      '02d': '⛅',
      '02n': '☁️',
      '03d': '☁️',
      '03n': '☁️',
      '04d': '☁️',
      '04n': '☁️',
      '09d': '🌧️',
      '09n': '🌧️',
      '10d': '🌦️',
      '10n': '🌧️',
      '11d': '⛈️',
      '11n': '⛈️',
      '13d': '❄️',
      '13n': '❄️',
      '50d': '🌫️',
      '50n': '🌫️',
    };
    
    return iconMap[iconCode] || '🌡️';
  }
}