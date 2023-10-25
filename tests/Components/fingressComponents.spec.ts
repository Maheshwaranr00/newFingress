import { test, expect, chromium, Page, Browser, BrowserContext} from "@playwright/test";

let page: Page;
let browser: Browser;
let context: BrowserContext;


test.beforeAll(async()=>{
    browser = await chromium.launch({headless:false});
    context = await browser.newContext();
    page = await context.newPage();
    await page.goto('http://192.168.1.49:8086/');    
    await page.locator("text='view_comfy'").waitFor({state:'visible'});
    await page.locator("text='view_comfy'").click();
    //await page.getByTestId("mat-focus-indicator mat-menu-trigger mat-button mat-button-base").first().click();
    await page.getByText('Fingress Explorer').click();
    await page.getByText('   Components   ').click();
    
})
test.afterAll(async()=>{
    await page.close();
    await browser.close();
})
    test('Verify the user can add all the invoice details successfully', async () => {
        
        await test.step('User clicks to Data grid option', async () => {
            await page.getByText('Data Grids').click();
        });
        await test.step('User clicks on the add button', async () => {
            await page.getByRole('button', { name: 'Add' }).click();
        });
        await test.step('User enters the valid invoice number', async () => {
            await page.getByLabel('Invoice No').fill('123AFASF');
        });
        await test.step('User enters the currency linked with the invoice', async () => {
            await page.getByLabel('Currency').fill('asdfasf');
        });
        await test.step('User enters the amount linked with the invoice', async () => {
            await page.getByLabel('Amount').fill('12313');
        });
        await test.step('User clicks on the add button to add the invoice to the grid', async () => {
            await page.getByRole('button', { name: 'Add' }).click();
        });
        await test.step('User clicks on the "delete icon" to delete the existing invoice and confirms by clicking "yes" button', async () => {
            await page.getByText('delete').click();
            await page.getByText('Yes ').click();
        })
    });
    