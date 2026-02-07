export const ApiConstantRoutes = {
  paths: {
    get auth() {
      return {
        get default() {
          return '/auth';
        },
        get login() {
          return `${this.default}/login`;
        },
        get register() {
          return `${this.default}/register`;
        },
      };
    },
    get categories() {
      return {
        get default() {
          return '/categories';
        },
      };
    },
    get products() {
      return {
        get default() {
          return '/products';
        },
      };
    },
    get orders() {
      return {
        get default() {
          return '/orders';
        },
        get admin() {
          return '/admin/orders';
        },
      };
    },
  },
};
