import { gql } from "@apollo/client";

// Get all categories
export const GET_CATEGORIES = gql`
  query GetCategories {
    categories {
      name
    }
  }
`;

// Get products by category (or all if no category specified)
export const GET_PRODUCTS_BY_CATEGORY = gql`
  query GetProducts($category: String) {
    products(category: $category) {
      id
      name
      inStock
      gallery
      description
      attributes {
        id
        name
        type
        items {
          displayValue
          value
          id
        }
      }
      prices {
        amount
        currency {
          symbol
          label
        }
      }
      brand
    }
  }
`;

// Get product by ID
export const GET_PRODUCT_BY_ID = gql`
  query GetProduct($id: String!) {
    product(id: $id) {
      id
      name
      inStock
      gallery
      description
      attributes {
        id
        name
        type
        items {
          displayValue
          value
          id
        }
      }
      prices {
        amount
        currency {
          symbol
          label
        }
      }
      brand
    }
  }
`;
