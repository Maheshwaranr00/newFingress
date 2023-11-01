import {test,expect,chromium, Browser, BrowserContext, Page,Locator} from "@playwright/test";


let browser : Browser;
let context : BrowserContext;
let page : Page;


let amounts:string[], column:string[];

let filters: Locator[],no:any;
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
//23473: Verify that the pages and the no of records updated in the pagination based on the filtered records
test('23468: Verify that the tabular view is filterable based on the configured filter fields',async()=>{
    await test.step('Identifying the applicable filters',async()=>{
        await page.locator('button[class*="btn-toggle"]').nth(1).waitFor({state:"visible"});     
        filters = await page.locator('button[class*="btn-toggle"]').all();
        no = filters.length;
    })
    //inputs of the filters
    const inputs=["INV20230518345473","rrr","INITIATION","NEW","2023-08-03",'2023-07-26'];
    let filterName=["reference","customer ref","stage","status","Inv.date","due.date"];
    await test.step('validating all filters of tabular page',async()=>{
        for(let i=0; i<no; i++){       
            await test.step('selecting the filters one by one',async()=>{
                console.log(i,inputs[i],filterName[i]);
                await page.locator("button[class*='btn-toggle']").nth(i).click();
            })            
            await test.step('dividing the filters based on the inputs',async()=>{
                if(i==4 || i==5){await page.locator("input[type='date']").fill(inputs[i]);}
                else{ await page.locator('input[class]').fill(inputs[i]); }   
            })
            await test.step('Clicking on the search button',async()=>{
                await page.locator('//span[text()="Search"]').click();
                await page.waitForTimeout(2000);
            })
            await test.step('Print the filter name and count of the rows',async()=>{
                noOfRows = await page.locator('td[class*="cdk-column-REFERENCE_ID"]').allTextContents();
                no1 = noOfRows.length;
                noOfcount = await page.locator('div[class="mat-paginator-range-label"]').textContent();    
                console.log(noOfcount); 
                console.log(filters[i],no1);
            })            
            await test.step('Clear the entered input from the filter ',async()=>{
                await page.locator("button[class*='btn-toggle']").nth(i).click();
                await page.locator('//span[text()="Clear"]').click();      
            })           
        }
    })    
})
//23472: Verify that the number of records per page depends on the page size configured
test('23469: Verify that the tabular view shows up pagination based on the page size configured',async()=>{
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
test('23476: Verify that the user can navigate to the next page',async()=>{
    await test.step('clicking on the item per page drop down',async()=>{
        await page.locator("div[class*='mat-select-arrow']").first().click();
    })
    await test.step('clicking an element and getting text of the selected element ',async()=>{
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
})
test('23475 - Verify that the user can navigate to the previous page',async()=>{
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
test('23481: Verify that the the records can be sorted based on the sortable fields configured',async()=>{
    await test.step('getting all amounts from the amount column before changing the sorting',async()=>{
        amounts = await page.locator("td[class*='mat-column-AMOUNT']").allTextContents(); 
        console.log(amounts);
    })
    await test.step('clicking on the sorting filter',async()=>{
        await page.locator("//div[text()=' Invoice Amount']").click();
    })    
    await test.step('getting all amounts from the amount column after clicking the sorting',async()=>{
        amounts = await page.locator("td[class*='mat-column-AMOUNT']").allTextContents();
        console.log(amounts);
    })
          
})
test('23490: Verify that the any amount field filter enablement shows up min and max range',async()=>{
    await test.step('getting amount from the first cell of amount column before changing the sorting',async()=>{
        amount1 = await page.locator("td[class*='mat-column-AMOUNT']").nth(0).textContent();
    })
    await test.step('clicking on the sorting filter',async()=>{
        await page.locator("//div[text()=' Invoice Amount']").click();
    })
    await test.step('getting amount from the first cell of amount column after changing the sorting',async()=>{
        amount2 = await page.locator("td[class*='mat-column-AMOUNT']").nth(0).textContent();
    })
    await test.step('validating the two fetched amount',async()=>{
        console.log(amount1,amount2);
        expect(amount1).not.toBe(amount2);        
    }) 
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
