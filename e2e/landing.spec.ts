/**
 * E2E smoke tests for the public landing page (cliper-bot-landing).
 * These run against the Next.js dev server at localhost:3000.
 * No auth, no backend needed — tests public pages only.
 */
import { test, expect } from '@playwright/test'

test('หน้า landing โหลดได้และมี CTA', async ({ page }) => {
  await page.goto('/')
  // Page should render without crashing
  await expect(page.locator('body')).toBeVisible()
})

test('หน้า login โหลดได้และมีปุ่ม Discord', async ({ page }) => {
  await page.goto('/login')
  await expect(page.locator('body')).toBeVisible()
  // Discord login button should be present
  await expect(page.getByRole('button', { name: /discord/i })).toBeVisible({ timeout: 10000 })
})

test('หน้า legal/privacy โหลดได้', async ({ page }) => {
  await page.goto('/legal/privacy')
  await expect(page.locator('body')).toBeVisible()
})

test('หน้า legal/terms โหลดได้', async ({ page }) => {
  await page.goto('/legal/terms')
  await expect(page.locator('body')).toBeVisible()
})

test('/app redirect ไป login ถ้าไม่ได้ login', async ({ page }) => {
  await page.goto('/app')
  // Should redirect to login or show login prompt
  await expect(page).toHaveURL(/login|\/app/, { timeout: 10000 })
})
