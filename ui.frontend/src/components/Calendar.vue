<template>
  <div class="calendar-widget">
    <div class="calendar-widget__month-indicator">{{ monthIndicator }}</div>
    <div class="calendar-widget__day-of-week">
      <div v-for="day in weekdays" :key="day">{{ day }}</div>
    </div>
    <div
      :style="`--calendar-widget-date-grid-button-first-child-grid-column: ${firstDayInMonth}`"
      class="calendar-widget__date-grid"
    >
      <div
        v-for="dayObject in days"
        :key="dayObject.day"
        :class="dayObject.day === today ? 'calendar-widget__today' : false"
      >
        <time :datetime="dayObject.datetime">{{ dayObject.day }}</time>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';

  export default defineComponent({
    // eslint-disable-next-line vue/multi-word-component-names
    name: 'Calendar',
    inheritAttrs: false,
    data() {
      return {
        month: new Date().getMonth(),
        day: new Date().getDate(),
      };
    },
    computed: {
      firstDayInMonth() {
        const today = new Date();
        return new Date(today.getFullYear(), today.getMonth(), 1).getDay() + 1;
      },
      monthIndicator() {
        const today = new Date();
        const months = [
          'January',
          'February',
          'March',
          'April',
          'May',
          'June',
          'July',
          'August',
          'September',
          'October',
          'November',
          'December',
        ];
        const month = months[today.getMonth()];
        return `${month} ${today.getFullYear()}`;
      },
      weekdays() {
        return ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
      },
      days() {
        const today = new Date();
        const daysInMonth = new Date(
          today.getFullYear(),
          today.getMonth() + 1,
          0
        ).getDate();
        const dates = [];
        for (let index = 0; index < daysInMonth; index++) {
          const date = new Date(
            Date.UTC(today.getFullYear(), today.getMonth(), index + 1)
          );
          const datetime = date.toISOString().split('T')[0];
          dates.push({
            day: index + 1,
            datetime,
          });
        }
        return dates;
      },
      today() {
        const today = new Date();
        return today.getDate();
      },
    },
  });
</script>

<style>
  @import 'Calendar.css';
</style>
