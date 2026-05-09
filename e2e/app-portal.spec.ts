/**
 * E2E tests สำหรับ authenticated /app/* pages
 * ใช้ mock_session cookie + NEXT_PUBLIC_PORTAL_MOCK_MODE=true (ตั้งใน playwright.config.ts)
 */
import { test, expect } from '@playwright/test'
import { loginAsMockUser } from './helpers'

test.beforeEach(async ({ page }) => {
  await loginAsMockUser(page)
})

// ─── Auth guard ───────────────────────────────────────────────────────────────

test('/app ไม่มี session → redirect ไป /login', async ({ page }) => {
  await page.context().clearCookies()
  await page.goto('/app')
  await expect(page).toHaveURL(/\/login/, { timeout: 10000 })
})

test('/app มี session → redirect ไป /app/overview', async ({ page }) => {
  await page.goto('/app')
  await expect(page).toHaveURL(/\/app\/overview/, { timeout: 10000 })
})

// ─── Overview ─────────────────────────────────────────────────────────────────

test('/app/overview โหลดและแสดง nav links', async ({ page }) => {
  await page.goto('/app/overview')
  // ใช้ href selector แทน role text — ไม่ขึ้นกับ translation
  await expect(page.locator('a[href="/app/overview"]').first()).toBeVisible({ timeout: 10000 })
  await expect(page.locator('a[href="/app/campaigns"]').first()).toBeVisible()
  await expect(page.locator('a[href="/app/submissions"]').first()).toBeVisible()
  await expect(page.locator('a[href="/app/withdraw"]').first()).toBeVisible()
  await expect(page.locator('a[href="/app/settings"]').first()).toBeVisible()
})

test('/app/overview แสดง mock data ไม่ crash', async ({ page }) => {
  await page.goto('/app/overview')
  await expect(page.locator('body')).toBeVisible({ timeout: 10000 })
  await expect(page.getByText('Application error')).not.toBeVisible()
})

// ─── Campaigns ────────────────────────────────────────────────────────────────

test('/app/campaigns โหลดได้', async ({ page }) => {
  await page.goto('/app/campaigns')
  await expect(page.locator('body')).toBeVisible({ timeout: 10000 })
  await expect(page.getByText('Application error')).not.toBeVisible()
})

test('/app/campaigns มี search input', async ({ page }) => {
  await page.goto('/app/campaigns')
  // input type=text หรือ search ใช้ locator ตาม element
  await expect(page.locator('input[type="text"], input[type="search"]').first()).toBeVisible({ timeout: 10000 })
})

// ─── Earnings ─────────────────────────────────────────────────────────────────

test('/app/earnings โหลดได้', async ({ page }) => {
  await page.goto('/app/earnings')
  await expect(page.locator('body')).toBeVisible({ timeout: 10000 })
  await expect(page.getByText('Application error')).not.toBeVisible()
})

// ─── Submissions ──────────────────────────────────────────────────────────────

test('/app/submissions โหลดได้', async ({ page }) => {
  await page.goto('/app/submissions')
  await expect(page.locator('body')).toBeVisible({ timeout: 10000 })
  await expect(page.getByText('Application error')).not.toBeVisible()
})

// ─── Withdraw ─────────────────────────────────────────────────────────────────

test('/app/withdraw โหลดได้', async ({ page }) => {
  await page.goto('/app/withdraw')
  await expect(page.locator('body')).toBeVisible({ timeout: 10000 })
  await expect(page.getByText('Application error')).not.toBeVisible()
})

// ─── Settings ─────────────────────────────────────────────────────────────────

test('/app/settings โหลดได้', async ({ page }) => {
  await page.goto('/app/settings')
  await expect(page.locator('body')).toBeVisible({ timeout: 10000 })
  await expect(page.getByText('Application error')).not.toBeVisible()
})

// ─── Navigation flow ──────────────────────────────────────────────────────────

test('คลิก campaigns nav → ไปหน้า campaigns', async ({ page }) => {
  await page.goto('/app/overview')
  await expect(page.locator('a[href="/app/campaigns"]').first()).toBeVisible({ timeout: 10000 })
  await page.locator('a[href="/app/campaigns"]').first().click()
  await expect(page).toHaveURL(/\/app\/campaigns/, { timeout: 10000 })
})

test('คลิก submissions nav → ไปหน้า submissions', async ({ page }) => {
  await page.goto('/app/overview')
  await expect(page.locator('a[href="/app/submissions"]').first()).toBeVisible({ timeout: 10000 })
  await page.locator('a[href="/app/submissions"]').first().click()
  await expect(page).toHaveURL(/\/app\/submissions/, { timeout: 10000 })
})
