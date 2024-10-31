
const REST_API_URL = '/wp-json/pressai/v1';

export const getOpenAIAPIKey = async () => {
    const response = await fetch(REST_API_URL + '/get_option', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({name: 'pressai_openai_api_key'}),
    });

    return await response.json();
};

export const setOpenAIAPIKey = async (apiKey) => {
    const response = await fetch(REST_API_URL + '/save_api_key', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ api_key: apiKey }),
    });

    return await response.json();
};

export const fetchDashboardItems = async (itemName) => {
    const response = await fetch(REST_API_URL + `/dashboard_items?item_name=${itemName}`);
    return await response.json();
};


export const updateDashboardItems = async (hiddenItems, shownItems, itemName) => {
    await fetch(REST_API_URL + '/dashboard_items', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            item_name: itemName,
            hidden_items: hiddenItems,
            shown_items: shownItems,
        }),
    });
};


export const getOption = async (name) => {
    const response = await fetch(REST_API_URL + '/get_option', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({name: name}),
    });

    return await response.json();
};

export const setOption = async (name, value) => {
    const response = await fetch(REST_API_URL + '/set_option', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: name, value: value }),
    });

    return await response.json();
};
