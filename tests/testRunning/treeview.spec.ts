import {test,expect,chromium, Browser, BrowserContext, Page, Locator, selectors} from "@playwright/test";


let browser : Browser;
let context : BrowserContext;
let page : Page;


let noOfcount: string | null ;
let noOfRows: string[],no2: Number;
let count: string | null,no1: Number,noOfcount1:string|null;

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
        await page.locator("text='Tree View'").click();
    })
})
test.afterAll(async()=>{
    await page.close();
    await browser.close();
})
test('expansion in tree view',async()=>{
    await page.locator('div[class*="list-toggle"]').nth(1).waitFor({state:"visible"});
    const expand = await page.locator('div[class*="list-toggle"]').all();
    for(let i=0; i< expand.length;i++){
        await expand[i].click();
        console.log("validating rows");
        await expect(page.locator('text="Due Date"').nth(i)).toBeVisible();
        // try{await expect(page.locator("text='No Matching Data Found.'")).toBeVisible(); }
        // catch(Error){console.log(Error,i);}               
    }
})
test('validating item per page',async()=>{
    await test.step('Selecting the five options presents in item per page by using for loop',async()=>{
        for(let i=0; i<4; i++){
            await test.step('click on the item per page drop down',async()=>{
                await page.locator("div[class*='mat-select-arrow']").first().click();
            })
            await test.step('clicking an element and getting text of the selected element ',async()=>{
                count =await page.locator("span[class='mat-option-text']").nth(i).textContent();
                await page.locator("span[class='mat-option-text']").nth(i).click();
            })            
            await test.step('getting count of the rows presented in the page',async()=>{
                await page.locator('td[class*="cdk-cell cdk-column-REFERENCE_ID"]').nth(i).waitFor({state:"visible"});
                noOfRows = await page.locator('td[class*="cdk-cell cdk-column-REFERENCE_ID"]').allTextContents();
                no1 = noOfRows.length; 
            })
            if(Number(count)>Number(no1)){console.log(no1);break;}
            await test.step('validating the selected count and presented no of rows',async()=>{
                expect(count).toContain(`${no1}`); 
            })
            await test.step('fetch the paginator range label from the page and print the count of the rows and range label ',async()=>{
                noOfcount = await page.locator('div[class="mat-paginator-range-label"]').textContent();    
                console.log(noOfcount+" no.of invoice " +no1); 
            })
            await test.step('navigate to the next four pages and validating the pages respect to the selected count ',async()=>{
                for(let i=0; i<4;i++){
                    await test.step('navigating to the next page',async()=>{
                        await page.locator('button[class*="mat-paginator-navigation-next"]').click();
                    })
                    await test.step('getting count of the rows presented in the page',async()=>{
                        await page.locator('td[class*="cdk-cell cdk-column-REFERENCE_ID"]').nth(i).waitFor({state:"visible"});
                        noOfRows = await page.locator('td[class*="cdk-cell cdk-column-REFERENCE_ID"]').allTextContents();
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
                        console.log(noOfcount," no.of invoice ",no2); 
                    })
                }
            })       
           }
    })  
})
//23472: Verify that the number of records per page depends on the page size configured
test('23469: Verify that the tree view shows up pagination based on the page size configured',async()=>{
    await test.step('Selecting the five options presents in item per page by using for loop',async()=>{
        for(let i=0; i<4; i++){
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
test('23475,23476: Verify that the user can navigate to the previous page and next page',async()=>{
    for(let i=0;i<5;i++){
        await test.step('clicking an element and getting text of the selected element ',async()=>{
            count =await page.locator("span[class='mat-option-text']").nth(2).textContent();
            await page.locator("span[class='mat-option-text']").nth(2).click();
        }) 
        await test.step('navigating to the next page',async()=>{
            await page.locator('button[class*="mat-paginator-navigation-next"]').waitFor({state:"visible"});
            await page.locator('button[class*="mat-paginator-navigation-next"]').click();
            noOfcount = await page.locator('div[class="mat-paginator-range-label"]').textContent();    
            console.log(noOfcount); 
        })
    }
    for(let i=0;i<5;i++){
        await test.step('navigating to the previous page',async()=>{
            await test.step('clicking an element and getting text of the selected element ',async()=>{
                count =await page.locator("span[class='mat-option-text']").nth(2).textContent();
                await page.locator("span[class='mat-option-text']").nth(2).click();
            }) 
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
test('23468: Verify that the tree view is filterable based on the configured filter fields',async()=>{
    await test.step('Clicking the filter page option',async()=>{
        await page.locator('[mattooltip="Filter Page"]').click();
    })
    await test.step('Entering reference id and CRN ',async()=>{
        await page.locator('[name="REFERENCE_ID"]').fill('INV20230904494771');
        await page.locator('[name="CUSTOMER_REFERENCE"]').fill('CRN1000383');
    })
    await test.step('Clicking the search option',async()=>{
        await page.locator('text="Search"').click();
        await page.waitForLoadState('networkidle');
        noOfcount = await page.locator('div[class="mat-paginator-range-label"]').textContent();    
            console.log(noOfcount); 
    })      
})
test('23576: Verify that the user can drill down to each level from a parent record to view the list of child records at that level',async()=>{
    await test.step('Expanding the high level and low level row and verifying that price text is presented',async()=>{
        await page.locator('td[class*="toggleExpansion"]').click();
        await page.locator('td[class*="toggleExpansion"]').nth(1).click();
        await expect(page.locator('text="Price"')).toBeVisible();
    })  
})
test('23487: Verify that the user can remove all the filters in single click',async()=>{
    await test.step('removing all the filters in single click',async()=>{
        await page.locator('[mattooltip="Filter Page"]').click();
        await page.locator('text="Clear"').click();
        await page.waitForLoadState('networkidle');
        noOfcount1 = await page.locator('div[class="mat-paginator-range-label"]').textContent();    
        console.log(noOfcount1); 
    })
})
