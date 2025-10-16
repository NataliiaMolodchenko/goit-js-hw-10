import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";

import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const refs = {
    dateInput: document.querySelector("#datetime-picker"),
    startBtn: document.querySelector("[data-start]"),
    days: document.querySelector("[data-days]"),
    hours: document.querySelector("[data-hours]"),
    minutes: document.querySelector("[data-minutes]"),
    seconds: document.querySelector("[data-seconds]"),
};

let userSelectedDate = null;
let timerId = null;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
      const selectedDate = selectedDates[0];
      const dateNow = new Date();

      if (selectedDate <= dateNow) {
          iziToast.error({
              title: "Error",
              message: "Please choose a date in the future",
              position: "topRight",
              timeout: 3000,
          })
          refs.startBtn.disabled = true;
          return;
      }

      userSelectedDate = selectedDate;
      refs.startBtn.disabled = false;
  },
};

flatpickr(refs.dateInput, options);

refs.startBtn.addEventListener("click", startTimer);

function startTimer() {
    refs.startBtn.disabled = true;
    refs.dateInput.disabled = true;

    timerId = setInterval(() => {
        const dateNow = new Date();
        const timeLeft = userSelectedDate - dateNow;

        if (timeLeft <= 0) {
            clearInterval(timerId);
            updateTimerDisplay({ days: 0, hours: 0, minutes: 0, seconds: 0 });
            refs.dateInput.disabled = false;
            return;
        }

        const time = convertMs(timeLeft);
        updateTimerDisplay(time);
    }, 1000);
}

function updateTimerDisplay({days, hours, minutes, seconds}) {
    refs.days.textContent = addLeadingZero(days);
    refs.hours.textContent = addLeadingZero(hours);
    refs.minutes.textContent = addLeadingZero(minutes);
    refs.seconds.textContent = addLeadingZero(seconds);
}

function addLeadingZero(value) {
    return String(value).padStart(2, "0");
}

function convertMs(ms) {
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;

    const days = Math.floor(ms / day);
    const hours = Math.floor((ms % day) / hour);
    const minutes = Math.floor(((ms % day) % hour) / minute);
    const seconds = Math.floor((((ms % day) % hour) % minute) / second);

    return { days, hours, minutes, seconds };
}

console.log(convertMs(2000)); // {days: 0, hours: 0, minutes: 0, seconds: 2}
console.log(convertMs(140000)); // {days: 0, hours: 0, minutes: 2, seconds: 20}
console.log(convertMs(24140000)); // {days: 0, hours: 6 minutes: 42, seconds: 20}
