import { get, post, put } from '../utils/httpRequest';

const SUFFIX_SECTION_API_URL = '/section';

const getAllSectionByCourse = async (sectionRequest) => {
    const path = `${SUFFIX_SECTION_API_URL}/get-all-section-by-course`;
    const response = await post(path, sectionRequest);

    if (response?.status !== 200) {
        return null;
    }

    return response.data;
}

const sectionService = {
    getAllSectionByCourse,
}

export default sectionService;