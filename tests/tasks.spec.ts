import { test, expect, Page } from '@playwright/test';
import testCases, { TestCase } from '../data/testCases';

// ─────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────
const BASE_URL = 'https://animated-gingersnap-8cf7f2.netlify.app';
const CREDENTIALS = {
  username: 'admin',
  password: 'password123',
};

// ─────────────────────────────────────────────
// Helper: Login
// ─────────────────────────────────────────────
async function login(page: Page): Promise<void> {
  await page.goto(BASE_URL);

  await page.getByLabel(/username/i).fill(CREDENTIALS.username);
  await page.getByLabel(/password/i).fill(CREDENTIALS.password);
  await page.getByRole('button', { name: /sign in|log in|submit/i }).click();

  // Wait for sidebar to appear after login
  await expect(page.getByRole('button', { name: /web application/i }).first()).toBeVisible({
    timeout: 10_000,
  });
}

// ─────────────────────────────────────────────
// Helper: Navigate to a project via the sidebar
// The sidebar contains <button> or <a> elements with the project name.
// We scope to the nav/sidebar to avoid matching the page heading.
// ─────────────────────────────────────────────
async function navigateToProject(page: Page, projectName: string): Promise<void> {
  // Target the sidebar link specifically (it's a button in the nav)
  const sidebarLink = page
    .locator('nav, aside, [class*="sidebar"], [class*="Sidebar"]')
    .getByText(projectName, { exact: true })
    .first();

  // Fallback: use the role=button that contains the project name
  const buttonLink = page.getByRole('button', { name: new RegExp(projectName, 'i') }).first();

  // Try sidebar scoped locator first, fall back to button role
  if (await sidebarLink.isVisible().catch(() => false)) {
    await sidebarLink.click();
  } else {
    await buttonLink.click();
  }

  // Wait for column headers to confirm navigation succeeded
  await expect(page.getByText('To Do').first()).toBeVisible({ timeout: 10_000 });
}

// ─────────────────────────────────────────────
// Helper: Assert task exists in the correct column with correct tags
// ─────────────────────────────────────────────
async function assertTaskInColumn(
  page: Page,
  taskName: string,
  columnName: string,
  expectedTags: string[]
): Promise<void> {
  // Find the column by its heading text, then look for the task card inside it
  // The board layout: each column is a container with a heading + list of cards
  const column = page
    .locator('div, section')
    .filter({
      has: page.locator('h2, h3, [class*="column-header"], [class*="columnHeader"]').filter({
        hasText: columnName,
      }),
    })
    .first();

  await expect(column).toBeVisible({ timeout: 8_000 });

  // Assert the task card is inside that column
  const taskCard = column.getByText(taskName, { exact: true });
  await expect(taskCard).toBeVisible({ timeout: 8_000 });

  // Assert each expected tag appears on the page (tags are visible near the task)
  for (const tag of expectedTags) {
    const tagLocator = page.getByText(tag, { exact: true }).first();
    await expect(tagLocator).toBeVisible({ timeout: 5_000 });
  }
}

// ─────────────────────────────────────────────
// Data-driven test loop
// Each test case is generated from the testCases array —
// no copy-paste, fully scalable.
// ─────────────────────────────────────────────
for (const tc of testCases) {
  test(`TC${tc.id}: [${tc.project}] "${tc.taskName}" is in "${tc.column}" with tags ${JSON.stringify(tc.tags)}`, async ({
    page,
  }) => {
    // Step 1: Login
    await login(page);

    // Step 2: Navigate to the target project via sidebar
    await navigateToProject(page, tc.project);

    // Step 3: Assert task is in the correct column with the correct tags
    await assertTaskInColumn(page, tc.taskName, tc.column, tc.tags);
  });
}
