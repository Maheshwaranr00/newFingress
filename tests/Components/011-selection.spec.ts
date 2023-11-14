import{expect, selectors,test,Page,Browser,BrowserContext,chromium} from "@playwright/test";

let page: Page;
let browser: Browser;
let context: BrowserContext;
selectors.setTestIdAttribute("class");

test.beforeAll(async()=>{
    browser = await chromium.launch({headless:false});
    context = await browser.newContext();
    page = await context.newPage();
    await page.goto('http://192.168.1.49:8086/');    
    await page.locator("text='view_comfy'").waitFor({state:'visible'});
    await page.locator("text='view_comfy'").click();
    //await page.getByTestId("mat-focus-indicator mat-menu-trigger mat-button mat-button-base").first().click();
    await page.getByText('Fingress Explorer').click();
    await page.getByText('   Components   ').click();
    await page.getByRole('menuitem', { name: 'Form Elements' }).click();    
})
test.afterAll(async()=>{
    await page.close();
    await browser.close();
})
test('Select the single option',async()=>{
    await test.step('User ensures the select dropdown is available in the selection tab',async()=>{       
        await page.getByText('Selection').click();
        await expect(page.getByText('Select', { exact: true })).toContainText("Select");
        console.log("'Select' comment is visibled in placeholder");
    })
    await test.step('User selects the desired option by clicking the select dropdown',async()=>{
        await page.getByText('Select', { exact: true }).click(); 
        await page.getByRole('option', { name: 'Banana' }).click();
    })
    await test.step('The selected option must be displayed under the select dropdown',async()=>{
        await expect(page.getByText('Banana').first()).toContainText("Banana ");
        console.log("Single(Banana) value only will be selected from dropdown");
    })
})
test('Deselect the chosen option ',async()=>{
    await test.step('User ensures one of the available option is selected from the select dropdown',async()=>{
        await expect(page.getByText('Banana').first()).toContainText("Banana ");
        console.log("selected(Banana) value is visibled in dropdown");
    })
    await test.step('User deselects the existing option by selecting the new option in select dropdown',async()=>{
        await page.getByText('Banana Select').click(); 
        await page.getByRole('option', { name: 'Orange' }).click();
    })
    await test.step('The newly replaced option must be displayed under the select dropdown',async()=>{
        await expect(page.getByText('Orange Select')).toContainText("Orange ");
        console.log("after selecting orange value ,Banana was deselected and orange is selected");
    })
})
test('Select the single option by searching keyword',async()=>{
    await test.step('User ensures the "select with search" dropdown is available in the selection tab',async()=>{
        await expect(page.getByText('Select with search', { exact: true })).toContainText("Select with search ");
        console.log("'Select with search' comment is visibled in placeholder");
    })
    await test.step('User selects the option by searching keyword in the search box',async()=>{
        await page.getByText('Select with search', { exact: true }).click();
        await page.getByPlaceholder('Search...').fill('o');
        await page.getByRole('option', { name: 'Orange' }).click();
    })
    await test.step('The selected option must be displayed under the select with search dropdown',async()=>{
        await expect(page.getByText('Orange Select with search')).toContainText(" Orange ");
        console.log("single(Orange) value only will be selected from dropdown");
    })
})
test('Deselect the chosen option by searching keyword',async()=>{
    await test.step('User ensures one of the available option is selected from the "select with search" dropdown',async()=>{
        await expect(page.getByText('Orange Select with search')).toContainText(" Orange ");
  console.log("selected(Orange) value is visibled in dropdown");
    })
    await test.step('User deselects the existing option by selecting the new option in select with search dropdown',async()=>{
        await page.getByText('Orange Select with search').click();
        await page.getByPlaceholder('Search...').clear();
        await page.getByPlaceholder('Search...').fill('a');
        await page.getByRole('option', { name: 'Apple' }).click();
    })
    await test.step('The newly replaced option must be displayed under the "select with search" dropdown',async()=>{
        await expect(page.getByText('Apple Select with search')).toContainText(" Apple ");
  console.log("selected(Orange) value is deselected and single(apple) value is selected from dropdown");
    })
})  
test('Select the single option by search keyword/decoration',async()=>{
    await test.step('User ensures the "select with search and decoration" dropdown is available in the selection tab',async()=>{
        await expect(page.getByText('Select with search and decoration', { exact: true })).toContainText("Select with search and decoration ");
        console.log("'Select with search and decoration ' comment is visibled in placeholder");
    })
    await test.step('User selects the option by searching decoration in the search box',async()=>{
        await page.getByText('Select with search and decoration', { exact: true }).click();
  await page.getByPlaceholder('Search...').fill("a");
  await page.getByRole('option', { name: 'I like Australia' }).click();
    })
    await test.step('The selected decoration option must be displayed under the "select with search and decoration" dropdown',async()=>{
        await expect(page.getByText('Australia Select with search and decoration')).toContainText(' Australia ');
    console.log("(Australia) value is selected from dropdown");
    })
})
test('deselect the option by clicking (close)X option',async()=>{
    await test.step('The selected option must be displayed under the "select with search and decoration" dropdown',async()=>{
        await expect(page.getByText('Australia Select with search and decoration')).toContainText(' Australia ');
  console.log("selected(Australia) value is selected from dropdown");
    })
    await test.step('User clicks on the X button to deselect the existing option',async()=>{
        await page.getByLabel('Clear').first().click();
    })
    await test.step('User ensures the Select with search and decoration dropdown must be empty',async()=>{
        await expect(page.getByText('Select with search and decoration', { exact: true })).toContainText("Select with search and decoration ");
  console.log("Value is deselected and 'Select with search and decoration ' comment is visibled in placeholder");
    })
})
test('search the unavailable option in "select with search and decoration" dropdown',async()=>{
    await test.step('User ensures the "select with search and decoration" dropdown is available',async()=>{
        await expect(page.getByText('Select with search and decoration', { exact: true })).toContainText("Select with search and decoration ");
  console.log("Value is deselected and 'Select with search and decoration ' comment is visibled in placeholder");
    })
    await test.step('User searches the unavailable keyword in the search box',async()=>{
        await page.getByText('Select with search and decoration', { exact: true }).click();
  await page.getByPlaceholder('Search...').clear();
  await page.getByPlaceholder('Search...').fill("b");
  await page.keyboard.press("Enter");
    })
    await test.step('No matched items message must be displayed',async()=>{
        await expect(page.getByRole('listbox', { name: 'Select with search and decoration' })).toContainText(" No matching items");
        console.log("no items found based on search keyword");
        await page.locator('text="close"').click();
        await page.getByRole('option', { name: 'Australia' }).nth(1).click();
    })
})
test('Select the desired list of checkbox for selecting countries',async()=>{
    await test.step('User ensures the List box select option is available in the selection tab',async()=>{
        await expect(page.getByText('List box select')).toBeVisible();
    console.log("list box select category is available");
    })
    await test.step('User selects the multiple desired options from the checkbox available for selecting countries',async()=>{
        await page.getByRole('option', { name: 'Australia' }).first().click();
       await page.getByRole('option', { name: 'Germany' }).first().click();
       await page.getByRole('option', { name: 'Spain' }).first().click();
       await page.getByRole('option', { name: 'India' }).first().click();
    })
    await test.step('User ensures the selected checkbox options must be enabled by checked symbol',async()=>{
        await expect(page.getByRole('option', { name: 'Australia' }).first()).toBeEnabled();
        console.log("Australia selected");
        await expect(page.getByRole('option', { name: 'Germany' }).first()).toBeEnabled();
        console.log("Germany selected");
        await expect(page.getByRole('option', { name: 'Spain' }).first()).toBeEnabled();
        console.log("Spain selected");
        await expect(page.getByRole('option', { name: 'India' }).first()).toBeEnabled();
        console.log("India selected");
    })
})
test('deselect the desired checkboxes of the countries that is selected',async()=>{
    await test.step('User ensures the List box select option must be enabled by checked symbol',async()=>{
        await expect(page.getByRole('option', { name: 'Australia' })).toBeEnabled();
        await expect(page.getByRole('option', { name: 'Germany' })).toBeEnabled();
        await expect(page.getByRole('option', { name: 'Spain' })).toBeEnabled();
        await expect(page.getByRole('option', { name: 'India' })).toBeEnabled();
        console.log("selected options are available");
    })
    await test.step('User deselects the multiple desired options from the checkboxes that is enabled',async()=>{
        await page.getByRole('option', { name: 'Australia' }).click();
    await page.getByRole('option', { name: 'Germany' }).click();
    await page.getByRole('option', { name: 'Spain' }).click();
    await page.getByRole('option', { name: 'India' }).click();
    })
    await test.step('User ensures the deselected checkbox options must be displayed',async()=>{
        await expect(page.getByRole('option', { name: 'Australia' })).not.toBeChecked();
     console.log("Australia deselected");
     await expect(page.getByRole('option', { name: 'Germany' })).not.toBeChecked();
     console.log("Germany deselected");
     await expect(page.getByRole('option', { name: 'Spain' })).not.toBeChecked();
     console.log("Spain deselected");
     await expect(page.getByRole('option', { name: 'India' })).not.toBeChecked();
     console.log("India deselected");
    })
})
test('Select the business code in the "Business code dropdown"',async()=>{
    await test.step('User ensures the Business code dropdown option is available in the selection tab',async()=>{
        await expect(page.getByText('Business code dropdown')).toContainText('Business code');
    console.log('Business code dropdown is available');
    })
    await test.step('User selects the desired business code by searching the keyword in the search box available',async()=>{
        await page.getByText('Business code dropdown').click();
    await page.getByPlaceholder('Search...').fill("c");
    await page.getByRole('option', { name: 'CNY' }).click();
    })
    await test.step('User ensures the selected business code is displayed under business code dropdown',async()=>{
        await expect(page.getByText('CNY Business code dropdown')).toContainText('CNY');
        console.log("specified option is selected");
    })
})
test('Replacing the business code that is selected in the "Business code dropdown"',async()=>{
    await test.step('User ensures the selected business code must be available under business code dropdown',async()=>{
        await expect(page.getByText('CNY Business code dropdown')).toContainText('CNY');
    console.log("selected options available to change that value");
    })
    await test.step('User change the desired business code by searching the keyword in the search box available',async()=>{
        await page.getByText('CNY Business code dropdown').click();
    await page.getByPlaceholder('Search...').clear();
    await page.getByPlaceholder('Search...').fill("e");
    await page.getByRole('option', { name: 'EUR' }).click();
    })
    await test.step('User ensures the changed option should be displayed under business code dropdown',async()=>{
        await expect(page.getByText('EUR Business code dropdown')).toContainText('EUR');
    console.log("specified option is changed");
    })
}) 
test('Checking the unavailable business code in "Business code dropdown"',async()=>{
    await test.step('User ensures the Business code dropdown option is available',async()=>{
        await page.getByText('EUR Business code dropdown').click();
    await page.getByPlaceholder('Search...').clear();
    })
    await test.step('Use searches the unavailable keyword in the search box of the "Business code dropdown"',async()=>{
        await page.getByPlaceholder('Search...').fill("d");
    await page.keyboard.press('Enter');
    })
    await test.step('No matched items should be displayed under the Business code dropdown',async()=>{
        await expect(page.getByText('No matching items.')).toContainText('No matching items');
    console.log("No option is chosen");
    await page.locator('text="close"').nth(1).click();
    await page.getByRole('option', { name: 'EUR' }).click();
    })
})
test('Select the dependent value from the "dependent dropdown"',async()=>{
    await test.step('User ensures the dependent dropdown option is available in the selection tab',async()=>{
        await expect(page.getByText('Dependent dropdown')).toContainText('Dependent dropdown');
    console.log('Dependent dropdown is available');
    })
    await test.step('User selects the desired dependent value from the dropdown',async()=>{
        await page.getByText('Dependent dropdown').click();
    await page.getByRole('option', { name: 'Assam' }).click();
    })
    await test.step('User ensures the selected dependent value is displayed under dependent dropdown',async()=>{
        await expect(page.getByText('Assam Dependent dropdown')).toContainText('Assam');
    console.log("assam value is selected");
    })
})
test('Changing the dependent value from the "dependent dropdown"',async()=>{
    await test.step('User ensures the selected dependent value is available under dependent dropdown of selection tab',async()=>{
        await expect(page.getByText('Assam Dependent dropdown')).toContainText('Assam');
    console.log("selected options available to change that particular value");
    })
    await test.step('User change the desired dependent value under the dependent dropdown',async()=>{
        await page.getByText('Assam Dependent dropdown').click();
        await page.getByRole('option', { name: 'Tamilnadu' }).click();
    })
    await test.step('User ensures the changed option should be displayed under dependent dropdown',async()=>{
        await expect(page.getByText('Tamilnadu Dependent dropdown')).toContainText('Tamilnadu');
    console.log('Tamilnadu value is selected');
    })
})
test('Select the one of the URL option from the "URL dropdown"',async()=>{
    await test.step('User ensures the URL dropdown option is available in the selection tab',async()=>{
        await expect(page.getByText('URL dropdown')).toBeVisible();
    console.log('URL dropdown is available');
    })
    await test.step('User selects the desired URL option by searching the keyword in the search box available',async()=>{
        await page.getByText('URL dropdown').click();
    await page.getByPlaceholder('Search...').fill("c");
    await page.getByRole('option', { name: 'CENTIZENTECHS' }).click();
    })
    await test.step('User ensures the selected URL is displayed under URL dropdown',async()=>{
        await expect(page.getByRole('option', { name: 'CENTIZENTECHS' })).toContainText('CENTIZENTECHS');
    console.log("specified option is selected");
    })
})
test('Changing the URL value from the "URL dropdown"',async()=>{
    await test.step('User ensures the selected URL value is available under URL dropodown',async()=>{
        await expect(page.getByRole('option', { name: 'CENTIZENTECHS' })).toBeHidden();
    console.log("selected URL options available to change the value");
    })
    await test.step('User change the desired URL value by searching the keyword in the search box available',async()=>{
        await page.getByText('CENTIZENTECHS URL dropdown').click();
    await page.getByPlaceholder('Search...').clear();
    await page.getByPlaceholder('Search...').fill("z");
    await page.getByRole('option', { name: 'ZAPPM' }).click();
    })
    await test.step('User ensures the changed option should be displayed under URL dropdown',async()=>{
        await expect(page.getByText('ZAPPM URL dropdown')).toContainText('ZAPPM');
    console.log("specified option is changed");
    })
})
test('Check the unavailable URL in the "URL dropdown"',async()=>{
    await test.step('User ensures the URL dropdown is available in selection tab',async()=>{
        await page.getByText('ZAPPM URL dropdown').click();
    await page.getByPlaceholder('Search...').clear();
    })
    await test.step('Use searches the unavailable keyword in the URL dropdown search box',async()=>{
        await page.getByPlaceholder('Search...').fill("zaa");
    await page.keyboard.press('Enter');
    })
    await test.step('No matched items should be displayed under the URL dropdown',async()=>{
        await expect(page.getByText('No matching items.')).toContainText('No matching items');
        console.log("No option is chosen");
        await page.locator('text="close"').nth(1).click();
        await page.getByRole('option', { name: 'ZAPPM' }).click();
    })
})
test('Select the auto populate value from "auto populate dropdown"',async()=>{
    await test.step('User ensures the Auto populate dropdown is available in the selection tab',async()=>{
        await expect(page.getByText('Auto populate dropdown *')).toContainText('Auto populate dropdown');
    console.log('Auto populate dropdown is available');
    })
    await test.step('User selects the desired auto populate option from the dropdown',async()=>{
        await page.getByText('Auto populate dropdown *').click();
        await page.getByRole('option', { name: 'TATASTEEL PVT LTD' }).click();
    })
    await test.step('User ensures the selected auto populate value is displayed under auto populate dropdown',async()=>{
        await expect(page.getByText('TATASTEEL PVT LTD Auto populate dropdown *')).toContainText('TATASTEEL PVT LTD');
    console.log("TATASTEEL PVT LTD value is selected");
    })
})

test('Changing the auto populate value from the "Auto populate dropdown"',async()=>{
    await test.step('User ensures the selected auto populate value is available under auto populate dropdown',async()=>{
        await expect(page.getByText('TATASTEEL PVT LTD Auto populate dropdown *')).toContainText('TATASTEEL PVT LTD');
        console.log("selected auto populate values available to change");
    })
    await test.step('User change the desired auto populate value under the "auto populate dropdown"',async()=>{
        await page.getByText('TATASTEEL PVT LTD Auto populate dropdown *').click();
    await page.getByRole('option', { name: 'HCL PVT LTD' }).click();
    })
    await test.step('User ensures the changed option should be displayed under "auto populate dropdown"',async()=>{
        await expect(page.getByText('HCL PVT LTD Auto populate dropdown *')).toContainText('HCL');
    console.log('HCL PVT LTD value is selected');
    })    
})
test('Selecting the values from "model dropdown"',async()=>{
    await test.step('User ensures the Model dropdown option is available in the selection tab',async()=>{
        await expect(page.getByText('Model dropdown')).toContainText('Model dropdown')
    console.log("Model dropdown is available");        
    })
    await test.step('User selects the desired model option by searching the keyword in the search box available',async()=>{
        await page.getByLabel('Model dropdown').click();
        await page.getByPlaceholder('Search...').fill('037');
        await page.locator('span').filter({ hasText: '037' }).nth(1).click();
    })
    await test.step('User ensures the selected model is displayed under Model dropdown',async()=>{
        await expect(page.getByText('037').nth(0)).toContainText('037');
        console.log("Specified value is selected");
    })
})
test('Change the selected model from the "Model dropdown"',async()=>{
    await test.step('User ensures the selected model value is available under Model dropdown',async()=>{
    await page.getByText('037').nth(0).click();
    await page.getByPlaceholder('Search...').clear();
    })
    await test.step('User change the desired model value by searching the keyword in the search box available',async()=>{
        await page.getByPlaceholder('Search...').fill('181');
        await page.locator('span').filter({ hasText: '181' }).nth(1).click();
    //await page.getByTestId('mat-option mat-focus-indicator nonbordered mat-active ng-tns-c77-57 ng-star-inserted').first().click();
    })
    await test.step('User ensures the changed option should be displayed under Model dropdown',async()=>{
        await expect (page.locator('span').filter({ hasText: '181' }).nth(0)).toContainText('181');
        console.log("Changed value is selected");
    })
})
test('Move the options under Advanced select from available options to selected options',async()=>{
    await test.step('User ensures the Advance select option is available in the selection tab',async()=>{
        await expect(page.getByText('Advanced select')).toBeVisible();
        console.log("List of invoices available to move");        
    })
    await test.step('User selects the desired available options and then click move option',async()=>{
        
        await page.getByRole('option', { name: '5' }).first().click();
        await page.getByRole('option', { name: '809' }).first().click();
        await page.getByRole('option', { name: '803' }).first().click();
        await page.getByRole('option', { name: '3' }).first().click();
        await page.getByRole('option', { name: '7' }).first().click();
        await page.locator("[class*='fa-arrow-right']").click();    
    })
    await test.step('User ensures the chosen option should be moved',async()=>{        
        console.log("Selected options are moved");
    })    
})
test('Move back the options under Advanced select from selected options to available options',async()=>{
    await test.step('User ensures the selected options can be moved back to other folder',async()=>{
        await expect(page.getByText('Advanced select')).toBeVisible();
        console.log("List of invoices available to move back");
    })
    await test.step('User select desired options and then click move back option',async()=>{
        await page.getByRole('option', { name: '803' }).click();
        await page.locator("[class*='fa-arrow-left']").click();
    })
    await test.step('User ensures the chosen option should be moved back',async()=>{        
        console.log("Desired options are moved back");
    })
})
test('Change the priority of options',async()=>{
    await test.step('User ensures the list of selected options are available',async()=>{
        console.log("List of selected options are available to change the priority")
    })
    await test.step('User selects the options and then click priority option',async()=>{
        await page.getByRole('option', { name: '809' }).click();
        await page.locator("[class*='fa-chevron-up']").nth(0).click();
    })
    await test.step('User ensures the desired options should be rearranged',async()=>{
        console.log('Desired options are rearranged');        
    })
})



