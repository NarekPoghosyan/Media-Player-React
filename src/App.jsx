import React from "react";
import Player from "./video-player/Player";
import Video from "./video-player/assets/spaceX.mp4";

const App = () => {
  return (
    <div className="app">
      <Player url={Video} />
    </div>
  );
};

export default App;
