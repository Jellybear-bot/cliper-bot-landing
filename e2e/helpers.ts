import type { Page } from '@playwright/test'

const MOCK_SESSION = JSON.stringify({ discord_id: 'test-user-001', username: 'testclipper' })

/** ตั้ง mock_session cookie เพื่อ simulate การ login (ใช้ได้เฉพาะ dev mode) */
export async function loginAsMockUser(page: Page) {
  await page.goto('/')
  await page.context().addCookies([
    {
      name: 'mock_session',
      value: MOCK_SESSION,
      domain: 'localhost',
      path: '/',
    },
  ])
}
