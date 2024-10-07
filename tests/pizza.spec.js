import { test, expect } from 'playwright-test-coverage';



test('home page', async ({ page }) => {
  await page.goto('/');

  expect(await page.title()).toBe('JWT Pizza');
});

test('create and close franchise', async ({ page }) => {
    await page.goto('http://localhost:5173/');
    await page.getByRole('link', { name: 'Login' }).click();
    await page.getByPlaceholder('Email address').fill('Alia@admin.com');
    await page.getByPlaceholder('Password').click();
    await page.getByPlaceholder('Password').fill('toomanysecrets');
    await page.getByRole('button', { name: 'Login' }).click();
    await page.getByRole('link', { name: 'Admin' }).click();
    await page.getByRole('button', { name: 'Add Franchise' }).click();
    await page.getByPlaceholder('franchise name').click();
    await page.getByPlaceholder('franchise name').fill('newFranchise');
    await page.getByPlaceholder('franchisee admin email').click();
    await page.getByPlaceholder('franchisee admin email').fill('f@jwt.com');
    await page.getByRole('button', { name: 'Create' }).click();
    await expect(page.getByRole('table')).toContainText('newFranchise');
    await expect(page.getByRole('heading')).toContainText('Mama Ricci\'s kitchen');
    await page.getByRole('row', { name: 'newFranchise pizza franchisee' }).getByRole('button').click();
    await expect(page.getByRole('main')).toContainText('Are you sure you want to close the newFranchise franchise? This will close all associated stores and cannot be restored. All outstanding revenue with not be refunded.');
    await page.getByRole('button', { name: 'Close' }).click();
})

test('create and close franchise store', async ({ page }) => {
    await page.goto('http://localhost:5173/');
    await page.getByRole('link', { name: 'Login' }).click();
    await page.getByPlaceholder('Email address').fill('f@jwt.com');
    await page.getByPlaceholder('Password').click();
    await page.getByPlaceholder('Password').fill('franchisee');
    await page.locator('div').filter({ hasText: 'Welcome backEmail' }).nth(2).click();
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page.getByRole('heading')).toContainText('The web\'s best pizza');
    await page.getByLabel('Global').getByRole('link', { name: 'Franchise' }).click();
    await expect(page.getByRole('main')).toContainText('Everything you need to run an JWT Pizza franchise. Your gateway to success.');
    await page.getByRole('button', { name: 'Create store' }).click();
    await page.getByPlaceholder('store name').click();
    await page.getByPlaceholder('store name').fill('Lodi');
    await page.getByRole('button', { name: 'Create' }).click();
    await expect(page.locator('tbody')).toContainText('Lodi');
    await page.getByRole('row', { name: 'Lodi 0 ₿ Close' }).getByRole('button').click();
    await expect(page.getByRole('main')).toContainText('Are you sure you want to close the pizzaPocket store Lodi ? This cannot be restored. All outstanding revenue with not be refunded.');
    await page.getByRole('button', { name: 'Close' }).click();
    await expect(page.locator('tbody')).not.toContainText('Lodi');
})

test('register', async ({ page }) => {
    await page.goto('http://localhost:5173/');
    await page.getByRole('link', { name: 'Register' }).click();
    await page.getByPlaceholder('Full name').click();
    await page.getByPlaceholder('Full name').fill('Maria');
    await page.getByPlaceholder('Email address').click();
    await page.getByPlaceholder('Email address').fill('maria@fakee.com');
    await page.getByPlaceholder('Password').click();
    await page.getByPlaceholder('Password').fill('m');
    await expect(page.getByRole('heading')).toContainText('Welcome to the party');
    await page.locator('div').filter({ hasText: /^Password$/ }).getByRole('button').click();
    await page.locator('div').filter({ hasText: /^Password$/ }).getByRole('button').click();
    await page.getByRole('button', { name: 'Register' }).click();
    await expect(page.locator('#navbar-dark')).toContainText('Logout');
})

test('visit franchise tab', async ({ page }) => {
    await page.goto('http://localhost:5173/');
    await page.getByLabel('Global').getByRole('link', { name: 'Franchise' }).click();
    await expect(page.getByText('So you want a piece of the')).toBeVisible();
    await page.getByRole('link', { name: '-555-5555' }).click();
    await expect(page.locator('tbody')).toContainText('2020');
    await page.getByRole('link', { name: 'login', exact: true }).click();
    await expect(page.locator('form')).toContainText('Are you new? Register instead.');
    await page.getByRole('main').getByText('Register').click();
} )

test('verify order and logout', async ({ page }) => {
    await page.goto('http://localhost:5173/');
    await page.getByRole('link', { name: 'Register' }).click();
    await page.getByPlaceholder('Full name').click();
    await page.getByPlaceholder('Full name').fill('Ali');
    await page.getByPlaceholder('Email address').click();
    await page.getByPlaceholder('Email address').fill('ali@ali.com');
    await page.getByPlaceholder('Password').click();
    await page.getByPlaceholder('Password').fill('a');
    await page.getByRole('button', { name: 'Register' }).click();
    await page.getByRole('button', { name: 'Order now' }).click();
    await page.getByRole('combobox').selectOption('148');
    await page.getByRole('link', { name: 'Image Description Pepperoni' }).click();
    await page.getByRole('button', { name: 'Checkout' }).click();
    await page.getByRole('button', { name: 'Pay now' }).click();
    await page.getByText('VerifyOrder more').click();
    await page.getByRole('button', { name: 'Verify' }).click();
    await page.getByRole('button', { name: 'Close' }).click();
    await page.getByRole('link', { name: 'Logout' }).click();
    await expect(page.locator('#navbar-dark')).toContainText('Login');
})

test('purchase with login', async ({ page }) => {
    await page.route('*/**/api/order/menu', async (route) => {
      const menuRes = [
        { id: 1, title: 'Veggie', image: 'pizza1.png', price: 0.0038, description: 'A garden of delight' },
        { id: 2, title: 'Pepperoni', image: 'pizza2.png', price: 0.0042, description: 'Spicy treat' },
      ];
      expect(route.request().method()).toBe('GET');
      await route.fulfill({ json: menuRes });
    });
  
    await page.route('*/**/api/franchise', async (route) => {
      const franchiseRes = [
        {
          id: 2,
          name: 'LotaPizza',
          stores: [
            { id: 4, name: 'Lehi' },
            { id: 5, name: 'Springville' },
            { id: 6, name: 'American Fork' },
          ],
        },
        { id: 3, name: 'PizzaCorp', stores: [{ id: 7, name: 'Spanish Fork' }] },
        { id: 4, name: 'topSpot', stores: [] },
      ];
      expect(route.request().method()).toBe('GET');
      await route.fulfill({ json: franchiseRes });
    });
  
    await page.route('*/**/api/auth', async (route) => {
      const loginReq = { email: 'd@jwt.com', password: 'a' };
      const loginRes = { user: { id: 3, name: 'Kai Chen', email: 'd@jwt.com', roles: [{ role: 'diner' }] }, token: 'abcdef' };
      expect(route.request().method()).toBe('PUT');
      expect(route.request().postDataJSON()).toMatchObject(loginReq);
      await route.fulfill({ json: loginRes });
    });
  
    await page.route('*/**/api/order', async (route) => {
      const orderReq = {
        items: [
          { menuId: 1, description: 'Veggie', price: 0.0038 },
          { menuId: 2, description: 'Pepperoni', price: 0.0042 },
        ],
        storeId: '4',
        franchiseId: 2,
      };
      const orderRes = {
        order: {
          items: [
            { menuId: 1, description: 'Veggie', price: 0.0038 },
            { menuId: 2, description: 'Pepperoni', price: 0.0042 },
          ],
          storeId: '4',
          franchiseId: 2,
          id: 23,
        },
        jwt: 'eyJpYXQ',
      };
      expect(route.request().method()).toBe('POST');
      expect(route.request().postDataJSON()).toMatchObject(orderReq);
      await route.fulfill({ json: orderRes });
    });
  
    await page.goto('http://localhost:5173/');
  
    // Go to order page
    await page.getByRole('button', { name: 'Order now' }).click();
  
    // Create order
    await expect(page.locator('h2')).toContainText('Awesome is a click away');
    await page.getByRole('combobox').selectOption('4');
    await page.getByRole('link', { name: 'Image Description Veggie A' }).click();
    await page.getByRole('link', { name: 'Image Description Pepperoni' }).click();
    await expect(page.locator('form')).toContainText('Selected pizzas: 2');
    await page.getByRole('button', { name: 'Checkout' }).click();
  
    // Login
    await page.getByPlaceholder('Email address').click();
    await page.getByPlaceholder('Email address').fill('d@jwt.com');
    await page.getByPlaceholder('Email address').press('Tab');
    await page.getByPlaceholder('Password').fill('a');
    await page.getByRole('button', { name: 'Login' }).click();
  
    // Pay
    await expect(page.getByRole('main')).toContainText('Send me those 2 pizzas right now!');
    await expect(page.locator('tbody')).toContainText('Veggie');
    await expect(page.locator('tbody')).toContainText('Pepperoni');
    await expect(page.locator('tfoot')).toContainText('0.008 ₿');
    await page.getByRole('button', { name: 'Pay now' }).click();
  
    // Check balance
    await expect(page.getByText('0.008')).toBeVisible();
  });