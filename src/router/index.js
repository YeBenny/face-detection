import { createRouter, createWebHashHistory } from 'vue-router'
import FaceDetectionView from '../views/FaceDetectionView.vue'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'face-detection',
      component: FaceDetectionView
    }
  ]
})

export default router
