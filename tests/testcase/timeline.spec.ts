import {test,expect,chromium, Browser, BrowserContext, Page, Locator, selectors} from "@playwright/test";

let browser : Browser;
let context : BrowserContext;
let page : Page;


let view : Locator[],countOfInvoice: string[],invoice: Locator[];
let month :Locator[],monthBadge:string[];

let baseUrl = "http://192.168.1.49:8086/";

test.beforeAll(async()=>{
     browser = await chromium.launch({headless:false});
     context = await browser.newContext();
     page = await context.newPage();
    
     await page.goto(baseUrl);
     await test.step('navigating to the card view from the home page',async()=>{
        await page.locator("//mat-icon[text()='view_comfy']").click();
        await page.locator("//span[text()='Fingress Explorer']").click();
        await page.locator("text='   List Pages   '").click();
        await page.locator("text='Timeline View'").click();
    })
})
test.afterAll(async()=>{
    await page.close();
    await browser.close();
})
test('23481: Verify that the the records can be sorted based on the sortable fields configured',async()=>{
    selectors.setTestIdAttribute('class');
    await test.step('waiting for visibility of months and getting all months text',async()=>{
        await page.getByTestId('pr-1').nth(0).waitFor({state:"visible"});
        const months = await page.getByTestId('pr-1').allTextContents();
        console.log(months);
    })
    await test.step('clicking on the ascending order',async()=>{
        await page.locator("text=' Ascending '").click();
    })
    await test.step('after switching the sorting fetching the months as text',async()=>{
        const AscMonths = await page.getByTestId('pr-1').allTextContents();
        console.log(AscMonths);
    })  
})
test('23492: Verify that the any date field filter enablement shows up min and max range',async()=>{
    selectors.setTestIdAttribute('class');
    await test.step('waiting for visibility of months and getting first month text',async()=>{
        await page.getByTestId('pr-1').nth(0).waitFor({state:"visible"});
        const months = await page.getByTestId('pr-1').textContent();
        console.log(months);
    })
    await test.step('clicking on the descending order',async()=>{
        await page.locator("text='Descending '").click();
    })
    await test.step('after switching the sorting fetching the first month as text',async()=>{
        const AscMonths = await page.getByTestId('pr-1').textContent();
        console.log(AscMonths);
    })  

})