package com.telusko.ecom_proj.controller;

import com.telusko.ecom_proj.model.Product;
import com.telusko.ecom_proj.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "http://localhost:5173")
public class ProductController {

    @Autowired
    private ProductService productService;

    @Autowired
    private RestTemplate restTemplate;

    public static class BuyerInfo {
        public String fullName;
        public String address;
        public String city;
        public String zip;
        public String phone;
        public String email;
    }

    @GetMapping
    public List<Product> getAllProducts() {
        return productService.getAllProducts();
    }

    @PostMapping
    public Product addProduct(@RequestBody Product product) {
        // The product is still saved to the database as normal
        Product savedProduct = productService.addProduct(product);

        /* --- THIS AUTOMATION HAS BEEN REMOVED AS REQUESTED ---
        try {
            String n8nWebhookUrl = "https://salamandarstoic.app.n8n.cloud/webhook-test/e14088c0-faae-471f-a191-a1adadfb16d3";

            Map<String, Object> payload = new HashMap<>();
            payload.put("productName", savedProduct.getName());
            payload.put("price", savedProduct.getSellPrice());
            payload.put("sellerUsername", savedProduct.getSellerUsername());

            restTemplate.postForObject(n8nWebhookUrl, payload, String.class);
            System.out.println("Successfully triggered n8n workflow for new product.");

        } catch (Exception e) {
            System.err.println("Error triggering n8n workflow for new product: " + e.getMessage());
        }
        --- END OF REMOVED SECTION --- */

        return savedProduct;
    }

    @GetMapping("/seller/{username}")
    public List<Product> getProductsBySeller(@PathVariable String username) {
        return productService.getProductsBySeller(username);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id, @RequestParam String sellerUsername) {
        productService.deleteProduct(id, sellerUsername);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/buy")
    public ResponseEntity<Void> buyProduct(@PathVariable Long id, @RequestBody BuyerInfo buyerInfo) {
        Product soldProduct = productService.buyProduct(id);

        // This "Product Sold" automation is still active
        try {
            String n8nWebhookUrl = "https://rcp2026.app.n8n.cloud/webhook-test/70ec5780-0737-4a62-954a-fdb3c8fdb517";

            Map<String, Object> payload = new HashMap<>();
            payload.put("productName", soldProduct.getName());
            payload.put("sellPrice", soldProduct.getSellPrice());
            payload.put("sellerEmail", soldProduct.getSellerUsername() + "@example.com"); // Placeholder
            payload.put("buyerFullName", buyerInfo.fullName);
            payload.put("buyerAddress", buyerInfo.address + ", " + buyerInfo.city + " - " + buyerInfo.zip);
            payload.put("buyerEmail", buyerInfo.email);

            restTemplate.postForObject(n8nWebhookUrl, payload, String.class);
            System.out.println("Successfully triggered n8n workflow for product sold.");
        } catch (Exception e) {
            System.err.println("Error triggering n8n workflow for product sold: " + e.getMessage());
        }

        return ResponseEntity.ok().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
        Product product = productService.getProductById(id);
        if (product != null) {
            return ResponseEntity.ok(product);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}