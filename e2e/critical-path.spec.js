import { test, expect } from '@playwright/test';

test.describe('FitSync Critical User Journey (Project Plan E2E)', () => {
  test('1. Unauthenticated guest lands on Login and can sign in', async ({ page }) => {
    await page.goto('/login');
    await expect(page).toHaveURL(/.*login/);

    // Verify Hero title & login actions
    await expect(page.getByText(/Adaptive Fitness/i)).toBeVisible();
    await expect(page.getByText(/Continue with Google/i)).toBeVisible();

    const demoBtn = page.getByText(/Continue as Demo Athlete/i);
    await expect(demoBtn).toBeVisible();
    await demoBtn.click();

    // Should redirect to Dashboard
    await expect(page).toHaveURL(/.*dashboard/);
    await expect(page.getByRole('heading', { name: /Alex Rivera/i })).toBeVisible({ timeout: 10000 });
  });

  test.describe('Authenticated Athlete Journeys', () => {
    test.beforeEach(async ({ page }) => {
      await page.addInitScript(() => {
        localStorage.setItem('fitsync_dev_auth', 'true');
      });
    });

    test('2. Dashboard displays biometrics, calorie ring, water, and today workout', async ({ page }) => {
      await page.goto('/dashboard');
      await expect(page).toHaveURL(/.*dashboard/);

      // Verify User Greeting & Biometrics
      await expect(page.getByRole('heading', { name: /Alex Rivera/i })).toBeVisible({ timeout: 10000 });
      await expect(page.getByText(/24.6/)).toBeVisible(); // BMI
      await expect(page.getByText(/Normal/i).first()).toBeVisible(); // BMI category

      // Verify Calorie Target Ring & Nutrition Summary
      await expect(page.getByText(/Target: 2505 kcal/i)).toBeVisible(); // Calorie target
      await expect(page.getByRole('heading', { name: 'Water' })).toBeVisible();
      await expect(page.getByText(/Today's Workout/i)).toBeVisible();
    });

    test('3. Workout player initializes and displays active timer controls', async ({ page }) => {
      await page.goto('/workout');
      await expect(page).toHaveURL(/.*workout/);

      // Check exercise stepper and interactive timer controls
      await expect(page.getByText(/Exercise \d+ of \d+/i)).toBeVisible({ timeout: 10000 });
      await expect(page.getByRole('heading', { name: /Full Workout Queue/i })).toBeVisible();
      await expect(page.getByRole('button', { name: /Pause|Resume/i })).toBeVisible();
      await expect(page.getByText(/\+15s Rest/i)).toBeVisible();
    });

    test('4. Cultural diet plan displays adapted meals and pantry manager', async ({ page }) => {
      await page.goto('/nutrition');
      await expect(page).toHaveURL(/.*nutrition/);

      // Verify Meal Plan Categories
      await expect(page.getByText(/Cultural Meal Plan/i)).toBeVisible({ timeout: 10000 });
      await expect(page.getByText(/Today's Adapted Menu/i)).toBeVisible();
      await expect(page.getByText(/Breakfast/i)).toBeVisible();
      await expect(page.getByText(/Lunch/i)).toBeVisible();
      await expect(page.getByText(/Dinner/i)).toBeVisible();

      // Verify Pantry Staples Section
      await expect(page.getByText(/Kitchen Pantry Staples/i)).toBeVisible();
    });

    test('5. Progress analytics displays streak calendar and charts', async ({ page }) => {
      await page.goto('/progress');
      await expect(page).toHaveURL(/.*progress/);

      // Verify KPI cards and charts
      await expect(page.getByText(/Fitness Analytics/i)).toBeVisible({ timeout: 10000 });
      await expect(page.getByText(/Daily Calories vs Target/i)).toBeVisible();
      await expect(page.getByText(/Body Weight Progression/i)).toBeVisible();
      await expect(page.getByText(/Workout Consistency/i)).toBeVisible();
    });

    test('6. Medical disclaimer notice is present on layout footer', async ({ page }) => {
      await page.goto('/dashboard');
      await expect(
        page.getByText(/FitSync provides general fitness, biometric and nutritional guidance/i)
      ).toBeVisible({ timeout: 10000 });
    });
  });
});
