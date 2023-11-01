import {test,expect,chromium, Browser, BrowserContext, Page, Locator} from "@playwright/test";

let browser : Browser;
let context : BrowserContext;
let page : Page;

let data: string | null, cal_format:string | null, cal1: string | null, cal2 : string | null, cal3 : string | null;
let cells : Locator[];
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
        await page.locator('//span[text()="Calendar View"]').click();
     })
})
test.afterEach(async()=>{
    await page.close();
    await browser.close();
})
test('23508: Verify that the user can switch the calendar option to Day/Week/Month',async()=>{
    for(let i=0;i<3;i++){
        await test.step('Selecting calender type and fetching the text of selected calendar type',async()=>{
            cal_format = await page.locator('button[class*="fc-dayGrid"]').nth(i).textContent();
            await page.locator('button[class*="fc-dayGrid"]').nth(i).click(); 
        })
        await test.step('Getting current month/week/day',async()=>{
            cal1 = await page.locator("h2").textContent(); 
        })   
        await test.step('Navigating to the next calendar page',async()=>{
            for(let i=0; i<4;i++)
            await page.locator(`button[title='Next ${cal_format}']`).click();
        })           
        await test.step('Getting month/week/day after navigation',async()=>{
            cal2 = await page.locator("h2").textContent();
        })
        await test.step('Verifying calendar titles',async()=>{
            expect(cal1).not.toBe(cal2);                
        })
        await test.step('Clicking the today option',async()=>{
            await page.locator("text='today'").click();                
        })
        await test.step('Getting calender title after clicking today option',async()=>{
            cal3 = await page.locator("h2").textContent();
        })
        await test.step('Compare the initial calendar title with final calendar title',async()=>{
            expect(cal3).toContain(cal1);
        })
        console.log(cal_format,cal1,cal2,cal3);
        console.log(`The ${cal_format} button is validated`);
    }
})
test('23507: Verify that the user can view the records in a calendar view',async()=>{
    await test.step('Checking the entries in date cell',async()=>{
        for(let i=1;i<31;i++){
            await test.step('Dividing the cells by date',async()=>{
                if(i<10){ await page.locator(`td[data-date='2023-10-0${i}']`).click();}
                else{await page.locator(`td[data-date='2023-10-${i}']`).click();}
            })
            await test.step('Fetching the record status of each date cell',async()=>{
                try{await expect(page.locator("h5")).toBeVisible();
                data = await page.locator("h5").textContent();
                await test.step('Verifying the records of all date cells',async()=>{
                expect(data,`date ${i}`).toContain('There are currently no records available.');                
                if(i<10){ await page.locator(`td[data-date='2023-10-0${i}']`).click();}
                    else{await page.locator(`td[data-date='2023-10-${i}']`).click();}
                })}
                catch(Error){await page.locator('[class="mat-dialog-content"]').waitFor({state:"visible"});
                    console.log(await page.locator('[class="mat-dialog-content"]').textContent());
                await page.locator('text="Ok"').click();}                
            })                          
        }
    })  
})
test('23475,23476 - Validating previous month and next month navigations',async()=>{    
    await test.step('Getting current month title',async()=>{
        cal1 = await page.locator("h2").textContent();    
    })
    console.log('navigating to the previous month');
    await test.step('Navigating to the desired month and reading the calender title',async()=>{
        while(cal1!='January 2023'){await page.locator('button[title="Previous month"]').click();
        cal1 = await page.locator("h2").textContent();
        console.log(cal1);}    
    })                
    { waitUntil: 'networkidle' }
    console.log('navigating to the Next month');
    await test.step('Hitting the Next month option until navigating to the current month',async()=>{
        while(cal1!='October 2023'){await page.locator('button[title="Next month"]').click();
        cal1 = await page.locator("h2").textContent();
        console.log(cal1);}        
    })              
})