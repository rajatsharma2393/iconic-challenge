import axios from 'axios';
import { Product } from "./../model/product";
import { Response } from "./../model/response";

const BASE_PRODUCT_URL = "https://eve.theiconic.com.au/catalog/products";

const getProductsDetails = async (page: number, pageSize: number): Promise<any> => {

    return await axios.get(`${BASE_PRODUCT_URL}?gender=female&page=${page}&page_size=${pageSize}&sort=popularity`)

}

const getVideoPreviewUrl = async (sku: string): Promise<any> => {

    return await axios.get(`${BASE_PRODUCT_URL}/${sku}/videos`)
}


// First requests that fetch first set of products as well as total page count
const makeInitialRequest = async (pageSize: number): Promise<Response> => {
    const products = await getProductsDetails(1, pageSize);
    let resp = <Response>{};

    if (products && products.data) {
        resp.pageCount = products.data.page_count;

    } else {
        throw new Error("Error fetching page count");
    }

    if (products && products.data && products.data._embedded && products.data._embedded.product) {
        resp.products = products.data._embedded.product;
    } else {
        throw new Error("Error fetching initial products details");
    }

    return resp;

}

// Next set of requests that only fetches details of products
const makeNextPageRequests = async (page: number, pageSize: number): Promise<Product[]> => {
    const products = await getProductsDetails(page, pageSize);
    if (products && products.data && products.data._embedded && products.data._embedded.product) {
        return products.data._embedded.product;
    } else {
        throw new Error("Error fetching products details");
    }
}

// Function to populate the video preview url if any in passed product
const populateVideoPreviewUrls = async (videoProduct: Product) => {

    let resp = await getVideoPreviewUrl(videoProduct.sku);
    if (resp && resp.data && resp.data._embedded && resp.data._embedded.videos_url) {
        videoProduct.video_urls = resp.data._embedded.videos_url.map((url: any) => {
            return url.url;
        });
    }

}

export {
    getProductsDetails,
    getVideoPreviewUrl,
    makeInitialRequest,
    makeNextPageRequests,
    populateVideoPreviewUrls
}