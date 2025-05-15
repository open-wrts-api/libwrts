export type list = {
    name: string,
    description: string | null,
    creator: {
        profile_image_url: string,
        public_profile_name: string,
        public_profile_url: string | null,
        package_name: string | null,
        name: string
    },
    subject: string,
    from_language: string,
    to_language: string,
    words: {
        [key: number]: string
    }[],
    book: string | null
}

export async function getListById(id: number) {
    /**
     * @description Haalt een lijst op met een bepaalde id
     * 
     * @param {number} id - De id van de lijst
     * 
     * @example
     * getListById(178805126)
     * geeft bijvoorbeeld:
     * {
     *     "name": "Grandes Lignes e6.1 | Chapitre 1 | Voca ABEF | 2 vmbo-t/havo",
     *     "description": null,
     *     "creator": {
     *         "profile_image_url": "https://wrts-production.s3.eu-west-2.amazonaws.com/user/1738264174-c803cd00-23d8-4080-b1f5-6c303f9c1052.png",
     *         "public_profile_name": "polarlearn",
     *         "public_profile_url": "/polarlearn",
     *         "package_name": null,
     *         "name": "andrei1010 (Eigenaar van PolarLearn)"
     *     },
     *     "subject": "Frans",
     *     "from_language": "fr-FR",
     *     "to_language": "nl-NL",
     *     "words": [
     *         {
     *             "0": "en Angleterre",
     *             "1": "in/naar Engeland"
     *         },
     *         {
     *             "0": "en Espagne",
     *             "1": "in/naar Spanje"
     *         }
     *         // etc...
     *     ],
     *     "book": null
     * }
     */
    const resp = await fetch(
        `https://api.wrts.nl/api/v3/public/lists/${id}`,
    )
    const data = await resp.json()
    const list = data.results.map((rawList: any) => {
        // pick source/target languages from top‐level locales (non‐default → default)
        const from_language = rawList.locales.find((l: any) => !l.default)?.code
            || rawList.locales[0].code;
        const to_language = rawList.locales.find((l: any) => l.default)?.code
            || rawList.locales[1]?.code;
        // map words array
        const words = rawList.words_with_performance.map((item: any) => ({
            0: item.words[0],
            1: item.words[1],
        }));
        return {
            name: rawList.title,
            description: rawList.description,
            creator: {
                profile_image_url: rawList.creator.profile_image_url,
                public_profile_name: rawList.creator.public_profile_name,
                public_profile_url: rawList.creator.public_profile_url,
                package_name: rawList.creator.package_name,
                name: rawList.creator.name,
            },
            subject: rawList.subject.name,
            from_language,
            to_language,
            words,
            book: rawList.book,
        };
    });
    return list[0];
}