const API_KEY = 'sk-yMDXZzP0LeW67pWHCmsxJsnYYPeBcLBsk7MzeDxwZs8O1rLE';
const BASE_URL = 'https://api.iamhc.cn';

async function testEndpoint(endpoint, model, description) {
    console.log(`\n🧪 测试: ${description}`);
    console.log(`   端点: ${endpoint}`);
    console.log(`   模型: ${model}`);
    
    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + API_KEY
            },
            body: JSON.stringify({
                model: model,
                messages: [
                    { role: 'user', content: 'hi' }
                ]
            })
        });

        console.log(`   状态: ${response.status} ${response.statusText}`);
        
        if (response.ok) {
            const data = await response.json();
            console.log(`   ✅ 成功!`);
            if (data.choices && data.choices[0]) {
                console.log(`   回复: ${data.choices[0].message?.content?.substring(0, 50)}...`);
            }
            return { success: true, endpoint, model };
        } else {
