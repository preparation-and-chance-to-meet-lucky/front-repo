class Youtube{
    constructor(httpClient){
        this.youtube = httpClient;
    }

    async search(query){
        const response = await this.youtube.get('search',{
            params: {
                part: 'songs',
                type: 'playlist',
                q: query,
            },
        });

        return response.data.items.map((items) => ({
            ...items,
            id: items.id.videoId,
        }));
    }
}

export default Youtube