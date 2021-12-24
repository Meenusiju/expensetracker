import { initializeApp } from 'firebase/app';
import {  getFirestore } from 'firebase/firestore';

const firebaseApp = initializeApp({
  apiKey: "AIzaSyDLN59MTdZfLCMIw3ieEKghJrAzzya-kcA",
  authDomain: "data-viz-9d5f7.firebaseapp.com",
  projectId: "data-viz-9d5f7",
  storageBucket: "data-viz-9d5f7.appspot.com",
  messagingSenderId: "404086317324",
  appId: "1:404086317324:web:34e396e1496c685022e929",
  measurementId: "G-SJT5LMEDR0"
});
export const db = getFirestore(firebaseApp);

