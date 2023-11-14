import { test,expect,Browser, BrowserContext, Locator, Page, chromium } from '@playwright/test';
import { barChartTestScripts } from './barCharts.spec';
let browser : Browser;
let context : BrowserContext;
let page : Page;
let tabs :Locator[],tabHeader:string|null,chartHeader:string|null;
(async () => {  

    test.only('Verifying the tab names and chart names should be related ',async()=>{
        browser = await chromium.launch({headless:false,downloadsPath:`tests/dashboards/newfile`});
     context = await browser.newContext();
     page = await context.newPage();   
     let baseUrl = "http://192.168.1.49:8086/";  
     await page.goto(baseUrl);
     await page.locator("//mat-icon[text()='view_comfy']").click();
     await page.locator("//span[text()='Fingress Explorer']").click();
     await page.locator("text='   Dashboards   '").click();
     await page.locator("text='Bar Charts'").click();
       
        await test.step('waiting and fetching the locators of tab headers',async()=>{
            await page.locator('[class="mat-tab-label-content"]').nth(0).waitFor({state:"visible"});
            tabs = await page.locator('[class="mat-tab-label-content"]').all();
        })
        await test.step('Fetching the text content of tab header and chart header',async()=>{
            tabHeader = await page.locator('[class="mat-tab-label-content"]').nth(0).textContent();
            chartHeader = await page.locator('[class*=card-header]').nth(1).textContent();
        })
        await test.step('Verifying that chart heading and tab heading are related ',async()=>{
            expect(chartHeader).toContain(tabHeader);
        })    
        for(let i=1;i<tabs.length;i++){
            await test.step('clicking the tabs one by one',async()=>{
                await tabs[i].click();
            })
            await test.step('Fetching the text content of tab header and chart header',async()=>{
                tabHeader= await tabs[i].textContent();
                chartHeader = await page.locator('[class*=card-header]').nth(1).textContent();
            })
            await test.step('Verifying that chart heading and tab heading are related ',async()=>{
                expect(chartHeader).toContain(tabHeader);
               
                
            })
        }
        await page.close();
    await browser.close(); 
    })
    


})();
function globalExceptionHandler(error: Error) {
    try{ throw new Error(`${error}`)}
    catch(error){console.log('An error occurred:', error);}
    
    // You can add additional logic here, such as logging or reporting.
  }
  
  // Set the global exception handler
  process.on('Error', globalExceptionHandler);
// process.on('unhandledRejection', (error: Error, promise: Promise<any>) => {
//     if (error.message.includes('expect(received).toContain(expected)')) {
//         console.log('Custom handling of assertion error:');        
//         console.log(error);
//     }
//     });
  
//   process.on('uncaughtException', (error: Error) => {
//     console.log('Uncaught Exception:');
//     console.log(error);
//   });
  