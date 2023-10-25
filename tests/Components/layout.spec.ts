import {test,expect,chromium, Browser, BrowserContext, Page, Locator} from "@playwright/test";

let browser : Browser;
let context : BrowserContext;
let page : Page;



let baseUrl = "http://192.168.1.49:8086/";

test.beforeEach(async()=>{
     browser = await chromium.launch({headless:false});
     context = await browser.newContext();
     page = await context.newPage();    
     await page.goto(baseUrl);
     await test.step('Navigating to the calendar page from the home page',async()=>{
        await page.locator("//mat-icon[text()='view_comfy']").click();
        await page.locator("//span[text()='Fingress Explorer']").click();
        await page.locator("text='    Components   '").click();
        await page.locator("text='Layouts'").click();
     })
})
test.afterEach(async()=>{
    await page.close();
    await browser.close();
})

test('',async()=>{
    await page.locator('')
})