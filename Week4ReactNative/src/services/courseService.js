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

const getAllCourseOfStudent = async (courseRequest) => {
    const path = `${SUFFIX_COURSE_API_URL}/get-all-course-of-student`;
    const response = await post(path, courseRequest);

    if (response?.status !== 200) {
        return null;
    }

    return response.data;
}

const getAllCourseFavouriteOfStudent = async (courseRequest) => {
    const path = `${SUFFIX_COURSE_API_URL}/get-all-course-favorite-of-student`;
    const response = await post(path, courseRequest);

    if (response?.status !== 200) {
        return null;
    }

    return response.data;
}

const courseService = {
    getCourse,
    getCourseByTopic,
    getCourseByLevel,
    getCourseByListCategory,
    getAllCourseOfStudent,
    getAllCourseFavouriteOfStudent
}

export default courseService;