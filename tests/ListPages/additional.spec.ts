// test('Validating 100 option item per page with pagination',async()=>{        
//     await test.step('waiting for visiblity of rows and getting count of rows before selecting count in item per page ',async()=>{
//         await page.locator('td[class*="cdk-column-REFERENCE_ID"]').nth(1).waitFor({state:"visible"});
//         noOfRows = await page.locator('td[class*="cdk-column-REFERENCE_ID"]').allTextContents();
//         no1 = noOfRows.length;  
//     })
//     await test.step('getting page range label',async()=>{
//         noOfcount = await page.locator('div[class="mat-paginator-range-label"]').textContent();
//         console.log(noOfcount,no1);
    
//     })
//     await test.step('selecting count in item per page and getting text of the selected option',async()=>{
//         await page.locator("div[class*='mat-select-arrow']").first().click();
//         const count = await page.locator("span[class='mat-option-text']").nth(4).textContent();
//         count1 =count?.substring(1,4)
//         await page.locator("span[class='mat-option-text']").nth(4).click();         
//     })    
//     await test.step('navigating to next page using for loop and getting count of the rows',async()=>{
//         for(let i=0; i<5;i++){
//             if(Number(no1)<Number(count1)){break;}
//             await test.step('navigating to the next page',async()=>{
//                 await page.locator('button[class*="mat-paginator-navigation-next"]').click();
//             })
//             await test.step('waiting to visibile the rows and getting the count of the rows',async()=>{
//                 await page.locator('td[class*="column-REFERENCE_ID"]').nth(1).waitFor({state:"visible"});
//                 noOfRows = await page.locator('td[class*="column-REFERENCE_ID"]').allTextContents();
//                 no2 = noOfRows.length;
//             })
//             //compare the count of rows and selected count
//                 if(count1!=`${no2}`){ 
//                     console.log(no2);
//                     break;
//                 }
//                 expect(count1).toContain(`${no2}`);
            
//             await test.step('getting page range label',async()=>{
//                 const text = await page.locator('div[class="mat-paginator-range-label"]').textContent();
//                 console.log(text,no2);
//             })            
//         }
//     })   
// })
//tabular 113
// await test.step('select the maximum count in the item per page drop down ',async()=>{
//     await page.locator("div[class*='mat-select-arrow']").first().click();
//     await page.locator("span[class='mat-option-text']").nth(4).click();
// })