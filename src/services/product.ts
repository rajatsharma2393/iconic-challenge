import axios from 'axios';

const BASE_PRODUCT_URL = "https://eve.theiconic.com.au/catalog/products";

const getProductsDetails = async (page: number, pageSize: number): Promise<any> => {

    return await axios.get(`${BASE_PRODUCT_URL}?gender=female&page=${page}&page_size=${pageSize}&sort=popularity`)

}

const getVideoPreviewUrl = async (sku: string): Promise<any> => {

    return await axios.get(`${BASE_PRODUCT_URL}/${sku}/videos`)
}

export {
    getProductsDetails,
    getVideoPreviewUrl
}