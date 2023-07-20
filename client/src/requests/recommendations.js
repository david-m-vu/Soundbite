const baseURL = "http://localhost:3001"

export const generateGPTRecPlaylist = async (access_token, activityInput, durationInput) => {
    const response = await fetch(`${baseURL}/recommendations`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "activity": activityInput,
            "duration": durationInput,
            "access_token": access_token
        }),
    })

    if (response.ok) {
        const responseJSON = await response.json();
        return {
            ...responseJSON
        };
    }
}