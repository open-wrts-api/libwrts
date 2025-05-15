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

export type ForumPostDetail = {
  id: number;
  can_flag: boolean;
  can_edit: boolean;
  can_answer: boolean;
  created_at: string;
  title: string;
  body: string;
  contents: string;
  topic: string | null;
  subject: string;
  tutor_qna_answers: any[];
  other_qna_answers: any[];
  requires_forced_moderation: boolean;
  user: {
    id: number;
    username: string;
    first_name: string;
    grade_display: string;
    profile_image_url: string;
    highlighted_achievement: string | null;
    package_name: string | null;
    tutor: boolean;
    profile_image: string;
    employee: boolean;
  };
  closed: boolean;
  is_flagged: boolean | null;
  qna_attachments: any[];
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

export async function getForumPost(id: string) {
  /**
   * @description Fetcht de data van een specifieke forum post
   * 
   * @param {string} id - De id van de forum post
   * 
   * @example
   * getForumPost("526465")
   * geeft bijvoorbeeld:
   * {
   *     "id": 526465,
   *     "can_flag": true,
   *     "can_edit": false,
   *     "can_answer": false,
   *     "created_at": "2025-05-15T13:34:34Z",
   *     "title": "Hee,",
   *     "body": "Hoe heb jij het afgelopen schooljaar ervaren? Doe mee met ons onderzoek en maak kans op €15! Het onderzoek staat in de link hieronder!\nhttps://a37ov9bj34e.typeform.com/to/QtnisI5L",
   *     "contents": "Hee,\nHoe heb jij het afgelopen schooljaar ervaren? Doe mee met ons onderzoek en maak kans op €15! Het onderzoek staat in de link hieronder!\nhttps://a37ov9bj34e.typeform.com/to/QtnisI5L",
   *     "topic": null,
   *     "subject": "Other",
   *     "tutor_qna_answers": [],
   *     "other_qna_answers": [],
   *     "requires_forced_moderation": false,
   *     "user": {
   *         "id": 101097306,
   *         "username": "voetbal-7-hrC",
   *         "first_name": "Emma",
   *         "grade_display": "6 vwo",
   *         "profile_image_url": "https://wrts-production.s3.eu-west-2.amazonaws.com/user/1694015952-f58705d3-73d6-47da-afe5-a6419bf59957.png",
   *         "highlighted_achievement": null,
   *         "package_name": null,
   *         "tutor": false,
   *         "profile_image": "https://wrts-production.s3.eu-west-2.amazonaws.com/user/1694015952-f58705d3-73d6-47da-afe5-a6419bf59957.png",
   *         "employee": true
   *     },
   *     "closed": true,
   *     "is_flagged": null,
   *     "qna_attachments": []
   * }
   */

  const resp = await fetch(
    `https://api.wrts.nl/api/v3/public/qna/questions/${id}`,
  )
  const data = await resp.json()

  return {
    id: data.qna_question.id,
    can_flag: data.qna_question.can_flag,
    can_edit: data.qna_question.can_edit,
    can_answer: data.qna_question.can_answer,
    created_at: data.qna_question.created_at,
    title: data.qna_question.title,
    body: data.qna_question.body,
    contents: data.qna_question.contents,
    topic: data.qna_question.topic,
    subject: data.qna_question.subject.name,
    tutor_qna_answers: data.qna_question.tutor_qna_answers,
    other_qna_answers: data.qna_question.other_qna_answers,
    requires_forced_moderation: data.qna_question.requires_forced_moderation,
    user: {
      id: data.qna_question.user.id,
      username: data.qna_question.user.username,
      first_name: data.qna_question.user.first_name,
      grade_display: data.qna_question.user.grade_display,
      profile_image_url: data.qna_question.user.profile_image_url,
      highlighted_achievement: data.qna_question.user.highlighted_achievement,
      package_name: data.qna_question.user.package_name,
      tutor: data.qna_question.user.tutor,
      profile_image: data.qna_question.user.profile_image.image_url,
      employee: data.qna_question.user.employee
    },
    closed: data.qna_question.closed,
    is_flagged: data.qna_question.is_flagged,
    qna_attachments: data.qna_question.qna_attachments
  }
}