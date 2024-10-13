import { get, post, put } from '../utils/httpRequest';

const SUFFIX_COURSE_API_URL = '/course';

const getCourse = async (courseRequest) => {
    const path = `${SUFFIX_COURSE_API_URL}/get-all-course`;
    const response = await post(path, courseRequest);

    if (response?.status !== 200) {
        return null;
    }

    return response.data.content;
}

const getCourseByTopic = async (courseRequest) => {
    const path = `${SUFFIX_COURSE_API_URL}/get-all-course-by-topic`;
    const response = await post(path, courseRequest);

    if (response?.status !== 200) {
        return null;
    }

    return response.data.content;
}

const getCourseByLevel = async (courseRequest) => {
    const path = `${SUFFIX_COURSE_API_URL}/get-all-course-by-level`;
    const response = await post(path, courseRequest);

    if (response?.status !== 200) {
        return null;
    }

    return response.data.content;
}

const getCourseByListCategory = async (courseRequest) => {
    const path = `${SUFFIX_COURSE_API_URL}/get-all-course-by-list-category`;
    const response = await post(path, courseRequest);

    if (response?.status !== 200) {
        return null;
    }

    return response.data.content;
}


const courseService = {
    getCourse,
    getCourseByTopic,
    getCourseByLevel,
    getCourseByListCategory
}

export default courseService;