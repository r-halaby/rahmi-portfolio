"use client";

import { StoryVideoPlayer } from "./story-video-player";

export function GardenVideoPlayer({ src }: { src: string }) {
  return (
    <StoryVideoPlayer
      src={src}
      style={{ maxWidth: "900px", maxHeight: "80vh" }}
      emailTo="rahmihalaby@gmail.com"
      emailSubject="I better just give you the gig now!"
    />
  );
}
