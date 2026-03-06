import { test, expect, Page } from '@playwright/test';
import testCases, { TestCase } from '../data/testCases';

const BASE_URL = 'https://animated-gingersnap-8cf7f2.netlify.app';
const CREDENTIALS = {
  username: 'admin',
  password: 'password123',
};

async function login(page: Page): Promise<void> {
  await page.goto(BASE_URL);

  await page.getByLabel(/username/i).fill(CREDENTIALS.username);
  await page.getByLabel(/password/i).fill(CREDENTIALS.password);
  await page.getByRole('button', { name: /sign in|log in|submit/i }).click();
  await expect(page.getByRole('button', { name: /web application/i }).first()).toBeVisible({
    timeout: 10_000,
  });
}

async function navigateToProject(page: Page, projectName: string): Promise<void> {
  const sidebarLink = page
    .locator('nav, aside, [class*="sidebar"], [class*="Sidebar"]')
    .getByText(projectName, { exact: true })
    .first();
  const buttonLink = page.getByRole('button', { name: new RegExp(projectName, 'i') }).first();
  if (await sidebarLink.isVisible().catch(() => false)) {
    await sidebarLink.click();
  } else {
    await buttonLink.click();
  }
  await expect(page.getByText('To Do').first()).toBeVisible({ timeout: 10_000 });
}

async function assertTaskInColumn(
  page: Page,
  taskName: string,
  columnName: string,
  expectedTags: string[]
): Promise<void> {
  
  const column = page
    .locator('div, section')
    .filter({
      has: page.locator('h2, h3, [class*="column-header"], [class*="columnHeader"]').filter({
        hasText: columnName,
      }),
    })
    .first();

  await expect(column).toBeVisible({ timeout: 8_000 });

  const taskCard = column.getByText(taskName, { exact: true });
  await expect(taskCard).toBeVisible({ timeout: 8_000 });

  for (const tag of expectedTags) {
    const tagLocator = page.getByText(tag, { exact: true }).first();
    await expect(tagLocator).toBeVisible({ timeout: 5_000 });
  }
}

for (const tc of testCases) {
  test(`TC${tc.id}: [${tc.project}] "${tc.taskName}" is in "${tc.column}" with tags ${JSON.stringify(tc.tags)}`, async ({
    page,
  }) => {
    await login(page);
    await navigateToProject(page, tc.project);
    await assertTaskInColumn(page, tc.taskName, tc.column, tc.tags);
  });
}
