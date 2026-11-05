import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || '/api/v1';

export const api = axios.create({ baseURL: BASE_URL });

// Attach Firebase ID token (or dev token) to every request
api.interceptors.request.use(async (config) => {
  try {
    const { auth, firebaseConfigured } = await import('../config/firebase.config.js');
    if (firebaseConfigured && auth?.currentUser) {
      const token = await auth.currentUser.getIdToken();
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Dev bypass: server accepts any token or none when DEV_AUTH_BYPASS=true
  } catch {
    // Silently skip — server handles missing token
  }
  return config;
});

// Convenience wrappers
export const getMe = () => api.get('/users/me').then((r) => r.data.user);
export const deleteAccount = () => api.delete('/users/me').then((r) => r.data);
export const onboard = (data) => api.post('/users/onboard', data).then((r) => r.data.user);
export const getWorkoutPlan = () => api.get('/workouts/plan').then((r) => r.data.plan);
export const getWorkoutToday = (day) => api.get(`/workouts/today?day=${day}`).then((r) => r.data.day);
export const completeWorkout = () => api.post('/workouts/complete').then((r) => r.data);
export const generateWorkout = () => api.post('/workouts/generate').then((r) => r.data.plan);
export const getDietPlan = () => api.get('/diet/plan').then((r) => r.data.plan);
export const generateDiet = () => api.post('/diet/generate').then((r) => r.data.plan);
export const swapMeal = (mealType) => api.post(`/diet/swap/${mealType}`).then((r) => r.data.meal);
export const updatePantry = (list) => api.put('/diet/pantry', { pantryInventory: list }).then((r) => r.data);
export const logMeal = (data) => api.post('/logs/meal', data).then((r) => r.data);
export const logWeight = (weightKg) => api.post('/logs/weight', { weightKg }).then((r) => r.data);
export const logWater = (waterMl) => api.post('/logs/water', { waterMl }).then((r) => r.data);
export const getTodayLog = () => api.get('/logs/today').then((r) => r.data.log);
export const searchFoods = (q) => api.get(`/logs/foods?q=${encodeURIComponent(q)}`).then((r) => r.data.foods);
export const getProgress = (range = '30d') => api.get(`/logs/progress?range=${range}`).then((r) => r.data.logs);
export const updateBurnTask = (id, status) => api.patch(`/logs/burn-task/${id}`, { status }).then((r) => r.data);
export const updateFcmToken = (fcmToken) => api.patch('/users/me/fcm-token', { fcmToken }).then((r) => r.data);

// Gemini AI endpoints
export const estimateFoodAI = (foodName, portion) => api.post('/ai/estimate-food', { foodName, portion }).then((r) => r.data.data);
export const generatePantryRecipeAI = (mealType, targetCalories) => api.post('/ai/pantry-recipe', { mealType, targetCalories }).then((r) => r.data.data);
export const getBalanceAdviceAI = (surplusKcal, exerciseName, durationMins) => api.post('/ai/balance-advice', { surplusKcal, exerciseName, durationMins }).then((r) => r.data.data);

