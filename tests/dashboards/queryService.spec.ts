import test from "@playwright/test"

test('response',async({page})=>{
    await page.goto('http://192.168.1.49:8086/');
    await page.locator("//mat-icon[text()='view_comfy']").click();
    await page.locator("//span[text()='Fingress Explorer']").click();
    await page.locator("text='   Dashboards   '").click();
    const [response] = await Promise.all([
        page.waitForResponse(res=>
            res.status()==200
            && res.url() == "http://192.168.1.49:8086/data-service/fgLayoutTemplateDetail"
            ),
            await page.locator('text="Advance Charts"').click()
    ]) 
    console.log(response);
})
test.only('request',async({page})=>{
    await page.goto('http://192.168.1.49:8086/');
    await page.locator("//mat-icon[text()='view_comfy']").click();
    await page.locator("//span[text()='Fingress Explorer']").click();
    await page.locator("text='   List Pages   '").click();
        const [request] = await Promise.all([
        page.waitForRequest(re=>
            re.url() == "http://192.168.1.49:8086/data-service/fgLayoutTemplateDetail"
            ),
            await page.locator('(//span[text()="List View"])[1]').click()
        ]) 
    console.log(request);
})