import {test,expect,chromium, Browser, BrowserContext, Page, Locator} from "@playwright/test";

let browser : Browser;
let context : BrowserContext;
let page : Page;
let count: string | null,noOfcount: string | null , count1: string | undefined;
let noOfRows: string[],no1: Number,no2: Number;
let amounts:string[],amount1: string | null,amount2: string | null, column:string[];

let filters: Locator[],no:any;

let baseUrl = "http://192.168.1.49:8086/";

test.beforeAll(async()=>{
    browser = await chromium.launch({headless:false});
    context = await browser.newContext();
    page = await context.newPage();     
    await page.goto(baseUrl);
    await test.step('Get into the Tabular page',async()=>{
       await page.locator("//mat-icon[text()='view_comfy']").click();
       await page.locator("//span[text()='Fingress Explorer']").click();
       await page.locator("text='   List Pages   '").click();
       await page.locator("text='Tree View'").click();
   }) 
})
test.afterAll(async()=>{
   await page.close();
   await browser.close();
})
//23469,23472,23473,
test('Verify that the tabular view shows up pagination based on the page size configured',async()=>{
    await test.step('Selecting the five options presents in item per page by using for loop',async()=>{
        for(let i=0; i<5; i++){
            await test.step('clicking on the item per page drop down',async()=>{
                await page.locator("div[class*='mat-select-arrow']").first().click();
            })
            await test.step('clicking an element and getting text of the selected element ',async()=>{
                count =await page.locator("span[class='mat-option-text']").nth(i).textContent();
                await page.locator("span[class='mat-option-text']").nth(i).click();
            })            
            await test.step('getting count of the rows presented in the page',async()=>{
                await page.locator('td[class*="cdk-column-REFERENCE_ID"]').nth(i).waitFor({state:"visible"});
                noOfRows = await page.locator('td[class*="cdk-column-REFERENCE_ID"]').allTextContents();
                no1 = noOfRows.length; 
            })
            if(Number(count)>Number(no1)){console.log(no1);break;}
            await test.step('validating the selected count and presented no.of rows',async()=>{
                expect(count).toContain(`${no1}`); 
            })
            await test.step('fetch the paginator range label from the page and print the count of the rows  ',async()=>{
                noOfcount = await page.locator('div[class="mat-paginator-range-label"]').textContent();    
                console.log(noOfcount+" no.of invoice " +no1); 
            })
            await test.step('navigate to the next four pages and validating the pages with the selected count ',async()=>{
                for(let i=0; i<4;i++){
                    await test.step('navigating to the next page',async()=>{
                        await page.locator('button[class*="mat-paginator-navigation-next"]').click();
                    })
                    await test.step('getting count of the presented rows  in the page',async()=>{
                        await page.locator('td[class*="cdk-column-REFERENCE_ID"]').nth(i).waitFor({state:"visible"});
                        noOfRows = await page.locator('td[class*="cdk-column-REFERENCE_ID"]').allTextContents();
                        no2 = noOfRows.length;    
                    })
                    if(no1>no2){
                        console.log(no2);
                        break;
                    }
                    await test.step('validating the selected count and presented no of rows',async()=>{
                    expect(count).toContain(`${no2}`);       
                    })
                    await test.step('fetch the paginator range label from the page and print the count of the rows and range label ',async()=>{
                        noOfcount = await page.locator('div[class="mat-paginator-range-label"]').textContent();    
                        console.log(noOfcount+" no.of invoice " +no2); 
                    })
                }
            })       
        }
    })    
})
//23475,23476,23480
test('Verify that the user can navigate to the previous page and next page',async()=>{
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
//23487
test('Verify that the user can remove all the filters in single click',async()=>{
    

})