<script setup>
import { onMounted } from 'vue'

import * as faceLandmarksDetection from '@tensorflow-models/face-landmarks-detection'
import * as util from '../shared/util'

// declare the canvas variable and setting up the context
let detector
let video
let canvas
let ctx

onMounted(() => {
  video = document.getElementById('video')
  canvas = document.getElementById('canvas')
  ctx = canvas.getContext('2d')

  accessCamera()

  video.addEventListener('loadeddata', async () => {
    await createDetector()
    renderPrediction()
  })
})

const sleep = (time = 0) => {
  new Promise((res) => {
    setTimeout(res, time)
  })
}

const checkIsWechat = (() => {
  const agentInfo = navigator.userAgent.toLowerCase()
  const isWechatEnv = ['micromessenger', 'wechat', 'weixin'].some((sign) =>
    agentInfo.includes(sign)
  )
  return () => isWechatEnv
})()

const accessCamera = async () => {
  const width = window.innerWidth
  const height = window.innerHeight
  const cameraWidth = util.isMobile() ? (width > height ? width : height) : width
  const cameraHeight = util.isMobile() ? (width > height ? height : width) : height
  const constraints = {
    audio: false,
    video: {
      width: cameraWidth,
      height: cameraHeight
    }
  }

  if (checkIsWechat()) {
    const stream = await navigator.mediaDevices.getUserMedia(constraints)
    const videoTracks = stream.getVideoTracks()?.[0] ?? null
    await sleep(1000)
    videoTracks?.stop?.()
    await sleep(100)
  }

  const stream = await navigator.mediaDevices.getUserMedia(constraints)
  video.srcObject = stream
  await video.play()

  const videoWidth = video.videoWidth
  const videoHeight = video.videoHeight
  // Must set below two lines, otherwise video element doesn't show.
  video.width = videoWidth
  video.height = videoHeight

  canvas.width = videoWidth
  canvas.height = videoHeight
}

const createDetector = async () => {
  const model = faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh
  const detectorConfig = {
    maxFaces: 1,
    refineLandmarks: true,
    runtime: 'mediapipe',
    solutionPath: 'https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh'
  }
  detector = await faceLandmarksDetection.createDetector(model, detectorConfig)
}

const renderPrediction = async () => {
  if (detector === null) return

  const faces = await detector.estimateFaces(video, {
    flipHorizontal: false
  })

  // Using canvas to draw the video first
  const videoWidth = video.videoWidth
  const videoHeight = video.videoHeight

  ctx.clearRect(0, 0, videoWidth, videoHeight)
  ctx.fillStyle = 'transparent'
  ctx.fillRect(0, 0, videoWidth, videoHeight)

  util.drawResults(ctx, faces, true, true)

  requestAnimationFrame(renderPrediction)
}
</script>

<template>
  <video id="video" playsInline muted></video>
  <canvas id="canvas"></canvas>
</template>

<style scoped>
#video {
  width: 100%;
  height: 100%;
}

#canvas {
  position: absolute;
  top: 0;
  left: 0;
}
</style>
