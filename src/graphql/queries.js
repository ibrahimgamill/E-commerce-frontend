import { gql } from "@apollo/client";

export const GET_CATEGORIES = gql`
  query GetCategories {
    categories {
      name
    }
  }
`;

export const GET_PRODUCTS = gql`
  query GetProducts {
    products {
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

export const GET_PRODUCTS_BY_CATEGORY = gql`
  query GetProductsByCategory($category: String!) {
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
