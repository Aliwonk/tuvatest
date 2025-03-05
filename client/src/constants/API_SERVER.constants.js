const URL_SERVER = "http://localhost:8080";
const API_SERVER = {
    AUTH: {
        LOGIN: `${URL_SERVER}/auth/login`,
        REGISTRATION: `${URL_SERVER}/auth/registration`
    },
    HOME: `${URL_SERVER}`,
    PROFILE: `${URL_SERVER}/user/profile`,
    PAY: {
        WALLET: `${URL_SERVER}/pay/wallet`,
    },
    QUESTION: {
        CREATE: `${URL_SERVER}/question/create`,
        ONE: `${URL_SERVER}/question/get`,
        ALL: `${URL_SERVER}/question/get-all`,
        SUBJECT: {
            CREATE: `${URL_SERVER}/question/subject/create`,
            ONE: `${URL_SERVER}/question/subject/get`,
            ALL: `${URL_SERVER}/question/subject/get-all`
        }
    },
    TEST: {
        TRAIN: `${URL_SERVER}/test/train`,
        TRAIN_FINISH: `${URL_SERVER}/test/train-finish`
    }
}

export {
    API_SERVER
}