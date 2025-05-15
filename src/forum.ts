export type forumPost = {
    title?: string,
    content?: string,
    created_at: Date,
    answers_count: number,
    correct_answer: boolean,
    statuses?: string[],
    subject: string,
    user: {
        id: number,
        username: string,
        first_name: string,
        profile_image_url: string,
    }
    id: string
}
export async function getForumPage(offset?: number) {
    /**
     * @description Fetcht de data van de StudyGo forum hoofdpagina
     * 
     * @param {number} offset - De offset van de infinte scroll component, dit wordt gebruikt meerdere antwoorden te krijgen
     * 
     * @example
     * getForumPage()
     * geeft bijvoorbeeld:
       {
         "0": {
           "title": "Vraag Van De Week:",
           "content": "Vraag Van De Week: \n\nElke week op woensdag vanaf ongeveer 15.00 vragen wij als tutors jullie een vraag. Deze week is dat: \n\nDe zon schijnt de hele week al lekker! Dat betekent zonnen en zwemmen, maar dit is niet zonder gevaren. Vind jij dat school jaarlijks voorlichting zou moeten geven over o.a. het beschermen tegen de zon en de gevaren van zwemmen in de zee?",
           "created_at": "2025-05-14T14:55:56.000Z",
           "answers_count": 60,
           "correct_answer": false,
           "statuses": ["answered", "pinned"],
           "subject": "Anders",
           "user": {
             "id": 100347216,
             "username": "anna-devries",
             "first_name": "Anna",
             "profile_image_url": "https://wrts-production.s3.eu-west-2.amazonaws.com/user/1694067455-12f31018-97ec-41c9-a5da-571c9a6b77ac.png",
           },
           "id": "526301"
         }
       }
    */
    const resp = await fetch(
        `https://api.wrts.nl/api/v3/public/qna/questions${offset ? `?offset=${offset}` : ''}`,
    )
    const data = await resp.json()
    const questions = data.results.map((question: forumPost) => {
        return {
            title: question.title,
            content: question.content,
            created_at: new Date(question.created_at),
            answers_count: question.answers_count,
            correct_answer: question.correct_answer,
            statuses: question.statuses,
            subject: question.subject,
            user: {
                id: question.user.id,
                username: question.user.username,
                first_name: question.user.first_name,
                profile_image_url: question.user.profile_image_url,
            },
            id: question.id
        }
    })
    return questions
}

