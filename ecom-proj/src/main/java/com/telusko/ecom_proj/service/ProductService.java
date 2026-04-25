package com.telusko.ecom_proj.service;

import com.telusko.ecom_proj.model.Product;
import com.telusko.ecom_proj.repo.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.awt.color.ProfileDataException;
import java.util.List;

@Service
public class ProductService {
    @Autowired
    private ProductRepository productRepository;

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public List<Product> getProductsBySeller(String username) {
        return productRepository.findBySellerUsername(username);
    }

    public Product addProduct(Product product) {
        return productRepository.save(product);
    }

    public void deleteProduct(Long id, String sellerUsername) {
        // Find the product or throw an error
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));

        // Business Logic: Check if the user is the owner
        if (!product.getSellerUsername().equals(sellerUsername)) {
            throw new RuntimeException("You are not authorized to delete this product.");
        }
        productRepository.delete(product);
    }

    // 👇 Add this new method
    public Product buyProduct(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ProfileDataException("Product not found with id: " + id));
        productRepository.delete(product);
        return product;
    }

    // Inside your ProductService class
    public Product getProductById(Long id) {
        // This assumes you have a product repository to find the product
        return productRepository.findById(id).orElse(null);
    }
}
