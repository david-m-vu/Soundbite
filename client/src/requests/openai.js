const baseURL = "http://localhost:3001"

export const getGPTPlaylistRecommendation = async (input) => {
    const response = await fetch(`${baseURL}/openai/recplaylist`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "message": input
        }),
    })

    if (response.ok) {
        const responseJSON = await response.json();
        return responseJSON.content;
    }
}