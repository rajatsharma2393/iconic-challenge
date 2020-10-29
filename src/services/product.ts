import axios from 'axios';
const getProductsApi = async (page: number, pageSize: number): Promise<any> => {

    return await axios.get(`https://eve.theiconic.com.au/catalog/products?gender=female&page=${page}&page_size=${pageSize}&sort=popularity`)

}

const getVideoPreviewUrl = async (sku: string): Promise<any> => {

    return await axios.get(`https://eve.theiconic.com.au/catalog/products/${sku}/videos`)
}

export {
    getProductsApi,
    getVideoPreviewUrl
}