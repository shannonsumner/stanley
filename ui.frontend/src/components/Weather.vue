<template>
  <div v-if="typeof apiResponse.weather !== 'undefined'" class="weather-widget">
    <img
      :alt="apiResponse.weather[0].main"
      :src="
        require(`../resources/assets/weather/${apiResponse.weather[0].main.toLowerCase()}.jpg`)
      "
      class="weather-widget__background-image"
    />
    <div class="weather-widget__content">
      <div class="weather-widget__location">
        <span>
          {{ apiResponse.name }}
        </span>
        <span>
          <img
            :src="`https://flagcdn.com/20x15/${apiResponse.sys?.country.toLowerCase()}.png`"
            :srcset="`https://flagcdn.com/40x30/${apiResponse.sys?.country.toLowerCase()}.png 2x, https://flagcdn.com/60x45/${apiResponse.sys?.country.toLowerCase()}.png 3x`"
            alt="US"
            height="15"
            width="20"
          />
        </span>
      </div>
      <div class="weather-widget__temperature">
        <img
          :src="`https://openweathermap.org/img/wn/${apiResponse.weather[0].icon}@2x.png`"
          alt="weather"
        />
        <span>
          {{
            Math.round(
              (9 / 5) * (parseInt(apiResponse.main.temp, 10) - 273.15) + 32
            )
          }}°F
        </span>
      </div>
      <div class="weather-widget__copy">
        <p>
          Feels like
          {{
            Math.round(
              (9 / 5) * (parseInt(apiResponse.main.feels_like, 10) - 273.15) +
                32
            )
          }}°F.
        </p>

        <!-- Descriptions -->
        <p v-for="weather in apiResponse.weather" :key="weather.id">
          {{
            weather.description.charAt(0).toUpperCase() +
            weather.description.slice(1)
          }}.
        </p>
      </div>
      <hr class="weather-widget__divider" />
      <div class="weather-widget__other">
        <div>
          <svg viewBox="0 0 1000 1000">
            <g>
              <path
                d="M500,10C229.4,10,10,229.4,10,500c0,270.6,219.4,490,490,490c270.6,0,490-219.4,490-490C990,229.4,770.6,10,500,10L500,10z M793.8,793.8c-38.2,38.2-82.6,68.1-132.1,89.1c-51.2,21.6-105.6,32.6-161.7,32.6s-110.5-11-161.7-32.6c-49.5-20.9-93.9-50.9-132.1-89.1c-38.2-38.2-68.1-82.6-89.1-132.1C95.5,610.5,84.5,556.1,84.5,500c0-56.1,11-110.5,32.6-161.7c20.9-49.5,50.9-93.9,89.1-132.1c38.2-38.2,82.6-68.1,132.1-89.1C389.5,95.5,443.9,84.5,500,84.5s110.5,11,161.7,32.6c49.5,20.9,93.9,50.9,132.1,89.1c38.2,38.2,68.2,82.6,89.1,132.1c21.6,51.2,32.6,105.6,32.6,161.7c0,56.1-11,110.5-32.6,161.7C861.9,711.2,832,755.6,793.8,793.8L793.8,793.8z M648.5,174c-74.7-34-159.5-41.3-238.8-20.6c-71.5,18.7-137,60.2-184.5,116.9c-49.8,59.5-79.2,134.9-82.9,212.4c-3.8,79.1,19.1,158.2,64.4,222.8l60-38l-28.3-48.2l-28.9,16.9c-22-47.1-32.5-99.4-30-151.7c2-41.5,12.2-82.3,29.6-119.8l30.2,16.8l27.1-48.9l-29.5-16.3c5.3-7.6,10.9-14.9,16.8-22.1c35.7-42.7,82.9-75.8,135.1-95.2l24.5,238.4c-14.3,18.7-22.8,42-22.8,67.3c0,61.3,49.6,110.9,110.9,110.9c61.2,0,110.8-49.6,110.8-110.9c0-52.8-36.9-96.9-86.4-108.1L393.8,197.2c8.3-2.9,16.7-5.5,25.2-7.7c17.7-4.6,35.7-7.7,53.9-9.2l0.3,35.9l55.9-0.5l-0.3-35.2c35.8,3.2,71.1,12.4,104.2,27.5c51.6,23.5,96.9,61.3,129.7,107.8l-30.4,17.8l28.3,48.2l30.2-17.7c25.8,55.3,35.4,117.7,27.2,178.7c-4.4,33-14.2,65.4-28.7,95.6L759.6,622l-27.1,48.9l60,35.5c33.2-47.2,54.7-102,62.3-158.6c10.6-79.1-5.7-160.4-45.9-228.9C771.9,255.7,714.9,204.2,648.5,174L648.5,174z M501.5,448.9c30.8,0,55.9,25,55.9,55.8s-25.1,55.9-55.9,55.9c-30.8,0-55.9-25-55.9-55.9S470.6,448.9,501.5,448.9z"
              />
            </g>
          </svg>
        </div>
        <div>
          <span>{{ apiResponse.main.pressure }} hPa</span>
        </div>

        <div>
          <svg viewBox="0 0 1000 1000">
            <g>
              <path
                d="M819.8,645.6c0.1-0.1,0.3-0.3,0.3-0.3c-0.4-4.5-1.2-9.2-2.2-14c-0.5-3.1-0.9-6.3-1.5-9.3c-0.2,0.2-0.4,0.5-0.5,0.7c-6.6-25-18.3-49.4-18.3-49.4L531.4,39.9c-39.9-67.3-75,0-75,0L195,583c-10.9,28.9-13.5,51.7-13.5,51.7c-2,14-3,28.2-3,42.7C178.4,850,322.4,990,500,990c177.6,0,321.6-140,321.6-312.7C821.6,666.6,820.9,656,819.8,645.6L819.8,645.6z M500,652.7c-96.2-84.5-188.1-78-252.4-53.7L498.6,89.2l242.3,499.3c20,45.8,22.7,75.3,22.7,87.9C701.5,722.5,605.8,745.6,500,652.7L500,652.7z"
              />
            </g>
          </svg>
        </div>
        <div>
          <span>{{ apiResponse.main.humidity }}%</span>
        </div>

        <div>
          <svg viewBox="0 0 1000 1000">
            <g>
              <path
                d="M983.3,480C974.4,468.8,765,190.4,500,190.4C235,190.4,25.6,468.8,16.7,480c-8.9,11.1-8.9,29,0,40.1C25.6,531.2,235,809.6,500,809.6c265,0,474.4-278.4,483.3-289.5C992.2,506.7,992.2,491.1,983.3,480L983.3,480L983.3,480z M500,740.5c-193.8,0-363-180.4-414.3-242.8C137,437.6,306.2,255,500,255c193.8,0,363,180.4,414.3,242.8C863,560.1,693.8,740.5,500,740.5L500,740.5L500,740.5z M502.2,355.2c-78,0-142.5,64.6-142.5,142.5c0,78,64.6,142.5,142.5,142.5c78,0,142.5-64.6,142.5-142.5C644.8,419.8,580.2,355.2,502.2,355.2L502.2,355.2L502.2,355.2z M502.2,575.7c-42.3,0-75.7-33.4-75.7-75.7c0-42.3,33.4-75.7,75.7-75.7c42.3,0,75.7,33.4,75.7,75.7C578,542.3,544.5,575.7,502.2,575.7L502.2,575.7L502.2,575.7z"
              />
            </g>
          </svg>
        </div>
        <div>
          <span
            >{{
              apiResponse.visibility === 10000
                ? 10
                : Math.round((apiResponse.visibility * 0.621371) / 1000)
            }}
            mi</span
          >
        </div>

        <div>
          <svg viewBox="0 0 1000 1000">
            <g>
              <path
                d="M869.3,430.6c-1.4,0.6-3,1-4.6,1h-91.2c-6.3,0-11.4-5.1-11.4-11.4v-22.8c0-6.3,5.1-11.4,11.4-11.4h79.8l0,0h0c50.3,0,91.2-40.8,91.2-91.2c0-50.4-40.8-91.2-91.2-91.2h0V158c0,0,0,0,0,0c75.5,0,136.7,61.2,136.7,136.8C990,364.9,937.2,422.6,869.3,430.6z M557,431.6c-3.2,0-6.3-0.2-9.4-0.4c-0.7,0.1-1.3,0.4-2,0.4h-433c-6.3,0-11.4-5.1-11.4-11.4v-22.8c0-6.3,5.1-11.4,11.4-11.4h426.9v-1.5c5.7,0.9,11.5,1.5,17.5,1.5c62.9,0,114-51,114-114c0-63-51-114-114-114c-62.3,0-112.9,50-113.9,112.1h-45.6c1-87.3,72-157.7,159.4-157.7c88.1,0,159.5,71.5,159.5,159.6C716.5,360.1,645.1,431.6,557,431.6z M709,523.6c93.5,7.8,167.1,86,167.1,181.6c0,100.7-81.6,182.4-182.3,182.4c-100.7,0-182.3-81.7-182.3-182.4c0-18.1,2.7-35.5,7.6-52h48.3c-6.6,16-10.3,33.6-10.3,52c0,75.6,61.2,136.8,136.7,136.8s136.7-61.2,136.7-136.8c0-75.6-61.2-136.8-136.7-136.8c-0.1,0-0.1,0-0.2,0v0H21.4c-6.3,0-11.4-5.1-11.4-11.4v-22.8c0-6.3,5.1-11.4,11.4-11.4h683.7C706.5,522.8,707.7,523.1,709,523.6z"
              />
            </g>
          </svg>
        </div>
        <div>
          <span>{{ Math.round(apiResponse.wind.speed * 2.2369) }} mph</span>
        </div>
      </div>
    </div>
  </div>
  <LoadingSpinner v-else />
</template>

<script lang="ts">
  /* eslint-disable no-undef */
  import { defineComponent, ref } from 'vue';
  import axios from 'axios';
  import LoadingSpinner from '@/components/LoadingSpinner.vue';

  export default defineComponent({
    // eslint-disable-next-line vue/multi-word-component-names
    name: 'Weather',
    components: {
      LoadingSpinner,
    },
    inheritAttrs: false,
    setup() {
      const apiResponse = ref({});
      const apiId = 'b310c67e700e8a73d6a94507160c3595';

      const requestWeather = async (longitude: number, latitude: number) => {
        const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiId}`;
        const request = axios.get(apiUrl);
        const { data } = await request;
        apiResponse.value = data;
        sessionStorage.weather = JSON.stringify(data);
      };

      const success = (position: GeolocationPosition) => {
        if (position) {
          const { longitude, latitude } = position.coords;
          requestWeather(longitude, latitude);
        }
      };

      const error = (err: GeolocationPositionError) => {
        console.warn(`ERROR(${err.code}): ${err.message}`);
      };

      if (sessionStorage.weather) {
        apiResponse.value = JSON.parse(sessionStorage.weather);
      } else {
        navigator.geolocation.getCurrentPosition(success, error, {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        });
      }

      return { apiResponse };
    },
  });
</script>

<style>
  @keyframes fadeIn {
    0% {
      opacity: 0;
    }

    100% {
      opacity: 1;
    }
  }

  .weather-widget {
    animation: fadeIn 0.275s ease-in-out;
    block-size: 304px;
    border-radius: 24px;
    display: grid;
    font-family: Montserrat, sans-serif;
    font-size: 18px;
    font-weight: 400;
    grid-template-columns: 1fr;
    inline-size: 304px;
    line-height: 1.4;
    overflow: hidden;
  }

  .weather-widget__content {
    align-items: center;
    display: flex;
    flex-direction: column;
    grid-column-start: 1;
    grid-row-start: 1;
    justify-content: space-between;
    padding-block: 24px;
    padding-inline: 24px;
    z-index: 2;
  }

  .weather-widget__background-image {
    block-size: 304px;
    filter: brightness(80%);
    grid-column-start: 1;
    grid-row-start: 1;
    inline-size: 100%;
    object-fit: cover;
    opacity: 0.8;
    transition: 0.275s;
    z-index: 1;
  }

  .weather-widget:hover .weather-widget__background-image {
    transform: scale(1.025);
  }

  .weather-widget__location {
    align-items: center;
    color: #fff;
    display: flex;
    gap: 8px;
  }

  .weather-widget__temperature {
    align-items: center;
    color: #fff;
    display: flex;
    font-size: 48px;
  }

  .weather-widget__temperature > img {
    block-size: 72px;
    inline-size: 100px;
    object-fit: cover;
  }

  .weather-widget__copy {
    color: #fff;
    font-size: 16px;
    text-align: center;
  }

  .weather-widget__copy p {
    margin-block: 0;
    margin-inline: 0;
    padding-block: 0;
    padding-inline: 0;
  }

  .weather-widget__divider {
    background: #fff;
    block-size: 1px;
    border: none;
    border-radius: 1px;
    inline-size: 100%;
    margin-block: 16px;
    opacity: 0.2;
  }

  .weather-widget__other {
    align-items: center;
    color: #fff;
    display: grid;
    font-size: 16px;
    gap: 12px 8px;
    grid-template-columns: 32px 1fr 32px 1fr;
    grid-template-rows: repeat(2, 1fr);
    inline-size: 100%;
  }

  .weather-widget__other > div {
    display: flex;
    justify-content: start;
  }

  .weather-widget__other svg {
    block-size: 24px;
    fill: #fff;
    inline-size: 24px;
    padding-inline: 4px;
  }

  .aem-GridColumn:has(.weather-widget) {
    align-items: center;
    display: flex;
    flex-flow: column nowrap;
  }
</style>
