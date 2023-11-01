import { chromium,expect,test,Page } from "@playwright/test";
test.describe.configure({ mode: 'serial' });
test.use({
        viewport:{
            width: 1024,
            height:768
        }})
        let i;
test.beforeEach('Open start URL', async ({ page }) => {
    await page.goto('http://192.168.1.49:8086/');
    await page.locator("//mat-icon[text()='view_comfy']").click();
    await page.locator("//span[text()='Fingress Explorer']").click();
    await page.locator("text='    Components   '").click();
})

test('Verify the user can able to upload the files in template A ', async ({ page }) => {
    test.info().annotations.push(({
        type: 'Test',
        description: 'User should successfully able to attach the file in the Template A'
    }))
    await test.step('User clicks on the form elements option', async () => {
        await page.getByText('Form Elements').click();
    });
    await test.step('User clicks on the Attachments tab', async () => {
        await page.getByText('Attachments').click();
    });
    await test.step('User selects the desired file for uploading',async()=> {
        await page.setInputFiles("input[type='file']",
        ["fg_kmbl_doa_open_api_v7.txt"])
    });
});
test('Verify the user can able to upload the files in template B ', async ({ page }) => {
    test.info().annotations.push(({
        type: 'Test',
        description: 'User should successfully able to attach the file in the Template B'
    }))
    await test.step('User clicks on the form elements option', async () => {
        await page.getByText('Form Elements').click();
    });
    await test.step('User clicks on the Attachments tab', async () => {
        await page.getByText('Attachments').click();
    });
    await test.step('User selects the desired file for uploading',async()=> {
        await page.setInputFiles("input[type='file']",
        ["fg_kmbl_doa_open_api_v7.txt"])
    });
});
test('Verify the user can able to upload the files in template C ', async ({ page }) => {
    test.info().annotations.push(({
        type: 'Test',
        description: 'User should successfully able to attach the file in the Template C'
    }))
    await test.step('User clicks on the form elements option', async () => {
        await page.getByText('Form Elements').click();
    });
    await test.step('User clicks on the Attachments tab', async () => {
        await page.getByText('Attachments').click();
    });
    await test.step('User selects the desired file for uploading',async()=> {
        await page.setInputFiles("input[type='file']",
        ["fg_kmbl_doa_open_api_v7.txt"])
    });
});

test.only("verify that user can able to view the panel in expand mode",async({page})=>{
    await test.step('User clicks on the form elements option', async () => {
        await page.getByText('Form Elements').click();
    });
    await test.step('User clicks on the Attachments tab', async () => {
        await page.getByText('Attachments').click();
    });
    await test.step("User clicks the expand panel",async()=>{
        await page.locator("text=' Expansion Panel '").nth(1).click();
    })
})