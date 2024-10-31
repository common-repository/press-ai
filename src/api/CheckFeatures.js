export const isFeatureAvailable = async (feature) => {
    const response = await fetch('/wp-json/pressai/v1/is_feature_available', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({feature: feature}),
    });

    return await response.json();
};