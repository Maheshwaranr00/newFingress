import {test,expect,chromium, Browser, BrowserContext, Page, Locator} from "@playwright/test";


let browser : Browser;
let context : BrowserContext;
let page : Page;


let  column:string[];
let inv_no: string | null;
let active_page: string | null,dates:string[], Dates: string[],date:string|null,date1:string|null;

let filters: Locator[],no:any;
let pageCount: string | null, activePage: string | null, no_of_page: string | null, count1:string[];
let noOfRows: Number;
let baseUrl = "http://192.168.1.49:8086/";


test.beforeEach(async()=>{
    browser = await chromium.launch({headless:false});
    context = await browser.newContext();
    page = await context.newPage();    
    await page.goto(baseUrl);  
    await test.step('Landed to List View from Home',async()=>{       
        await page.locator("//mat-icon[text()='view_comfy']").click();
        await page.locator("//span[text()='Fingress Explorer']").click();
        await page.locator("text='   List Pages   '").click();
        await page.locator('(//span[text()="List View"])[1]').waitFor({state:"visible" });
        await page.locator('(//span[text()="List View"])[1]').click();
    })
})
test.afterEach(async()=>{
    await page.close();
    await browser.close();
})
test('List expansion',async()=>{            
    //await expect(page).toHaveURL(`${baseUrl}fgPage/7618c0a1-9446-4c04-a00e-6634352f6111/44b4eb67-f5b8-482b-934f-a03d7f8796be`);
    //const view = await page.locator('div[class*="list-toggle"]').all();
    await test.step('Verifying the lists are expanded with its fields',async()=>{
        for(let i=0; i< 10;i++){
            await page.locator('[class*="list-toggle"]').nth(i).click();
            console.log("list view is expanded");
            await expect(page.locator('text="Due Date"').nth(i)).toBeVisible();
        }
    })    
})
test('Filtering the records in List view',async()=>{            
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
                console.log(filter[i]," : ",count.length);
            })
            await test.step('clearing the input data',async()=>{
                await filters[i].click();
                await page.locator('text="Clear"').click();
            })            
        }
    })    
})
test("Navigating between pages to find the records per page",async()=>{        
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
    })
    await test.step('fetching number of the active page and getting count of rows',async()=>{
        activePage=await page.locator('li[class*="active"]').textContent();       
        count1 = await page.locator('[class*="list-toggle"]').allTextContents();
        noOfRows = count1.length;
        console.log(no_of_page,activePage);       
    })    
    await test.step('print the details of the first page',async()=>{
        const numb = await page.locator('[class*="fg-paginator-total-records"]').textContent();
        console.log(pageCount, " : ",count1.length," : ",numb);
    })  
    await test.step('getting count of rows from all the pages',async()=>{
        while(activePage!=no_of_page){             
            await test.step('clicking the next page button',async()=>{
                await page.locator("li[class*='page-next-item']").click();  
            })
            await test.step('waiting for the expand option pagination label visibility',async()=>{
                await page.locator('span[class*="fg-paginator-total-pages"]').waitFor({state: "visible"});
                await page.locator('div[class*="list-toggle"]').nth(0).waitFor({state: "visible"});
            })          
            await test.step('fetching the active page number,paginator label,total record label',async()=>{
                activePage = await page.locator('li[class*="active"]').textContent();
                const pageCount = await page.locator('span[class*="fg-paginator-total-pages"]').textContent(); 
                count1 = await page.locator('div[class*="list-toggle"]').allTextContents();
                const numb = await page.locator('span[class*="fg-paginator-total-records"]').textContent();
                console.log(pageCount, " : ",count1.length," : ",numb); 
            })            
        }
    })        
})
test('first & last visibility in List view pagination',async()=>{        
    await test.step('the first page & previous page links should be hidden in first page',async()=>{
        await expect(page.locator('text="First"')).toBeHidden();
        await expect(page.locator('li[title="Previous Page"]')).toBeHidden();
    })
    await test.step('the last page & next page links should be visible',async()=>{
        await expect(page.locator('li[title="Next Page"]')).toBeVisible();
        await expect(page.locator('text="Last"')).toBeVisible();
    })    
    await test.step('Clicking on the last page',async()=>{
        await page.locator('text="Last"').click();
    })
    await test.step('the last page & next page link should be hidden in last page',async()=>{
        await expect(page.locator('text="Last"')).toBeHidden();
        await expect(page.locator('li[title="Next Page"]')).toBeHidden();
    })
    await test.step('The first and previous page links should be visible ',async()=>{
        await expect(page.locator('text="First"')).toBeVisible();
        await expect(page.locator('li[title="Previous Page"]')).toBeVisible();
    })
    await test.step('clicking on the random middle page',async()=>{
        await page.locator('a[class="page-link"]').nth(3).click();
    })    
    await test.step('All the four page links should be visible in the middle page',async()=>{
        await expect(page.locator('li[title="Previous Page"]')).toBeVisible();
        await expect(page.locator('text="First"')).toBeVisible();    
        await expect(page.locator('text="Last"')).toBeVisible();
        await expect(page.locator('li[title="Next Page"]')).toBeVisible();
    })        
})
test('Validating Next Page, Previous Page and Number page visibility', async()=>{    
    await test.step('Verify that first five page links should be visible in the first page',async()=>{
        await page.locator('li[class*="page-item pointer"]').nth(0).waitFor({state:"visible"})
        const pagelinks = await page.locator('li[class*="page-item pointer"]').all();
        for(let i=0;i<pagelinks.length;i++){
            await expect(page.locator('li[class*="page-item pointer"]').nth(i)).toBeVisible();
        }
    })    
    await test.step('Clicking on the last page',async()=>{
        await page.locator('text="Last"').click();
    })
    await test.step('four page links should be visible in the last page',async()=>{
        await page.locator('li[class*="page-item pointer"]').nth(0).waitFor({state:"visible"})
        const pagelinks = await page.locator('li[class*="page-item pointer"]').all();
        for(let i=0;i<pagelinks.length;i++){
            await expect(page.locator('li[class*="page-item pointer"]').nth(i)).toBeVisible();
        }
    })    
    await test.step('clicking on the random middle page',async()=>{
        await page.locator('li[class*="page-item pointer"]').nth(0).click();
    })   
    await test.step('the middle page should contains five number page links',async()=>{
        await page.locator('li[class*="page-item pointer"]').nth(0).waitFor({state:"visible"})
        const pagelinks = await page.locator('li[class*="page-item pointer"]').all();
        for(let i=0;i<pagelinks.length;i++){
            await expect(page.locator('li[class*="page-item pointer"]').nth(i)).toBeVisible();
        }
    })    
})
//23473: Verify that the pages and the no of records updated in the pagination based on the filtered records
test('23468: Verify that the list view is filterable based on the configured filter fields',async()=>{
    await test.step('Identifying the applicable filters',async()=>{
        await page.locator('button[class*="btn-toggle"]').nth(1).waitFor({state:"visible"});
        filters = await page.locator('button[class*="btn-toggle"]').all();
        no = filters.length;
    })
    //inputs of the filters
    const inputs = ['INV20230828474930','INITIATION','APPROVED'];
    const filter = ['Reference','Stage','status'];
    await test.step('verify the records are filtered in the list view',async()=>{
        for(let i=0;i<no;i++){
            await test.step('valid input data for search filter ',async()=>{
                await filters[i].click();
                await page.locator("input[class*='mat-form-field-autofill-control']").nth(1).fill(inputs[i]);
                await page.locator('text="Search"').click();
            })
            await test.step('Verifying the filtered Records',async()=>{
                await page.locator('td[class*="mat-column-REFERENCE_ID"]').nth(0).waitFor({state:"visible"});
                const count = await page.locator('td[class*="mat-column-REFERENCE_ID"]').allTextContents();
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
test('23480: Verify that the total number of record count shows up in the pagination section',async()=>{
    await expect(page.locator('span[class*="fg-paginator-total-records"]')).toBeVisible();
})
test('23471: Verify that the number of pages shows up as hyperlinks in the pagination section',async()=>{
    await test.step('Verify that first five page links should be visible in the first page',async()=>{
        const pageLink = await page.locator('li[class*="page-item pointer"]').all();
        for(let i=0;i< pageLink.length;i++){
            await expect(page.locator('li[class*="page-item pointer"]').nth(i)).toBeVisible();
        }
    })    
    await test.step('Clicking on the last page',async()=>{
        await page.locator('text="Last"').click();
    })
    await test.step('four page links should be visible in the last page',async()=>{
        const pageLink = await page.locator('li[class*="page-item pointer"]').all();
        for(let i=0;i<pageLink.length;i++){
            await expect(page.locator('li[class*="page-item pointer"]').nth(i)).toBeVisible();
        }
    })    
    await test.step('clicking on the random middle page',async()=>{
        await page.locator('li[class*="page-item pointer"]').nth(0).click();
    })   
    await test.step('the middle page should contains five number page links',async()=>{
        const pageLink = await page.locator('li[class*="page-item pointer"]').all();
        for(let i=0;i<pageLink.length;i++){
            await expect(page.locator('li[class*="page-item pointer"]').nth(i)).toBeVisible();
        }
    })    
})
test('23474: Verify that the user can navigate to the desired page directly',async()=>{
    await test.step('Verify that first five page links should be visible in the first page',async()=>{
        await page.locator('li[class*="page-item pointer"]').nth(0).waitFor({state:"visible"});
        const pageLink = await page.locator('li[class*="page-item pointer"]').all();
        for(let i=0;i<pageLink.length;i++){
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
        const pageLink = await page.locator('li[class*="page-item pointer"]').all();
        for(let i=0;i<pageLink.length;i++){
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
        const pageLink = await page.locator('li[class*="page-item pointer"]').all();
        for(let i=0;i<pageLink.length;i++){
            await page.locator('li[class*="page-item pointer"]').nth(i).click();
            active_page = await page.locator('li[class*="active"]').textContent();
            console.log(active_page);
        }
    })    
})
test('23475: Verify that the user can navigate to the previous page',async()=>{
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
                no_of_page = await page.locator('li[class*="active"]').textContent(); 
            })                           
        }
})
test('23476: Verify that the user can navigate to the next page',async()=>{
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
                activePage=await page.locator('li[class*="active"]').textContent(); 
            })                           
        }
})
test('23477: Verify that the page wise free text search option is available if configured to match the records',async()=>{
    await test.step('Identifying the last page',async()=>{
        await page.locator('text="Last"').click();
        no_of_page = await page.locator('li[class*="active"]').textContent(); 
    })
    await test.step('Navigating to first page through First option from navigation panel',async()=>{
        await page.locator('text="First"').click();
        activePage=await page.locator('li[class*="active"]').textContent();
    })        
    await test.step('Entering the first invoice number in search box',async()=>{
        inv_no = await page.locator('td[class*="dk-column-REFERENCE_ID"]').nth(0).textContent();        
        await page.locator('[name="inlineSearchField"]').fill(`${inv_no}`);
        console.log(await page.locator('span[class*="fg-paginator-total-pages"]').textContent());
        await page.locator('[name="inlineSearchField"]').fill("");
    })
        while(activePage!=no_of_page){             
            await test.step('clicking the next page button',async()=>{
                await page.locator('[title="Next Page"]').click();  
            })
            await test.step('waiting for the expand option pagination label visibility',async()=>{
                await page.locator('span[class*="fg-paginator-total-pages"]').waitFor({state: "visible"});
            })                           
            await test.step('Entering the first invoice number in search box',async()=>{
                inv_no = await page.locator('td[class*="dk-column-REFERENCE_ID"]').nth(0).textContent();                
                await page.locator('[name="inlineSearchField"]').fill(`${inv_no}`);
                console.log(await page.locator('span[class*="fg-paginator-total-pages"]').textContent());
                await page.locator('[name="inlineSearchField"]').fill("");
            })
            activePage=await page.locator('li[class*="active"]').textContent(); 
        }
})
test('23485: Verify that the column filter is enabled if configured for all fields at the header level',async()=>{
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
//Test Case 23483: Verify that the sort sorting order based on either high to low or low to high for the list view
test('23481: Verify that the the records can be sorted based on the sortable fields configured',async()=>{
    await test.step('Fetching the dates before changing the sorting from the invoice date column',async()=>{
        await page.locator('td[class*="mat-column-INVOICE_DATE"]').nth(0).waitFor({state:"visible"});
        dates = await page.locator('td[class*="mat-column-INVOICE_DATE"]').allTextContents();
        console.log(dates);
    })    
    await test.step('changing the date sorting',async()=>{
        await page.locator('text=" Invoice Date"').click();
    })
    await test.step('Fetching the dates after changing the sorting from the invoice date column',async()=>{
        await page.locator('td[class*="mat-column-INVOICE_DATE"]').nth(0).waitFor({state:"visible"});
        dates = await page.locator('td[class*="mat-column-INVOICE_DATE"]').allTextContents();
        console.log(dates);
    })      
})
test('23492: Verify that the any date field filter enablement shows up min and max range',async()=>{
    await test.step('Fetching the first date before changing the sorting from the invoice date column',async()=>{
        date = await page.locator('td[class*="mat-column-INVOICE_DATE"]').nth(0).textContent();
        console.log(date);
    })
    await test.step('changing the date sorting',async()=>{
        await page.locator('text=" Invoice Date"').click();
    })
    await test.step('Fetching the first date after changing the sorting from the invoice date column',async()=>{
        date1 = await page.locator('td[class*="mat-column-INVOICE_DATE"]').nth(0).textContent();
        console.log(date1);
    })
    await test.step('Verifying that the date should be changed',async()=>{
        console.log(date,date1);
        expect(date).not.toBe(date1);
    })
})