class ProductDTO {
    constructor(product) {
        this.id = product._id;
        this.title = product.title;
        this.description = product.description;
        this.code = product.code;
        this.price = product.price;
        this.stock = product.stock;
        this.category = product.category;
        this.thumbnails = product.thumbnails;
        this.status = product.status;
        this.createdAt = product.createdAt;
        this.updatedAt = product.updatedAt;
    }

    static fromProduct(product) {
        return new ProductDTO(product);
    }

    static fromProducts(products) {
        return products.map(product => new ProductDTO(product));
    }

    toJSON() {
        return {
            id: this.id,
            title: this.title,
            description: this.description,
            code: this.code,
            price: this.price,
            stock: this.stock,
            category: this.category,
            thumbnails: this.thumbnails,
            status: this.status,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        };
    }
}

export default ProductDTO;
