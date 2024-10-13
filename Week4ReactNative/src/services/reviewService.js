import { get, post, put } from '../utils/httpRequest';

const SUFFIX_REVIEW_API_URL = '/review';

const getAllReviewByCourse = async (reviewRequest) => {
    const path = `${SUFFIX_REVIEW_API_URL}/get-all-review-by-course`;
    const response = await post(path, reviewRequest);

    if (response?.status !== 200) {
        return null;
    }

    return response.data;
}

const getReview5StarByCourse = async (reviewRequest) => {
    const path = `${SUFFIX_REVIEW_API_URL}/get-all-review-5-star-by-course`;
    const response = await post(path, reviewRequest);

    if (response?.status !== 200) {
        return null;
    }

    return response.data;
}
const getReview4StarByCourse = async (reviewRequest) => {
    const path = `${SUFFIX_REVIEW_API_URL}/get-all-review-4-star-by-course`;
    const response = await post(path, reviewRequest);

    if (response?.status !== 200) {
        return null;
    }

    return response.data;
}
const getReview3StarByCourse = async (reviewRequest) => {
    const path = `${SUFFIX_REVIEW_API_URL}/get-all-review-3-star-by-course`;
    const response = await post(path, reviewRequest);

    if (response?.status !== 200) {
        return null;
    }

    return response.data;
}
const getReview2StarByCourse = async (reviewRequest) => {
    const path = `${SUFFIX_REVIEW_API_URL}/get-all-review-2-star-by-course`;
    const response = await post(path, reviewRequest);

    if (response?.status !== 200) {
        return null;
    }

    return response.data;
}
const getReview1StarByCourse = async (reviewRequest) => {
    const path = `${SUFFIX_REVIEW_API_URL}/get-all-review-1-star-by-course`;
    const response = await post(path, reviewRequest);

    if (response?.status !== 200) {
        return null;
    }

    return response.data;
}


const reviewService = {
    getAllReviewByCourse,
    getReview5StarByCourse,
    getReview4StarByCourse,
    getReview3StarByCourse,
    getReview2StarByCourse,
    getReview1StarByCourse
}

export default reviewService;