
import { Product } from "./model/product";
import { Response } from "./model/response";
import { getProductsDetails, getVideoPreviewUrl } from "./services/product";

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

// Function to populate next set of products into our all products DS
const populateNextProducts = async (allProducts: Array<Product>, pageNo: number, pageSize: number) => {
    //Can use Promise.all here but if 1 api fails, other ones will not proceed
    // Also Gateway not handling concurrent requests in short span of time

    let products: Array<Product> = await makeNextPageRequests(pageNo, pageSize);
    //  To avoid unnecessary properties
    products = products.map((product: Product) => {
        return { name: product.name, sku: product.sku, video_count: product.video_count, video_urls: [] };
    });
    allProducts.push(...products);
}

// Main function to fetch all product details and add their corresponding video urls
const fetchDetails = async (): Promise<Array<Product>> => {
    try {
        let pageSize: number = 100;
        let response: Response = await makeInitialRequest(pageSize);
        let allProducts = Array<Product>();
        // To avoid unnecessary properties
        let products: Array<Product> = response.products.map((product: Product) => {
            return { name: product.name, sku: product.sku, video_count: product.video_count, video_urls: [] };
        })
        allProducts.push(...products);

        console.log("Processed page 1")

        // Process next set of pages and fetch products
        for (let i = 2; i <= response.pageCount; i++) {
            try {
                //   Have to process this 1 by 1 otherwise gateway giving timeout error
                await populateNextProducts(allProducts, i, pageSize);
                console.log(`Processed page ${i}`)
            } catch (err) {
                console.log(err);
                console.log("Error in processing page: " + i);
            }

        }


        // For testing to check video url working
        // allProducts[0].sku = "LO569SA80GXF";
        // allProducts[0].video_count = 1;

        // Filter out which products have video url and which dont
        // We dont need to process products that have zero video counts
        let noVideoProducts: Array<Product> = allProducts.filter(product => {
            return product.video_count == 0;
        })
        let videoProducts: Array<Product> = allProducts.filter(product => {
            return product.video_count != 0;
        })

        for (let i = 0; i < videoProducts.length; i++) {
            // Need to fetch this as well 1 by 1
            await populateVideoPreviewUrls(videoProducts[i]);
        }
        allProducts = Array<Product>();

        // First add video products
        allProducts.push(...videoProducts);
        allProducts.push(...noVideoProducts);
        return allProducts;


    } catch (err) {
        console.log(err);
        return Array<Product>();
    }
}

export {
    makeInitialRequest,
    makeNextPageRequests,
    populateVideoPreviewUrls,
    populateNextProducts,
    fetchDetails
}
