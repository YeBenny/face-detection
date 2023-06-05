import { createRouter, createWebHistory } from 'vue-router'
import FaceDetectionView from '../views/FaceDetectionView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'face-detection',
      component: FaceDetectionView
    }
  ]
})

export default router
