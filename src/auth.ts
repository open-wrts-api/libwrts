import { getRandom } from 'random-useragent';

function uuidv4() {
    return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, c =>
        (+c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> +c / 4).toString(16)
    );
}

export type tokenData = {
    token: string,
    expires_at: number,
    renew_from: number
}

export type UserData = {
    id: number;
    username: string;
    full_name: string;
    first_name: string;
    last_name: string;
    public_profile_name: string;
    email: string;
    role_name: string;
    promo_banner: null | string;
    needs_to_fill_education_details: boolean;
    can_use_chat: boolean;
    can_access_qna: boolean;
    new_notifications_count: number;
    locale: string;
    country: string;
    theme: string;
    is_paying_customer: boolean;
    profile_image: string;
    needs_to_verify_email: boolean;
    formatted_grade: string;
    streak: number;
}

export async function getToken(email: string, password: string) {
    /**
     * @description Haalt een token op met de gebruikersnaam en het wachtwoord
     * 
     * @param {string} username - De gebruikersnaam van de gebruiker
     * @param {string} password - Het wachtwoord van de gebruiker
     * 
     * @example
     * getToken('username', 'password')
     * geeft bijvoorbeeld:
     * {
     *     "auth_token": "eyJhbGciOiJIUzI1NiJ9.XXXX.YYYY",
     *     "expires_at": 1748175956,
     *     "renew_from": 1748175956
     * }
     */
    const resp = await fetch("https://api.wrts.nl/api/v3/auth/get_token", {
        "credentials": "omit",
        "headers": {
            "User-Agent": getRandom(),
            "Accept": "application/json, text/plain, */*",
            "Accept-Language": "en-US,en;q=0.5",
            "Content-Type": "application/json",
            "X-Client-Type": "web",
            "X-Language-Code": "nl",
            "X-Locale-Code": "nl-NL",
            "X-Session-Id": uuidv4(),
            "X-Device-Id": uuidv4(),
            "Sec-GPC": "1",
            "Sec-Fetch-Dest": "empty",
            "Sec-Fetch-Mode": "cors",
            "Sec-Fetch-Site": "cross-site",
            "Priority": "u=0"
        },
        "referrer": "https://studygo.com/",
        "body": "{\"email\":\"" + email + "\",\"password\":\"" + password + "\"}",
        "method": "POST",
        "mode": "cors"
    });
    const data = await resp.json()
    const tokenData: tokenData = {
        token: data.auth_token,
        expires_at: data.expires_at,
        renew_from: data.renew_from
    }
    return tokenData
}

export async function getUserData(token: string): Promise<UserData> {
    /**
     * @description Haalt de gebruikersdata op met de token
     * 
     * @param {string} token - De token van de gebruiker
     * 
     * @example
     * getUserData("eyJhbGciOiJIUzI1NiJ9.XXXX.YYYY")
     * geeft bijvoorbeeld:
     * {
     *     "id": 188145225,
     *     "username": "polarlearn",
     *     "full_name": "andrei1010‎ (Eigenaar van PolarLearn)ㅤ",
     *     "first_name": "andrei1010‎ (Eigenaar van PolarLearn)",
     *     "last_name": "ㅤ",
     *     "public_profile_name": "polarlearn",
     *     "email": "andrei@andrei1010.me",
     *     "role_name": "Basis",
     *     "promo_banner": null,
     *     "needs_to_fill_education_details": false,
     *     "can_use_chat": false,
     *     "can_access_qna": true,
     *     "new_notifications_count": 0,
     *     "locale": "nl-NL",
     *     "country": "NL",
     *     "theme": "dark",
     *     "is_paying_customer": false,
     *     "profile_image": "https://wrts-production.s3.eu-west-2.amazonaws.com/user/1738264174-c803cd00-23d8-4080-b1f5-6c303f9c1052.png",
     *     "needs_to_verify_email": false,
     *     "formatted_grade": "2 havo",
     *     "streak": 1
     * }
     */
    const resp = await fetch(
        "https://api.wrts.nl/api/v3/get_user_data",
        {
            "headers": {
                "x-auth-token": token
            }
        }
    )
    const data = await resp.json()

    const userData: UserData = {
        id: data.id,
        username: data.username,
        full_name: data.full_name,
        first_name: data.first_name,
        last_name: data.last_name,
        public_profile_name: data.public_profile_name,
        email: data.email,
        role_name: data.role_name,
        promo_banner: data.promo_banner,
        needs_to_fill_education_details: data.needs_to_fill_education_details,
        can_use_chat: data.can_use_chat,
        can_access_qna: data.can_access_qna,
        new_notifications_count: data.new_notifications_count,
        locale: data.locale.code,
        country: data.country.code,
        theme: data.theme.selected_theme.replace(/^system_/, ''),
        is_paying_customer: data.is_paying_customer,
        profile_image:
            typeof data.profile_image === 'string'
                ? data.profile_image
                : data.profile_image.image_url,
        needs_to_verify_email: data.needs_to_verify_email,
        formatted_grade: data.formatted_grade,
        streak:
            typeof data.streak === 'object'
                ? data.streak.count
                : data.streak
    }

    return userData
}