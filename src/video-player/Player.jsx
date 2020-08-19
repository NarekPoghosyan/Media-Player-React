import React from "react";
import ReactPlayer from "react-player";
import './style.css'

export default class Player extends React.Component {
  constructor(options) {
    super(options)
    this.player = React.createRef();
    this.loadingRef = React.createRef();
    this.state = {
      playing: false,
      url: options.url,
      playClass: 'play_control',
      volume: 1,
      classVolume: "minus_volume",
      time: '00:00:00',
      videoLength: 0,
      intervalInstance: 0,
      progressBarWidth: 0,
      progressCircleLeft: 0,
      videoEnded: false,
      volumeJumpValue: 0.1,
      sizeChangeed: false,
      classMain: '',
      sizeClassWidth: '640px',
      sizeClassHeight: '360px',
      classSize: "size_control",
    }
  }

  play = () => {
    this.setState({ playing: true, })
    this.setState({
      intervalInstance: setInterval(() => {
        this.calculateProgress()
      }, 100)
    })
  }

  restart = () => {
    clearInterval(this.state.intervalInstance)
    this.setState({
      intervalInstance: setInterval(() => {
        this.calculateProgress()
      }, 100)
    })
    this.player.current.seekTo(0, "seconds");
    this.setState({ playing: true, time: '00:00:00', videoEnded: false, playClass: "play_control" })
  }

  pause = () => {
    clearInterval(this.state.intervalInstance)
    this.setState({ playing: false })
  }

  changeVideoCurrentTimeRight = () => {
    if (this.player.current.getCurrentTime() < this.player.current.getDuration()) {
      this.player.current.seekTo(this.player.current.getCurrentTime() + 5)
    }
  }

  changeVideoCurrentTimeLeft = () => {
    if (this.player.current.getCurrentTime() > 0) {
      this.player.current.seekTo(this.player.current.getCurrentTime() - 5)
    }
    this.setState({ playClass: "play_control" })
  }

  videoStarted = () => {
    let seconds = Math.floor(this.player.current.player.player.player.duration % 60);
    let minutes = Math.floor(this.player.current.player.player.player.duration / 60);
    let hours = Math.floor(this.player.current.player.player.player.duration / 3600);
    this.setState({ videoLength: `${("0" + hours).substr(-2)}:${("0" + minutes).substr(-2)}:${("0" + seconds).substr(-2)}` })
  }

  isEnded = () => {
    this.setState({ playClass: 'retry_control', videoEnded: true, })
  }

  volumePlus = () => {
    if (this.state.volume >= 0) {
      this.setState({ classVolume: "minus_volume" })
    }
    const nextValue = Number((this.state.volume + this.state.volumeJumpValue).toFixed(1));
    this.setState({ volume: nextValue >= 1 ? 1 : nextValue });
  }

  volumeMinus = () => {
    if (this.state.volume === 0.1) {
      this.setState({ classVolume: "volume_no" })
    }
    const nextValue = Number((this.state.volume - this.state.volumeJumpValue).toFixed(1));
    this.setState({ volume: nextValue <= 0 ? 0 : nextValue });
  }

  sizeChange = () => {
    if (!this.state.sizeChangeed) {
      this.setState({ sizeChangeed: true, classSize: 'resize_control', classMain: 'main', sizeClassWidth: '100%', sizeClassHeight: '100%' })
    } else {
      this.setState({ sizeChangeed: false, classSize: 'size_control', classMain: '', sizeClassWidth: '640px', sizeClassHeight: '360px' })
    }
  }

  calculateProgress = () => {
    const progressBarSpeed = this.loadingRef.current.clientWidth / this.player.current.getDuration();
    const progress = progressBarSpeed * this.player.current.getCurrentTime();
    this.setState({ progressBarWidth: `${progress}px`, progressCircleLeft: `${progress + 15 > this.loadingRef.current.clientWidth ? progress - 15 : progress}px` })
  }

  onProgress = () => {
    let seconds = Math.floor(this.player.current.getCurrentTime() % 60);
    let minutes = Math.floor(this.player.current.getCurrentTime() / 60);
    let hours = Math.floor(this.player.current.getCurrentTime() / 3600);
    this.setState({ time: `${("0" + hours).substr(-2)}:${("0" + minutes).substr(-2)}:${("0" + seconds).substr(-2)}` })
  }

  checkKey = event => {
    switch (event.keyCode) {
      case 27:
        this.setState({ sizeChangeed: false, classSize: 'size_control', classMain: '', sizeClassWidth: '640px', sizeClassHeight: '360px' })
        break;
      case 37:
        this.changeVideoCurrentTimeLeft()
        break;
      case 38:
        this.volumePlus()
        break;
      case 39:
        this.changeVideoCurrentTimeRight()
        break;
      case 40:
        this.volumeMinus()
        break;
    }
  }

  render() {
    return (
      <div className="container" onKeyUp={this.checkKey}>
        <div className="player_container" style={{ width: this.state.sizeClassWidth, height: this.state.sizeClassHeight }}>
          <ReactPlayer
            url={this.state.url}
            ref={this.player}
            playing={this.state.playing}
            volume={this.state.volume}
            onProgress={this.onProgress}
            onEnded={this.isEnded}
            onDuration={this.videoStarted}
            width='100%'
            height='100%'
          />
          <div className="controls_container">
            <div className="loading" ref={this.loadingRef}>
              <div className="progress_bar" style={{ width: this.state.progressBarWidth }}></div>
              <div className="progress_circle" style={{ left: this.state.progressCircleLeft }}></div>
            </div>
            <div className="controls">
              <div className="play_pause_controls">
                <button className={this.state.playClass} onClick={this.state.videoEnded ? this.restart : this.play}>{this.state.playButtonText}</button>
                <div><button className="pause_control" onClick={this.pause}></button></div>
                <div className="data_control">{this.state.time} / {this.state.videoLength} </div>
              </div>
              <div className="vol_size_controls">
                <div className="volume_controls">
                  <button className={this.state.classVolume} onClick={this.volumeMinus}></button>
                  <button className="volume_yes" onClick={this.volumePlus}></button>
                </div>
                <button className={this.state.classSize} onClick={this.sizeChange}></button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}