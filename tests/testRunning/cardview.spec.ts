import {test,expect,chromium, Browser, BrowserContext, Page, Locator} from "@playwright/test";

let browser : Browser;
let context : BrowserContext;
let page : Page;
let pageCount: string | null;
let no_of_page: string | null;
let view : Locator[];
let last_page : string | null, active_page : string|null;

let baseUrl = "http://192.168.1.49:8086/";

test.beforeAll(async()=>{
     browser = await chromium.launch({headless:false});
     context = await browser.newContext();
     page = await context.newPage();
     
     await page.goto(baseUrl);
     await test.step('Navigating to the card view from the home page',async()=>{
        await page.locator("//mat-icon[text()='view_comfy']").click();
        await page.locator("//span[text()='Fingress Explorer']").click();
        await page.locator("text='   List Pages   '").click();
        await page.locator("text='Card View'").nth(1).click();
    })
})
test.afterAll(async()=>{
    await page.close();
    await browser.close();
})
test('Card view - Validating the view option and checking visibility of the details',async()=>{   
        await test.step('Getting locator for all the view options ',async()=>{
            await page.locator("button[class*='fg-icon-btn']").nth(0).waitFor({state:"visible"});
            view = await page.locator("button[class*='fg-icon-btn']").all();
        })
        for(let i=0; i<view.length;i++){
            await test.step('Clicking the view icon',async()=>{
                await view[i].click();
            })
            await test.step('Checking the visibility of chosen product details',async()=>{
                await expect(page.locator("text=' Product Detail '")).toBeVisible();
                await expect(page.locator("text=' Name '")).toBeVisible();
                await expect(page.locator("text=' Description '")).toBeVisible();
                await expect(page.locator("text=' Discounted Price '")).toBeVisible();
                await expect(page.locator("text=' Price '")).toBeVisible();
            })
            await test.step('Move back to the card view page',async()=>{
                await page.locator("text='Back'").click();
            })
        }     
})
test('Card view - Validating page navigation and fetching the product count',async()=>{
    await test.step("Clicking the 'last' page",async()=>{
        await page.locator("text='Last'").click();
    })
    await test.step('Fetching the text content of active page',async()=>{
        last_page = await page.locator('li[class*="active"]').textContent();
    })
    await test.step("Clicking the 'first' page",async()=>{
        await page.locator('text="First"').click();  
    })
    console.log(last_page);  
    for(let i=0; i<Number(last_page); i++){
        await test.step('Checking the visibility of view option and fetching the locators for all view options',async()=>{
            await page.locator("button[class*='fg-icon-btn']").nth(0).waitFor({state:"visible"});
            view = await page.locator("button[class*='fg-icon-btn']").all();
        })
        await test.step('Fetching of active page number',async()=>{
            active_page = await page.locator('li[class*="active"]').textContent();
        })
        await test.step('Printing the invoice count per page',async()=>{
            console.log(active_page +' count '+ view.length);
        })
        await test.step('Clicking the next page option',async()=>{
            await page.locator('li[title="Next Page"]').click();
        })        
    }
})
test('23471: Verify that the number of pages shows up as hyperlinks in the pagination section',async()=>{
    await test.step('Verify that page links should be visible in the first page',async()=>{
        await page.locator('text="First"').click();
        const pageLink = await page.locator('li[class*="page-item pointer"]').all();
        for(let i=0;i< pageLink.length;i++){
            await expect(page.locator('li[class*="page-item pointer"]').nth(i)).toBeVisible();
        }
    })    
    // await test.step('Clicking on the last page',async()=>{
    //     await page.locator('text="Last"').click();
    // })
    // await test.step('page links should be visible in the last page',async()=>{
    //     const pageLink = await page.locator('li[class*="page-item pointer"]').all();
    //     for(let i=0;i<pageLink.length;i++){
    //         await expect(page.locator('li[class*="page-item pointer"]').nth(i)).toBeVisible();
    //     }
    // })    
    // await test.step('clicking on the random middle page',async()=>{
    //     await page.locator('li[class*="page-item pointer"]').nth(0).click();
    // })   
    // await test.step('page links should be visible',async()=>{
    //     const pageLink = await page.locator('li[class*="page-item pointer"]').all();
    //     for(let i=0;i<pageLink.length;i++){
    //         await expect(page.locator('li[class*="page-item pointer"]').nth(i)).toBeVisible();
    //     }
    // })    
})
//
test('23474: Verify that the user can navigate to the desired page directly',async()=>{
    await test.step('Verify that page links should be visible in the first page',async()=>{
        await page.locator('li[class*="page-item pointer"]').nth(0).waitFor({state:"visible"});
        const pageLink = await page.locator('li[class*="page-item pointer"]').all();
        for(let i=0;i<pageLink.length;i++){
            await page.locator('li[class*="page-item pointer"]').nth(i).click();
            active_page = await page.locator('li[class*="active"]').textContent();
            console.log(active_page);
        }
    })    
    // await test.step('Clicking on the last page',async()=>{
    //     await page.locator('text="Last"').click();
    //     active_page = await page.locator('li[class*="active"]').textContent();
    //         console.log("last page no: "+active_page);
    // })
    // await test.step('page links should be visible in the last page',async()=>{
    //     await page.locator('li[class*="page-item pointer"]').nth(0).waitFor({state:"visible"});
    //     const pageLink = await page.locator('li[class*="page-item pointer"]').all();
    //     for(let i=0;i<pageLink.length;i++){
    //         await page.locator('li[class*="page-item pointer"]').nth(i).click();
    //         active_page = await page.locator('li[class*="active"]').textContent();
    //         console.log(active_page);
    //     }
    // })    
    // await test.step('clicking on the random middle page',async()=>{
    //     await page.locator('li[class*="page-item pointer"]').nth(0).click();
    //     active_page = await page.locator('li[class*="active"]').textContent();
    //     console.log("random middle page no : "+active_page);
    // })   
    // await test.step('page links should be present in the middle page ',async()=>{
    //     await page.locator('li[class*="page-item pointer"]').nth(0).waitFor({state:"visible"});
    //     const pageLink = await page.locator('li[class*="page-item pointer"]').all();
    //     for(let i=0;i<pageLink.length;i++){
    //         await page.locator('li[class*="page-item pointer"]').nth(i).click();
    //         active_page = await page.locator('li[class*="active"]').textContent();
    //         console.log(active_page);
    //     }
    // })    
})
test('23475: Verify that the user can navigate to the previous page',async()=>{
    await test.step('Fetching the first page number ',async()=>{
       // pageCount = await page.locator('span[class*="fg-paginator-total-pages"]').textContent();
        await page.locator('li[class*="page-item pointer"]').nth(0).click();
        await page.locator('[class*="fg-icon-btn"]').nth(0).waitFor({state:"visible"});         
        active_page=await page.locator('li[class*="active"]').textContent(); 
        console.log(pageCount);
    })
    await test.step('Identifying the last page',async()=>{
        await page.locator('text="Last"').click();
        no_of_page = await page.locator('li[class*="active"]').textContent(); 
    })           
        while(active_page!=no_of_page){             
            await test.step('clicking the previous page button',async()=>{
                await page.locator("li[class*='page-prev-item']").click();                  
            })
            await test.step('waiting for the expand option pagination label visibility',async()=>{
                //await page.locator('span[class*="fg-paginator-total-pages"]').waitFor({state: "visible"});
                await page.locator('[class*="fg-icon-btn"]').nth(1).waitFor({state: "visible"});
                no_of_page = await page.locator('li[class*="active"]').textContent();
            })                           
        }
})
test('23476: Verify that the user can navigate to the next page',async()=>{
    await test.step('Identify the total number of pages',async()=>{
        //pageCount = await page.locator('span[class*="fg-paginator-total-pages"]').textContent();
        //console.log(pageCount);        
    })
    await test.step('Identifying the last page',async()=>{        
        await page.locator('text="Last"').click();
        no_of_page = await page.locator('li[class*="active"]').textContent(); 
    })
    await test.step('Navigating to first page through First option from navigation panel',async()=>{
        await page.locator('text="First"').click();
        active_page=await page.locator('li[class*="active"]').textContent(); 
    })        
        while(active_page!=no_of_page){             
            await test.step('clicking the next page button',async()=>{
                await page.locator("li[class*='page-next-item']").click();  
            })
            await test.step('waiting for the pagination label visibility',async()=>{
                // await page.locator('span[class*="fg-paginator-total-pages"]').waitFor({state: "visible"});
                // console.log(await page.locator('span[class*="fg-paginator-total-pages"]').textContent());
                active_page=await page.locator('li[class*="active"]').textContent(); 
            })                           
        }
})
