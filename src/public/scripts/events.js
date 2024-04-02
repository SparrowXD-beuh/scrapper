
const videoplayer = document.querySelector("#videoplayer");
const controls = document.querySelector(".controls");
const cascade = document.querySelector(".cascade");
const seekbar = document.getElementById("seekbar");
const currentTime = document.getElementById("currentTime");
const buffer = document.getElementById("buffer");
const timeSpan = document.getElementById("time");
const volumeControl = document.getElementById("volume");
const video = document.querySelector("#video");
const tooltip = document.getElementById('tooltip');
let timeoutId;

const hideControls = () => {
  timeoutId = setTimeout(() => {
    controls.style.opacity = "0";
    cascade.style.opacity = "0";
  }, 5000);
};
const showControls = () => {
  clearTimeout(timeoutId);
  controls.style.opacity = "1";
  cascade.style.opacity = "1";
};
document.addEventListener("mousemove", () => {
  showControls();
  hideControls();
});
document.addEventListener("mouseleave", () => {
  clearTimeout(timeoutId);
  controls.style.opacity = "0";
});

function updateBufferWidth() {
  if (video.buffered.length > 0) {
    const bufferedEnd = video.buffered.end(video.buffered.length - 1);
    const duration = video.duration;
    buffer.style.width = `${(bufferedEnd / duration) * 100}%`;
  }
}
function formatTime(seconds) {
  var date = new Date(null);
  date.setSeconds(seconds);
  var hours = date.getUTCHours();
  var minutes = date.getUTCMinutes();
  var formattedTime = "";
  if (hours > 0) {
    formattedTime += hours.toString().padStart(2, "0") + ":";
  }
  formattedTime += minutes.toString().padStart(2, "0") + ":";
  formattedTime += date.toISOString().substr(17, 2);
  return formattedTime;
}

video.addEventListener("timeupdate", function () {
  updateBufferWidth();
  const progress = (video.currentTime / video.duration) * 100;
  seekbar.value = progress.toFixed(2);
  currentTime.style.width = `${progress}%`;
  const formattedTime =
    formatTime(video.currentTime) + " / " + formatTime(video.duration);
  timeSpan.textContent = formattedTime;
});
seekbar.addEventListener("input", function () {
  if (isFinite(video.duration)) {
    const seekTime = (parseFloat(seekbar.value) / 100) * video.duration;
    video.currentTime = seekTime;
    const timeUpdateEvent = new Event('timeupdate');
    video.dispatchEvent(timeUpdateEvent);
    currentTime.style.width = `${(video.currentTime / video.duration * 100)}%`;
  }
});
video.addEventListener("progress", updateBufferWidth);

// Play/Pause
const pauseIcon = document.getElementsByClassName("pause-svg-icon");
const playIcon = document.getElementsByClassName("play-svg-icon");
function playVideo() {
  video.play();
  for (let icon of pauseIcon) {
    icon.style.display = "inline-block";
  }
  for (let icon of playIcon) {
    icon.style.display = "none";
  }
}
function pauseVideo() {
  video.pause();
  for (let icon of playIcon) {
    icon.style.display = "inline-block";
  }
  for (let icon of pauseIcon) {
    icon.style.display = "none";
  }
}
document.getElementById("play").addEventListener("click", function () {
  if (video.paused) {
    playVideo();
    tooltip.textContent = 'Pause';
  } else {
    pauseVideo();
    tooltip.textContent = 'Play';
  }
});

// Mute/Unmute
const unmuteIcon = document.getElementsByClassName("unmute-svg-icon");
const muteIcon = document.getElementsByClassName("mute-svg-icon");
function muteVideo() {
  video.muted = true;
  volumeControl.value = 0;
  for (let icon of muteIcon) {
    icon.style.display = "inline-block";
  }
  for (let icon of unmuteIcon) {
    icon.style.display = "none";
  }
}
function unmuteVideo() {
  video.muted = false;
  for (let icon of unmuteIcon) {
    icon.style.display = "inline-block";
  }
  for (let icon of muteIcon) {
    icon.style.display = "none";
  }
}
document.getElementById("mute").addEventListener("click", function () {
  if (video.muted) {
    unmuteVideo();
  } else {
    muteVideo();
  }
});
volumeControl.addEventListener("input", function () {
  if (this.value == 0) {
    muteVideo();
  } else {
    unmuteVideo();
    video.volume = this.value / 100;
  }
});

// Toggle miniplayer
const pipOff = document.getElementsByClassName("svg-icon-pip-on");
const pipOn = document.getElementsByClassName("svg-icon-pip-off");
function enterPip() {
  for (let icon of pipOn) {
    icon.style.display = "inline-block";
  }
  for (let icon of pipOff) {
    icon.style.display = "none";
  }
  video.requestPictureInPicture().catch((error) => {
    console.error("Error entering PiP mode:", error);
  });
}
function exitPip() {
  for (let icon of pipOff) {
    icon.style.display = "inline-block";
  }
  for (let icon of pipOn) {
    icon.style.display = "none";
  }
  document.exitPictureInPicture().catch((error) => {
    console.error("Error exiting PiP mode:", error);
  });
}
document.getElementById("pip").addEventListener("click", function () {
  if (document.pictureInPictureElement) {
    exitPip();
  } else {
    enterPip();
  }
});
video.addEventListener('leavepictureinpicture', () => {
  for (let icon of pipOff) {
    icon.style.display = "inline-block";
  }
  for (let icon of pipOn) {
    icon.style.display = "none";
  }
});
video.addEventListener('enterpictureinpicture', () => {
  for (let icon of pipOn) {
    icon.style.display = "inline-block";
  }
  for (let icon of pipOff) {
    icon.style.display = "none";
  }
});

// Toggle fullscreen
const enterFullscreenIcon = document.getElementsByClassName(
  "svg-icon-fullscreen-off"
);
const exitFullscreenIcon = document.getElementsByClassName(
  "svg-icon-fullscreen-on"
);
function enterFullscreen() {
  for (let icon of enterFullscreenIcon) {
    icon.style.display = "inline-block";
  }
  for (let icon of exitFullscreenIcon) {
    icon.style.display = "none";
  }
  if (videoplayer.requestFullscreen) {
    videoplayer.requestFullscreen();
  } else if (videoplayer.mozRequestFullScreen) {
    videoplayer.mozRequestFullScreen();
  } else if (videoplayer.webkitRequestFullscreen) {
    videoplayer.webkitRequestFullscreen();
  } else if (videoplayer.msRequestFullscreen) {
    videoplayer.msRequestFullscreen();
  }
}
function exitFullscreen() {
  for (let icon of exitFullscreenIcon) {
    icon.style.display = "inline-block";
  }
  for (let icon of enterFullscreenIcon) {
    icon.style.display = "none";
  }
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.mozCancelFullScreen) {
    document.mozCancelFullScreen();
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) {
    document.msExitFullscreen();
  }
}
document.getElementById("fullscreen").addEventListener("click", function () {
  if (document.fullscreenElement) {
    exitFullscreen();
  } else {
    enterFullscreen();
  }
});

// settings
const settingsBox = document.querySelector(".settingsbox");
const settingsicon = document.querySelector(".settings-svg-icon");
document.getElementById("settings").addEventListener("click", function() {
  if (settingsBox.style.display == 'flex') {
    settingsBox.style.display = "none";
  } else {
    settingsBox.style.display = "flex";
  }
});
document.getElementById("closesettingsbox").addEventListener("click", () => {
  settingsBox.style.display = "none"
})

// Skip/Rewind
document.getElementById("rewind").addEventListener("click", function () {
  video.currentTime -= 10;
});
document.getElementById("skip").addEventListener("click", function () {
  video.currentTime += 10;
});

//select settings
const qualitySelect = document.getElementById("qualityselect");
const playbackRateSelect = document.getElementById("playbackrateselect");
document.getElementById("quality").addEventListener("click", () => {
    qualitySelect.style.display = 'flex';
    playbackRateSelect.style.display = 'none';
})
document.getElementById("playbackrate").addEventListener("click", () => {
    qualitySelect.style.display = 'none';
    playbackRateSelect.style.display = 'flex';
})


document.addEventListener("keydown", function (event) {
  showControls();
  event.preventDefault();
  switch (event.code) {
    case "Space":
      if (video.paused) {
        playVideo();
      } else {
        pauseVideo();
      }
      break;
    case "ArrowRight":
      video.currentTime += 10;
      break;
    case "ArrowLeft":
      video.currentTime -= 10;
      break;
    case "KeyM":
      if (video.muted) {
        unmuteVideo();
      } else {
        muteVideo();
      }
      break
    case "KeyF":
      if (document.fullscreenElement) {
        exitFullscreen();
      } else {
        enterFullscreen();
      }
      break;
  }
});

function changeQuality(source) {
  const currentTime = video.currentTime;
  const videoSource = document.getElementById('source');
  videoSource.src = source;
  video.load();
  video.currentTime = currentTime;
}

function changeSpeed(speed) {
  video.playbackRate = parseFloat(speed)
}