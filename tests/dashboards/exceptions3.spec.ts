import { chromium,  BrowserContext, Page ,Locator,test,expect} from '@playwright/test';

let tabs :Locator[],tabHeader:string|null,chartHeader:string|null;
async function setupBrowserContext(): Promise<BrowserContext> {
  const browser = await chromium.launch();
  const context = await browser.newContext();

  // Create a function to handle page errors globally within the context
  function pageErrorHandler(error: Error) {
    console.error('Page error:', error);
    // You can add additional logic here for handling page errors.
  }

  // Create a function to handle network request errors globally within the context
  function networkRequestErrorHandler(request: any) {
    console.error('Network request error:', request.url());
    // You can add additional logic here for handling network request errors.
  }

  // Add global error handlers to all pages within the context
  context.pages().forEach((page: Page) => {
    page.on('pageerror', pageErrorHandler);
    page.on('requestfailed', networkRequestErrorHandler);
  });

  return context;
}

(async () => {
  try {
    const context = await setupBrowserContext();
    const page = await context.newPage();    
       
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
       for(let i=1;i<9;i++){
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
    await context.close();
  } catch (error) {
    console.error('An error occurred:', error);
  }
})();
