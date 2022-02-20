$(document).ready(videoPlayer);

function videoPlayer() {
  const container = $(".container");
  const playList = ["video-2.mp4", "video-1.mp4", "video-3.mp4", "video-4.mp4"];
  const videoFile = $("#videoFile");
  const controlBar = $("#controlBar");
  const playBtn = $("#playBtn");
  const prevBtn = $("#prevBtn");
  const nextBtn = $("#nextBtn");
  const currentTime = $("#currentTime");
  const progressBar = $("#progressBar");
  const progress = $("#progress");
  const duration = $("#duration");
  const loopBtn = $("#loopBtn");
  const volumeBtn = $("#volumeBtn");
  const volumeBar = $("#volumeBar");
  const volume = $("#volume");
  const fullScreenBtn = $("#fullScreenBtn");

  //Set Default Values
  let videoIndex = 0;
  let loop = false;
  let isPlaing = false;
  videoFile.get(0).volume = 0.5;
  volume.css({ width: "50%" });
  let isFullScreen = false;
  loadVideo();

  //Event Listeners
  videoFile.on('canplay', setDuration);
  playBtn.on("click", playPause);
  prevBtn.on("click", prevVideoPlay);
  nextBtn.on("click", nextVideoPlay);
  videoFile.on("timeupdate", timeUpdate);
  progressBar.on("click", setProgress);
  loopBtn.on("click", setLoop);
  videoFile.on("ended", videoEnd);
  volumeBtn.on("click", volumeBtnAction);
  volumeBar.on("click", setVolume);
  fullScreenBtn.on("click", fullScreen);
  controlBar.on("mouseover", showControllBar);
  controlBar.on("mouseleave", hideControllBar);

  //Functions
  function loadVideo() {
    videoFile.attr("src", `./videos/${playList[videoIndex]}`);
    progress.css({ width: 0 });
    // duration.text(document.querySelector('video').duration);
  }

  function setDuration(){
    duration.html(convertTime(this.duration))
  }

  function playPause() {
    if (!isPlaing) {
      videoFile.trigger("play");
      isPlaing = true;
      playBtn.children("i").removeClass("bi-play-fill");
      playBtn.children("i").addClass("bi-pause-fill");
    } else {
      videoFile.trigger("pause");
      isPlaing = false;
      playBtn.children("i").removeClass("bi-pause-fill");
      playBtn.children("i").addClass("bi-play-fill");
    }
  }

  function prevVideoPlay() {
    videoIndex--;
    if (videoIndex < 0) videoIndex = playList.length - 1;
    isPlaing = false;
    loadVideo();
    playPause();
  }

  function nextVideoPlay() {
    videoIndex++;
    if (videoIndex > playList.length - 1) videoIndex = 0;
    isPlaing = false;
    loadVideo();
    playPause();
  }

  function timeUpdate() {
    currentTime.text(convertTime(this.currentTime));
    progress.css({ width: `${(this.currentTime / this.duration) * 100}%` });
  }

  function setProgress(e) {
    let x = e.pageX - $(this).offset().left;
    let progressPercent = (x / $(this).width()) * 100;
    progress.css({ width: `${progressPercent}%` });
    videoFile.get(0).currentTime =
      (videoFile.get(0).duration * progressPercent) / 100;
  }

  function setLoop() {
    if (!loop) {
      loop = true;
      $(this)
        .removeClass("bi-pause-btn")
        .addClass("bi-play-btn")
        .css({ color: "#ff9800" });
    } else {
      loop = false;
      $(this)
        .removeClass("bi-play-btn")
        .addClass("bi-pause-btn")
        .css({ color: "black" });
    }
  }

  function videoEnd() {
    console.log("ended");
    if (loop) {
      nextVideoPlay();
    } else {
      isPlaing = false;
      playBtn
        .children("i")
        .removeClass("bi-pause-fill")
        .addClass("bi-play-fill");
      showControllBar();
    }
  }

  function volumeBtnAction() {
    if (videoFile.get(0).volume > 0) {
      videoFile.get(0).volume = 0;
      volumeBtn.removeClass("bi-volume-up").addClass("bi-volume-mute");
      volume.css({ width: 0 });
    } else {
      videoFile.get(0).volume = 1;
      volumeBtn.removeClass("bi-volume-mute").addClass("bi-volume-up");
      volume.css({ width: "100%" });
    }
  }

  function setVolume(e) {
    let x = e.pageX - $(this).offset().left;
    if (x < 0) x = 0;
    let volumePercent = (x / $(this).width()) * 100;
    volume.css({ width: `${volumePercent}%` });
    videoFile.get(0).volume = volumePercent / 100;

    //Change volume btn Look
    if (volumePercent == 0) {
      volumeBtn
        .removeClass("bi-volume-up")
        .removeClass("bi-volume-down")
        .addClass("bi-volume-mute");
    } else if (volumePercent < 40) {
      volumeBtn
        .removeClass("bi-volume-mute")
        .removeClass("bi-volume-up")
        .addClass("bi-volume-down");
    } else {
      volumeBtn
        .removeClass("bi-volume-mute")
        .removeClass("bi-volume-down")
        .addClass("bi-volume-up");
    }
  }

  function fullScreen() {
    if (!isFullScreen) {
      $(this).removeClass("bi-fullscreen").addClass("bi-fullscreen-exit");
      isFullScreen = true;
      container.css({ height: "100%", width: "100%" });
      videoFile.css({ width: "unset" });

      var elem = document.documentElement;
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if (elem.webkitRequestFullscreen) {
        /* Safari */
        elem.webkitRequestFullscreen();
      } else if (elem.msRequestFullscreen) {
        /* IE11 */
        elem.msRequestFullscreen();
      }
    } else {
      $(this).removeClass("bi-fullscreen-exit").addClass("bi-fullscreen");
      isFullScreen = false;
      container.css({ width: "min(100%, 1100px)", height: "70vh" });
      videoFile.css({ width: "100%", height: "100%" });

      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        /* Safari */
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        /* IE11 */
        document.msExitFullscreen();
      }
    }
  }

  function showControllBar() {
    controlBar.css({ opacity: "1" });
  }

  function hideControllBar() {
    if (isPlaing) controlBar.css({ opacity: "0.3" });
  }

  function convertTime(time) {
    let mins = Math.floor(time / 60);
    let secs = Math.floor(time % 60);
    if (mins < 10) mins = `0${String(mins)}`;
    if (secs < 10) secs = `0${String(secs)}`;

    return `${mins}:${secs}`;
  }
}
