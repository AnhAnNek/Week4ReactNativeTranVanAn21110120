import { get, post, put } from '../utils/httpRequest';

const SUFFIX_LESSON_API_URL = '/lesson';

const getAllLessonBySection = async (lessonRequest) => {
    const path = `${SUFFIX_LESSON_API_URL}/get-all-lesson-by-section`;
    const response = await post(path, lessonRequest);

    if (response?.status !== 200) {
        return null;
    }

    return response.data;
}

const lessonService = {
    getAllLessonBySection,
}

export default lessonService;