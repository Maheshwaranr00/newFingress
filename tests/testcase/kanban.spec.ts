import {test,expect,chromium, Browser, BrowserContext, Page, Locator, selectors} from "@playwright/test";


let browser : Browser;
let context : BrowserContext;
let page : Page;

let minimize: Locator[],countOfMinimize:any;
let maximize: Locator[],countOfMaximize: any;
let count: string | null,no1: Number,noOfcount: string | null;
let kanbanOptions: Locator[];
let baseUrl = "http://192.168.1.49:8086/";


test.beforeEach(async()=>{
     browser = await chromium.launch({headless:false});
     context = await browser.newContext();
     page = await context.newPage();
     
     await page.goto(baseUrl);
     await test.step('Navigating to the kanban page from the home page',async()=>{
        await page.locator("//mat-icon[text()='view_comfy']").click();
        await page.locator("//span[text()='Fingress Explorer']").click();
        await page.locator("text='   List Pages   '").click();
        await page.locator("text='Kanban'").nth(1).click();
     })     
})
test.afterEach(async()=>{
    await page.close();
    await browser.close();
})
//23472: Verify that the number of records per page depends on the page size configured,23473,
test('23469: Verify that the tabular view shows up pagination based on the page size configured',async()=>{
    for(let i=0; i<4; i++){        
        await test.step('clicking the item per page',async()=>{
            await page.locator("div[class*='mat-select-arrow']").first().click();
        })
        await test.step('selecting count and fetching the count as text',async()=>{
            count =await page.locator("span[class='mat-option-text']").nth(i).textContent();
            await page.locator("span[class='mat-option-text']").nth(i).click();
        })
        await page.waitForTimeout(2000);
        await test.step('Getting the count of work items',async()=>{
            const noOfcount = await page.locator('div[class="mat-paginator-range-label"]').textContent();
            console.log(noOfcount);
        })              
        await page.locator('button[class*="fg-icon-btn"]').nth(4).waitFor({state:"visible"});
        await test.step('counting the items per page based on navigation options',async()=>{
            const no = await page.locator('button[class*="fg-icon-btn"]').all();
            no1 = no.length; 
        })
        if(i==3){console.log(no1);break;}
            await test.step('Validating the counting and selected count',async()=>{            
                expect(count).toContain(`${no1}`);            
                console.log(" No.of items " +no1);
            })                   
    }        
})
test('23475,23476: Verify that the user can navigate to the previous page and next page',async()=>{
    await test.step('clicking the item per page',async()=>{
        await page.locator("div[class*='mat-select-arrow']").first().click();
    })
    await test.step('selecting count and fetching the count as text',async()=>{
        count =await page.locator("span[class='mat-option-text']").nth(0).textContent();
        await page.locator("span[class='mat-option-text']").nth(0).click();
    })
    for(let i=0;i<5;i++){
        await test.step('navigating to the next page',async()=>{
            await page.locator('button[class*="mat-paginator-navigation-next"]').waitFor({state:"visible"});
            await page.locator('button[class*="mat-paginator-navigation-next"]').click();
            noOfcount = await page.locator('div[class="mat-paginator-range-label"]').textContent();    
            console.log(noOfcount); 
        })
    }
    for(let i=0;i<5;i++){
        await test.step('navigating to the previous page',async()=>{
            await page.locator('button[class*="mat-paginator-navigation-previous"]').waitFor({state:"visible"});
            await page.locator('button[class*="mat-paginator-navigation-previous"]').click();
            noOfcount = await page.locator('div[class="mat-paginator-range-label"]').textContent();    
            console.log(noOfcount); 
        })
    }
})
test('23480: Verify that the total number of record count shows up in the pagination section',async()=>{
    await expect(page.locator('div[class="mat-paginator-range-label"]')).toBeVisible();    
})


