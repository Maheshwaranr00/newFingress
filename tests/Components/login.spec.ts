import {test, expect,Browser,BrowserContext,Page,chromium, Locator} from "@playwright/test";

let browser : Browser;
let context : BrowserContext;
let page : Page;
let otp : Locator[];

let baseUrl = "http://192.168.1.49:8086/";

test.beforeAll(async()=>{
     browser = await chromium.launch();
     context = await browser.newContext();
     page = await context.newPage();
     await page.goto(baseUrl);
     await test.step('Landed on the Login page from the home page',async()=>{
        await page.locator("//mat-icon[text()='view_comfy']").click();
        await page.locator("//span[text()='Fingress Explorer']").click();
        await page.locator("text='    Components   '").click();
        await page.locator("text='Login'").click();
    })
})
test.afterAll(async()=>{
    await page.close();
    await browser.close();
})
test('Entering details in Name, Phone Number and Email text boxes',async()=>{
    await page.locator("input[name*='F_NAME']").fill('jhesfjklngv');
    await page.locator('input[name*="PH_NO"]').fill('8478589345');
    await page.locator("input[name*='EMAIL']").fill('hqtrgv@mail.com');
    await test.step('Clicking teh submit button',async()=>{
        await page.locator('text="SUBMIT"').click();
    })    
})
test('Entering details in login fields',async()=>{   
    await test.step('Entering details in domain id text box',async()=>{
        await page.locator('[data-placeholder="Domain Id"]').fill('g');
    })    
    await test.step('Entering details in login id text box',async()=>{
        await page.locator('[data-placeholder="Login Id"]').fill('g');
    })    
    await test.step('Entering details in password text box',async()=>{
        await page.locator('[type="password"]').fill('1234');         
    })      
    await test.step('Clicking the sign in button',async()=>{
        await page.locator('text="Sign In"').click();        
    })    
})
test(' Validating the otp page ',async()=>{
    await test.step('Entering phone number in required text box ',async()=>{
        await page.locator('[name*="PHONE_NUMBER"]').fill('7856655346');
    })
    await test.step('Clicking Next option after entering the Phone number',async()=>{
        await page.locator('text="Next"').nth(0).click();
    })    
    await test.step('Verifying that Verify option should be disabled before entering the otp',async()=>{
        await expect(page.locator('text="Verify"')).toBeDisabled();
    })    
    await test.step('Fetching the locators of otp input boxes',async()=>{
        otp = await page.locator('[type="number"]').all();
    })    
    await test.step('Entering otp using arrowUp button',async()=>{
        for(let i=0;i<otp.length;i++){ await otp[i].click();
            await test.step('Clicking the Arrow Up option',async()=>{
                await page.keyboard.press('ArrowUp');        
            })
        }
    })   
    await test.step('Verifying that Verify & Previous options are in enabled state',async()=>{
        await expect(page.locator('text="Verify"')).toBeEnabled();
        await expect(page.locator('text="Previous"').nth(0)).toBeVisible();
    })     
    await test.step('Clicking the Verify & Next options',async()=>{
        await page.locator('text="Verify"').click();
        await page.locator('text="Next"').nth(1).click();
    })    
    await test.step('Fetching the login result',async()=>{
        console.log(await page.locator('h1').textContent()); 
    })      
})