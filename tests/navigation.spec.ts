const { test, expect } = require('@playwright/test');

test.describe('E2E Tests for the Application', () => {
  // Test 1: Sprawdza link do logowania
  test('has link to login page', async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.click('text=login');
    await expect(page).toHaveURL('http://localhost:3000/user/login');
    await expect(page.locator('h1')).toContainText('Welcome Back');
  });

  // Test 2: Sprawdza przekierowanie niezalogowanego użytkownika
  test('redirects unauthenticated user to login page', async ({ page }) => {
    await page.goto('http://localhost:3000/user/profile');
    const message = page.locator('h1');
    await expect(message).toContainText('Musisz się zalogować');
    const subMessage = page.locator('p.text-gray-600');
    await expect(subMessage).toContainText('Aby uzyskać dostęp do tej strony, prosimy o zalogowanie się.');
  });

  // Test 3: Testuje poprawne logowanie i przekierowanie na stronę profilu
  test('successful login redirects to profile page', async ({ page }) => {
    await page.goto('http://localhost:3000/user/login');
    await page.fill('input[name="email"]', 'vamiac80@03.tml.waw.pl');
    await page.fill('input[name="password"]', '123456');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('http://localhost:3000/user/profile', { timeout: 10000 });
    await expect(page.locator('h1')).toContainText('Edytuj Profil');
  });

  // Test 4: Testuje zarządzanie samochodami (lista i dodawanie samochodu)
  test('manages cars (list and add)', async ({ page }) => {
    // Zaloguj się
    await page.goto('http://localhost:3000/user/login');
    await page.fill('input[name="email"]', 'vamiac80@03.tml.waw.pl');
    await page.fill('input[name="password"]', '123456');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('http://localhost:3000/user/profile');

    // Przejdź do listy samochodów
    await page.goto('http://localhost:3000/user/cars');
    await expect(page.locator('h1')).toContainText('Twoje samochody');

    // Dodaj nowy samochód
    await page.fill('input#carMake', 'Seat');
    await page.fill('input#model', 'Leon');
    await page.fill('input#colour', 'Czarny');
    await page.fill('input#yearOfManufacture', '2024');
    await page.click('button[type="submit"]');

    // Sprawdź, czy samochód został dodany do listy
    const carEntry = page.locator('li', { hasText: 'Seat Leon (2024)' });
    await expect(carEntry).toBeVisible();
  });

  // Test 5: Testuje resetowanie hasła
  test('reset password functionality', async ({ page }) => {
    // Przejdź do strony resetowania hasła
    await page.goto('http://localhost:3000/user/reset_password');
  
    // Wypełnij pole e-mail
    await page.fill('input[name="email"]', 'vamiac80@03.tml.waw.pl');
  
    // Kliknij przycisk wysyłania
    await page.click('button[type="submit"]');
  
    // Oczekuj na pojawienie się komunikatu o sukcesie
    const resetMessage = page.locator('div.text-green-500');
    await expect(resetMessage).toBeVisible({ timeout: 10000 });
  
    // Sprawdź treść komunikatu
    await expect(resetMessage).toContainText(
      'Jeśli adress e-mail znajduje sie w bazie. Wysłano e-mail z linkiem do zresetowania hasła. Sprawdź swoją skrzynkę pocztową.'
    );
  });
  
  
  // Test 6: Testuje ponowne wysyłanie maila weryfikacyjnego
  test('resend verification email', async ({ page }) => {
    // Zaloguj się na konto bez zweryfikowanego e-maila
    await page.goto('http://localhost:3000/user/login');
    await page.fill('input[name="email"]', 'vofyabarto@gufum.com');
    await page.fill('input[name="password"]', '123456');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('http://localhost:3000/user/verify');

    // Wyślij ponownie e-mail weryfikacyjny
    const resendButton = page.locator('button', { hasText: 'Wyślij ponownie e-mail weryfikacyjny' });
    await expect(resendButton).toBeVisible();
    await resendButton.click();

    // Sprawdź komunikat o wysłaniu e-maila
    const successMessage = page.locator('p.text-green-500');
    await expect(successMessage).toContainText('E-mail weryfikacyjny został ponownie wysłany!');
  });

  // Test 7: Kliknięcie przycisku "Przejdź do logowania" po komunikacie o niezalogowanym użytkowniku
  test('redirect button from unauthenticated page works', async ({ page }) => {
    await page.goto('http://localhost:3000/user/profile');
    const loginButton = page.locator('button', { hasText: 'Przejdź do logowania' });
    await expect(loginButton).toBeVisible();
    await loginButton.click();
    await expect(page).toHaveURL('http://localhost:3000/user/login');
  });

  // Test 8: Testuje wylogowanie
test('logout redirects to login page', async ({ page }) => {
  // Zaloguj się
  await page.goto('http://localhost:3000/user/login');
  await page.fill('input[name="email"]', 'vamiac80@03.tml.waw.pl');
  await page.fill('input[name="password"]', '123456');
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL('http://localhost:3000/user/profile', {
    timeout: 10000,
  });

  // Kliknij przycisk wylogowania
  await page.locator('button:has-text("Logout")').click();

  // Sprawdź, czy strona przekierowuje do strony glownej
  await expect(page).toHaveURL('http://localhost:3000', {
    timeout: 10000,
  });
});

 // Test 9: Testuje rejestrację nowego użytkownika
test('registration works', async ({ page }) => {
  await page.goto('http://localhost:3000/user/register');
  await page.fill('input[name="email"]', `test+${Date.now()}@example.com`);
  await page.fill('input[name="password"]', 'testpassword');
  await page.fill('input[name="confirmPassword"]', 'testpassword');
  await page.click('button[type="submit"]');

  // Sprawdź, czy wyświetlany jest komunikat o weryfikacji
  await expect(page.locator('h1')).toHaveText('Rejestracja zakończona!', {
    timeout: 5000,
  });

  await expect(
    page.locator('p', {
      hasText: 'Na Twój adres e-mail został wysłany link weryfikacyjny.',
    })
  ).toBeVisible();
});



});
