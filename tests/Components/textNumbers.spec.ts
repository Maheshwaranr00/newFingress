import {test,expect,chromium, Browser, BrowserContext, Page, Locator} from "@playwright/test";

let browser : Browser;
let context : BrowserContext;
let page : Page;

let baseUrl = "http://192.168.1.49:8086/";

test.beforeAll(async()=>{
     browser = await chromium.launch({headless:false});
     context = await browser.newContext();
     page = await context.newPage();    
     await page.goto(baseUrl);
     await test.step('Navigating to the calendar page from the home page',async()=>{
        await page.locator("//mat-icon[text()='view_comfy']").click();
        await page.locator("//span[text()='Fingress Explorer']").click();
        await page.locator("text='    Components   '").click();
        await page.locator('text="Form Elements"').click();
     })
})
test.afterAll(async()=>{
    await page.close();
    await browser.close();
})
test('Verifying the data required message is shown after clearing the entered data from the text boxes',async()=>{
    await page.locator('[data-placeholder="Please enter your name"]').fill('Mahesh');
    await page.locator('[name*="email"]').fill('mahesh');
    await page.locator('[data-placeholder="Please enter your name"]').click();
    await page.locator('[data-placeholder="Please enter your name"]').clear();
    await expect(page.locator('text=" Please enter a valid email address"')).toBeVisible();
    await page.locator('[type="password"]').nth(0).fill('658658');
    await page.locator('[type="password"]').nth(0).clear();    
    await expect(page.locator('text="Name is required"')).toBeVisible();
    await expect(page.locator('text="Password is required"')).toBeVisible();
})
test('verifying that ',async()=>{
    await page.locator('[type="number"]').nth(0).fill('23');
    await page.locator("[name*='MOBILE_NUMBER']").nth(0).fill('5689767');
    await page.locator("input[name*='AMOUNT']").click();
    await expect(page.locator('text="Please enter valid value for Mobile Number "')).toBeVisible();
    const inputField =  page.locator("input[name*='AMOUNT']");
    await inputField.fill('465700');
    await page.waitForTimeout(2000);
    const enteredAmount = await inputField.inputValue();
    console.log(enteredAmount);
    const text='The box can only contain 50 characters but its a large text box';
    await page.locator('[data-placeholder="Description"]').fill(text);
    await page.waitForTimeout(2000);
    const enteredText =await page.locator('[data-placeholder="Description"]').inputValue();
    console.log(enteredText,enteredText.length);
    console.log(text,text.length);
})
test('rich text',async()=>{
    const inputField = page.locator('[class="angular-editor-textarea"]');
    await inputField.fill('Hello Everyone ....');
    await page.waitForTimeout(2000);
    const enteredText = await inputField.textContent();   
    console.log(enteredText);
    const buttons = ["Undo","Redo","Bold","Italic","Underline","Strikethrough","Subscript","Superscript","Justify Left",
    "Justify Center","Justify Right","Justify Full","Indent","Outdent","Unordered List","Ordered List","Text Color",
    "Background Color","Insert Link","Unlink","Insert Image","Insert Video","Horizontal Line","Clear Formatting"];
    console.log(buttons.length);
    for(let i=0;i<buttons.length;i++){
        if(i>1){await page.keyboard.press('Control+A');}
        try{await page.locator(`[title="${buttons[i]}"]`).click();}
        catch(Error){console.log(Error);}        
        await page.waitForTimeout(1000);        
        const enteredText = await page.locator('[class="angular-editor-textarea"]').textContent(); 
        console.log(enteredText);
    }
})
test('Picker & Input',async()=>{
    await page.locator('[type="password"]').nth(0).fill('658658');
    await page.locator("[name*='PICKER_INPUT']").nth(1).fill('jkhsdfelhgeh');
})