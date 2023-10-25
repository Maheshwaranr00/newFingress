import {test,expect,chromium, Browser, BrowserContext, Page, Locator} from "@playwright/test";

let browser : Browser;
let context : BrowserContext;
let page : Page;

let filters: Locator[],no:any;
let pageCount: string | null, activePage: string | null, no_of_page: string | null, column:string[];
let noOfRows: Number,inv_no: string | null;
let active_page: string | null,dates:string[], Dates: string[],date:string|null,date1:string|null;

let baseUrl = "http://192.168.1.49:8086/";

test.beforeEach(async()=>{
     browser = await chromium.launch({headless:false});
     context = await browser.newContext();
     page = await context.newPage();    
     await page.goto(baseUrl);
     await test.step('Navigating to the calendar page from the home page',async()=>{
        await page.locator("//mat-icon[text()='view_comfy']").click();
        await page.locator("//span[text()='Fingress Explorer']").click();
        await page.locator("text='   List Pages   '").click();
        await page.locator('(//span[text()="List View"])[1]').click();
     })
})
test.afterEach(async()=>{
    await page.close();
    await browser.close();
})
//23473,23468,23480
test('verify that the list view is filterable based on the configured filter fields',async()=>{
    await test.step('Identifying the applicable filters',async()=>{
        await page.locator('button[class*="btn-toggle"]').nth(1).waitFor({state:"visible"});
        filters = await page.locator('button[class*="btn-toggle"]').all();
        no = filters.length;
    })
    //inputs of the filters
    const inputs = ['INV20230828474932','INITIATION','NEW'];
    const filter = ['Reference','Stage','status'];
    await test.step('verify the records are filtered in the list view',async()=>{
        for(let i=0;i<no;i++){
            await test.step('valid input data for search filter ',async()=>{
                await filters[i].click();
                await page.locator("input[class*='mat-form-field-autofill-control']").nth(0).fill(inputs[i]);
                await page.locator('text="Search"').click();
            })
            await test.step('Verifying the filtered Records',async()=>{
                await page.locator("button[class*='fg-icon-btn']").nth(0).waitFor({state:"visible"});
                const count = await page.locator("button[class*='fg-icon-btn']").allTextContents();
                const pageCount = await page.locator('span[class*="fg-paginator-total-pages"]').textContent(); 
                const numb = await page.locator('span[class*="fg-paginator-total-records"]').textContent();
                console.log(pageCount,numb)
                console.log(filter[i]," : ",count.length);
            })
            await test.step('clearing the input data',async()=>{
                await filters[i].click();
                await page.locator('text="Clear"').click();
            })            
        }
    })    
})
//23471
test('Verify that the number of pages shows up as hyperlinks in the pagination section',async()=>{
    await test.step('Verify that first five page links should be visible in the first page',async()=>{
        for(let i=0;i<5;i++){
            await expect(page.locator('li[class*="page-item pointer"]').nth(i)).toBeVisible();
        }
    })    
    await test.step('Clicking on the last page',async()=>{
        await page.locator('text="Last"').click();
    })
    await test.step('four page links should be visible in the last page',async()=>{
        for(let i=0;i<4;i++){
            await expect(page.locator('li[class*="page-item pointer"]').nth(i)).toBeVisible();
        }
    })    
    await test.step('clicking on the random middle page',async()=>{
        await page.locator('li[class*="page-item pointer"]').nth(0).click();
    })   
    await test.step('the middle page should contains five number page links',async()=>{
        for(let i=0;i<4;i++){
            await expect(page.locator('li[class*="page-item pointer"]').nth(i)).toBeVisible();
        }
    })    
})
//23474
test('Verify that the user can navigate to the desired page directly',async()=>{
    await test.step('Verify that first five page links should be visible in the first page',async()=>{
        await page.locator('li[class*="page-item pointer"]').nth(0).waitFor({state:"visible"});
        for(let i=0;i<5;i++){
            await page.locator('li[class*="page-item pointer"]').nth(i).click();
            active_page = await page.locator('li[class*="active"]').textContent();
            console.log(active_page);
        }
    })    
    await test.step('Clicking on the last page',async()=>{
        await page.locator('text="Last"').click();
        active_page = await page.locator('li[class*="active"]').textContent();
            console.log("last page no: "+active_page);
    })
    await test.step('four page links should be visible in the last page',async()=>{
        await page.locator('li[class*="page-item pointer"]').nth(0).waitFor({state:"visible"});
        for(let i=0;i<4;i++){
            await page.locator('li[class*="page-item pointer"]').nth(i).click();
            active_page = await page.locator('li[class*="active"]').textContent();
            console.log(active_page);
        }
    })    
    await test.step('clicking on the random middle page',async()=>{
        await page.locator('li[class*="page-item pointer"]').nth(0).click();
        active_page = await page.locator('li[class*="active"]').textContent();
        console.log("random middle page no : "+active_page);
    })   
    await test.step('the middle page should contains five number page links',async()=>{
        await page.locator('li[class*="page-item pointer"]').nth(0).waitFor({state:"visible"});
        for(let i=0;i<4;i++){
            await page.locator('li[class*="page-item pointer"]').nth(i).click();
            active_page = await page.locator('li[class*="active"]').textContent();
            console.log(active_page);
        }
    })    
})
//23475
test('Verify that the user can navigate to the previous page',async()=>{
    await test.step('Identify the total number of pages',async()=>{
        pageCount = await page.locator('span[class*="fg-paginator-total-pages"]').textContent();
        activePage=await page.locator('li[class*="active"]').textContent(); 
        console.log(pageCount);
    })
    await test.step('Identifying the last page',async()=>{
        await page.locator('text="Last"').click();
        no_of_page = await page.locator('li[class*="active"]').textContent(); 
    })           
        while(activePage!=no_of_page){             
            await test.step('clicking the previous page button',async()=>{
                await page.locator("li[class*='page-prev-item']").click();  
            })
            await test.step('waiting for the expand option pagination label visibility',async()=>{
                await page.locator('span[class*="fg-paginator-total-pages"]').waitFor({state: "visible"});
                await page.locator('div[class*="list-toggle"]').nth(1).waitFor({state: "visible"});
            })                           
        }
})
//23476
test('Verify that the user can navigate to the next page',async()=>{
    await test.step('Identify the total number of pages',async()=>{
        pageCount = await page.locator('span[class*="fg-paginator-total-pages"]').textContent();
        console.log(pageCount);
    })
    await test.step('Identifying the last page',async()=>{
        await page.locator('text="Last"').click();
        no_of_page = await page.locator('li[class*="active"]').textContent(); 
    })
    await test.step('Navigating to first page through First option from navigation panel',async()=>{
        await page.locator('text="First"').click();
        activePage=await page.locator('li[class*="active"]').textContent(); 
    })        
        while(activePage!=no_of_page){             
            await test.step('clicking the next page button',async()=>{
                await page.locator("li[class*='page-next-item']").click();  
            })
            await test.step('waiting for the expand option pagination label visibility',async()=>{
                await page.locator('span[class*="fg-paginator-total-pages"]').waitFor({state: "visible"});
                console.log(await page.locator('span[class*="fg-paginator-total-pages"]').textContent());
            })                           
        }
})
//23477
test('Verify that the page wise free text search option is available if configured to match the records',async()=>{
    await test.step('Identifying the last page',async()=>{
        await page.locator('text="Last"').click();
        no_of_page = await page.locator('li[class*="active"]').textContent(); 
    })
    await test.step('Navigating to first page through First option from navigation panel',async()=>{
        await page.locator('text="First"').click();
        activePage=await page.locator('li[class*="active"]').textContent(); 
    })        
    await test.step('Entering the first invoice number in search box',async()=>{
        inv_no = await page.locator('td[class*="dk-column-REFERENCE_ID"]').textContent();
        //@ts-ignore
        await page.locator('[name="inlineSearchField"]').fill(inv_no);
    })
        while(activePage!=no_of_page){             
            await test.step('clicking the next page button',async()=>{
                await page.locator("li[class*='page-next-item']").click();  
            })
            await test.step('waiting for the expand option pagination label visibility',async()=>{
                await page.locator('span[class*="fg-paginator-total-pages"]').waitFor({state: "visible"});
            })                           
            await test.step('Entering the first invoice number in search box',async()=>{
                inv_no = await page.locator('td[class*="dk-column-REFERENCE_ID"]').textContent();
                //@ts-ignore
                await page.locator('[name="inlineSearchField"]').fill(inv_no);
                console.log(await page.locator('span[class*="fg-paginator-total-pages"]').textContent());
            })
        }
})
//23485
test('Verify that the column filter is enabled if configured for all fields at the header level',async()=>{
    await test.step('Identifying the applicable filters',async()=>{
        await page.locator('button[class*="btn-toggle"]').nth(1).waitFor({state:"visible"});
        filters = await page.locator('button[class*="btn-toggle"]').all();
        no = filters.length;
        console.log("Filters count : "+no)
        for(let i=0;i<no;i++){
            await test.step('Verifying the filters are in enabled state',async()=>{
                await expect(filters[i]).toBeEnabled();
            })            
        }
    })
    await test.step('Fetching the column count',async()=>{
        column = await page.locator('[class*="mat-sort-header-content"]').allTextContents();
        console.log("Column count : "+column.length);
    })
})
//23481,23483,23492
test('Verify that the the records can be sorted based on the sortable fields configured',async()=>{
    await test.step('Fetching the dates before changing the sorting from the invoice date column',async()=>{
        dates = await page.locator('td[class*="mat-column-INVOICE_DATE"]').allTextContents();
        console.log(dates);
    })
    await test.step('Fetching the first date before changing the sorting from the invoice date column',async()=>{
        date = await page.locator('td[class*="mat-column-INVOICE_DATE"]').textContent();
        console.log(date);
    })
    await test.step('changing the date sorting',async()=>{
        await page.locator('text=" Invoice Date"').click();
    })
    await test.step('Fetching the dates after changing the sorting from the invoice date column',async()=>{
        dates = await page.locator('td[class*="mat-column-INVOICE_DATE"]').nth(0).allTextContents();
        console.log(dates);
    })
    await test.step('Fetching the first date after changing the sorting from the invoice date column',async()=>{
        date1 = await page.locator('td[class*="mat-column-INVOICE_DATE"]').textContent();
        console.log(date1);
    })
    await test.step('Verifying that the date should be changed',async()=>{
        expect(date).not.toBe(date1);
    })
})
test('',async()=>{
    
})