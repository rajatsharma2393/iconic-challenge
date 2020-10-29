import {
    getInitialProductData,
    getNextPageProductsData,
    populateVideoPreviewUrls,
} from "./../../services/product";

import axios from 'axios';
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

import { Product } from "./../../model/product";
import { Response } from "./../../model/response";


const validProductApiData = {
    "_embedded": {
        "product": [
            {
                "video_count": 0,
                "price": 60,
                "markdown_price": 60,
                "special_price": 0,
                "returnable": true,
                "final_sale": false,
                "stock_update": null,
                "final_price": 60,
                "sku": "NI126SA09FTY",
                "name": "Nike One Leggings"
            },
            {
                "video_count": 1,
                "price": 60,
                "markdown_price": 60,
                "special_price": 0,
                "returnable": true,
                "final_sale": false,
                "stock_update": null,
                "final_price": 60,
                "sku": "NQ126SA09FTY",
                "name": "Nike Two Leggings"
            }
        ]
    },
    "page_count": 2,
    "page_size": 5,
    "total_items": 10,
    "page": 1
}

const validProductVideoApiData = {
    "_embedded": {
        "videos_url": [
            {
                "url": "https:\/\/vod-progressive.akamaized.net\/exp=1603943267~acl=%2Fvimeo-prod-skyfire-std-us%2F01%2F4681%2F17%2F448408308%2F1969019186.mp4~hmac=d352d5e751f0e85b1779ca33745d591af2cb50431d838b553b080294e17321ca\/vimeo-prod-skyfire-std-us\/01\/4681\/17\/448408308\/1969019186.mp4",
            }
        ]
    },
    "page_count": 1,
    "page_size": 25,
    "total_items": 1,
    "page": 1
}

test('Test getInitialProductData with valid data', () => {
    (mockedAxios.get as any).mockResolvedValue(Promise.resolve({ data: validProductApiData }));

    getInitialProductData(2).then(result => {
        expect(result).toBeTruthy();
        expect(result).toHaveProperty('pageCount', 2);
        expect(result).toHaveProperty('products');
        expect(result.products).toHaveLength(2);
    }).catch(err => {
        fail(err);
    })
})

test('Test getInitialProductData with invalid data(No Page count)', async () => {
    (mockedAxios.get as any).mockResolvedValue(Promise.resolve({ data: {} }));


    await expect(getInitialProductData(2))
        .rejects
        .toThrow(Error);
})

test('Test getInitialProductData with invalid data(No products)', async () => {
    (mockedAxios.get as any).mockResolvedValue(Promise.resolve({ data: { page_count: 2 } }));


    await expect(getInitialProductData(2))
        .rejects
        .toThrow(Error);
})



test('Test getNextPageProductsData with valid data', () => {
    (mockedAxios.get as any).mockResolvedValue(Promise.resolve({ data: validProductApiData }));

    getNextPageProductsData(1, 2).then(products => {
        expect(products).toBeTruthy();
        expect(products).toHaveLength(2);
    }).catch(err => {
        fail(err);
    })
})



test('Test getInitialProductData with invalid data(No products)', async () => {
    (mockedAxios.get as any).mockResolvedValue(Promise.resolve({ data: {} }));


    await expect(getNextPageProductsData(1, 2))
        .rejects
        .toThrow(Error);
})


test('Test populateVideoPreviewUrls with urls data', async () => {
    (mockedAxios.get as any).mockResolvedValue(Promise.resolve({ data: validProductVideoApiData }));

    let product: Product = { name: "A", sku: "a", video_count: 1, video_urls: [] };

    populateVideoPreviewUrls(product).then(result => {
        expect(product).toBeTruthy();
        expect(product.video_urls).toHaveLength(1);
    }).catch(err => {
        fail(err);
    })
})


test('Test populateVideoPreviewUrls with no urls data', async () => {
    (mockedAxios.get as any).mockResolvedValue(Promise.resolve({ data: {} }));

    let product: Product = { name: "A", sku: "a", video_count: 0, video_urls: [] };

    populateVideoPreviewUrls(product).then(result => {
        expect(product).toBeTruthy();
        expect(product.video_urls).toHaveLength(0);
    }).catch(err => {
        fail(err);
    })
})
