import test from "@playwright/test";

test('',async({request})=>{
    const _response = await request.get('https://uat.quiklyz.com/data-service/queryServiceV2',{
                
    })
    console.log(_response.json());
})