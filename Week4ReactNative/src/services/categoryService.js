import {get, post, put} from '../utils/httpRequest';
const SUFFIX_CATEGORY_API_URL = '/categories';

const fetchAllCategory = async () => {
  const response = await get(`${SUFFIX_CATEGORY_API_URL}/get-all`);
  if (response?.status !== 200) {
    return null;
  }
  return response.data;
};

const categoryService = {
  fetchAllCategory,
};

export default categoryService;
