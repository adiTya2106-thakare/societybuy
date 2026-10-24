import { test, expect } from "@playwright/test";

test.describe("Public pages", () => {
  test("homepage loads", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("Buy Together")).toBeVisible();
    await expect(page.getByText("Save Together")).toBeVisible();
  });

  test("login page loads", async ({ page }) => {
    await page.goto("/login");
    await expect(page.getByLabel("Email address")).toBeVisible();
    await expect(page.getByLabel("Password")).toBeVisible();
  });

  test("register page loads", async ({ page }) => {
    await page.goto("/register");
    await expect(page.getByText("Create your account")).toBeVisible();
  });

  test("bulk deals public page loads", async ({ page }) => {
    await page.goto("/bulk-deals");
    await expect(page).toHaveTitle(/SocietyBuy/);
  });
});

test.describe("Authentication flow", () => {
  test("invalid login shows error", async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel("Email address").fill("notexist@test.com");
    await page.getByLabel("Password").fill("WrongPass123");
    await page.getByRole("button", { name: "Login" }).click();
    await expect(page.getByText(/Invalid email or password/i)).toBeVisible({ timeout: 5000 });
  });

  test("register with mismatched passwords shows error", async ({ page }) => {
    await page.goto("/register");
    await page.getByLabel("First name").fill("Test");
    await page.getByLabel("Last name").fill("User");
    await page.getByLabel("Email address").fill("test@example.com");
    await page.getByLabel("Mobile number").fill("9800000000");
    await page.getByLabel("Password").fill("Password@1234");
    await page.getByLabel("Confirm password").fill("Different@5678");
    await page.getByRole("button", { name: "Create Account" }).click();
    await expect(page.getByText(/Passwords do not match/i)).toBeVisible();
  });
});

test.describe("Protected routes", () => {
  test("app dashboard redirects to login when not authenticated", async ({ page }) => {
    await page.goto("/app");
    await expect(page).toHaveURL(/\/login/);
  });

  test("admin dashboard redirects to login when not authenticated", async ({ page }) => {
    await page.goto("/admin");
    await expect(page).toHaveURL(/\/login/);
  });
});
