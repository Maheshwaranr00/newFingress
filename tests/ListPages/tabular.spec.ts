import {test,expect,chromium, Browser, BrowserContext, Page} from "@playwright/test";


let browser : Browser;
let context : BrowserContext;
let page : Page;

let count: string | null,noOfcount: string | null , count1: string | undefined;
let noOfRows: string[],no1: Number,no2: Number;
let amount1: string | null,amount2: string | null;

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
        await page.locator('(//span[text()="Tabular"])[1]').click();
    }) 
})
test.afterAll(async()=>{
    await page.close();
    await browser.close();
})
test("Verify the records are filtered based on the valid input in tabular view",async()=>{      
    //await page.pause();
    //await expect(page).toHaveURL(`${baseUrl}fgPage/02d3c622-00d9-4c90-a1ac-82dbed96c655/44b4eb67-f5b8-482b-934f-a03d7f8796be`);    
    //Filters of Reference#, Customer Reference, Stage, Status, Invoice Date and Due Date
    const inputs=["INV20230518345473","rrr","INITIATION","NEW","2023-08-03",'2023-07-26'];
    const filters=["reference","customer ref","stage","status","Inv.date","due.date"];
    await test.step('validating all filters of tabular page',async()=>{
        for(let i=0; i<6; i++){       
            await test.step('selecting the filters one by one',async()=>{
                console.log(i,inputs[i],filters[i]);
                await page.locator("button[class*='btn-toggle']").nth(i).click();
            })            
            await test.step('dividing the filters based on the inputs',async()=>{
                if(i==4 || i==5){await page.locator("input[type='date']").fill(inputs[i])}
                else{ await page.locator('input[class]').fill(inputs[i]); }   
            })
            await test.step('Clicking on the search button',async()=>{
                await page.locator('//span[text()="Search"]').click();
                await page.waitForTimeout(2000);
            })
            await test.step('Print the filter name and count of the rows',async()=>{
                noOfRows = await page.locator('td[class*="cdk-column-REFERENCE_ID"]').allTextContents();
                no1 = noOfRows.length;
                console.log(filters[i],no1);
            })            
            await test.step('Clear the entered input from the filter ',async()=>{
                await page.locator("button[class*='btn-toggle']").nth(i).click();
                await page.locator('//span[text()="Clear"]').click();      
            })           
        }
    })    
})
test('Verify the pages are navigated with proper pagination in tabular view',async()=>{           
    //await expect(page).toHaveURL(`${baseUrl}page/02d3c622-00d9-4c90-a1ac-82dbed96c655/44b4eb67-f5b8-482b-934f-a03d7f8796be`);
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
                    await test.step('getting count of the rows presented in the page',async()=>{
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
test('Sorting of Amount in tabular view',async()=>{           
    await test.step('getting amount from the first cell before changing the sorting',async()=>{
        amount1 = await page.locator("(//td[@role='cell'])[5]").textContent(); 
    })
    await test.step('clicking on the sorting filter',async()=>{
        await page.locator("//div[text()=' Invoice Amount']").click();
    })    
    await test.step('getting amount from the first cell after clicking the sorting',async()=>{
        amount2 = await page.locator("(//td[@role='cell'])[5]").textContent();
    })
    await test.step('validating the two fetched amount',async()=>{
        expect(amount1).not.toBe(amount2);
        console.log(amount1,amount2);
    })   
})